import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ClothSim } from './cloth.js';
import { createHoloMaterial } from './holoMaterial.js';
import { SurfaceLayer } from './decals.js';
import { normalMapFromImage } from './textures.js';
import { MacroDofPass } from './dofPass.js';
import { BAKED_POSE } from './bakedPose.js';
import { QUALITY, initialQuality, pixelRatioFor, QualityMonitor } from './performance.mjs';

export const DEFAULT_HOLO_PARAMS = {
  performance: 'High',
  physics: {
    viscosity: 0.6,
    stiffness: 1.0,
    iterations: 14,
    smoothing: 0.045,
    grabRadius: 0.27,
  },
  material: {
    preset: 'Holo',
    finish: 'Matte',
    baseColor: '#20242d',
    holoIntensity: 3.78,
    holoScale: 400,
    bandFreq: 1.1,
    saturation: 1.0,
    hueShift: 0.37,
    sparkle: 0.73,
    specTint: 0.33,
    iridescence: 0.81,
    roughness: 0.62,
    metalness: 1.0,
    clearcoat: 0.06,
    coatRoughness: 0.7,
    sheen: 0,
    bump: 3.0,
    bumpTiling: 3,
  },
  images: {
    edit: false,
    useImage: true,
    scale: 0.35,
    rotation: 0,
    opacity: 1.0,
    cornerRadius: 0,
  },
  render: {
    background: '#0b0c12',
    exposure: 0.5,
    environment: 0.73,
    bloom: 0.04,
    bloomThreshold: 1.41,
    noise: 0.345,
    toneMapping: 'Neutral',
    occlusion: true,
    occlusionStrength: 1,
    dof: false,
    dofAperture: 40,
    dofBlur: 0.04,
    dofRange: 0.3,
  },
};

const TONE_MAPPINGS = {
  AgX: THREE.AgXToneMapping,
  ACES: THREE.ACESFilmicToneMapping,
  Neutral: THREE.NeutralToneMapping,
};

const CLOTH_LONG_SIDE = 3;
const WHITE = new THREE.Color(0xffffff);

const GrainShader = {
  uniforms: {
    tDiffuse: { value: null },
    uAmount: { value: 0.08 },
    uTime: { value: 0 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uAmount;
    uniform float uTime;
    varying vec2 vUv;
    float gHash(vec3 p3) {
      p3 = fract(p3 * 0.1031);
      p3 += dot(p3, p3.zyx + 31.32);
      return fract((p3.x + p3.y) * p3.z);
    }
    void main() {
      vec4 c = texture2D(tDiffuse, vUv);
      vec2 p = mod(gl_FragCoord.xy, 1024.0);
      float n = gHash(vec3(p, mod(uTime * 120.0, 512.0))) - 0.5;
      c.rgb += n * uAmount;
      gl_FragColor = c;
    }
  `,
};

export class HoloApp {
  constructor(host) {
    this.host = host;
    const width = host.clientWidth || window.innerWidth;
    const height = host.clientHeight || window.innerHeight;

    this.perfProfile = initialQuality({
      cores: navigator.hardwareConcurrency,
      memory: navigator.deviceMemory,
      coarsePointer: window.matchMedia('(pointer: coarse)').matches,
    });
    this.qualityMonitor = new QualityMonitor(this.perfProfile);
    this.currentPR = pixelRatioFor(this.perfProfile, window.devicePixelRatio, width, height);

    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
      powerPreference: 'high-performance',
      stencil: false,
      alpha: true,
    });
    this.renderer.setPixelRatio(this.currentPR);
    this.renderer.setSize(width, height);
    this.renderer.toneMapping = THREE.AgXToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    host.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.background = new THREE.Color('#0b0c12');
    this.scene.background = this.background;
    this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 200);
    this.updateCameraPositionForViewport();

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    const environment = new RoomEnvironment();
    this.environmentTarget = pmrem.fromScene(environment, 0.04);
    this.scene.environment = this.environmentTarget.texture;
    environment.dispose();
    pmrem.dispose();

    const rimA = new THREE.DirectionalLight(0x7fd4ff, 1.1);
    rimA.position.set(-4, 2.5, -3);
    const rimB = new THREE.DirectionalLight(0xff9ad5, 0.9);
    rimB.position.set(4.5, -1.5, -2.5);
    const key = new THREE.DirectionalLight(0xffffff, 0.7);
    key.position.set(1.5, 3, 4);
    this.scene.add(rimA, rimB, key);

    this.surface = new SurfaceLayer();
    const holo = createHoloMaterial(this.surface.texture);
    this.holoMaterial = holo.material;
    this.holoUniforms = holo.uniforms;
    const maxAniso = this.renderer.capabilities.getMaxAnisotropy();
    if (this.holoMaterial.roughnessMap) this.holoMaterial.roughnessMap.anisotropy = maxAniso;
    this.surface.texture.anisotropy = maxAniso;

    this.clothMesh = new THREE.Mesh(undefined, this.holoMaterial);
    this.clothMesh.frustumCulled = false;
    this.clothMesh.visible = false;
    this.clothAspect = 1;
    this.clothSegments = QUALITY[this.perfProfile].segments;
    this.buildCloth(1);
    this.scene.add(this.clothMesh);

    this.bumpSource = null;
    this.clock = new THREE.Clock();
    this.elapsed = 0;
    this.raycaster = new THREE.Raycaster();
    this.pointerNdc = new THREE.Vector2();
    this.dragPlane = new THREE.Plane();
    this.grabbing = false;
    this.grabPointerId = null;
    this.draggingDecal = false;
    this.decalGrabOffset = { u: 0, v: 0 };
    this.pickingFocus = false;
    this.focusVertex = null;
    this.pickReleaseId = null;
    this.spaceHeld = false;
    this.focusTmp = new THREE.Vector3();
    this.editMode = false;
    this.prevUseImage = false;
    this.hoverCursor = 'default';
    this.disposed = false;
    this.params = null;
    this.frameCount = 0;
    this.lastFpsTime = performance.now();
    this.fps = 60;
    this.onFpsUpdate = null;

    const canvas = this.renderer.domElement;
    canvas.addEventListener('pointerdown', this.onPointerDown);
    canvas.addEventListener('pointermove', this.onPointerMove);
    canvas.addEventListener('pointerup', this.onPointerUp);
    canvas.addEventListener('pointercancel', this.onPointerUp);
    canvas.addEventListener('wheel', this.onWheel, { passive: false });
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('blur', this.onWindowBlur);

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.enableZoom = false;
    this.controls.enableRotate = false;
    this.controls.enablePan = false;
    this.controls.target.set(...BAKED_POSE.target);
    this.controls.update();

    const rt = new THREE.WebGLRenderTarget(width, height, {
      samples: Math.min(QUALITY[this.perfProfile].samples, this.renderer.capabilities.maxSamples),
      type: THREE.HalfFloatType,
    });
    this.composer = new EffectComposer(this.renderer, rt);
    this.composer.setPixelRatio(this.currentPR);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.dofPass = new MacroDofPass(this.scene, this.camera);
    this.dofPass.enabled = false;
    this.composer.addPass(this.dofPass);
    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 0.144, 0.85, 1.0);
    this.composer.addPass(this.bloomPass);
    this.composer.addPass(new OutputPass());
    this.grainPass = new ShaderPass(GrainShader);
    this.composer.addPass(this.grainPass);

    this.resizeObserver = new ResizeObserver(() => this.onResize());
    this.resizeObserver.observe(host);

    this.applyParams({ ...DEFAULT_HOLO_PARAMS, performance: this.perfProfile });
    document.addEventListener('visibilitychange', this.onVisibilityChange);
    // Start only after the texture is ready and the cloth is revealed.
  }

  buildCloth(aspect) {
    this.clothAspect = aspect;
    const w = aspect >= 1 ? CLOTH_LONG_SIDE : CLOTH_LONG_SIDE * aspect;
    const h = aspect >= 1 ? CLOTH_LONG_SIDE / aspect : CLOTH_LONG_SIDE;
    const segs = this.clothSegments;
    const segX = aspect >= 1 ? segs : Math.max(10, Math.round(segs * aspect));
    const segY = aspect >= 1 ? Math.max(10, Math.round(segs / aspect)) : segs;
    this.sim = new ClothSim(w, h, segX, segY);
    const geo = new THREE.PlaneGeometry(w, h, segX, segY);
    const posAttr = new THREE.BufferAttribute(this.sim.positions, 3);
    posAttr.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('position', posAttr);
    this.cavityAttr = new THREE.BufferAttribute(new Float32Array(this.sim.count), 1);
    this.cavityAttr.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('aCavity', this.cavityAttr);
    geo.computeVertexNormals();
    const old = this.clothMesh.geometry;
    this.clothMesh.geometry = geo;
    this.clothGeometry = geo;
    if (old) old.dispose();
    this.holoUniforms.uClothSize.value.set(w, h);
    this.focusVertex = null;
    this.cancelInteraction();
  }

  cancelInteraction() {
    if (this.grabPointerId !== null &&
        this.renderer.domElement.hasPointerCapture(this.grabPointerId)) {
      this.renderer.domElement.releasePointerCapture(this.grabPointerId);
    }
    this.grabbing = false;
    this.draggingDecal = false;
    this.grabPointerId = null;
    if (this.sim) this.sim.endGrab();
    if (this.controls) this.controls.enabled = true;
  }

  applyParams(p) {
    this.params = p;
    this.applyPerfProfile(p.performance);
    const m = this.holoMaterial;
    m.color.set(p.material.baseColor);
    m.roughness = p.material.roughness;
    m.metalness = p.material.metalness;
    m.clearcoat = p.material.clearcoat;
    m.clearcoatRoughness = p.material.coatRoughness;
    m.sheen = p.material.sheen;
    m.sheenColor.set(p.material.baseColor).lerp(WHITE, 0.5);
    m.iridescence = p.material.iridescence;
    m.normalScale.set(p.material.bump, p.material.bump);
    if (m.normalMap) m.normalMap.repeat.set(p.material.bumpTiling, p.material.bumpTiling);
    this.scene.environmentIntensity = p.render.environment;

    const u = this.holoUniforms;
    u.uHoloIntensity.value = p.material.holoIntensity;
    u.uHoloScale.value = p.material.holoScale;
    u.uBandFreq.value = p.material.bandFreq;
    u.uSaturation.value = p.material.saturation;
    u.uHueShift.value = p.material.hueShift;
    u.uSparkle.value = p.material.sparkle;
    u.uSpecTint.value = p.material.specTint;
    u.uSurfaceOpacity.value = p.images.opacity;
    u.uCornerRound.value = p.images.cornerRadius;

    this.background.set(p.render.background);
    this.renderer.toneMappingExposure = p.render.exposure;
    const tm = TONE_MAPPINGS[p.render.toneMapping] ?? THREE.AgXToneMapping;
    if (this.renderer.toneMapping !== tm) this.renderer.toneMapping = tm;
    this.bloomPass.strength = p.render.bloom;
    this.bloomPass.threshold = p.render.bloomThreshold;
    this.grainPass.uniforms.uAmount.value = p.render.noise;
    u.uCavityAmount.value = p.render.occlusion ? p.render.occlusionStrength : 0;
    this.dofPass.enabled = p.render.dof;
    this.dofPass.setParams(p.render.dofAperture * 1e-2, p.render.dofBlur, p.render.dofRange * 0.5);

    this.editMode = p.images.edit;
    this.controls.enableZoom = false;
    this.controls.enableRotate = false;
    this.controls.enablePan = false;

    if (this.prevUseImage && !p.images.useImage && this.surface.clothImage) {
      this.removeClothImage();
    }
    this.prevUseImage = p.images.useImage;
  }

  resetCloth() {
    this.sim.reset();
    this.clothGeometry.attributes.position.needsUpdate = true;
    this.clothGeometry.computeVertexNormals();
  }

  poke() {
    this.sim.poke(1);
  }

  setBackgroundColor(colorStr) {
    this.background.set(colorStr);
    this.scene.background = this.background;
  }

  setClothImage(img) {
    const iw = img.naturalWidth || img.width || 1;
    const ih = img.naturalHeight || img.height || 1;
    const aspect = Math.min(3, Math.max(1 / 3, iw / ih));
    this.surface.setClothImage(img);
    if (this.surface.setAspect(aspect)) this.rebindSurfaceTexture();
    this.buildCloth(aspect);
  }

  removeClothImage() {
    this.surface.setClothImage(null);
    if (this.surface.setAspect(1)) this.rebindSurfaceTexture();
    this.buildCloth(1);
  }

  reveal() {
    this.clothMesh.visible = true;
    this.onVisibilityChange();
  }

  applyPerfProfile(profile) {
    this.perfProfile = profile;
    const quality = QUALITY[profile];
    const w = this.host.clientWidth || window.innerWidth;
    const h = this.host.clientHeight || window.innerHeight;
    this.currentPR = pixelRatioFor(profile, window.devicePixelRatio, w, h);
    this.renderer.setPixelRatio(this.currentPR);
    this.renderer.setSize(w, h);
    this.composer.setPixelRatio(this.currentPR);
    const samples = Math.min(quality.samples, this.renderer.capabilities.maxSamples);
    for (const target of [this.composer.renderTarget1, this.composer.renderTarget2]) {
      if (target.samples !== samples) {
        target.samples = samples;
        target.dispose();
      }
    }
    this.composer.setSize(w, h);
    this.bloomPass.enabled = quality.bloom;
    this.physicsParams = { ...this.params.physics, iterations: quality.iterations };
    // Keep the existing mesh and simulation during runtime downgrades so the
    // visitor's drape is preserved. Initial mesh density uses device hints.
  }

  onVisibilityChange = () => {
    if (this.disposed) return;
    this.renderer.setAnimationLoop(null);
    this.clock.stop();
    this.qualityMonitor.reset();
    if (document.hidden) this.cancelInteraction();
    if (!document.hidden && this.clothMesh.visible) {
      this.clock.start();
      this.lastFpsTime = performance.now();
      this.frameCount = 0;
      this.renderer.setAnimationLoop(this.tick);
    }
  };

  setBumpMap(img) {
    const old = this.holoMaterial.normalMap;
    let tex = null;
    if (img) {
      tex = normalMapFromImage(img);
      tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
      const tiling = this.params?.material.bumpTiling ?? 3;
      tex.repeat.set(tiling, tiling);
    }
    this.bumpSource = img;
    this.holoMaterial.normalMap = tex;
    if (!!old !== !!tex) this.holoMaterial.needsUpdate = true;
    if (old) old.dispose();
  }

  rebindSurfaceTexture() {
    this.surface.texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
    this.holoUniforms.uSurfaceMap.value = this.surface.texture;
  }

  updatePointer(e) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointerNdc.set(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1,
    );
  }

  raycastCloth() {
    this.raycaster.setFromCamera(this.pointerNdc, this.camera);
    this.clothGeometry.computeBoundingSphere();
    const hits = this.raycaster.intersectObject(this.clothMesh, false);
    return hits.length > 0 ? hits[0] : null;
  }

  onKeyDown = (e) => {
    if (e.code !== 'Space' || e.repeat) return;
    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    e.preventDefault();
    this.spaceHeld = true;
    this.controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
    if (!this.grabbing && !this.draggingDecal && !this.pickingFocus) {
      this.renderer.domElement.style.cursor = 'grab';
    }
  };

  onKeyUp = (e) => {
    if (e.code !== 'Space') return;
    this.spaceHeld = false;
    this.controls.mouseButtons.LEFT = THREE.MOUSE.ROTATE;
  };

  onWindowBlur = () => {
    this.spaceHeld = false;
    this.controls.mouseButtons.LEFT = THREE.MOUSE.ROTATE;
  };

  onPointerDown = (e) => {
    if (e.button !== 0 || this.grabbing || this.draggingDecal) return;
    this.updatePointer(e);
    if (this.pickingFocus) {
      this.pickingFocus = false;
      this.renderer.domElement.style.cursor = 'default';
      const pick = this.raycastCloth();
      if (pick) {
        const p = this.sim.positions;
        let best = 0;
        let bestD2 = Infinity;
        for (let i = 0; i < this.sim.count; i++) {
          const dx = p[i * 3] - pick.point.x;
          const dy = p[i * 3 + 1] - pick.point.y;
          const dz = p[i * 3 + 2] - pick.point.z;
          const d2 = dx * dx + dy * dy + dz * dz;
          if (d2 < bestD2) { bestD2 = d2; best = i; }
        }
        this.focusVertex = best;
      }
      this.pickReleaseId = e.pointerId;
      this.controls.enabled = false;
      return;
    }
    if (this.spaceHeld) return;
    const hit = this.raycastCloth();
    if (!hit) return;

    if (this.editMode) {
      if (!hit.uv) return;
      const d = this.surface.hitTest(hit.uv.x, hit.uv.y);
      if (!d) return;
      this.surface.selected = d;
      this.draggingDecal = true;
      this.decalGrabOffset.u = d.u - hit.uv.x;
      this.decalGrabOffset.v = d.v - hit.uv.y;
      this.grabPointerId = e.pointerId;
      this.controls.enabled = false;
      this.renderer.domElement.setPointerCapture(e.pointerId);
      this.renderer.domElement.style.cursor = 'move';
      return;
    }

    const radius = this.params?.physics.grabRadius ?? 0.45;
    if (!this.sim.startGrab(hit.point, radius)) return;
    this.grabbing = true;
    this.grabPointerId = e.pointerId;
    this.controls.enabled = false;
    const normal = new THREE.Vector3();
    this.camera.getWorldDirection(normal);
    this.dragPlane.setFromNormalAndCoplanarPoint(normal, hit.point);
    this.renderer.domElement.setPointerCapture(e.pointerId);
    this.renderer.domElement.style.cursor = 'grabbing';
  };

  onPointerMove = (e) => {
    const active = this.grabbing || this.draggingDecal;
    if (active && e.pointerId !== this.grabPointerId) return;
    this.updatePointer(e);
    if (this.draggingDecal) {
      const hit = this.raycastCloth();
      const sel = this.surface.selected;
      if (hit?.uv && sel) {
        sel.u = hit.uv.x + this.decalGrabOffset.u;
        sel.v = hit.uv.y + this.decalGrabOffset.v;
        this.surface.redraw();
      }
      return;
    }
    if (!this.grabbing) return;
    this.raycaster.setFromCamera(this.pointerNdc, this.camera);
    const target = new THREE.Vector3();
    if (this.raycaster.ray.intersectPlane(this.dragPlane, target)) {
      this.sim.moveGrab(target);
    }
  };

  onPointerUp = (e) => {
    if (e.pointerId === this.pickReleaseId) {
      this.pickReleaseId = null;
      this.controls.enabled = true;
      return;
    }
    const active = this.grabbing || this.draggingDecal;
    if (!active || e.pointerId !== this.grabPointerId) return;
    this.grabbing = false;
    this.draggingDecal = false;
    this.grabPointerId = null;
    this.sim.endGrab();
    this.controls.enabled = true;
    if (this.renderer.domElement.hasPointerCapture(e.pointerId)) {
      this.renderer.domElement.releasePointerCapture(e.pointerId);
    }
    this.renderer.domElement.style.cursor = this.hoverCursor;
  };

  onWheel = (e) => {
    if (!this.editMode) return;
    const sel = this.surface.selected;
    if (!sel) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    sel.scale = THREE.MathUtils.clamp(sel.scale * Math.exp(-e.deltaY * 0.0012), 0.02, 2.5);
    this.surface.redraw();
  };

  onResize() {
    const width = this.host.clientWidth || window.innerWidth;
    const height = this.host.clientHeight || window.innerHeight;
    if (width === 0 || height === 0) return;
    this.camera.aspect = width / height;
    this.updateCameraPositionForViewport();
    this.camera.updateProjectionMatrix();
    this.currentPR = pixelRatioFor(this.perfProfile, window.devicePixelRatio, width, height);
    this.renderer.setPixelRatio(this.currentPR);
    this.composer.setPixelRatio(this.currentPR);
    this.renderer.setSize(width, height);
    this.composer.setSize(width, height);
    this.qualityMonitor.reset();
  }

  updateCameraPositionForViewport() {
    const width = this.host.clientWidth || window.innerWidth;
    const isMobile = width < 768;
    const scale = isMobile ? 1.4 : 1.0;

    const target = new THREE.Vector3(...BAKED_POSE.target);
    const baseCam = new THREE.Vector3(...BAKED_POSE.camera);
    const offset = baseCam.clone().sub(target).multiplyScalar(scale);

    this.camera.position.copy(target).add(offset);
    if (this.controls) {
      this.controls.target.copy(target);
      this.controls.update();
    }
  }

  tick = () => {
    if (this.disposed) return;
    const dt = this.clock.getDelta();
    const nextProfile = this.qualityMonitor.sample(dt, this.grabbing || this.draggingDecal);
    if (nextProfile) this.applyPerfProfile(nextProfile);
    this.elapsed += dt;
    this.grainPass.uniforms.uTime.value = this.elapsed % 61.7;

    if (this.params) {
      this.sim.step(dt, this.physicsParams);
      this.clothGeometry.attributes.position.needsUpdate = true;
      this.clothGeometry.computeVertexNormals();
    }

    if (this.params?.render.occlusion) {
      this.sim.computeCavity(
        this.clothGeometry.attributes.normal.array,
        this.cavityAttr.array,
      );
      this.cavityAttr.needsUpdate = true;
    }
    if (this.params?.render.dof) {
      let focusDist;
      if (this.focusVertex !== null && this.focusVertex < this.sim.count) {
        const p = this.sim.positions;
        const i = this.focusVertex * 3;
        this.focusTmp.set(p[i], p[i + 1], p[i + 2]);
        focusDist = this.camera.position.distanceTo(this.focusTmp);
      } else {
        focusDist = this.camera.position.distanceTo(this.controls.target);
      }
      this.dofPass.setFocus(focusDist);
    }

    if (!this.grabbing && !this.draggingDecal && !this.pickingFocus && !this.spaceHeld &&
        this.perfProfile !== 'Low') {
      const hit = this.raycastCloth();
      let cursor = 'default';
      if (hit) {
        cursor = this.editMode
          ? hit.uv && this.surface.hitTest(hit.uv.x, hit.uv.y) ? 'move' : 'default'
          : 'grab';
      }
      if (cursor !== this.hoverCursor) {
        this.hoverCursor = cursor;
        this.renderer.domElement.style.cursor = cursor;
      }
    }

    this.controls.update();
    this.composer.render();

    const now = performance.now();
    this.frameCount++;
    if (now - this.lastFpsTime >= 500) {
      this.fps = Math.round((this.frameCount * 1000) / (now - this.lastFpsTime));
      this.frameCount = 0;
      this.lastFpsTime = now;
      this.onFpsUpdate?.(this.fps);
    }
  };

  dispose() {
    this.disposed = true;
    this.renderer.setAnimationLoop(null);
    this.resizeObserver.disconnect();
    const canvas = this.renderer.domElement;
    canvas.removeEventListener('pointerdown', this.onPointerDown);
    canvas.removeEventListener('pointermove', this.onPointerMove);
    canvas.removeEventListener('pointerup', this.onPointerUp);
    canvas.removeEventListener('pointercancel', this.onPointerUp);
    canvas.removeEventListener('wheel', this.onWheel);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('blur', this.onWindowBlur);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    this.controls.dispose();
    for (const pass of this.composer.passes) pass.dispose();
    this.composer.dispose();
    this.clothGeometry.dispose();
    this.holoMaterial.normalMap?.dispose();
    this.holoMaterial.roughnessMap?.dispose();
    this.holoMaterial.dispose();
    this.surface.dispose();
    this.environmentTarget.dispose();
    this.scene.traverse((obj) => {
      if (obj.geometry && obj.geometry !== this.clothGeometry) obj.geometry.dispose();
    });
    this.renderer.dispose();
    canvas.remove();
  }
}

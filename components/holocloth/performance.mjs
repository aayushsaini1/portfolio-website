export const QUALITY = {
  High: { pixelRatio: 2, pixels: 4000000, samples: 8, segments: 48, iterations: 14, bloom: true },
  Medium: { pixelRatio: 1.5, pixels: 2000000, samples: 4, segments: 36, iterations: 10, bloom: true },
  Low: { pixelRatio: 1, pixels: 1000000, samples: 0, segments: 28, iterations: 7, bloom: false },
};

export function initialQuality({ cores, memory, coarsePointer = false }) {
  if ((cores > 0 && cores <= 4) || (memory > 0 && memory <= 4)) return 'Low';
  // Missing hardware hints are common, notably in Safari.
  if (coarsePointer || !cores) return 'Medium';
  return 'High';
}

export function pixelRatioFor(profile, dpr, width, height) {
  const quality = QUALITY[profile];
  return Math.min(dpr || 1, quality.pixelRatio, Math.sqrt(quality.pixels / Math.max(1, width * height)));
}

// Only downgrade after sustained slow rendering. Never oscillate between tiers
// or count loading, tab suspension, or a single long frame as weak hardware.
export class QualityMonitor {
  constructor(profile) {
    this.profile = profile;
    this.reset();
  }

  reset() {
    this.warmup = 3;
    this.seconds = 0;
    this.frames = 0;
    this.slowWindows = 0;
  }

  sample(dt, interacting = false) {
    if (dt <= 0 || dt > 0.25) {
      this.reset();
      return null;
    }
    if (this.warmup > 0) {
      this.warmup -= dt;
      return null;
    }
    this.seconds += dt;
    this.frames++;
    if (this.seconds < 1) return null;
    const fps = this.frames / this.seconds;
    this.seconds = 0;
    this.frames = 0;
    this.slowWindows = fps < 45 ? this.slowWindows + 1 : 0;
    if (this.slowWindows < 3 || interacting || this.profile === 'Low') return null;
    this.profile = this.profile === 'High' ? 'Medium' : 'Low';
    this.reset();
    return this.profile;
  }
}

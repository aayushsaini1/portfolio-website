"use client";

import React, { useEffect, useRef } from 'react';

export default function MazeAnimation() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let resizeTimeout;

    // Maze configuration
    const cols = 12;
    const rows = 12;
    let cells = [];
    let stack = [];
    let currentCell = null;
    let path = [];
    let solvedPath = [];
    let pathIndex = 0;
    let phase = 'generate'; // 'generate', 'solve', 'solved-pause', 'fade-out'
    let fadeOpacity = 1;
    let pauseCounter = 0;

    // Grid Cell Constructor
    class Cell {
      constructor(c, r) {
        this.c = c;
        this.r = r;
        // top, right, bottom, left walls
        this.walls = [true, true, true, true];
        this.visited = false;
      }

      // Check unvisited neighbors
      checkNeighbors() {
        const neighbors = [];

        const top = cells[index(this.c, this.r - 1)];
        const right = cells[index(this.c + 1, this.r)];
        const bottom = cells[index(this.c, this.r + 1)];
        const left = cells[index(this.c - 1, this.r)];

        if (top && !top.visited) neighbors.push(top);
        if (right && !right.visited) neighbors.push(right);
        if (bottom && !bottom.visited) neighbors.push(bottom);
        if (left && !left.visited) neighbors.push(left);

        if (neighbors.length > 0) {
          const rIdx = Math.floor(Math.random() * neighbors.length);
          return neighbors[rIdx];
        }
        return undefined;
      }
    }

    function index(c, r) {
      if (c < 0 || r < 0 || c > cols - 1 || r > rows - 1) return -1;
      return c + r * cols;
    }

    function removeWalls(a, b) {
      const x = a.c - b.c;
      if (x === 1) {
        a.walls[3] = false;
        b.walls[1] = false;
      } else if (x === -1) {
        a.walls[1] = false;
        b.walls[3] = false;
      }
      const y = a.r - b.r;
      if (y === 1) {
        a.walls[0] = false;
        b.walls[2] = false;
      } else if (y === -1) {
        a.walls[2] = false;
        b.walls[0] = false;
      }
    }

    // Initialize/Reset Maze State
    function initMaze() {
      cells = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          cells.push(new Cell(c, r));
        }
      }

      // Start generation from bottom-left cell
      const startCell = cells[index(0, rows - 1)];
      startCell.visited = true;
      currentCell = startCell;
      stack = [startCell];
      path = [];
      solvedPath = [];
      pathIndex = 0;
      phase = 'generate';
      fadeOpacity = 1;
      pauseCounter = 0;
    }

    // Find path using DFS from (0, rows-1) to (cols-1, 0)
    function solveMaze() {
      const visited = new Array(cells.length).fill(false);
      const parentMap = new Map();
      const queue = [index(0, rows - 1)];
      visited[index(0, rows - 1)] = true;

      const targetIdx = index(cols - 1, 0);
      let found = false;

      while (queue.length > 0) {
        const currIdx = queue.shift();
        if (currIdx === targetIdx) {
          found = true;
          break;
        }

        const currCell = cells[currIdx];
        const nextIndices = [];

        // Check 4 directions and if no walls exist
        // Top
        if (!currCell.walls[0]) {
          const nextIdx = index(currCell.c, currCell.r - 1);
          if (nextIdx !== -1 && !visited[nextIdx]) nextIndices.push(nextIdx);
        }
        // Right
        if (!currCell.walls[1]) {
          const nextIdx = index(currCell.c + 1, currCell.r);
          if (nextIdx !== -1 && !visited[nextIdx]) nextIndices.push(nextIdx);
        }
        // Bottom
        if (!currCell.walls[2]) {
          const nextIdx = index(currCell.c, currCell.r + 1);
          if (nextIdx !== -1 && !visited[nextIdx]) nextIndices.push(nextIdx);
        }
        // Left
        if (!currCell.walls[3]) {
          const nextIdx = index(currCell.c - 1, currCell.r);
          if (nextIdx !== -1 && !visited[nextIdx]) nextIndices.push(nextIdx);
        }

        for (const nextIdx of nextIndices) {
          visited[nextIdx] = true;
          parentMap.set(nextIdx, currIdx);
          queue.push(nextIdx);
        }
      }

      if (found) {
        const solPath = [];
        let curr = targetIdx;
        while (curr !== undefined) {
          solPath.push(cells[curr]);
          curr = parentMap.get(curr);
        }
        solvedPath = solPath.reverse();
      }
    }

    // Canvas sizing
    function resizeCanvas() {
      const container = containerRef.current;
      if (!container) return;
      const size = Math.min(container.clientWidth, 240);

      // Set display size
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;

      // Set actual buffer size scaled for retina displays
      const dpr = window.devicePixelRatio || 1;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      ctx.scale(dpr, dpr);
    }

    // Dynamic color fetching from CSS properties
    function getThemeColors() {
      const rootStyle = getComputedStyle(document.documentElement);
      const isDark = document.documentElement.classList.contains('dark');
      const border = rootStyle.getPropertyValue('--border-color').trim() || '#e0e0e0';
      return {
        background: rootStyle.getPropertyValue('--bg-color').trim() || '#f4f4f4',
        border: isDark ? border : '#a0a0a0',
        accent: rootStyle.getPropertyValue('--accent-color').trim() || '#fb5215',
        muted: rootStyle.getPropertyValue('--muted-color').trim() || '#888888',
      };
    }

    // Main Game Loop
    function tick() {
      const size = canvas.width / (window.devicePixelRatio || 1);
      const cellW = size / cols;
      const cellH = size / rows;
      const colors = getThemeColors();

      ctx.clearRect(0, 0, size, size);
      ctx.save();

      // Apply fade-out opacity if in fade out phase
      if (phase === 'fade-out') {
        fadeOpacity -= 0.05;
        if (fadeOpacity <= 0) {
          initMaze();
        }
      }
      ctx.globalAlpha = Math.max(0, fadeOpacity);

      // 1. Update Generation
      if (phase === 'generate') {
        // Run step per frame for a smooth animation pace on a smaller grid
        for (let i = 0; i < 1; i++) {
          const next = currentCell.checkNeighbors();
          if (next) {
            next.visited = true;
            stack.push(currentCell);
            removeWalls(currentCell, next);
            currentCell = next;
          } else if (stack.length > 0) {
            currentCell = stack.pop();
          } else {
            // Finished generating
            solveMaze();
            phase = 'solve';
            pathIndex = 0;
            break;
          }
        }
      }

      // 2. Update Solving Line
      if (phase === 'solve') {
        pathIndex += 0.125; // Speed of solving path tracing
        if (pathIndex >= solvedPath.length - 1) {
          pathIndex = solvedPath.length - 1;
          phase = 'solved-pause';
          pauseCounter = 0;
        }
      }

      // 3. Update Solved Pause
      if (phase === 'solved-pause') {
        pauseCounter++;
        if (pauseCounter > 120) { // Keep solved for 2 seconds
          phase = 'fade-out';
        }
      }

      // --- Draw Maze Grid ---
      ctx.strokeStyle = colors.border;
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';

      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const x = cell.c * cellW;
        const y = cell.r * cellH;

        if (cell.walls[0]) { // Top
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + cellW, y);
          ctx.stroke();
        }
        if (cell.walls[1]) { // Right
          ctx.beginPath();
          ctx.moveTo(x + cellW, y);
          ctx.lineTo(x + cellW, y + cellH);
          ctx.stroke();
        }
        if (cell.walls[2]) { // Bottom
          ctx.beginPath();
          ctx.moveTo(x, y + cellH);
          ctx.lineTo(x + cellW, y + cellH);
          ctx.stroke();
        }
        if (cell.walls[3]) { // Left
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + cellH);
          ctx.stroke();
        }
      }

      // Draw boundary border to make the maze box complete
      ctx.strokeStyle = colors.border;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(0, 0, size, size);

      // Draw start and end indicators (small open gaps)
      ctx.fillStyle = colors.muted;
      ctx.font = `bold 1rem var(--font-mono), monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      // Start label
      ctx.fillText("IN", cellW / 2, size - cellH / 2);
      // Exit label
      ctx.fillText("OUT", size - cellW / 2, cellH / 2);

      // --- Draw Solving Path Line ---
      if ((phase === 'solve' || phase === 'solved-pause' || phase === 'fade-out') && solvedPath.length > 0) {
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        ctx.beginPath();
        // Start from center of start cell
        const startX = solvedPath[0].c * cellW + cellW / 2;
        const startY = solvedPath[0].r * cellH + cellH / 2;
        ctx.moveTo(startX, startY);

        const currentIndexLimit = Math.floor(pathIndex);
        for (let i = 1; i <= currentIndexLimit; i++) {
          const px = solvedPath[i].c * cellW + cellW / 2;
          const py = solvedPath[i].r * cellH + cellH / 2;
          ctx.lineTo(px, py);
        }

        // Interpolate the leading tip of the path line for smooth movement
        if (pathIndex < solvedPath.length - 1) {
          const nextIndex = currentIndexLimit + 1;
          const progress = pathIndex - currentIndexLimit;
          const currentCellObj = solvedPath[currentIndexLimit];
          const nextCellObj = solvedPath[nextIndex];

          const currX = currentCellObj.c * cellW + cellW / 2;
          const currY = currentCellObj.r * cellH + cellH / 2;
          const nextX = nextCellObj.c * cellW + cellW / 2;
          const nextY = nextCellObj.r * cellH + cellH / 2;

          const interpX = currX + (nextX - currX) * progress;
          const interpY = currY + (nextY - currY) * progress;
          ctx.lineTo(interpX, interpY);
        }
        ctx.stroke();

        // Draw Arrow / Leading Tip
        const tipIdx = Math.floor(pathIndex);
        if (tipIdx >= 0) {
          let tipX = solvedPath[tipIdx].c * cellW + cellW / 2;
          let tipY = solvedPath[tipIdx].r * cellH + cellH / 2;

          if (pathIndex < solvedPath.length - 1) {
            const nextIdx = tipIdx + 1;
            const progress = pathIndex - tipIdx;
            const currentCellObj = solvedPath[tipIdx];
            const nextCellObj = solvedPath[nextIdx];

            const currX = currentCellObj.c * cellW + cellW / 2;
            const currY = currentCellObj.r * cellH + cellH / 2;
            const nextX = nextCellObj.c * cellW + cellW / 2;
            const nextY = nextCellObj.r * cellH + cellH / 2;

            tipX = currX + (nextX - currX) * progress;
            tipY = currY + (nextY - currY) * progress;
          }

          ctx.fillStyle = colors.accent;
          ctx.beginPath();
          ctx.arc(tipX, tipY, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(tick);
    }

    initMaze();
    resizeCanvas();
    tick();

    // Resize handler
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeCanvas();
      }, 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        margin: '2rem 0',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          background: 'transparent',
        }}
      />
      <div
        style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: '1.1rem',
          color: 'var(--muted-color)',
          marginTop: '1.5rem',
          textTransform: 'uppercase',
          letterSpacing: '0.2em'
        }}
      >
        F#CK-AROUND-&-FIND-OUT.exe
      </div>

    </div>
  );
}

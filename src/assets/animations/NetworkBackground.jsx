import React, { useRef, useEffect } from 'react';

// ============================================================
// CONFIG
// ============================================================
const CONFIG = {
  backgroundColor: 'white',
  nodeCount: { desktop: 250, tablet: 55, mobile: 35 },
  nodeRadius: { min: 1.5, max: 1.0 },
  nodeColor: 'rgb(43, 43, 43)',
  glowColor: '',
  glowBlur: { min: 2, max: 4 },
  velocity: { min: 0.002, max: 0.005 },
  lineDistance: 100,
  lineColor: 'rgb(83, 83, 83)',
  lineWidth: 1,
  lineOpacityNear: 0.35,
  mouseRadius: 60,
  mouseRepulsionForce: 0.2,
  repulsionRadius: 20,
  repulsionForce: 0.03,
  edgeFadeMargin: 60,
  noiseOpacity: 0.015,
  breathingSpeed: 0.001,
};

// ============================================================
// HELPERS
// ============================================================
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const rand = (min, max) => Math.random() * (max - min) + min;
const dist = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);

// ============================================================
// NODE CLASS
// ============================================================
class Node {
  constructor(width, height) {
    this.originalX = rand(0, width);
    this.originalY = rand(0, height);
    this.x = this.originalX;
    this.y = this.originalY;
    this.vx = rand(CONFIG.velocity.min, CONFIG.velocity.max) * (Math.random() > 0.5 ? 1 : -1);
    this.vy = rand(CONFIG.velocity.min, CONFIG.velocity.max) * (Math.random() > 0.5 ? 1 : -1);
    this.radius = rand(CONFIG.nodeRadius.min, CONFIG.nodeRadius.max);
    this.glowBlur = rand(CONFIG.glowBlur.min, CONFIG.glowBlur.max);
    this.twinklePhase = rand(0, Math.PI * 2);
    this.twinkleSpeed = rand(0.005, 0.02);
    this.phase = rand(0, Math.PI * 2);
  }

  update(width, height, mouse, time, delta) {
    const breath = Math.sin(time * CONFIG.breathingSpeed + this.phase) * 0.1 + 1;
    const currentRadius = this.radius * breath;

    // Organic velocity variation
    this.vx += Math.sin(time * 0.002 + this.phase) * 0.002;
    this.vy += Math.cos(time * 0.0025 + this.phase) * 0.002;

    // Mouse REPULSION (push away strongly to break lines)
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const d = dist(this.x, this.y, mouse.x, mouse.y);
    if (d < CONFIG.mouseRadius && d > 0.5) {
      const force = (1 - d / CONFIG.mouseRadius) * CONFIG.mouseRepulsionForce;
      const normX = dx / d;
      const normY = dy / d;
      this.vx -= normX * force * delta * 60;
      this.vy -= normY * force * delta * 60;
    }

    // SOFT EDGE REPULSION
    const edgeMargin = 0;
    const edgeForce = 0.006;
    if (this.x < edgeMargin) this.vx += (edgeMargin - this.x) * edgeForce * delta * 60;
    if (this.x > width - edgeMargin) this.vx -= (this.x - (width - edgeMargin)) * edgeForce * delta * 60;
    if (this.y < edgeMargin) this.vy += (edgeMargin - this.y) * edgeForce * delta * 60;
    if (this.y > height - edgeMargin) this.vy -= (this.y - (height - edgeMargin)) * edgeForce * delta * 60;

    const maxSpeed = 0.35;
    const spd = Math.hypot(this.vx, this.vy);
    if (spd > maxSpeed) {
      this.vx = (this.vx / spd) * maxSpeed;
      this.vy = (this.vy / spd) * maxSpeed;
    }

    this.x += this.vx * delta * 60;
    this.y += this.vy * delta * 60;

    if (this.x < 0) { this.x = 0; this.vx = Math.abs(this.vx) * 0.8; }
    if (this.x > width) { this.x = width; this.vx = -Math.abs(this.vx) * 0.8; }
    if (this.y < 0) { this.y = 0; this.vy = Math.abs(this.vy) * 0.8; }
    if (this.y > height) { this.y = height; this.vy = -Math.abs(this.vy) * 0.8; }

    return { radius: currentRadius, breath };
  }

  draw(ctx, radius, opacity, glowBlur, twinkle) {
    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowBlur);
    const alpha = opacity * twinkle;
    // grad.addColorStop(0, `rgba(168, 85, 247, ${alpha * 0.9})`);
    grad.addColorStop(1, `rgba(255, 255, 255, 0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, glowBlur, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = `rgba(255, 255, 255, ${opacity * twinkle})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ============================================================
// GRID CLASS
// ============================================================
class Grid {
  constructor(width, height, cellSize) {
    this.cellSize = cellSize;
    this.cols = Math.ceil(width / cellSize);
    this.rows = Math.ceil(height / cellSize);
    this.cells = Array.from({ length: this.cols * this.rows }, () => []);
  }

  clear() {
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i] = [];
    }
  }

  addNode(node) {
    const col = Math.floor(node.x / this.cellSize);
    const row = Math.floor(node.y / this.cellSize);
    if (col >= 0 && col < this.cols && row >= 0 && row < this.rows) {
      this.cells[row * this.cols + col].push(node);
    }
  }

  getNearby(node) {
    const col = Math.floor(node.x / this.cellSize);
    const row = Math.floor(node.y / this.cellSize);
    const neighbors = [];
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const c = col + dc;
        const r = row + dr;
        if (c >= 0 && c < this.cols && r >= 0 && r < this.rows) {
          const cell = this.cells[r * this.cols + c];
          for (let i = 0; i < cell.length; i++) {
            neighbors.push(cell[i]);
          }
        }
      }
    }
    return neighbors;
  }
}

// ============================================================
// DRAWING UTILS
// ============================================================
const drawBackground = (ctx, width, height) => {
  // Full transparent canvas. Aap apna background parent div par CSS se lagayein.
  ctx.clearRect(0, 0, width, height);
};

const drawNoise = (ctx, width, height) => {
  ctx.fillStyle = `rgba(255, 255, 255, ${CONFIG.noiseOpacity})`;
  for (let i = 0; i < 400; i++) {
    const x = rand(0, width);
    const y = rand(0, height);
    const size = rand(0.5, 1.5);
    ctx.fillRect(x, y, size, size);
  }
};

const drawLines = (ctx, nodes, grid, width, height, time) => {
  ctx.strokeStyle = CONFIG.lineColor;
  ctx.lineWidth = CONFIG.lineWidth;
  const maxDist = CONFIG.lineDistance;
  const maxDistSq = maxDist * maxDist;

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const neighbors = grid.getNearby(node);
    for (let j = 0; j < neighbors.length; j++) {
      const other = neighbors[j];
      if (node === other) continue;
      const dx = node.x - other.x;
      const dy = node.y - other.y;
      const dSq = dx * dx + dy * dy;
      if (dSq < maxDistSq && dSq > 0.1) {
        const d = Math.sqrt(dSq);
        const opacity = (1 - d / maxDist) * CONFIG.lineOpacityNear;
        const avgX = (node.x + other.x) / 2;
        const avgY = (node.y + other.y) / 2;
        const fade = Math.min(
          1,
          Math.min(avgX, avgY, width - avgX, height - avgY) / CONFIG.edgeFadeMargin
        );
        const finalOpacity = opacity * fade * (0.9 + 0.1 * Math.sin(time * 0.001 + i + j));
        if (finalOpacity > 0.005) {
          ctx.globalAlpha = finalOpacity;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        }
      }
    }
  }
  ctx.globalAlpha = 1;
};

// ============================================================
// REACT COMPONENT
// ============================================================
const NetworkBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const nodesRef = useRef([]);
  const gridRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const dimensionsRef = useRef({ width: 0, height: 0 });
  const isPausedRef = useRef(false);
  const lastTimeRef = useRef(0);

  const initCanvas = (canvas, container) => {
    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = rect.width;
    const height = rect.height;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    dimensionsRef.current = { width, height };

    let count = CONFIG.nodeCount.desktop;
    if (width < 768) count = CONFIG.nodeCount.mobile;
    else if (width < 1024) count = CONFIG.nodeCount.tablet;

    nodesRef.current = [];
    for (let i = 0; i < count; i++) {
      nodesRef.current.push(new Node(width, height));
    }

    gridRef.current = new Grid(width, height, CONFIG.lineDistance);
    return ctx;
  };

  const animate = (timestamp) => {
    if (isPausedRef.current) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { width, height } = dimensionsRef.current;
    const mouse = mouseRef.current;
    const nodes = nodesRef.current;
    const grid = gridRef.current;

    if (!width || !height) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    const delta = lastTimeRef.current ? Math.min((timestamp - lastTimeRef.current) / 1000, 0.05) : 0.016;
    lastTimeRef.current = timestamp;
    const time = timestamp / 1000;

    drawBackground(ctx, width, height);

    grid.clear();
    const updates = [];
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const { radius, breath } = node.update(width, height, mouse, time, delta);
      updates.push({ node, radius, breath });
      grid.addNode(node);
    }

    // Repulsion between nodes
    for (let i = 0; i < nodes.length; i++) {
      const nodeA = nodes[i];
      const neighbors = grid.getNearby(nodeA);
      for (let j = 0; j < neighbors.length; j++) {
        const nodeB = neighbors[j];
        if (nodeA === nodeB) continue;
        const dx = nodeA.x - nodeB.x;
        const dy = nodeA.y - nodeB.y;
        const d = Math.hypot(dx, dy);
        if (d < CONFIG.repulsionRadius && d > 0.1) {
          const force = (1 - d / CONFIG.repulsionRadius) * CONFIG.repulsionForce * delta * 60;
          const normX = dx / d;
          const normY = dy / d;
          nodeA.vx += normX * force;
          nodeA.vy += normY * force;
          nodeB.vx -= normX * force;
          nodeB.vy -= normY * force;
        }
      }
    }

    drawLines(ctx, nodes, grid, width, height, time);

    for (let i = 0; i < updates.length; i++) {
      const { node, radius, breath } = updates[i];
      const twinkle = 0.7 + 0.3 * Math.sin(time * node.twinkleSpeed + node.twinklePhase);
      const edgeFade = Math.min(
        1,
        Math.min(node.x, node.y, width - node.x, height - node.y) / CONFIG.edgeFadeMargin
      );
      const finalOpacity = edgeFade * (0.9 + 0.1 * breath);

      node.draw(ctx, radius, finalOpacity, node.glowBlur, twinkle);
    }

    drawNoise(ctx, width, height);
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const container = canvasRef.current.parentElement;
    const canvas = canvasRef.current;

    const handleResize = () => {
      initCanvas(canvas, container);
      lastTimeRef.current = 0;
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };

    const handleVisibility = () => {
      isPausedRef.current = document.hidden;
    };

    initCanvas(canvas, container);
    animationRef.current = requestAnimationFrame(animate);

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        pointerEvents: 'none',
      }}
    />
  );
};

export default NetworkBackground;
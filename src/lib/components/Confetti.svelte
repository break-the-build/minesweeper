<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  let canvas: HTMLCanvasElement;
  let animId: number;
  let particles: Particle[] = [];

  type Particle = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
    rotation: number;
    rotationSpeed: number;
    shape: 'rect' | 'circle';
    opacity: number;
  };

  const COLORS = ['#ff595e', '#ffca3a', '#6a4c93', '#1982c4', '#8ac926', '#ff924c', '#c77dff'];

  function spawn() {
    const w = canvas.width;
    for (let i = 0; i < 180; i++) {
      particles.push({
        x: Math.random() * w,
        y: -10 - Math.random() * 100,
        vx: (Math.random() - 0.5) * 4,
        vy: 2 + Math.random() * 4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 6 + Math.random() * 8,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        shape: Math.random() > 0.5 ? 'rect' : 'circle',
        opacity: 1,
      });
    }
  }

  function tick() {
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles = particles.filter((p) => p.opacity > 0);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.07; // gravity
      p.rotation += p.rotationSpeed;
      if (p.y > canvas.height * 0.7) p.opacity -= 0.02;

      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size / 2, p.size / 3, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    if (particles.length > 0) {
      animId = requestAnimationFrame(tick);
    }
  }

  onMount(() => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    spawn();
    animId = requestAnimationFrame(tick);
  });

  onDestroy(() => {
    cancelAnimationFrame(animId);
  });
</script>

<canvas bind:this={canvas}></canvas>

<style>
  canvas {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 100;
  }
</style>

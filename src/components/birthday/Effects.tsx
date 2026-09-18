import { useEffect, useRef } from "react";
import { sound } from "@/lib/sound";
import { getRecommendedParticleCount, getDeviceCapabilities } from "@/lib/performance";
import { detectCanvas } from "@/lib/featureDetection";

export function MagicDust({ dense = false }: { dense?: boolean }) {
  const baseCount = dense ? 48 : 26;
  const count = getRecommendedParticleCount(baseCount);
  
  if (count === 0) return null; // Skip rendering if reduced motion
  
  return (
    <div className="magic-dust" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <i
          key={i}
          style={
            {
              "--i": i,
              "--x": `${(i * 37) % 100}%`,
              "--y": `${(i * 53) % 95}%`,
              "--duration": `${2.5 + (i % 6) * 0.6}s`,
              "--delay": `${-(i * 0.25)}s`,
              "--size": `${2 + (i % 4)}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

export function StardustCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const capabilities = getDeviceCapabilities();
    
    // Skip on mobile, if reduced motion preferred, or canvas not supported
    if (capabilities.isMobile || capabilities.prefersReducedMotion || !detectCanvas()) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      hue: number;
    };

    const particles: Particle[] = [];
    let rafId = 0;
    const maxParticles = capabilities.isLowEnd ? 40 : 80;
    const particlesPerTrigger = capabilities.isLowEnd ? 2 : 3;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    let lastAdd = 0;
    const addParticle = (x: number, y: number) => {
      const now = Date.now();
      // Throttle particle creation on low-end devices
      if (capabilities.isLowEnd && now - lastAdd < 50) return;
      lastAdd = now;

      for (let i = 0; i < particlesPerTrigger; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 1.5;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 2 + Math.random() * 3,
          alpha: 0.9,
          hue: 280 + Math.random() * 80,
        });
      }
      if (particles.length > maxParticles) particles.splice(0, particlesPerTrigger);
    };

    const handlePointerMove = (e: PointerEvent) => {
      addParticle(e.clientX, e.clientY);
    };

    window.addEventListener("pointermove", handlePointerMove);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        if (!p) continue;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02;
        p.alpha -= 0.025;
        p.size *= 0.96;

        if (p.alpha <= 0 || p.size < 0.3) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 95%, 75%, ${p.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `hsla(${p.hue}, 100%, 80%, ${p.alpha})`;
        ctx.fill();
        ctx.restore();
      }

      rafId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="stardust-canvas" aria-hidden="true" />;
}

export function FireworksCanvas({ active = true }: { active?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    
    // Check if canvas is supported
    if (!detectCanvas()) {
      console.warn('Canvas not supported - fireworks disabled');
      return;
    }
    
    const capabilities = getDeviceCapabilities();
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let raf = 0;
    const frameSkip = capabilities.isLowEnd ? 2 : 1; // Skip frames on low-end devices

    type Dot = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      hue: number;
      size: number;
    };

    const dots: Dot[] = [];

    const resize = () => {
      const dpr = capabilities.isLowEnd ? 1 : Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const burst = (x: number, y: number, isHeart = false) => {
      sound.playFirework();
      const baseHue = 270 + Math.random() * 100;
      const baseCount = isHeart ? 50 : 42;
      const count = capabilities.isLowEnd ? Math.floor(baseCount * 0.5) : baseCount;

      for (let i = 0; i < count; i++) {
        let vx = 0;
        let vy = 0;
        if (isHeart) {
          const t = (i / count) * Math.PI * 2;
          const hx = 16 * Math.pow(Math.sin(t), 3);
          const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
          const speed = 0.18 + Math.random() * 0.08;
          vx = hx * speed;
          vy = hy * speed;
        } else {
          const a = Math.random() * Math.PI * 2;
          const s = 1.5 + Math.random() * 4.5;
          vx = Math.cos(a) * s;
          vy = Math.sin(a) * s;
        }

        dots.push({
          x,
          y,
          vx,
          vy,
          life: 1,
          maxLife: 1,
          hue: baseHue + (Math.random() * 40 - 20),
          size: 2 + Math.random() * 2.5,
        });
      }
    };

    const click = (e: PointerEvent) => {
      burst(e.clientX, e.clientY, Math.random() > 0.4);
    };

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointerdown", click);

    const tick = () => {
      frame++;
      
      // Skip frames on low-end devices
      if (frame % frameSkip !== 0) {
        raf = requestAnimationFrame(tick);
        return;
      }

      ctx.fillStyle = "rgba(12, 8, 32, 0.18)";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      // Automatic fireworks (less frequent on low-end)
      const fireworkInterval = capabilities.isLowEnd ? 120 : 75;
      if (frame % fireworkInterval === 0) {
        burst(
          window.innerWidth * (0.15 + Math.random() * 0.7),
          window.innerHeight * (0.15 + Math.random() * 0.4),
          Math.random() > 0.5
        );
      }

      for (let i = dots.length - 1; i >= 0; i--) {
        const d = dots[i];
        if (!d) continue;

        d.x += d.vx;
        d.y += d.vy;
        d.vy += 0.035;
        d.life -= 0.014;

        ctx.save();
        ctx.beginPath();
        ctx.arc(d.x, d.y, Math.max(0, d.life * d.size), 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${d.hue}, 95%, 72%, ${d.life})`;
        
        // Reduce shadow blur on low-end devices
        if (!capabilities.isLowEnd) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = `hsla(${d.hue}, 100%, 80%, ${d.life})`;
        }
        
        ctx.fill();
        ctx.restore();

        if (d.life <= 0) dots.splice(i, 1);
      }

      raf = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", click);
    };
  }, [active]);

  return (
    <canvas
      ref={ref}
      className="fireworks-canvas"
      aria-label="Interactive fireworks. Tap anywhere to launch one."
    />
  );
}

export function Confetti({ burst = false }: { burst?: boolean }) {
  if (!burst) return null;
  
  const capabilities = getDeviceCapabilities();
  const baseCount = 56;
  const count = getRecommendedParticleCount(baseCount);
  
  if (count === 0) return null;
  
  return (
    <div className="confetti" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <i
          key={i}
          style={
            {
              "--i": i,
              "--color": `hsl(${(i * 35) % 360}deg 90% 70%)`,
              "--dx": `${((i % 11) - 5) * 5}vw`,
              "--duration": `${2.4 + (i % 6) * 0.3}s`,
            } as React.CSSProperties
          }
        >
          {i % 4 === 0 ? "★" : i % 3 === 0 ? "♥" : ""}
        </i>
      ))}
    </div>
  );
}


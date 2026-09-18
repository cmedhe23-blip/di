import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Compass,
  Heart,
  Music,
  Play,
  RotateCcw,
  Sparkles,
  Sliders,
  VolumeX,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import garden from "@/assets/cosmic-garden.jpg";
import chest from "@/assets/celestial-chest.jpg";
import cake from "@/assets/wishing-cake.jpg";
import fireworks from "@/assets/cosmic-fireworks.jpg";
import { sound } from "@/lib/sound";
import { birthdayData as defaultData } from "./data";
import { Confetti, FireworksCanvas, MagicDust, StardustCursor } from "./Effects";
import { LoadableImage, handleFontLoading } from "./LoadingStates";
import { 
  loadJourneyState, 
  saveSceneProgress, 
  saveMusicPreference, 
  saveCustomizations 
} from "@/lib/storage";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { sanitizeTextInput } from "@/lib/security";
import { applyBackdropFilterFallback, logFeatureSupport, detectCanvas, detectMediaDevices } from "@/lib/featureDetection";

// Create a mutable type for the birthday data
type BirthdayData = {
  sisterName: string;
  birthdayDate: string;
  videoUrl: string | null;
  musicUrl: string | null;
  balloonCount: number;
  candleCount: number;
  photos: Array<{
    src: string;
    title: string;
    date: string;
    message: string;
  }>;
  wishes: string[];
  balloonMessages: string[];
  chronicle: string;
  finalMessage: string;
  musicLabel: string;
};

const scenes = [
  "Welcome",
  "Celestial Lock",
  "Video Portal",
  "Memories",
  "Memory Detail",
  "Chronicle",
  "Balloon World",
  "Wishing Cake",
  "Fireworks",
  "Revelation",
  "Heartfelt Epistle",
  "End Credits",
];

function Scene({
  children,
  className = "",
  background,
}: {
  children: React.ReactNode;
  className?: string;
  background?: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 1.03, filter: "blur(10px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.97, filter: "blur(8px)" }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className={`scene ${className}`}
      {...(background
        ? {
            style: {
              backgroundImage: `linear-gradient(180deg, rgba(14, 7, 30, 0.42), rgba(18, 7, 36, 0.78)), url(${background})`,
            },
          }
        : {})}
    >
      {children}
    </motion.section>
  );
}

function Title({ children, kicker }: { children: React.ReactNode; kicker?: string }) {
  return (
    <div className="title-wrap">
      {kicker && <p className="kicker">{kicker}</p>}
      <h1 className="script-title">{children}</h1>
      <span className="ornament">✦　♡　✦</span>
    </div>
  );
}

function Welcome({ next, sisterName }: { next: () => void; sisterName: string }) {
  const handleEnter = () => {
    sound.playButtonSound("harp");
    next();
  };

  return (
    <Scene background={garden} className="welcome">
      <MagicDust dense />
      <div className="moon">☾</div>
      <motion.div className="welcome-copy" initial={{ y: 25, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <p className="kicker">A celestial birthday story for {sisterName}</p>
        <h1 className="welcome-title">
          Welcome to My
          <br />
          Cosmic Garden
        </h1>
        <p className="lead">A magical journey crafted just for you with love and stars</p>
        <Button variant="magic" size="xl" pulseGlow soundType="harp" onClick={handleEnter}>
          <Sparkles className="animate-spin-slow" /> Enter Journey ✨
        </Button>
      </motion.div>
      <button className="scroll-cue" onClick={handleEnter} aria-label="Begin the journey">
        <span>Swipe up or tap to begin</span>
        <ChevronDown />
      </button>
    </Scene>
  );
}

function Lock({ next }: { next: () => void }) {
  const [open, setOpen] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const unseal = () => {
    if (open) return;
    sound.playButtonSound("harp");
    setOpen(true);
    setTimeout(next, 1400);
  };

  return (
    <Scene className="lock-scene">
      <MagicDust dense />
      <div className="lock-layout">
        <motion.div
          className={`chest-wrap ${open ? "open" : ""}`}
          animate={{ y: [-6, 6, -6] }}
          transition={{ repeat: Infinity, duration: 4 }}
          style={{
            transform: `perspective(900px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
          }}
          onClick={unseal}
          role="button"
          tabIndex={0}
          aria-label="Celestial chest. Tap to unseal."
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setTilt({
              x: (e.clientX - r.left - r.width / 2) / 35,
              y: -(e.clientY - r.top - r.height / 2) / 35,
            });
          }}
        >
          <LoadableImage
            src={chest}
            width={1280}
            height={1280}
            loading="lazy"
            alt="A glowing celestial treasure chest"
          />
          <div className="unlock-flare" />
          {!open && (
            <div 
              className="chest-hint-badge"
              onClick={(e) => {
                e.stopPropagation();
                unseal();
              }}
              role="button"
              tabIndex={0}
              aria-label="Tap to open the celestial chest"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  unseal();
                }
              }}
            >
              <Sparkles size={16} className="text-amber-300" />
              <span>Tap Chest to Open</span>
            </div>
          )}
        </motion.div>
        <div>
          <Title kicker="Beyond the clouds">
            A Celestial Key
            <br />
            Awaits You...
          </Title>
          <p className="lead">Touch the enchanted chest to unlock the galaxy of memories.</p>
          <Button variant="gold" size="xl" pulseGlow soundType="gold" onClick={unseal} disabled={open}>
            {open ? "The stars are opening..." : "Unseal Key ✨"}
          </Button>
        </div>
      </div>
    </Scene>
  );
}

function VideoPortal({
  videoUrl,
  onOpenCustomizer,
  onPlayingChange,
}: {
  videoUrl: string | null;
  onOpenCustomizer: () => void;
  onPlayingChange?: (isPlaying: boolean) => void;
}) {
  type Phase = "idle" | "countdown" | "curtain" | "playing";
  const [phase, setPhase] = useState<Phase>("idle");
  const [countNum, setCountNum] = useState(3);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCinema = useCallback(() => {
    if (!videoUrl) { onOpenCustomizer(); return; }
    sound.playButtonSound("sparkle");
    setCountNum(3);
    setPhase("countdown");
  }, [videoUrl, onOpenCustomizer]);

  // Auto-start when scene mounts if video exists
  useEffect(() => {
    if (!videoUrl) return;
    const t = setTimeout(startCinema, 700);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Countdown tick: 3 → 2 → 1 → 🎬 → curtain
  useEffect(() => {
    if (phase !== "countdown") return;
    if (countNum > 0) {
      const t = setTimeout(() => setCountNum((n) => n - 1), 1000);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setPhase("curtain"), 950);
    return () => clearTimeout(t);
  }, [phase, countNum]);

  // Curtains animate open, then reveal video
  useEffect(() => {
    if (phase !== "curtain") return;
    const t = setTimeout(() => setPhase("playing"), 1350);
    return () => clearTimeout(t);
  }, [phase]);

  // ── Custom player state ──
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showDedication, setShowDedication] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Cleanup controlsTimer on unmount
  useEffect(() => {
    return () => {
      if (controlsTimer.current) clearTimeout(controlsTimer.current);
    };
  }, []);

  // Show dedication overlay 1.5s after play starts
  useEffect(() => {
    if (phase === "playing") {
      const t = setTimeout(() => setShowDedication(true), 1500);
      const t2 = setTimeout(() => setShowDedication(false), 5500);
      return () => { clearTimeout(t); clearTimeout(t2); };
    }
    // Reset player state when leaving playing phase
    if (phase === "idle") {
      if (videoRef.current) { videoRef.current.pause(); }
      setPlaying(false);
      setCurrentTime(0);
      setShowDedication(false);
    }
  }, [phase]);

  // Auto-play when entering playing phase
  useEffect(() => {
    if (phase === "playing" && videoRef.current) {
      videoRef.current.play().then(() => { setPlaying(true); onPlayingChange?.(true); }).catch(() => {});
    }
    if (phase === "idle") {
      onPlayingChange?.(false);
    }
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const resetControlsTimer = () => {
    setShowControls(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => setShowControls(false), 3000);
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); onPlayingChange?.(true); }
    else { v.pause(); setPlaying(false); onPlayingChange?.(false); }
    resetControlsTimer();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Number(e.target.value);
    setCurrentTime(Number(e.target.value));
    resetControlsTimer();
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const val = Number(e.target.value);
    v.volume = val;
    setVolume(val);
    setMuted(val === 0);
    resetControlsTimer();
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    resetControlsTimer();
  };

  const handleReplay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play();
    setPlaying(true);
    setShowDedication(true);
    setTimeout(() => setShowDedication(false), 4000);
    resetControlsTimer();
  };

  const toggleFullscreen = () => {
    const el = stageRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
    resetControlsTimer();
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  const PETALS = ["🌸", "✨", "💖", "⭐", "🌺", "🌷", "💫"];

  return (
    <Scene background={garden} className="portal-scene">
      <MagicDust />

      {/* ── IDLE ── */}
      {phase === "idle" && (
        <>
          <Title kicker="Scene Three">Our Beautiful Memories</Title>
          <motion.button
            className="vintage-player"
            onClick={startCinema}
            aria-label="Open memories video"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="player-engraving">✦ CELESTIAL CINEMA ✦</div>
            <div className="vintage-play-ring">
              <Play className="big-play" fill="currentColor" />
            </div>
            <span>{videoUrl ? "Begin the memory film" : "Add a video in the customizer"}</span>
            <div className="vintage-sparkles">
              {["✨","🌸","💖","⭐"].map((s, i) => (
                <span key={s} className="vintage-sparkle" style={{ "--vi": i } as React.CSSProperties}>{s}</span>
              ))}
            </div>
          </motion.button>
        </>
      )}

      {/* ── COUNTDOWN OVERLAY ── */}
      <AnimatePresence mode="wait">
        {phase === "countdown" && (
          <motion.div
            key="countdown"
            className="cinema-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={countNum}
                className="cinema-count-num"
                initial={{ scale: 3.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.15, opacity: 0 }}
                transition={{ duration: 0.42, ease: "easeOut" }}
              >
                {countNum > 0 ? countNum : "🎬"}
              </motion.div>
            </AnimatePresence>
            <motion.p
              className="cinema-count-label"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            >
              {countNum > 0 ? "Get ready…" : "Lights, Camera, Memories!"}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── VELVET CURTAINS ── */}
      <AnimatePresence>
        {(phase === "countdown" || phase === "curtain") && (
          <div className="cinema-curtains-wrap" aria-hidden="true">
            <motion.div
              className="cinema-curtain cinema-curtain-left"
              animate={phase === "curtain" ? { x: "-100%" } : { x: "0%" }}
              transition={{ duration: 1.25, ease: [0.77, 0, 0.175, 1] }}
            />
            <motion.div
              className="cinema-curtain cinema-curtain-right"
              animate={phase === "curtain" ? { x: "100%" } : { x: "0%" }}
              transition={{ duration: 1.25, ease: [0.77, 0, 0.175, 1] }}
            />
          </div>
        )}
      </AnimatePresence>

      {/* ── PLAYING STAGE ── */}
      <AnimatePresence>
        {phase === "playing" && videoUrl && (
          <motion.div
            ref={stageRef}
            className="cinema-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            onMouseMove={resetControlsTimer}
            onTouchStart={resetControlsTimer}
            onClick={togglePlay}
          >
            {/* Film grain */}
            <div className="cinema-grain" aria-hidden="true" />

            {/* Gold corner ornaments */}
            <div className="cinema-corner cinema-corner-tl" aria-hidden="true">✦</div>
            <div className="cinema-corner cinema-corner-tr" aria-hidden="true">✦</div>
            <div className="cinema-corner cinema-corner-bl" aria-hidden="true">✦</div>
            <div className="cinema-corner cinema-corner-br" aria-hidden="true">✦</div>

            {/* Small pulsing dot in top-left corner — fades with controls */}
            <motion.div
              className="cinema-live-dot-wrap"
              animate={{ opacity: showControls ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              aria-hidden="true"
            >
              <span className="cinema-badge-dot" />
            </motion.div>

            {/* ── Dedication overlay ── */}
            <AnimatePresence>
              {showDedication && (
                <motion.div
                  className="cinema-dedication"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.7 }}
                  aria-live="polite"
                >
                  <span className="dedication-heart">♡</span>
                  <p className="dedication-text">This memory was made for you, Di</p>
                  <span className="dedication-sub">With love, always ✨</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Big centre play flash ── */}
            <AnimatePresence>
              {!playing && (
                <motion.div
                  className="cinema-centre-play"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.4 }}
                  transition={{ duration: 0.3 }}
                  aria-hidden="true"
                >
                  <Play fill="currentColor" size={52} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Video — no native controls */}
            <video
              ref={videoRef}
              src={videoUrl}
              playsInline
              className="cinema-video"
              onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime ?? 0)}
              onLoadedMetadata={() => setDuration(videoRef.current?.duration ?? 0)}
              onEnded={() => setPlaying(false)}
              onClick={(e) => e.stopPropagation()}
            />

            {/* Floating petals */}
            <div className="cinema-petals" aria-hidden="true">
              {Array.from({ length: 16 }).map((_, i) => (
                <span
                  key={i}
                  className="cinema-petal"
                  style={{
                    left: `${(i * 6.25) % 100}%`,
                    animationDelay: `${(i * 0.38) % 4}s`,
                    animationDuration: `${3.8 + (i % 5) * 0.65}s`,
                  }}
                >
                  {PETALS[i % PETALS.length]}
                </span>
              ))}
            </div>

            {/* ── CUSTOM CONTROLS BAR ── */}
            <motion.div
              className="cinema-controls"
              animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 16 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              aria-label="Video controls"
            >
              {/* Seek / progress bar */}
              <div className="cinema-seek-wrap" aria-label="Video progress">
                <div className="cinema-seek-track">
                  <div className="cinema-seek-fill" style={{ width: `${progressPct}%` }} />
                  <div className="cinema-seek-glow" style={{ width: `${progressPct}%` }} />
                </div>
                <input
                  type="range"
                  className="cinema-seek-input"
                  min={0}
                  max={duration || 0}
                  step={0.1}
                  value={currentTime}
                  onChange={handleSeek}
                  aria-label={`Seek: ${fmt(currentTime)} of ${fmt(duration)}`}
                />
              </div>

              <div className="cinema-controls-row">
                {/* Left group */}
                <div className="cinema-ctrl-group">
                  {/* NOW PLAYING label — lives in controls bar */}
                  <span className="cinema-now-label" aria-live="polite">
                    <span className="cinema-badge-dot" style={{ width: 6, height: 6 }} aria-hidden="true" />
                    NOW PLAYING
                  </span>
                  <button className="cinema-ctrl-btn" onClick={handleReplay} aria-label="Replay from start">
                    <RotateCcw size={16} />
                  </button>
                  <button className="cinema-ctrl-btn cinema-ctrl-play" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
                    {playing
                      ? <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                      : <Play size={20} fill="currentColor" />
                    }
                  </button>
                  <div className="cinema-volume-wrap">
                    <button className="cinema-ctrl-btn" onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"}>
                      {muted || volume === 0 ? <VolumeX size={16} /> : <Music size={16} />}
                    </button>
                    <input
                      type="range"
                      className="cinema-volume-input"
                      min={0}
                      max={1}
                      step={0.05}
                      value={muted ? 0 : volume}
                      onChange={handleVolume}
                      aria-label="Volume"
                    />
                  </div>
                  <span className="cinema-time" aria-label={`Time: ${fmt(currentTime)} of ${fmt(duration)}`}>
                    {fmt(currentTime)} / {fmt(duration)}
                  </span>
                </div>

                {/* Right group */}
                <div className="cinema-ctrl-group">
                  <button className="cinema-ctrl-btn" onClick={() => setPhase("idle")} aria-label="Close cinema">
                    <X size={16} />
                  </button>
                  <button className="cinema-ctrl-btn" onClick={toggleFullscreen} aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}>
                    {isFullscreen
                      ? <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3"/></svg>
                      : <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg>
                    }
                  </button>
                </div>
              </div>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </Scene>
  );
}


function Gallery({
  open,
  photos,
  onFlip,
}: {
  open: (n: number) => void;
  photos: typeof defaultData.photos;
  onFlip?: (count: number) => void;
}) {
  const [flipped, setFlipped] = useState<number | null>(null);

  const handlePhotoClick = (index: number) => {
    sound.playButtonSound("sparkle");
    if (flipped === index) {
      open(index);
    } else {
      setFlipped(index);
      onFlip?.(1);
    }
  };

  const handlePhotoKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handlePhotoClick(index);
    }
  };

  return (
    <Scene className="gallery-scene">
      <MagicDust />
      <Title kicker="Our little universe">
        A Tapestry
        <br />
        of Moments
      </Title>

      {/* Responsive Polaroid Field (Floating Scatter on Desktop, Responsive Grid on Mobile) */}
      <div className="polaroid-field">
        {photos.map((p, i) => (
          <motion.div
            key={p.title}
            className={`polaroid p${i + 1} ${flipped === i ? "is-flipped" : ""}`}
            whileHover={{ scale: 1.06, rotate: 0, zIndex: 15 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePhotoClick(i)}
            onKeyDown={(e) => handlePhotoKeyDown(e, i)}
            role="button"
            tabIndex={0}
            aria-label={`Photo ${i + 1}: ${p.title}. ${flipped === i ? "Press Enter to view full size" : "Press Enter to flip and read message"}.`}
            aria-pressed={flipped === i}
          >
            <div className="polaroid-inner">
              <div className="polaroid-front">
                <LoadableImage
                  src={p.src}
                  width={1024}
                  height={1280}
                  loading="lazy"
                  alt={p.title}
                />
                <span>{p.title}</span>
                <div className="polaroid-flip-tag">
                  <span>✦ Tap to flip</span>
                </div>
              </div>
              <div className="polaroid-back">
                <p className="polaroid-back-date">{p.date}</p>
                <p className="polaroid-back-msg">“{p.message}”</p>
                <span className="polaroid-stamp">✦ Tap to enlarge ✦</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <p className="gallery-hint">
        <span className="hidden md:inline">Hover & click to flip • Click again to open story</span>
        <span className="md:hidden">Tap photo to flip • Tap again to enlarge</span>
      </p>
    </Scene>
  );
}

function MemoryDetail({
  index,
  setIndex,
  photos,
}: {
  index: number;
  setIndex: (n: number) => void;
  photos: typeof defaultData.photos;
}) {
  const p = photos[index] ?? photos[0];
  if (!p) return null;

  const move = (by: number) => {
    setIndex((index + by + photos.length) % photos.length);
  };

  return (
    <Scene background={garden} className="detail-scene">
      <div className="memory-card">
        <div className="memory-photo">
          <LoadableImage src={p.src} width={1024} height={1280} alt={p.title} />
        </div>
        <div className="memory-words">
          <p className="kicker">{p.date}</p>
          <h1>{p.title}</h1>
          <p className="memory-message">“{p.message}”</p>
          <Heart className="heart-beat" />
          <div className="inline-nav">
            <Button
              variant="glass"
              size="icon"
              soundType="nav-prev"
              onClick={() => move(-1)}
              tooltip="Previous Memory (←)"
              aria-label="Previous memory"
            >
              <ArrowLeft />
            </Button>
            <span>
              {index + 1} / {photos.length}
            </span>
            <Button
              variant="glass"
              size="icon"
              soundType="nav-next"
              onClick={() => move(1)}
              tooltip="Next Memory (→)"
              aria-label="Next memory"
            >
              <ArrowRight />
            </Button>
          </div>
        </div>
      </div>
    </Scene>
  );
}

function Chronicle({
  sisterName,
  chronicle,
}: {
  sisterName: string;
  chronicle: string;
}) {
  return (
    <Scene className="chronicle">
      <MagicDust />
      <div className="flower-cluster left">
        🌺<br />
        🌸🌿
      </div>
      <div className="flower-cluster right">
        🌷<br />
        🌿🌺
      </div>
      <motion.article
        className="scroll-letter"
        initial={{ scaleY: 0.15, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 0.9 }}
      >
        <p className="kicker">A page from our story</p>
        <h1>For My Beautiful {sisterName}</h1>
        <p>{chronicle}</p>
        <h2>Happy Birthday</h2>
        <Heart />
      </motion.article>
      {Array.from({ length: 12 }, (_, i) => (
        <i className="petal" key={i} style={{ "--i": i } as React.CSSProperties}>
          ✿
        </i>
      ))}
    </Scene>
  );
}

function BalloonWorld({
  sisterName,
  balloonCount,
  balloonMessages,
  onPop,
}: {
  sisterName: string;
  balloonCount: number;
  balloonMessages: readonly string[];
  onPop?: (count: number, message: string) => void;
}) {
  const [popped, setPopped] = useState<number[]>([]);

  const pop = (i: number) => {
    if (popped.includes(i)) return;
    sound.playButtonSound("pop");
    setPopped((v) => {
      const next = [...v, i];
      const message = next.length === balloonCount 
        ? "All balloons popped! You filled the whole sky with joy!"
        : balloonMessages[(next.length - 1) % balloonMessages.length] || "";
      onPop?.(next.length, message);
      if (next.length === balloonCount) {
        sound.playButtonSound("harp");
      }
      return next;
    });
  };

  const done = popped.length === balloonCount;

  return (
    <Scene className="balloon-scene">
      <MagicDust />
      <Confetti burst={done} />
      
      {/* Screen reader announcement for balloon progress */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {popped.length > 0 && `${popped.length} of ${balloonCount} balloons popped`}
        {done && ". All balloons popped!"}
      </div>

      <div className="balloon-message">
        <p className="kicker">A sky full of joy</p>
        <h1>
          {sisterName},<br />
          <span>Life is a Celebration</span>
          <br />
          with You!
        </h1>
        <div className="mt-2">
          <p className="score" aria-label={`Balloon progress: ${popped.length} out of ${balloonCount} popped`}>
            Balloons popped: {popped.length} / {balloonCount}
          </p>
        </div>
        {popped.length > 0 && !done && (
          <p className="pop-note">
            {balloonMessages[(popped.length - 1) % balloonMessages.length]}
          </p>
        )}
        {done && <p className="complete-note">You filled the whole sky with joy! ✨</p>}
      </div>

      {Array.from({ length: balloonCount }, (_, i) => {
        // Constrain balloons so they stay around the perimeter without obscuring the central text
        const isLeft = i % 2 === 0;
        const xPos = isLeft ? 5 + (i * 11) % 28 : 67 + (i * 11) % 28;
        const isPopped = popped.includes(i);
        return (
          <button
            aria-label={`${isPopped ? "Popped balloon" : "Pop balloon"} ${i + 1} of ${balloonCount}`}
            aria-pressed={isPopped}
            key={i}
            onClick={() => pop(i)}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && !isPopped) {
                e.preventDefault();
                pop(i);
              }
            }}
            className={`balloon balloon-${i % 5} ${isPopped ? "popped" : ""}`}
            style={{ "--i": i, "--x": `${xPos}%` } as React.CSSProperties}
            disabled={isPopped}
          >
            {i % 5 === 0 ? "♡" : i % 4 === 0 ? "★" : ""}
          </button>
        );
      })}
    </Scene>
  );
}

function WishingCake({
  candleCount,
  wishes,
  onBlow,
}: {
  candleCount: number;
  wishes: readonly string[];
  onBlow?: (count: number, wish: string) => void;
}) {
  const [out, setOut] = useState<number[]>([]);
  const [wish, setWish] = useState("");
  const [micActive, setMicActive] = useState(false);
  const [micSupported] = useState(() => detectMediaDevices());
  const streamRef = useRef<MediaStream | null>(null);

  const blow = (i: number) => {
    if (out.includes(i)) return;
    sound.playWhoosh();
    const newWish = wishes[i] ?? "";
    setOut((v) => {
      const next = [...v, i];
      onBlow?.(next.length, newWish);
      if (next.length === candleCount) {
        sound.playButtonSound("harp");
      }
      return next;
    });
    setWish(newWish);
  };

  // Microphone blowing detector
  useEffect(() => {
    if (!micActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      return;
    }

    let rafId = 0;
    navigator.mediaDevices
      ?.getUserMedia({ audio: true })
      .then((stream) => {
        streamRef.current = stream;
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        const source = ctx.createMediaStreamSource(stream);
        source.connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);

        let lastBlow = 0;
        const checkMic = () => {
          analyser.getByteFrequencyData(data);
          let sum = 0;
          for (let i = 0; i < data.length; i++) sum += data[i] ?? 0;
          const avg = sum / data.length;

          if (avg > 40 && Date.now() - lastBlow > 550) {
            lastBlow = Date.now();
            setOut((currentOut) => {
              for (let i = 0; i < candleCount; i++) {
                if (!currentOut.includes(i)) {
                  sound.playWhoosh();
                  setWish(wishes[i] ?? "");
                  const nextOut = [...currentOut, i];
                  if (nextOut.length === candleCount) sound.playButtonSound("harp");
                  return nextOut;
                }
              }
              return currentOut;
            });
          }
          rafId = requestAnimationFrame(checkMic);
        };
        checkMic();
      })
      .catch(() => setMicActive(false));

    return () => {
      cancelAnimationFrame(rafId);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [micActive, candleCount, wishes]);

  const done = out.length === candleCount;

  return (
    <Scene className="cake-scene">
      <MagicDust />
      <Confetti burst={done} />
      
      {/* Screen reader announcement for candle progress */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {out.length > 0 && `${out.length} of ${candleCount} candles blown out`}
        {done && ". All wishes unlocked!"}
        {wish && `. Revealed wish: ${wish}`}
      </div>

      <div className="cake-copy">
        <Title kicker="Six wishes, just for you">The Wishing Cake</Title>
        <p className="wish-text" aria-live="polite">
          {done ? "Make a Wish! 🎂✨ All wishes unlocked!" : wish || "Touch each candle flame (or blow into mic) to reveal a birthday wish."}
        </p>
        <p className="score" aria-label={`Wish progress: ${out.length} out of ${candleCount} unlocked`}>
          {out.length} / {candleCount} wishes unlocked
        </p>
        {micSupported && (
          <div className="mt-3 flex justify-center">
            <Button
              variant={micActive ? "magic" : "glass"}
              size="sm"
              onClick={() => setMicActive((v) => !v)}
              tooltip="Enable microphone to blow out candles by blowing into your mic"
              aria-label={micActive ? "Microphone active. Blow into mic to extinguish candles" : "Enable microphone to blow out candles"}
            >
              {micActive ? "🎤 Mic Active (Blow into mic!)" : "🎙️ Enable Mic to Blow"}
            </Button>
          </div>
        )}
      </div>
      <div className="cake-art">
        <div className="cake-stage">
          <LoadableImage
            src={cake}
            width={1280}
            height={1024}
            loading="lazy"
            alt="A six candle floral birthday cake"
          />
          {Array.from({ length: candleCount }, (_, i) => {
            const isOut = out.includes(i);
            return (
              <button
                key={i}
                onClick={() => blow(i)}
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === " ") && !isOut) {
                    e.preventDefault();
                    blow(i);
                  }
                }}
                className={`candle-hit c${i + 1} ${isOut ? "out" : ""}`}
                aria-label={`${isOut ? "Extinguished" : "Blow out"} candle ${i + 1} of ${candleCount}`}
                aria-pressed={isOut}
                disabled={isOut}
              >
                <span className="flame" />
                <span className="smoke">〰</span>
              </button>
            );
          })}
        </div>
      </div>
    </Scene>
  );
}

function Fireworks({ sisterName }: { sisterName: string }) {
  const [canvasSupported] = useState(() => detectCanvas());
  
  return (
    <Scene background={fireworks} className="fireworks-scene">
      {canvasSupported ? (
        <FireworksCanvas />
      ) : (
        <div className="canvas-fallback">
          <div>
            <div className="canvas-fallback-icon">✨</div>
            <p>Imagine beautiful fireworks lighting up the sky!</p>
            <p className="text-sm mt-2">(Canvas effects unavailable in this browser)</p>
          </div>
        </div>
      )}
      <div className="firework-copy">
        <p className="script-title">Happy Birthday</p>
        <h1>{sisterName.toUpperCase()}</h1>
        <p>The World Shines for You! ✨</p>
      </div>
      {canvasSupported && <p className="tap-note">Tap anywhere in the sky to launch a firework</p>}
    </Scene>
  );
}

function Revelation({ sisterName }: { sisterName: string }) {
  const [open, setOpen] = useState(false);

  const handleReveal = () => {
    sound.playButtonSound("harp");
    setOpen(true);
  };

  return (
    <Scene className={`reveal-scene ${open ? "revealed" : ""}`}>
      <MagicDust dense />
      <div className="galaxy">
        <div className="galaxy-core">♡</div>
      </div>
      <motion.div className="reveal-copy" animate={open ? { scale: 1.06 } : { scale: 1 }}>
        <Title kicker="The final constellation">
          {open ? "You Are the Magic" : "The Ultimate Secret is Revealed..."}
        </Title>
        <p className="lead">
          {open
            ? `The brightest part of this whole universe has always been you, ${sisterName}.`
            : "A world of wonder awaits beyond the stars."}
        </p>
        <Button variant="magic" size="xl" soundType="magic" onClick={handleReveal} disabled={open}>
          {open ? "Revealed with love ♡" : "Enter the Magic ✨"}
        </Button>
      </motion.div>
    </Scene>
  );
}

function Epistle({
  sisterName,
  finalMessage,
}: {
  sisterName: string;
  finalMessage: string;
}) {
  return (
    <Scene className="epistle">
      <MagicDust />
      <article className="epistle-card">
        <span className="corner tl">✦</span>
        <span className="corner tr">✦</span>
        <p className="kicker">From my heart to yours</p>
        <h1>
          For My {sisterName},
          <br />
          A Lifetime of Love.
        </h1>
        <Heart className="heart-beat" />
        <p className="long-letter">{finalMessage}</p>
        <footer>
          Made with care for you,
          <br />
          <strong>— With All My Love</strong>
        </footer>
        <span className="corner bl">✦</span>
        <span className="corner br">✦</span>
      </article>
    </Scene>
  );
}

function End({
  replay,
  memories,
  celebrate,
}: {
  replay: () => void;
  memories: () => void;
  celebrate: () => void;
}) {
  return (
    <Scene background={fireworks} className="end-scene">
      <MagicDust dense />
      <div className="end-copy">
        <Heart className="heart-beat" />
        <h1>Be Always Happy...</h1>
        <p>The Stars Deserve Your Smile.</p>
        <span>
          Made with Love ♡
          <br />— Happy Birthday ✨
        </span>
        <div className="end-actions">
          <Button variant="glass" soundType="harp" onClick={replay} tooltip="Start from the beginning">
            <RotateCcw /> Replay Journey
          </Button>
          <Button variant="aurora" soundType="magic" onClick={memories} tooltip="Open memories gallery">
            <Play /> View Memories
          </Button>
          <Button variant="gold" soundType="gold" pulseGlow onClick={celebrate} tooltip="Celebrate with fireworks">
            <Sparkles /> Celebrate Again
          </Button>
        </div>
      </div>
    </Scene>
  );
}

export function BirthdayJourney() {
  const [data, setData] = useState<BirthdayData>(() => ({
    ...defaultData,
    photos: [...defaultData.photos],
    wishes: [...defaultData.wishes],
    balloonMessages: [...defaultData.balloonMessages],
  }));
  const [scene, setScene] = useState(0);
  const [memory, setMemory] = useState(0);
  const [music, setMusic] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [personalizeOpen, setPersonalizeOpen] = useState(false);
  const [showKeyboardHint, setShowKeyboardHint] = useState(true);
  const [navigationFeedback, setNavigationFeedback] = useState<"next" | "prev" | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const audio = useRef<HTMLAudioElement>(null);
  const touch = useRef(0);
  const wheel = useRef(0);

  // Focus trap for modals
  const drawerRef = useFocusTrap(drawerOpen);
  const personalizeRef = useFocusTrap(personalizeOpen);

  // Load saved state on mount
  useEffect(() => {
    handleFontLoading();
    
    // Detect feature support and apply fallbacks
    const features = logFeatureSupport();
    applyBackdropFilterFallback();
    
    // Show user-friendly warnings for missing features
    if (!features.canvas) {
      console.info('ℹ️ Some visual effects may be limited on this browser');
    }
    if (!features.mediaDevices) {
      console.info('ℹ️ Microphone candle-blowing feature unavailable on this browser');
    }
    
    // Load persisted state
    const savedState = loadJourneyState();
    if (savedState) {
      // Restore scene (but start at 0 if it's a new visit after 24 hours)
      const hoursSinceLastVisit = savedState.lastVisit 
        ? (Date.now() - new Date(savedState.lastVisit).getTime()) / (1000 * 60 * 60)
        : 999;
      
      if (hoursSinceLastVisit < 24 && savedState.lastScene > 0) {
        setScene(savedState.lastScene);
      }
      
      // Restore music preference
      setMusic(savedState.musicEnabled);
      if (savedState.musicEnabled) {
        setTimeout(() => {
          if (defaultData.musicUrl && audio.current) {
            audio.current.play().catch(() => {});
          } else {
            sound.toggleAmbient(true);
          }
        }, 500);
      }
      
      // Restore customizations
      if (savedState.customizations.sisterName || savedState.customizations.finalMessage) {
        setData(prev => ({
          ...prev,
          sisterName: savedState.customizations.sisterName || prev.sisterName,
          finalMessage: savedState.customizations.finalMessage || prev.finalMessage,
        }) as BirthdayData);
      }
    }
    
    // Hide keyboard hint after first interaction
    const hideHint = () => setShowKeyboardHint(false);
    window.addEventListener('keydown', hideHint, { once: true });
    return () => window.removeEventListener('keydown', hideHint);
  }, []);

  // Save scene progress when it changes
  useEffect(() => {
    if (scene > 0) {
      saveSceneProgress(scene);
    }
  }, [scene]);

  // Clear navigation feedback after showing
  useEffect(() => {
    if (navigationFeedback) {
      const timer = setTimeout(() => setNavigationFeedback(null), 600);
      return () => clearTimeout(timer);
    }
  }, [navigationFeedback]);

  const go = useCallback((n: number) => {
    sound.playButtonSound("chime");
    const newScene = Math.max(0, Math.min(11, n));
    setScene(newScene);
    setAnnouncement(`Jumped to scene ${newScene + 1} of 12: ${scenes[newScene]}`);
  }, []);

  const next = useCallback(() => {
    sound.playButtonSound("nav-next");
    setScene((s) => {
      const newScene = Math.min(11, s + 1);
      setAnnouncement(`Moving to scene ${newScene + 1} of 12: ${scenes[newScene]}`);
      return newScene;
    });
    setNavigationFeedback("next");
  }, []);

  const prev = useCallback(() => {
    sound.playButtonSound("nav-prev");
    setScene((s) => {
      const newScene = Math.max(0, s - 1);
      setAnnouncement(`Moving back to scene ${newScene + 1} of 12: ${scenes[newScene]}`);
      return newScene;
    });
    setNavigationFeedback("prev");
  }, []);

  const toggleSoundtrack = () => {
    if (data.musicUrl && audio.current) {
      if (music) {
        audio.current.pause();
        setMusic(false);
        saveMusicPreference(false);
        setAnnouncement("Background music paused");
      } else {
        audio.current.play().then(() => {
          setMusic(true);
          saveMusicPreference(true);
          setAnnouncement("Background music playing");
        }).catch(() => {
          setMusic(false);
          saveMusicPreference(false);
          setAnnouncement("Unable to play music");
        });
      }
    } else {
      const active = sound.toggleAmbient();
      setMusic(active);
      saveMusicPreference(active);
      setAnnouncement(active ? "Ambient music playing" : "Ambient music paused");
    }
  };

  // Keyboard accessibility
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") prev();
      if (e.key === "Escape") {
        setDrawerOpen(false);
        setPersonalizeOpen(false);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [next, prev]);

  // Smoothed wheel scroll to avoid accidental skipping
  const onWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - wheel.current < 1100) return;
    if (Math.abs(e.deltaY) > 55) {
      wheel.current = now;
      e.deltaY > 0 ? next() : prev();
    }
  };

  const renderScene = () => {
    switch (scene) {
      case 0:
        return <Welcome next={next} sisterName={data.sisterName} />;
      case 1:
        return <Lock next={next} />;
      case 2:
        return <VideoPortal videoUrl={data.videoUrl} onOpenCustomizer={() => setPersonalizeOpen(true)} onPlayingChange={setVideoPlaying} />;
      case 3:
        return <Gallery 
          open={(n) => { 
            setMemory(n); 
            go(4); 
          }} 
          photos={data.photos}
          onFlip={(count) => setAnnouncement(`Flipped ${count} of ${data.photos.length} photos`)}
        />;
      case 4:
        return <MemoryDetail index={memory} setIndex={setMemory} photos={data.photos} />;
      case 5:
        return <Chronicle sisterName={data.sisterName} chronicle={data.chronicle} />;
      case 6:
        return (
          <BalloonWorld
            sisterName={data.sisterName}
            balloonCount={data.balloonCount}
            balloonMessages={data.balloonMessages}
            onPop={(count, message) => setAnnouncement(`${count} of ${data.balloonCount} balloons popped. ${message}`)}
          />
        );
      case 7:
        return <WishingCake 
          candleCount={data.candleCount} 
          wishes={data.wishes} 
          onBlow={(count, wish) => setAnnouncement(`${count} of ${data.candleCount} candles blown out. Wish: ${wish}`)}
        />;
      case 8:
        return <Fireworks sisterName={data.sisterName} />;
      case 9:
        return <Revelation sisterName={data.sisterName} />;
      case 10:
        return <Epistle sisterName={data.sisterName} finalMessage={data.finalMessage} />;
      default:
        return <End replay={() => go(0)} memories={() => go(3)} celebrate={() => go(8)} />;
    }
  };

  return (
    <main
      className="journey"
      onWheel={onWheel}
      onTouchStart={(e) => (touch.current = e.touches[0]?.clientY ?? 0)}
      onTouchEnd={(e) => {
        const y = e.changedTouches[0]?.clientY ?? touch.current;
        const diff = touch.current - y;
        if (Math.abs(diff) > 80) (diff > 0 ? next : prev)();
      }}
      role="application"
      aria-label="Interactive birthday journey experience"
    >
      {/* Screen reader live region for announcements */}
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        {announcement}
      </div>

      {/* Skip to content link for keyboard users */}
      <a href="#scene-content" className="skip-to-content">
        Skip to scene content
      </a>

      {/* Navigation direction feedback */}
      <AnimatePresence>
        {navigationFeedback && (
          <motion.div
            className={`navigation-feedback ${navigationFeedback}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            {navigationFeedback === "next" ? (
              <>
                <ArrowRight size={32} />
                <span>Next Scene</span>
              </>
            ) : (
              <>
                <ArrowLeft size={32} />
                <span>Previous Scene</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <StardustCursor />
      {data.musicUrl ? <audio ref={audio} src={data.musicUrl} loop aria-label="Background music" /> : null}

      {/* Top Glassmorphic Navigation HUD — hidden while video plays */}
      <motion.header
        className="journey-top"
        animate={{ opacity: videoPlaying ? 0 : 1, pointerEvents: videoPlaying ? 'none' : 'auto' }}
        transition={{ duration: 0.4 }}
      >
        <div
          className="scene-name"
          aria-label={`Scene ${scene + 1}: ${scenes[scene]}`}
        >
          <Compass size={14} className="text-amber-300" />
          <span>{String(scene + 1).padStart(2, "0")}</span>
          <span className="hidden sm:inline">{scenes[scene]}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="glass"
            size="sm"
            soundType="gold"
            onClick={() => {
              setPersonalizeOpen(true);
              setAnnouncement("Opened customization panel. Edit story details.");
            }}
            tooltip="Personalize names & story details"
            className="text-xs customize-btn"
          >
            <Sliders size={13} />
            <span>Customize</span>
          </Button>

          <div className="music-control">
            {music && (
              <div className="music-wave" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
              </div>
            )}
            <Button
              variant={music ? "magic" : "glass"}
              size="icon"
              soundType={music ? "chime" : "sparkle"}
              onClick={toggleSoundtrack}
              tooltip={music ? "Mute Background Music" : "Play Ambient Celestial Music"}
              aria-label={music ? "Turn music off" : "Turn music on"}
            >
              {music ? <Music size={15} /> : <VolumeX size={15} />}
            </Button>
            <span className="hidden sm:inline">Music {music ? "On" : "Off"}</span>
          </div>
        </div>
      </motion.header>

      {/* Scene Transitions */}
      <AnimatePresence mode="wait">
        <div key={scene} id="scene-content" role="region" aria-live="polite" aria-label={`Scene ${scene + 1}: ${scenes[scene]}`}>
          {renderScene()}
        </div>
      </AnimatePresence>

      {/* Floating Bottom Navigation Pill — hidden while video plays */}
      <motion.footer
        className="journey-nav"
        aria-label="Scene navigation"
        animate={{ opacity: videoPlaying ? 0 : 1, y: videoPlaying ? 20 : 0, pointerEvents: videoPlaying ? 'none' : 'auto' }}
        transition={{ duration: 0.4 }}
      >
        <Button
          variant="glass"
          size="icon"
          soundType="nav-prev"
          onClick={prev}
          disabled={scene === 0}
          tooltip="Previous scene (← or swipe down)"
          aria-label={`Previous scene. Currently on scene ${scene + 1} of 12`}
        >
          <ArrowLeft />
        </Button>
        <div className="progress" role="progressbar" aria-valuenow={scene + 1} aria-valuemin={1} aria-valuemax={12} aria-label={`Progress: Scene ${scene + 1} of 12`}>
          <span style={{ width: `${((scene + 1) / 12) * 100}%` }} />
          <b>{scene + 1} / 12</b>
        </div>
        <Button
          variant="glass"
          size="icon"
          soundType="nav-next"
          onClick={next}
          disabled={scene === 11}
          tooltip="Next scene (→ or swipe up)"
          aria-label={`Next scene. Currently on scene ${scene + 1} of 12`}
        >
          <ArrowRight />
        </Button>
      </motion.footer>

      {/* Mobile Page Indicator - Only visible on mobile */}
      <div className="page-indicator-mobile">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className={`page-dot ${i === scene ? 'active' : ''}`}
            aria-hidden="true"
          />
        ))}
        <span className="page-number">{scene + 1}/12</span>
      </div>

      {/* Swipe Gesture Hint - Fades after 5s or first swipe */}
      {scene === 0 && (
        <div className="swipe-hint" style={{ opacity: scene > 0 ? 0 : 1 }}>
          <div className="finger-icon" />
          <span className="swipe-text">Swipe</span>
        </div>
      )}

      {/* Quick Jump Constellation Drawer Modal */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            className="scene-drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDrawerOpen(false)}
          >
            <motion.div
              ref={drawerRef}
              className="scene-drawer"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="drawer-title"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 id="drawer-title" className="font-serif text-xl text-white">Constellation Map</h2>
                  <p className="text-xs text-amber-200/80">Jump to any scene in the story</p>
                </div>
                <Button
                  variant="glass"
                  size="icon"
                  onClick={() => {
                    setDrawerOpen(false);
                    setAnnouncement("Closed constellation map");
                  }}
                  aria-label="Close constellation drawer"
                >
                  <X />
                </Button>
              </div>

              <div className="scene-grid">
                {scenes.map((name, i) => (
                  <button
                    key={name}
                    className={`scene-chip ${scene === i ? "active" : ""}`}
                    onClick={() => {
                      go(i);
                      setDrawerOpen(false);
                    }}
                  >
                    <span className="scene-chip-num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="scene-chip-name">{name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Personalize Customizer Drawer */}
      <AnimatePresence>
        {personalizeOpen && (
          <motion.div
            className="scene-drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPersonalizeOpen(false)}
          >
            <motion.div
              ref={personalizeRef}
              className="scene-drawer"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="customize-title"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 id="customize-title" className="font-serif text-xl text-white">Personalize the Story</h2>
                  <p className="text-xs text-amber-200/80">Customize names, story messages & media</p>
                </div>
                <Button
                  variant="glass"
                  size="icon"
                  onClick={() => {
                    setPersonalizeOpen(false);
                    setAnnouncement("Closed customization panel");
                  }}
                  aria-label="Close customizer"
                >
                  <X />
                </Button>
              </div>

              <div className="mt-4 flex flex-col gap-4 text-left">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                    Sister's Name / Nickname
                  </label>
                  <input
                    type="text"
                    value={data.sisterName}
                    onChange={(e) => {
                      const sanitized = sanitizeTextInput(e.target.value, 50);
                      setData(prev => ({ ...prev, sisterName: sanitized } as BirthdayData));
                    }}
                    maxLength={50}
                    className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-white placeholder-white/40 focus:border-amber-400 focus:outline-none"
                    placeholder="Enter name (e.g. Di, Sarah, Aanya)"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                    Chronicle Page Story
                  </label>
                  <textarea
                    rows={3}
                    value={data.chronicle}
                    onChange={(e) => {
                      const sanitized = sanitizeTextInput(e.target.value, 500);
                      setData(prev => ({ ...prev, chronicle: sanitized } as BirthdayData));
                    }}
                    maxLength={500}
                    className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-white placeholder-white/40 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                    Final Heartfelt Letter Message
                  </label>
                  <textarea
                    rows={4}
                    value={data.finalMessage}
                    onChange={(e) => {
                      const sanitized = sanitizeTextInput(e.target.value, 1000);
                      setData(prev => ({ ...prev, finalMessage: sanitized } as BirthdayData));
                    }}
                    maxLength={1000}
                    className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-white placeholder-white/40 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="magic"
                    size="default"
                    soundType="harp"
                    onClick={() => {
                      sound.playButtonSound("harp");
                      // Save customizations to localStorage
                      saveCustomizations({
                        sisterName: data.sisterName,
                        finalMessage: data.finalMessage,
                      });
                      setPersonalizeOpen(false);
                      setAnnouncement("Customizations saved successfully");
                    }}
                  >
                    Save & Shine ✨
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

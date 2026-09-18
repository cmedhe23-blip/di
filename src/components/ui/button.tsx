import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { sound } from "@/lib/sound";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full text-sm font-semibold cursor-pointer overflow-hidden transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/80 disabled:pointer-events-none disabled:opacity-40 disabled:cursor-not-allowed select-none active:scale-[0.94] hover:scale-[1.03] touch-manipulation [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white shadow-[0_4px_20px_rgba(236,72,153,0.45)] hover:shadow-[0_8px_32px_rgba(236,72,153,0.7)] hover:-translate-y-0.5 border border-pink-300/30",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[0_4px_18px_rgba(239,68,68,0.4)] hover:bg-destructive/90 hover:-translate-y-0.5 border border-red-300/20",
        outline:
          "border border-white/35 bg-white/10 text-white backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:bg-white/20 hover:border-white/60 hover:-translate-y-0.5",
        secondary:
          "bg-purple-950/70 text-purple-200 border border-purple-400/30 shadow-[0_4px_20px_rgba(147,51,234,0.2)] hover:bg-purple-900/90 hover:border-purple-300/50 hover:text-white hover:-translate-y-0.5",
        ghost:
          "text-white/85 hover:bg-white/15 hover:text-white hover:-translate-y-0.5",
        link:
          "text-amber-300 underline-offset-4 hover:underline hover:text-amber-200 hover:scale-100",
        magic:
          "group border border-pink-200/60 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white shadow-[0_0_35px_rgba(244,114,182,0.6),inset_0_1px_2px_rgba(255,255,255,0.7)] backdrop-blur-xl hover:shadow-[0_0_60px_rgba(244,114,182,0.95),inset_0_1px_3px_rgba(255,255,255,0.9)] hover:border-white hover:-translate-y-0.5",
        glass:
          "border border-white/35 bg-white/15 text-white shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.5)] backdrop-blur-2xl hover:bg-white/25 hover:border-white/70 hover:shadow-[0_12px_42px_rgba(255,255,255,0.3)] hover:-translate-y-0.5",
        gold:
          "group border-2 border-amber-200/90 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-amber-950 font-extrabold shadow-[0_0_40px_rgba(251,191,36,0.8),0_4px_25px_rgba(0,0,0,0.45),inset_0_2px_4px_rgba(255,255,255,0.9)] hover:shadow-[0_0_65px_rgba(251,191,36,1),0_8px_32px_rgba(0,0,0,0.6)] hover:border-white hover:-translate-y-0.5 tracking-[0.22em]",
        royal:
          "group border border-amber-300/80 bg-gradient-to-r from-purple-950/95 via-indigo-950/95 to-slate-950/95 text-amber-200 font-bold shadow-[0_0_35px_rgba(251,191,36,0.35),0_8px_30px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(251,191,36,0.5)] backdrop-blur-2xl hover:border-amber-200 hover:text-white hover:shadow-[0_0_55px_rgba(251,191,36,0.7)] hover:-translate-y-0.5 tracking-[0.22em]",
        roseGold:
          "group border border-pink-200/90 bg-gradient-to-r from-rose-400 via-pink-300 to-amber-200 text-rose-950 font-extrabold shadow-[0_0_40px_rgba(251,113,133,0.6),inset_0_2px_4px_rgba(255,255,255,0.95)] hover:shadow-[0_0_60px_rgba(251,113,133,0.9)] hover:border-white hover:-translate-y-0.5 tracking-[0.22em]",
        crystal:
          "group border border-white/60 bg-white/20 text-white font-bold shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_2px_6px_rgba(255,255,255,0.8),0_0_35px_rgba(255,255,255,0.4)] backdrop-blur-2xl hover:bg-white/30 hover:border-white hover:shadow-[0_0_60px_rgba(255,255,255,0.7)] hover:-translate-y-0.5 tracking-[0.22em]",
        cosmic:
          "group border border-violet-400/70 bg-gradient-to-r from-violet-900/95 via-purple-800/95 to-fuchsia-900/95 text-violet-100 shadow-[0_0_40px_rgba(168,85,247,0.5),inset_0_1px_2px_rgba(255,255,255,0.4)] backdrop-blur-xl hover:border-violet-300 hover:shadow-[0_0_65px_rgba(168,85,247,0.85)] hover:-translate-y-0.5",
        neon:
          "group border border-cyan-300/80 bg-gradient-to-r from-cyan-600 via-teal-500 to-emerald-500 text-white font-bold shadow-[0_0_35px_rgba(6,182,212,0.6),inset_0_1px_2px_rgba(255,255,255,0.8)] hover:shadow-[0_0_55px_rgba(6,182,212,0.95)] hover:border-white hover:-translate-y-0.5",
        aurora:
          "group border border-emerald-300/70 bg-gradient-to-r from-emerald-600 via-indigo-600 to-pink-500 text-white font-semibold shadow-[0_0_35px_rgba(52,211,153,0.5),inset_0_1px_2px_rgba(255,255,255,0.7)] hover:shadow-[0_0_55px_rgba(236,72,153,0.85)] hover:border-pink-200 hover:-translate-y-0.5",
        starlight:
          "group border border-amber-100/80 bg-gradient-to-r from-slate-900/90 via-purple-950/90 to-slate-900/90 text-amber-200 font-semibold shadow-[0_0_30px_rgba(253,230,138,0.35),inset_0_1px_1px_rgba(255,255,255,0.5)] backdrop-blur-2xl hover:border-amber-200 hover:text-white hover:shadow-[0_0_50px_rgba(253,230,138,0.7)] hover:-translate-y-0.5",
      },
      size: {
        default: "min-h-[44px] h-11 px-6 py-2.5 text-sm",
        sm: "min-h-[38px] h-9 rounded-full px-4 text-xs font-medium",
        lg: "min-h-[50px] h-13 rounded-full px-9 text-base font-semibold",
        icon: "min-h-[44px] min-w-[44px] h-11 w-11 p-0 rounded-full",
        xl: "min-h-[56px] h-14 rounded-full px-10 text-sm font-bold uppercase tracking-[0.22em] shadow-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonSoundType =
  | "default"
  | "magic"
  | "gold"
  | "cosmic"
  | "glass"
  | "nav-next"
  | "nav-prev"
  | "pop"
  | "sparkle"
  | "chime"
  | "harp"
  | "neon"
  | "aurora"
  | "none";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  soundEffect?: boolean;
  soundType?: ButtonSoundType;
  pulseGlow?: boolean;
  shimmer?: boolean;
  tooltip?: string;
}

interface Spark {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  size: number;
  color: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      soundEffect = true,
      soundType,
      pulseGlow = false,
      shimmer = false,
      tooltip,
      onClick,
      title,
      ...props
    },
    ref,
  ) => {
    const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; id: number }>>([]);
    const [sparks, setSparks] = React.useState<Spark[]>([]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Audio feedback triggered per soundType or variant
      if (soundEffect && soundType !== "none") {
        if (soundType) {
          sound.playButtonSound(soundType);
        } else if (variant === "gold") {
          sound.playButtonSound("gold");
        } else if (variant === "magic" || variant === "aurora") {
          sound.playButtonSound("magic");
        } else if (variant === "cosmic" || variant === "neon") {
          sound.playButtonSound("cosmic");
        } else if (variant === "glass") {
          sound.playButtonSound("glass");
        } else {
          sound.playButtonSound("chime");
        }
      }

      // Create click ripple particle
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now() + Math.random();
      setRipples((prev) => [...prev, { x, y, id }]);

      // Create burst of micro-sparks
      const sparkColors = ["#fbcfe8", "#fde047", "#a5f3fc", "#ffffff", "#c084fc"];
      const newSparks: Spark[] = Array.from({ length: 6 }, (_, i) => ({
        id: id + i,
        x,
        y,
        angle: (i * Math.PI * 2) / 6 + (Math.random() * 0.4 - 0.2),
        speed: 25 + Math.random() * 35,
        size: 3 + Math.random() * 3,
        color: sparkColors[i % sparkColors.length] ?? "#fff",
      }));
      setSparks((prev) => [...prev, ...newSparks]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
        setSparks((prev) => prev.filter((s) => !newSparks.some((ns) => ns.id === s.id)));
      }, 750);

      if (onClick) onClick(e);
    };

    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          onClick={handleClick}
          title={tooltip || title}
          {...props}
        />
      );
    }

    const showShimmer =
      shimmer ||
      variant === "magic" ||
      variant === "gold" ||
      variant === "cosmic" ||
      variant === "neon" ||
      variant === "aurora" ||
      variant === "starlight";

    return (
      <button
        className={cn(
          buttonVariants({ variant, size, className }),
          pulseGlow && "animate-pulse-glow",
        )}
        ref={ref}
        onClick={handleClick}
        title={tooltip || title}
        {...props}
      >
        {/* Active ripple waves */}
        {ripples.map((r) => (
          <span
            key={r.id}
            className="absolute rounded-full bg-white/45 pointer-events-none animate-ripple"
            style={{
              left: r.x,
              top: r.y,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}

        {/* Micro sparkle burst on click */}
        {sparks.map((s) => (
          <span
            key={s.id}
            className="absolute pointer-events-none rounded-full animate-sparkle-burst"
            style={{
              left: s.x,
              top: s.y,
              width: `${s.size}px`,
              height: `${s.size}px`,
              backgroundColor: s.color,
              boxShadow: `0 0 8px ${s.color}`,
              "--spark-x": `${Math.cos(s.angle) * s.speed}px`,
              "--spark-y": `${Math.sin(s.angle) * s.speed}px`,
            } as React.CSSProperties}
          />
        ))}

        <span className="relative z-10 flex items-center justify-center gap-2">
          {props.children}
        </span>

        {/* Shimmer light sweep for magical & luminous variants */}
        {showShimmer && (
          <span
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 ease-in-out group-hover:translate-x-full pointer-events-none"
            aria-hidden="true"
          />
        )}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

import { useEffect, useCallback, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { CelebrationTrigger } from "@/types";
import { cn } from "@/lib/utils";
import { markCelebrationSeen } from "@/lib/celebration-utils";
import { Trophy, Star, Sparkles } from "lucide-react";

interface CelebrationOverlayProps {
  objectiveId: number;
  objectiveName: string;
  trigger: CelebrationTrigger;
  onDismiss?: () => void;
}

const CELEBRATION_CONFIG = {
  hit_50: {
    title: "Halfway There!",
    subtitle: "50% complete",
    icon: Star,
    gradient: "from-blue-500 to-cyan-500",
    confettiCount: 30,
  },
  hit_75: {
    title: "Almost There!",
    subtitle: "75% complete",
    icon: Sparkles,
    gradient: "from-purple-500 to-pink-500",
    confettiCount: 50,
  },
  hit_100: {
    title: "Goal Achieved!",
    subtitle: "100% complete",
    icon: Trophy,
    gradient: "from-yellow-500 to-orange-500",
    confettiCount: 100,
  },
};

// Pre-computed confetti data type
interface ConfettiData {
  id: number;
  color: string;
  delay: number;
  left: number;
  animationDuration: number;
  size: number;
  isCircle: boolean;
}

// Confetti particle component - uses pre-computed values
function Confetti({ data }: { data: ConfettiData }) {
  return (
    <div
      className="absolute animate-confetti-fall"
      style={{
        left: `${data.left}%`,
        top: "-20px",
        animationDelay: `${data.delay}ms`,
        animationDuration: `${data.animationDuration}s`,
      }}
    >
      <div
        className="animate-confetti-spin"
        style={{
          width: data.size,
          height: data.size,
          backgroundColor: data.color,
          borderRadius: data.isCircle ? "50%" : "0",
        }}
      />
    </div>
  );
}

// Generate confetti data outside of render
function generateConfettiData(count: number): ConfettiData[] {
  const colors = ["#f59e0b", "#ef4444", "#22c55e", "#3b82f6", "#a855f7", "#ec4899"];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    color: colors[Math.floor(Math.random() * colors.length)],
    delay: Math.random() * 1000,
    left: Math.random() * 100,
    animationDuration: 2 + Math.random() * 2,
    size: 8 + Math.random() * 8,
    isCircle: Math.random() > 0.5,
  }));
}

export function CelebrationOverlay({
  objectiveId,
  objectiveName,
  trigger,
  onDismiss,
}: CelebrationOverlayProps) {
  const [dismissed, setDismissed] = useState(false);

  const config = trigger ? CELEBRATION_CONFIG[trigger] : null;
  const Icon = config?.icon;

  // Generate confetti data once when config changes
  const confettiData = useMemo(() => {
    if (!config) return [];
    return generateConfettiData(config.confettiCount);
  }, [config]);

  const handleDismiss = useCallback(() => {
    setDismissed(true);
    if (trigger) {
      markCelebrationSeen(objectiveId, trigger);
    }
    onDismiss?.();
  }, [objectiveId, trigger, onDismiss]);

  // Auto-dismiss timer
  useEffect(() => {
    if (!trigger || !config || dismissed) return;

    const timer = setTimeout(handleDismiss, 4000);
    return () => clearTimeout(timer);
  }, [trigger, config, dismissed, handleDismiss]);

  // Don't render if no trigger, no config, or dismissed
  if (!trigger || !config || !Icon || dismissed) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleDismiss}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 animate-fade-in" />

      {/* Confetti container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confettiData.map((data) => (
          <Confetti key={data.id} data={data} />
        ))}
      </div>

      {/* Celebration card */}
      <div
        className={cn(
          "relative z-10 mx-4 max-w-md animate-celebration-pop",
          "rounded-2xl bg-card p-8 text-center shadow-2xl"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div
          className={cn(
            "mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full",
            "bg-gradient-to-br text-white animate-bounce",
            config.gradient
          )}
        >
          <Icon className="h-10 w-10" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-1">{config.title}</h2>
        <p
          className={cn(
            "text-lg font-semibold bg-gradient-to-r bg-clip-text text-transparent",
            config.gradient
          )}
        >
          {config.subtitle}
        </p>

        {/* Objective name */}
        <p className="mt-4 text-muted-foreground">
          <span className="font-medium text-foreground">{objectiveName}</span>
        </p>

        {/* Dismiss hint */}
        <p className="mt-6 text-sm text-muted-foreground">
          Click anywhere to dismiss
        </p>
      </div>
    </div>,
    document.body
  );
}

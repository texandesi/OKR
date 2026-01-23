import { useState, useCallback } from "react";
import { CelebrationOverlay } from "@/components/CelebrationOverlay";
import { wasCelebrationSeen } from "@/lib/celebration-utils";
import type { CelebrationTrigger } from "@/types";

// Hook to use celebration overlay
export function useCelebration() {
  const [celebration, setCelebration] = useState<{
    objectiveId: number;
    objectiveName: string;
    trigger: CelebrationTrigger;
  } | null>(null);

  const triggerCelebration = useCallback(
    (objectiveId: number, objectiveName: string, trigger: CelebrationTrigger) => {
      if (!trigger) return;
      if (wasCelebrationSeen(objectiveId, trigger)) return;
      setCelebration({ objectiveId, objectiveName, trigger });
    },
    []
  );

  const dismissCelebration = useCallback(() => {
    setCelebration(null);
  }, []);

  const CelebrationComponent = celebration ? (
    <CelebrationOverlay
      objectiveId={celebration.objectiveId}
      objectiveName={celebration.objectiveName}
      trigger={celebration.trigger}
      onDismiss={dismissCelebration}
    />
  ) : null;

  return { triggerCelebration, CelebrationComponent };
}

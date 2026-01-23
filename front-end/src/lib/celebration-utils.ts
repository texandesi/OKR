// Storage key for tracking seen celebrations
export const getStorageKey = (objectiveId: number, trigger: string) =>
  `celebration_seen_${objectiveId}_${trigger}`;

// Check if celebration was already seen
export const wasCelebrationSeen = (objectiveId: number, trigger: string): boolean => {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(getStorageKey(objectiveId, trigger)) === "true";
};

// Mark celebration as seen
export const markCelebrationSeen = (objectiveId: number, trigger: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(getStorageKey(objectiveId, trigger), "true");
};

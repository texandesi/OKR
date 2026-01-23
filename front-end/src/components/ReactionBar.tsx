import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/client";
import type { EmojiType, ReactionSummary } from "@/types";
import { cn } from "@/lib/utils";

const EMOJI_MAP: Record<EmojiType, string> = {
  celebration: "🎉",
  clap: "👏",
  fire: "🔥",
  heart: "❤️",
};

const EMOJI_LIST: EmojiType[] = ["celebration", "clap", "fire", "heart"];

// Hardcoded current user ID (matches backend)
const CURRENT_USER_ID = 1;

interface ReactionBarProps {
  keyResultId: number;
  showOnlyIfReactions?: boolean;
}

export function ReactionBar({
  keyResultId,
  showOnlyIfReactions = false,
}: ReactionBarProps) {
  const queryClient = useQueryClient();

  const { data: reactions } = useQuery({
    queryKey: ["reactions", keyResultId],
    queryFn: () => api.reactions.get(keyResultId),
  });

  const toggleMutation = useMutation({
    mutationFn: (emoji: EmojiType) => api.reactions.toggle(keyResultId, emoji),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reactions", keyResultId] });
    },
  });

  const getReactionByEmoji = (emoji: EmojiType): ReactionSummary | undefined => {
    return reactions?.reactions.find((r) => r.emoji === emoji);
  };

  const hasUserReacted = (emoji: EmojiType): boolean => {
    const reaction = getReactionByEmoji(emoji);
    return reaction?.userIds.includes(CURRENT_USER_ID) ?? false;
  };

  if (showOnlyIfReactions && (!reactions || reactions.totalCount === 0)) {
    return null;
  }

  return (
    <div className="flex items-center gap-1">
      {EMOJI_LIST.map((emoji) => {
        const reaction = getReactionByEmoji(emoji);
        const userReacted = hasUserReacted(emoji);
        const count = reaction?.count ?? 0;

        return (
          <button
            key={emoji}
            onClick={() => toggleMutation.mutate(emoji)}
            disabled={toggleMutation.isPending}
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-0.5 text-sm transition-all",
              "hover:scale-105 active:scale-95",
              userReacted
                ? "bg-primary/20 ring-1 ring-primary/40"
                : "bg-muted/50 hover:bg-muted",
              count > 0 ? "opacity-100" : "opacity-60 hover:opacity-100"
            )}
            title={
              reaction
                ? `${reaction.users.join(", ")}`
                : `React with ${EMOJI_MAP[emoji]}`
            }
          >
            <span className="text-base leading-none">{EMOJI_MAP[emoji]}</span>
            {count > 0 && (
              <span
                className={cn(
                  "text-xs font-medium",
                  userReacted ? "text-primary" : "text-muted-foreground"
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

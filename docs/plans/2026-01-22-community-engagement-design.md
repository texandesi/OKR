# Community Engagement & Scheduling Features

**Date:** 2026-01-22
**Status:** Approved
**Target Users:** Students, families, roommates, social groups

## Overview

This design adds engagement and scheduling features to transform the OKR Manager into a motivating communal goal-tracking system.

### Features

| Feature | Purpose |
|---------|---------|
| **Reactions** | Quick emoji reactions (🎉 👏 🔥 ❤️) on completed key results, visible to all group members |
| **Celebrations** | Automatic visual moments when milestones hit (confetti/banner when objective reaches 50%, 75%, 100%) |
| **Group Streaks** | Track consecutive days the group has completed at least one task; display streak counter prominently |
| **Recurring Tasks** | Key results that auto-regenerate on a schedule (daily, weekly, monthly) with optional rotation among group members |

### Target Experience

A roommate opens the app, sees "🔥 7-day streak!", notices their housemate completed "Take out trash" with 3 reactions, and sees their own recurring "Clean kitchen" task is due today.

---

## Data Model

### New Tables

```sql
-- Emoji reactions on completed key results
CREATE TABLE reactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key_result_id INTEGER NOT NULL REFERENCES key_results(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    emoji VARCHAR(20) NOT NULL,  -- "celebration", "clap", "fire", "heart"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(key_result_id, user_id, emoji)
);

-- Group activity streaks
CREATE TABLE group_streaks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    streak_started_at DATE,
    UNIQUE(group_id)
);

-- Recurring task schedules
CREATE TABLE recurring_schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key_result_id INTEGER NOT NULL REFERENCES key_results(id) ON DELETE CASCADE,
    frequency VARCHAR(20) NOT NULL,  -- "daily", "weekly", "monthly"
    rotation_enabled BOOLEAN DEFAULT FALSE,
    rotation_users JSON,  -- Array of user IDs
    current_rotation_index INTEGER DEFAULT 0,
    next_due_date DATE NOT NULL,
    last_generated_at TIMESTAMP,
    UNIQUE(key_result_id)
);
```

### Model Changes

- `KeyResult` gains optional `recurring_schedule` relationship
- `Group` gains `streak` relationship
- Celebrations are computed (no storage) - triggered when objective progress crosses thresholds

---

## Backend API

### Reactions

```
POST   /key-results/{id}/reactions         → Add reaction (body: {emoji})
DELETE /key-results/{id}/reactions/{emoji} → Remove your reaction
GET    /key-results/{id}/reactions         → List reactions with user names
```

### Group Streaks

```
GET    /groups/{id}/streak                 → Get current streak info
POST   /groups/{id}/streak/check           → Internal: called when KR completed
```

### Recurring Schedules

```
POST   /key-results/{id}/schedule          → Create recurring schedule
PATCH  /key-results/{id}/schedule          → Update frequency/rotation
DELETE /key-results/{id}/schedule          → Remove recurring
GET    /groups/{id}/recurring              → List all recurring KRs in group
```

### Celebrations

No dedicated endpoints. Included in objective response:
```json
{ "celebrationTrigger": "hit_75" | "hit_50" | "hit_100" | null }
```

### Background Job

Daily cron job runs at midnight:
- Regenerates completed recurring tasks for next period
- Rotates assignee if rotation enabled
- Resets streak if no activity previous day

---

## Frontend Components

### New Components

**ReactionBar.tsx**
- Displays emoji buttons (🎉 👏 🔥 ❤️) below completed key results
- Shows count + avatars of who reacted
- Click to toggle your reaction (optimistic update)
- Subtle animation on add

**StreakBanner.tsx**
- Prominent display: "🔥 7-day streak!"
- Shows on group dashboard/header
- Pulses/glows when streak increases
- Sad state when streak breaks: "Start a new streak today!"

**CelebrationOverlay.tsx**
- Confetti animation + banner when objective hits milestone
- Triggered once per user per milestone (stored in localStorage)
- "Your group hit 75% on 'Spring Cleaning'! 🎉"
- Auto-dismisses after 3 seconds or on click

**RecurringScheduleForm.tsx**
- Added to KeyResult create/edit dialog
- Toggle: "Make this recurring"
- Frequency selector (daily/weekly/monthly)
- Rotation toggle + user multi-select
- Shows next due date preview

### Updated Components

- `KeyResultsList` - Show reaction bar on completed items, recurring icon badge
- `Dashboard` - Add streak banner, "Due today" section for recurring tasks
- `ObjectiveCard` - Trigger celebration overlay on progress threshold

---

## Implementation Order

### Phase 1: Reactions (simplest, immediate engagement)

1. Create `reactions` table and model
2. Add reaction endpoints
3. Build `ReactionBar` component
4. Integrate into `KeyResultsList`

### Phase 2: Group Streaks

1. Create `group_streaks` table and model
2. Add streak check logic to KeyResult completion flow
3. Build `StreakBanner` component
4. Add to group dashboard

### Phase 3: Celebrations

1. Add `celebrationTrigger` computed field to Objective response
2. Build `CelebrationOverlay` with confetti animation
3. Integrate trigger logic in `ObjectiveCard`

### Phase 4: Recurring Tasks

1. Create `recurring_schedules` table and model
2. Add schedule CRUD endpoints
3. Create background job for regeneration/rotation
4. Build `RecurringScheduleForm`
5. Add "Due today" dashboard section

---

## Verification Plan

1. Create a test group with 2 users
2. Complete a key result → verify reactions work
3. Complete tasks on consecutive days → verify streak increments
4. Hit 50% objective progress → verify celebration triggers
5. Create weekly rotating chore → verify it regenerates with rotated assignee

---

## Files to Create/Modify

### Backend (New)
- `app/models/reaction.py`
- `app/models/group_streak.py`
- `app/models/recurring_schedule.py`
- `app/schemas/reaction.py`
- `app/schemas/streak.py`
- `app/schemas/recurring.py`
- `app/repositories/reaction.py`
- `app/repositories/streak.py`
- `app/repositories/recurring.py`
- `app/services/reaction.py`
- `app/services/streak.py`
- `app/services/recurring.py`
- `app/routers/reactions.py`
- `app/routers/streaks.py`
- `app/routers/recurring.py`
- `app/jobs/daily_recurring.py`

### Backend (Modified)
- `app/models/__init__.py`
- `app/services/keyresult.py` (trigger streak check on completion)
- `app/schemas/objective.py` (add celebrationTrigger)
- `app/main.py` (register new routers)

### Frontend (New)
- `src/components/ReactionBar.tsx`
- `src/components/StreakBanner.tsx`
- `src/components/CelebrationOverlay.tsx`
- `src/components/RecurringScheduleForm.tsx`

### Frontend (Modified)
- `src/types/index.ts`
- `src/api/client.ts`
- `src/features/keyresults/KeyResultsList.tsx`
- `src/features/dashboard/Dashboard.tsx`
- `src/features/objectives/ObjectiveCard.tsx` (or ObjectivesList)

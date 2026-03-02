"use client";

import { useState, useEffect, useRef } from "react";
import { format, isSameDay, subDays, differenceInDays } from "date-fns";
import Confetti from "react-confetti";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Edit,
  Save,
  X,
  Loader2,
  BookOpen,
  Calendar,
  Tags,
  Trophy,
  PenTool,
  Sunrise,
  Zap,
  RotateCcw,
  Clock,
  Target,
} from "lucide-react";

export type JournalEntryDTO = {
  id: string;
  content: string;
  createdAt: string;
  mood?: string;
  theme?: string;
};

type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  progress: number;
  max: number;
  isUnlocked: boolean;
};

type Props = {
  entries: JournalEntryDTO[];
  userId: string;
};

export default function JournalClient({ entries: initialEntries, userId }: Props) {
  const [entries, setEntries] = useState(initialEntries);
  const [newContent, setNewContent] = useState("");
  const [newMood, setNewMood] = useState("");
  const [newTheme, setNewTheme] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [savingNew, setSavingNew] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState<string | null>(null);

  // Sound effect
  const unlockSound = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    unlockSound.current = new Audio("/sounds/unlock-chime.mp3");
  }, []);

  // ────────────────────────────────────────────────
  //  Achievement Definitions & Calculation
  // ────────────────────────────────────────────────

  const achievementsConfig: Omit<Achievement, "progress" | "isUnlocked">[] = [
    // Early wins
    { id: "morning", title: "Morning Momentum", description: "Start focus before 10 AM (3 times)", icon: Sunrise, color: "yellow", max: 3 },
    { id: "quickwin", title: "Quick Win", description: "Finish a 15+ min session", icon: Zap, color: "green", max: 1 },
    { id: "backontrack", title: "Back on Track", description: "Session after missing a day", icon: RotateCcw, color: "blue", max: 1 },

    // Session depth & quality
    { id: "deepdive", title: "Deep Dive", description: "Complete a 90+ min focus session", icon: Clock, color: "red", max: 1 },
    { id: "flowstate", title: "Flow State", description: "45+ continuous minutes focused", icon: Target, color: "cyan", max: 1 },

    // Streak & consistency
    { id: "fortnight", title: "Fortnight Fighter", description: "14-day streak", icon: Trophy, color: "orange", max: 14 },

    // Journaling focused
    { id: "rookie", title: "Reflection Rookie", description: "Write 10 journal entries", icon: BookOpen, color: "indigo", max: 10 },
    { id: "chronicler", title: "Daily Chronicler", description: "Journal after session 7 days in a row", icon: Calendar, color: "teal", max: 7 },
    { id: "insight", title: "Insight Hunter", description: "3+ different moods/themes in one week", icon: Tags, color: "purple", max: 3 },

    // Points & gamification
    { id: "wordmaster", title: "Word Master", description: "Write 5000 words total", icon: PenTool, color: "amber", max: 5000 },
  ];

  const calculateAchievements = (currentEntries: JournalEntryDTO[]): Achievement[] => {
    const today = new Date();

    // Total entries & words
    const totalEntries = currentEntries.length;
    const totalWords = currentEntries.reduce((sum, e) => sum + (e.content?.trim().split(/\s+/).length || 0), 0);

    // Daily streak for journaling
    let dailyStreak = 0;
    let currentDate = today;
    while (true) {
      const hasEntry = currentEntries.some((e) => isSameDay(new Date(e.createdAt), currentDate));
      if (!hasEntry) break;
      dailyStreak++;
      currentDate = subDays(currentDate, 1);
    }

    // Unique tags/moods in last 7 days
    const last7Days = currentEntries.filter((e) => differenceInDays(today, new Date(e.createdAt)) <= 7);
    const uniqueTags = new Set<string>();
    last7Days.forEach((e) => {
      if (e.mood) uniqueTags.add(e.mood);
      if (e.theme) uniqueTags.add(e.theme);
    });

    return achievementsConfig.map((ach) => {
      let progress = 0;
      let isUnlocked = false;

      switch (ach.id) {
        case "rookie":
          progress = totalEntries;
          break;
        case "chronicler":
          progress = dailyStreak;
          break;
        case "insight":
          progress = uniqueTags.size;
          break;
        case "wordmaster":
          progress = totalWords;
          break;
        default:
          progress = 0;
      }

      isUnlocked = progress >= ach.max;

      return { ...ach, progress, isUnlocked };
    });
  };

  const achievements = calculateAchievements(entries);

  // ────────────────────────────────────────────────
  //  Confetti + Sound + Backend Sync on unlock
  // ────────────────────────────────────────────────

  useEffect(() => {
    achievements.forEach((ach) => {
      if (ach.isUnlocked && !unlockedIds.includes(ach.id)) {
        setUnlockedIds((prev) => [...prev, ach.id]);
        setShowConfetti(ach.id);
        toast.success(`${ach.title} unlocked! 🎉`);

        // Play sound
        if (unlockSound.current) {
          unlockSound.current.currentTime = 0;
          unlockSound.current.play().catch(() => {});
        }

        // Sync achievement to backend (using userId)
        fetch("/api/journal/achievements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, achievementId: ach.id, progress: ach.progress }),
        }).catch((err) => {
          console.error("Failed to sync achievement:", err);
        });

        // Clear confetti after 6 seconds
        setTimeout(() => setShowConfetti(null), 6000);
      }
    });
  }, [achievements, unlockedIds, userId]);

  // ────────────────────────────────────────────────
  //  Save New Entry
  // ────────────────────────────────────────────────

  const handleSaveNew = async () => {
    if (!newContent.trim()) {
      toast.error("Write something first");
      return;
    }

    setSavingNew(true);

    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newContent.trim(),
          mood: newMood || undefined,
          theme: newTheme || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save");
      }

      const newEntry = await res.json();

      setEntries([newEntry, ...entries]);
      setNewContent("");
      setNewMood("");
      setNewTheme("");
      toast.success("Entry saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save entry");
    } finally {
      setSavingNew(false);
    }
  };

  // ────────────────────────────────────────────────
  //  Edit Handlers
  // ────────────────────────────────────────────────

  const startEdit = (entry: JournalEntryDTO) => {
    setEditingId(entry.id);
    setEditContent(entry.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  const handleSaveEdit = async (id: string) => {
    if (!editContent.trim()) {
      toast.error("Entry cannot be empty");
      return;
    }

    setSavingEdit(true);

    try {
      const res = await fetch(`/api/journal/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContent.trim() }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update");
      }

      // Optimistic update
      setEntries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, content: editContent.trim() } : e))
      );

      setEditingId(null);
      setEditContent("");
      toast.success("Entry updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update entry");
    } finally {
      setSavingEdit(false);
    }
  };

  // ────────────────────────────────────────────────
  //  Render
  // ────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-4xl space-y-12 py-10">
      {/* Confetti overlay */}
      {showConfetti && <Confetti recycle={false} numberOfPieces={300} gravity={0.15} />}

      {/* Achievements Section */}
      <Card className="bg-card/60 rounded-2xl border-0 shadow-sm backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="h-6 w-6 text-amber-500" />
            Journal Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {achievements.map((ach) => (
            <div key={ach.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg bg-${ach.color}-500/10 p-2`}>
                    <ach.icon className={`h-5 w-5 text-${ach.color}-600 dark:text-${ach.color}-400`} />
                  </div>
                  <div>
                    <span className="font-medium">{ach.title}</span>
                    {ach.isUnlocked && (
                      <span className="ml-2 text-xs text-green-600 dark:text-green-400">Unlocked!</span>
                    )}
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  {ach.progress}/{ach.max}
                </span>
              </div>
              <Progress
                value={(ach.progress / ach.max) * 100}
                className={`h-2 [&>div]:bg-${ach.color}-500`}
              />
              <p className="text-xs text-muted-foreground">{ach.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* New Entry Form */}
      <Card className="bg-card/60 rounded-2xl border-0 shadow-sm backdrop-blur-md">
        <CardHeader>
          <CardTitle>New Entry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Today I noticed... I felt... One idea that sparked was..."
            className="min-h-40 resize-none"
            disabled={savingNew}
          />

          {/* Mood & Theme Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="mood">Mood</Label>
              <Select value={newMood} onValueChange={setNewMood}>
                <SelectTrigger>
                  <SelectValue placeholder="How did you feel?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="focused">Focused</SelectItem>
                  <SelectItem value="calm">Calm</SelectItem>
                  <SelectItem value="energized">Energized</SelectItem>
                  <SelectItem value="stressed">Stressed</SelectItem>
                  <SelectItem value="reflective">Reflective</SelectItem>
                  <SelectItem value="motivated">Motivated</SelectItem>
                  <SelectItem value="tired">Tired</SelectItem>
                  <SelectItem value="excited">Excited</SelectItem>
                  <SelectItem value="anxious">Anxious</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="theme">Theme / Topic</Label>
              <Input
                id="theme"
                value={newTheme}
                onChange={(e) => setNewTheme(e.target.value)}
                placeholder="Productivity, creativity, gratitude, relationships..."
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSaveNew}
              disabled={savingNew || !newContent.trim()}
              className="min-w-32 bg-linear-to-r from-indigo-600 to-teal-600 text-white hover:from-indigo-700 hover:to-teal-700"
            >
              {savingNew ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Entry"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Entries List */}
      <div className="space-y-6">
        {entries.length === 0 ? (
          <div className="text-muted-foreground py-12 text-center">
            No entries yet. Start writing above.
          </div>
        ) : (
          entries.map((entry) => {
            const isEditing = editingId === entry.id;

            return (
              <Card
                key={entry.id}
                className="bg-card/60 rounded-2xl border-0 shadow-sm backdrop-blur-md transition-all hover:shadow-md"
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-muted-foreground text-sm">
                    {format(new Date(entry.createdAt), "EEEE, MMMM d, yyyy")}
                  </CardTitle>

                  {!isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEdit(entry)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </CardHeader>

                <CardContent>
                  {isEditing ? (
                    <div className="space-y-4">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="min-h-40 resize-none"
                        autoFocus
                      />

                      <div className="flex justify-end gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={cancelEdit}
                          disabled={savingEdit}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSaveEdit(entry.id)}
                          disabled={savingEdit || !editContent.trim()}
                          className="bg-linear-to-r from-indigo-600 to-teal-600 text-white hover:from-indigo-700 hover:to-teal-700"
                        >
                          {savingEdit ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Save Changes"
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                        {entry.content}
                      </p>
                      {(entry.mood || entry.theme) && (
                        <div className="flex gap-2 flex-wrap mt-3">
                          {entry.mood && (
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                              Mood: {entry.mood}
                            </span>
                          )}
                          {entry.theme && (
                            <span className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
                              Theme: {entry.theme}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}


// src/components/journal/JournalClient.tsx
// "use client";

// import { useState, useEffect, useRef } from "react";
// import { format, isSameDay, subDays, differenceInDays, startOfDay } from "date-fns";
// import Confetti from "react-confetti";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { toast } from "sonner";
// import {
//   Edit,
//   Save,
//   X,
//   Loader2,
//   BookOpen,
//   Calendar,
//   Tags,
//   Trophy,
//   PenTool,
//   Sunrise,
//   Zap,
//   RotateCcw,
//   Clock,
//   Target,
// } from "lucide-react";

// export type JournalEntryDTO = {
//   id: string;
//   content: string;
//   createdAt: string;
//   mood?: string;
//   theme?: string;
// };

// type Achievement = {
//   id: string;
//   title: string;
//   description: string;
//   icon: any;
//   color: string;
//   progress: number;
//   max: number;
//   isUnlocked: boolean;
// };

// type Props = {
//   entries: JournalEntryDTO[];
//   userId: string;
// };

// export default function JournalClient({ entries: initialEntries, userId }: Props) {
//   const [entries, setEntries] = useState(initialEntries);
//   const [newContent, setNewContent] = useState("");
//   const [newMood, setNewMood] = useState("");
//   const [newTheme, setNewTheme] = useState("");
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [editContent, setEditContent] = useState("");
//   const [savingNew, setSavingNew] = useState(false);
//   const [savingEdit, setSavingEdit] = useState(false);
//   const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
//   const [showConfetti, setShowConfetti] = useState<string | null>(null);

//   // Sound effect
//   const unlockSound = useRef<HTMLAudioElement | null>(null);
//   useEffect(() => {
//     unlockSound.current = new Audio("/sounds/unlock-chime.mp3");
//   }, []);

//   // ────────────────────────────────────────────────
//   //  Achievement Definitions & Calculation
//   // ────────────────────────────────────────────────

//   const achievementsConfig: Omit<Achievement, "progress" | "isUnlocked">[] = [
//     // Early wins
//     { id: "morning", title: "Morning Momentum", description: "Start focus before 10 AM (3 times)", icon: Sunrise, color: "yellow", max: 3 },
//     { id: "quickwin", title: "Quick Win", description: "Finish a 15+ min session", icon: Zap, color: "green", max: 1 },
//     { id: "backontrack", title: "Back on Track", description: "Session after missing a day", icon: RotateCcw, color: "blue", max: 1 },

//     // Session depth & quality
//     { id: "deepdive", title: "Deep Dive", description: "Complete a 90+ min focus session", icon: Clock, color: "red", max: 1 },
//     { id: "flowstate", title: "Flow State", description: "45+ continuous minutes focused", icon: Target, color: "cyan", max: 1 },

//     // Streak & consistency
//     { id: "fortnight", title: "Fortnight Fighter", description: "14-day streak", icon: Trophy, color: "orange", max: 14 },

//     // Journaling focused
//     { id: "rookie", title: "Reflection Rookie", description: "Write 10 journal entries", icon: BookOpen, color: "indigo", max: 10 },
//     { id: "chronicler", title: "Daily Chronicler", description: "Journal after session 7 days in a row", icon: Calendar, color: "teal", max: 7 },
//     { id: "insight", title: "Insight Hunter", description: "3+ different moods/themes in one week", icon: Tags, color: "purple", max: 3 },

//     // Points & gamification
//     { id: "wordmaster", title: "Word Master", description: "Write 5000 words total", icon: PenTool, color: "amber", max: 5000 },
//   ];

//   const calculateAchievements = (currentEntries: JournalEntryDTO[]): Achievement[] => {
//     const today = new Date();

//     // Total entries & words
//     const totalEntries = currentEntries.length;
//     const totalWords = currentEntries.reduce((sum, e) => sum + (e.content?.trim().split(/\s+/).length || 0), 0);

//     // Daily streak
//     let dailyStreak = 0;
//     let currentDate = today;
//     while (true) {
//       const hasEntry = currentEntries.some((e) => isSameDay(new Date(e.createdAt), currentDate));
//       if (!hasEntry) break;
//       dailyStreak++;
//       currentDate = subDays(currentDate, 1);
//     }

//     // Unique tags in last 7 days
//     const last7Days = currentEntries.filter((e) => differenceInDays(today, new Date(e.createdAt)) <= 7);
//     const uniqueTags = new Set<string>();
//     last7Days.forEach((e) => {
//       if (e.mood) uniqueTags.add(e.mood);
//       if (e.theme) uniqueTags.add(e.theme);
//     });

//     return achievementsConfig.map((ach) => {
//       let progress = 0;
//       let isUnlocked = false;

//       switch (ach.id) {
//         case "rookie":        progress = totalEntries; break;
//         case "chronicler":    progress = dailyStreak; break;
//         case "insight":       progress = uniqueTags.size; break;
//         case "wordmaster":    progress = totalWords; break;
//         // Add session-based ones later when you pass session data
//         default: progress = 0;
//       }

//       isUnlocked = progress >= ach.max;

//       return { ...ach, progress, isUnlocked };
//     });
//   };

//   const achievements = calculateAchievements(entries);

//   // ────────────────────────────────────────────────
//   //  Confetti + Sound on unlock
//   // ────────────────────────────────────────────────

//   useEffect(() => {
//     achievements.forEach((ach) => {
//       if (ach.isUnlocked && !unlockedIds.includes(ach.id)) {
//         setUnlockedIds((prev) => [...prev, ach.id]);
//         setShowConfetti(ach.id);
//         toast.success(`${ach.title} unlocked! 🎉`);

//         // Play sound
//         if (unlockSound.current) {
//           unlockSound.current.currentTime = 0;
//           unlockSound.current.play().catch(() => {});
//         }

//         // Sync to backend
//         fetch("/api/journal/achievements", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ userId, achievementId: ach.id }),
//         }).catch(() => {});

//         setTimeout(() => setShowConfetti(null), 6000);
//       }
//     });
//   }, [entries, achievements, unlockedIds]);

//   // ────────────────────────────────────────────────
//   //  Save / Edit Handlers
//   // ────────────────────────────────────────────────

//   const handleSaveNew = async () => {
//     if (!newContent.trim()) {
//       toast.error("Write something first");
//       return;
//     }

//     setSavingNew(true);

//     try {
//       const res = await fetch("/api/journal", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           content: newContent,
//           mood: newMood || undefined,
//           theme: newTheme || undefined,
//         }),
//       });

//       if (!res.ok) throw new Error("Failed to save");

//       const newEntry = await res.json();

//       setEntries([newEntry, ...entries]);
//       setNewContent("");
//       setNewMood("");
//       setNewTheme("");
//       toast.success("Entry saved");
//     } catch {
//       toast.error("Failed to save entry");
//     } finally {
//       setSavingNew(false);
//     }
//   };

//   // Edit handler (unchanged, just showing for completeness)
//   const startEdit = (entry: JournalEntryDTO) => {
//     setEditingId(entry.id);
//     setEditContent(entry.content);
//   };

//   const cancelEdit = () => {
//     setEditingId(null);
//     setEditContent("");
//   };

//   const handleSaveEdit = async (id: string) => {
//     if (!editContent.trim()) {
//       toast.error("Entry cannot be empty");
//       return;
//     }

//     setSavingEdit(true);

//     try {
//       const res = await fetch(`/api/journal/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ content: editContent }),
//       });

//       if (!res.ok) throw new Error("Failed to update");

//       setEntries((prev) =>
//         prev.map((e) => (e.id === id ? { ...e, content: editContent } : e))
//       );

//       setEditingId(null);
//       setEditContent("");
//       toast.success("Entry updated");
//     } catch {
//       toast.error("Failed to update entry");
//     } finally {
//       setSavingEdit(false);
//     }
//   };

//   return (
//     <div className="mx-auto max-w-4xl space-y-12 py-10">
//       {/* Confetti */}
//       {showConfetti && <Confetti recycle={false} numberOfPieces={300} gravity={0.15} />}

//       {/* Achievements */}
//       <Card className="bg-card/60 rounded-2xl border-0 shadow-sm backdrop-blur-md">
//         <CardHeader>
//           <CardTitle className="text-2xl font-bold flex items-center gap-2">
//             <Trophy className="h-6 w-6 text-amber-500" />
//             Journal Achievements
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           {achievements.map((ach) => (
//             <div key={ach.id} className="space-y-2">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className={`rounded-lg bg-${ach.color}-500/10 p-2`}>
//                     <ach.icon className={`h-5 w-5 text-${ach.color}-600 dark:text-${ach.color}-400`} />
//                   </div>
//                   <div>
//                     <span className="font-medium">{ach.title}</span>
//                     {ach.isUnlocked && (
//                       <span className="ml-2 text-xs text-green-600 dark:text-green-400">Unlocked!</span>
//                     )}
//                   </div>
//                 </div>
//                 <span className="text-sm text-muted-foreground">
//                   {ach.progress}/{ach.max}
//                 </span>
//               </div>
//               <Progress
//                 value={(ach.progress / ach.max) * 100}
//                 className={`h-2 [&>div]:bg-${ach.color}-500`}
//               />
//               <p className="text-xs text-muted-foreground">{ach.description}</p>
//             </div>
//           ))}
//         </CardContent>
//       </Card>

//       {/* New Entry Form */}
//       <Card className="bg-card/60 rounded-2xl border-0 shadow-sm backdrop-blur-md">
//         <CardHeader>
//           <CardTitle>New Entry</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <Textarea
//             value={newContent}
//             onChange={(e) => setNewContent(e.target.value)}
//             placeholder="Today I noticed... I felt... One idea that sparked was..."
//             className="min-h-40 resize-none"
//             disabled={savingNew}
//           />

//           {/* Mood & Theme Inputs */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <Label htmlFor="mood">Mood</Label>
//               <Select value={newMood} onValueChange={setNewMood}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="How did you feel?" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="focused">Focused</SelectItem>
//                   <SelectItem value="calm">Calm</SelectItem>
//                   <SelectItem value="energized">Energized</SelectItem>
//                   <SelectItem value="stressed">Stressed</SelectItem>
//                   <SelectItem value="reflective">Reflective</SelectItem>
//                   <SelectItem value="motivated">Motivated</SelectItem>
//                   <SelectItem value="tired">Tired</SelectItem>
//                   <SelectItem value="excited">Excited</SelectItem>
//                   <SelectItem value="anxious">Anxious</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="theme">Theme / Topic</Label>
//               <Input
//                 id="theme"
//                 value={newTheme}
//                 onChange={(e) => setNewTheme(e.target.value)}
//                 placeholder="Productivity, creativity, gratitude, relationships..."
//               />
//             </div>
//           </div>

//           <div className="flex justify-end">
//             <Button
//               onClick={handleSaveNew}
//               disabled={savingNew || !newContent.trim()}
//               className="min-w-32 bg-linear-to-r from-indigo-600 to-teal-600 text-white hover:from-indigo-700 hover:to-teal-700"
//             >
//               {savingNew ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Saving...
//                 </>
//               ) : (
//                 "Save Entry"
//               )}
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Entries List */}
//       <div className="space-y-6">
//         {entries.length === 0 ? (
//           <div className="text-muted-foreground py-12 text-center">
//             No entries yet. Start writing above.
//           </div>
//         ) : (
//           entries.map((entry) => {
//             const isEditing = editingId === entry.id;

//             return (
//               <Card
//                 key={entry.id}
//                 className="bg-card/60 rounded-2xl border-0 shadow-sm backdrop-blur-md transition-all hover:shadow-md"
//               >
//                 <CardHeader className="flex flex-row items-center justify-between pb-2">
//                   <CardTitle className="text-muted-foreground text-sm">
//                     {format(new Date(entry.createdAt), "EEEE, MMMM d, yyyy")}
//                   </CardTitle>

//                   {!isEditing && (
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => startEdit(entry)}
//                       className="text-muted-foreground hover:text-foreground"
//                     >
//                       <Edit className="h-4 w-4" />
//                     </Button>
//                   )}
//                 </CardHeader>

//                 <CardContent>
//                   {isEditing ? (
//                     <div className="space-y-4">
//                       <Textarea
//                         value={editContent}
//                         onChange={(e) => setEditContent(e.target.value)}
//                         className="min-h-40 resize-none"
//                         autoFocus
//                       />

//                       <div className="flex justify-end gap-3">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={cancelEdit}
//                           disabled={savingEdit}
//                         >
//                           Cancel
//                         </Button>
//                         <Button
//                           size="sm"
//                           onClick={() => handleSaveEdit(entry.id)}
//                           disabled={savingEdit || !editContent.trim()}
//                           className="bg-linear-to-r from-indigo-600 to-teal-600 text-white hover:from-indigo-700 hover:to-teal-700"
//                         >
//                           {savingEdit ? (
//                             <>
//                               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                               Saving...
//                             </>
//                           ) : (
//                             "Save Changes"
//                           )}
//                         </Button>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="space-y-2">
//                       <p className="text-foreground leading-relaxed whitespace-pre-wrap">
//                         {entry.content}
//                       </p>
//                       {(entry.mood || entry.theme) && (
//                         <div className="flex gap-2 flex-wrap">
//                           {entry.mood && (
//                             <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
//                               Mood: {entry.mood}
//                             </span>
//                           )}
//                           {entry.theme && (
//                             <span className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
//                               Theme: {entry.theme}
//                             </span>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// }




export type HabitCategory = "saúde" | "trabalho" | "estudo" | "lazer" | "outros";

export type HabitFrequency = "diário" | "semanal";

export interface Habit {
  id: string;
  name: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  goal: number;
  progress: number;
  createdAt: string;
  completedDates: string[];
  notes?: string;
}

export interface HabitFormData {
  name: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  goal: number;
  notes?: string;
}
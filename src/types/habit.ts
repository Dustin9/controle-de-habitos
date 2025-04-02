export type HabitCategory = "Saúde" | "Trabalho" | "Estudo" | "Lazer" | "Outros";

export type HabitFrequency = "Semanal" | "Todo dia";

export interface ProgressEntry {
  date: string;
  completed: boolean;
  streak?: number;
}

export interface BackendHabit {
  _id: string;
  name: string;
  description: string;
  goal: number;
  category: HabitCategory;
  frequency: HabitFrequency;
  user: string;
  progress: ProgressEntry[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Frontend habit representation
export interface Habit {
  _id: string;
  title: string; // maps from name
  description: string;
  goal: number;
  category: HabitCategory;
  frequency: HabitFrequency;
  progress: number; // calculated from progress array
  completedDates: string[]; // extracted from progress array
  createdAt: string;
  streak?: number; // number of consecutive days completed (for "Todo dia" habits)
}

export interface HabitFormData {
  title: string; // will be sent as name
  description: string;
  goal?: number; // Make goal optional since it's not needed for "Todo dia"
  category: HabitCategory;
  frequency: HabitFrequency;
}
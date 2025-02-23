
import React, { createContext, useContext, useEffect, useState } from "react";
import { Habit, HabitFormData } from "@/types/habit";
import { useToast } from "@/hooks/use-toast";

interface HabitContextType {
  habits: Habit[];
  addHabit: (data: HabitFormData) => void;
  toggleHabit: (habitId: string) => void;
  deleteHabit: (habitId: string) => void;
  updateHabitNotes: (habitId: string, notes: string) => void;
  loading: boolean;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export function HabitProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const savedHabits = localStorage.getItem("habits");
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  const addHabit = (data: HabitFormData) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      ...data,
      progress: 0,
      createdAt: new Date().toISOString(),
      completedDates: [],
    };

    setHabits((prev) => [...prev, newHabit]);
    toast({
      title: "Hábito adicionado",
      description: "Seu novo hábito foi criado com sucesso!",
    });
  };

  const toggleHabit = (habitId: string) => {
    const today = new Date().toISOString().split("T")[0];

    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id === habitId) {
          const isCompleted = habit.completedDates.includes(today);
          const completedDates = isCompleted
            ? habit.completedDates.filter((date) => date !== today)
            : [...habit.completedDates, today];

          return {
            ...habit,
            completedDates,
            progress: (completedDates.length / habit.goal) * 100,
          };
        }
        return habit;
      })
    );
  };

  const deleteHabit = (habitId: string) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== habitId));
    toast({
      title: "Hábito removido",
      description: "O hábito foi removido com sucesso.",
    });
  };

  const updateHabitNotes = (habitId: string, notes: string) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === habitId ? { ...habit, notes } : habit
      )
    );
    toast({
      title: "Observações atualizadas",
      description: "As observações foram salvas com sucesso.",
    });
  };

  return (
    <HabitContext.Provider value={{ habits, addHabit, toggleHabit, deleteHabit, updateHabitNotes, loading }}>
      {children}
    </HabitContext.Provider>
  );
}

export function useHabits() {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error("useHabits must be used within a HabitProvider");
  }
  return context;
}
import React, { createContext, useContext, useEffect, useState } from "react";
import { Habit as HabitType, HabitFormData, BackendHabit } from "@/types/habit";
import { useToast } from "@/hooks/use-toast";
import { createHabit as createHabitApi, getHabits as getHabitsApi, updateHabitProgress, deleteHabit as deleteHabitApi } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/lib/auth";
import { AxiosError } from 'axios';

interface HabitContextType {
  habits: HabitType[];
  addHabit: (data: HabitFormData) => Promise<void>;
  toggleHabit: (habitId: string) => void;
  deleteHabit: (habitId: string) => void;
  loading: boolean;
  refreshHabits: () => Promise<void>;
  updateHabitNotes: (habitId: string, notes: string) => Promise<void>;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

const mapHabitData = (backendHabit: BackendHabit): HabitType => {
  try {
    // Get current date in local timezone
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayStr = today.toISOString().split('T')[0];

    console.log('Mapping habit:', backendHabit.name);
    console.log('Raw current date:', now.toString());
    console.log('Normalized today:', todayStr);

    // Ensure progress is an array
    const progressArray = Array.isArray(backendHabit.progress) ? backendHabit.progress : [];

    // Count total progress entries as streak
    const streak = progressArray.length;

    // Convert backend dates to local timezone for comparison
    const completedDates = progressArray
      .filter(p => p && p.completed && p.date)
      .map(p => {
        try {
          // Parse the UTC date and convert to local date
          const utcDate = new Date(p.date);
          const localDate = new Date(utcDate.getTime());
          return localDate.toISOString().split('T')[0];
        } catch (error) {
          console.error('Error parsing date:', p.date);
          return null;
        }
      })
      .filter((date): date is string => date !== null);

    console.log('Raw completed dates:', progressArray.filter(p => p.completed).map(p => p.date));
    console.log('Normalized completed dates:', completedDates);
    console.log('Total progress entries (streak):', streak);

    // Calculate progress based on frequency
    let progress = 0;

    if (backendHabit.frequency === 'Todo dia') {
      progress = completedDates.includes(todayStr) ? 100 : 0;
      console.log('Todo dia - Progress:', progress);
    } else if (backendHabit.frequency === 'Semanal') {
      // For "Semanal", calculate progress based on days in current week
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Start from Sunday
      
      let completedThisWeek = 0;
      const thisWeekDates = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        thisWeekDates.push(dateStr);
        if (completedDates.includes(dateStr)) {
          completedThisWeek++;
        }
      }
      progress = (completedThisWeek / 7) * 100;
      console.log('Semanal - Week dates:', thisWeekDates);
      console.log('Completed this week:', completedThisWeek, 'Progress:', progress);
    }

    return {
      _id: backendHabit._id,
      title: backendHabit.name || '',
      description: backendHabit.description || '',
      goal: backendHabit.goal || 0,
      category: backendHabit.category || 'Saúde',
      frequency: backendHabit.frequency || 'Todo dia',
      progress,
      streak,
      completedDates,
      createdAt: backendHabit.createdAt || new Date().toISOString()
    };
  } catch (error) {
    console.error('Error in mapHabitData:', error);
    console.error('Backend habit data:', backendHabit);
    throw error;
  }
};

export function HabitProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = useState<HabitType[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleUnauthorized = () => {
    toast({
      title: "Sessão expirada",
      description: "Por favor, faça login novamente.",
      variant: "destructive",
    });
    navigate("/login");
  };

  const fetchHabits = async () => {
    if (!isAuthenticated()) {
      handleUnauthorized();
      return;
    }

    try {
      setLoading(true);
      const backendHabits = await getHabitsApi();
      console.log('Backend habits received:', backendHabits);
      
      if (!backendHabits) {
        console.error('No habits data received');
        toast({
          title: "Erro",
          description: "Não foi possível carregar os hábitos.",
          variant: "destructive",
        });
        return;
      }

      const mappedHabits = backendHabits.map(mapHabitData);
      console.log('Mapped habits:', mappedHabits);
      setHabits(mappedHabits);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error('Error fetching habits:', error);
        console.error('Error response:', error.response);
        if (error.response?.status === 401) {
          handleUnauthorized();
        } else {
          toast({
            title: "Erro",
            description: error.response?.data?.message || "Não foi possível carregar os hábitos.",
            variant: "destructive",
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const addHabit = async (data: HabitFormData) => {
    if (!isAuthenticated()) {
      handleUnauthorized();
      return;
    }

    setLoading(true);
    try {
      await createHabitApi({
        name: data.title,
        description: data.description,
        goal: data.goal,
        category: data.category,
        frequency: data.frequency
      });
      
      // Get fresh data from the backend
      const backendHabits = await getHabitsApi();
      console.log('Fetched habits after creation:', backendHabits);
      
      if (!backendHabits) {
        throw new Error('No habits data received after creation');
      }

      const mappedHabits = backendHabits.map(mapHabitData);
      console.log('Mapped habits after creation:', mappedHabits);
      setHabits(mappedHabits);
      
      toast({
        title: "Hábito adicionado",
        description: "Seu novo hábito foi criado com sucesso!",
      });
    } catch (error: unknown) {
      console.error('Error in addHabit:', error);
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          handleUnauthorized();
        } else {
          toast({
            title: "Erro",
            description: error.response?.data?.message || "Não foi possível criar o hábito.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível criar o hábito.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleHabit = async (habitId: string) => {
    if (!isAuthenticated()) {
      handleUnauthorized();
      return;
    }

    try {
      console.log('Toggling habit:', habitId);
      
      const habit = habits.find(h => h._id === habitId);
      if (!habit) {
        console.error('Habit not found:', habitId);
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      const isCompletedToday = habit.completedDates.includes(today);
      
      // Check if habit is already completed today
      if (isCompletedToday) {
        toast({
          title: "Hábito já completado",
          description: "Você já completou este hábito hoje. Tente novamente amanhã!",
          variant: "default",
        });
        return;
      }
      
      // Prepare the update data
      const updateData = {
        completed: true, // Always set to true since we're only allowing completion
        date: today,
        ...(habit.frequency === 'Todo dia' && { frequency: (habit.streak || 0) + 1 })
      };

      console.log('Sending update data:', updateData);

      // Call the API to update progress
      await updateHabitProgress(habitId, updateData);
      
      // Fetch fresh data from the backend
      const backendHabits = await getHabitsApi();
      console.log('Fetched habits after update:', backendHabits);
      
      if (!backendHabits) {
        throw new Error('No habits data received after update');
      }

      const mappedHabits = backendHabits.map(mapHabitData);
      console.log('Mapped habits after update:', mappedHabits);
      setHabits(mappedHabits);

      toast({
        title: "Hábito atualizado",
        description: "Progresso atualizado com sucesso!",
      });
    } catch (error) {
      console.error('Error in toggleHabit:', error);
      if (error instanceof AxiosError) {
        console.error('Axios error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
        if (error.response?.status === 401) {
          handleUnauthorized();
        } else {
          toast({
            title: "Erro",
            description: error.response?.data?.message || "Não foi possível atualizar o hábito.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível atualizar o hábito.",
          variant: "destructive",
        });
      }
    }
  };

  const deleteHabit = async (habitId: string) => {
    if (!isAuthenticated()) {
      handleUnauthorized();
      return;
    }

    try {
      await deleteHabitApi(habitId);
      
      // Update local state after successful deletion
      setHabits((prev) => prev.filter((habit) => habit._id !== habitId));
      
      toast({
        title: "Hábito removido",
        description: "O hábito foi removido com sucesso.",
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error deleting habit:', error);
        if (error.response?.status === 401) {
          handleUnauthorized();
        } else {
          toast({
            title: "Erro",
            description: error.response?.data?.message || "Não foi possível remover o hábito.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível remover o hábito.",
          variant: "destructive",
        });
      }
    }
  };

  const updateHabitNotes = async (habitId: string, notes: string) => {
    if (!isAuthenticated()) {
      handleUnauthorized();
      return;
    }

    try {
      setHabits((prev) =>
        prev.map((h) =>
          h._id === habitId ? { ...h, notes } : h
        )
      );

      toast({
        title: "Notas atualizadas",
        description: "As notas do hábito foram atualizadas com sucesso.",
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error updating habit notes:', error);
        if (error.response?.status === 401) {
          handleUnauthorized();
        } else {
          toast({
            title: "Erro",
            description: error.response?.data?.message || "Não foi possível atualizar as notas do hábito.",
            variant: "destructive",
          });
        }
      }
    }
  };

  return (
    <HabitContext.Provider value={{ 
      habits, 
      addHabit, 
      toggleHabit, 
      deleteHabit, 
      loading, 
      refreshHabits: fetchHabits,
      updateHabitNotes 
    }}>
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
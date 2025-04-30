import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Habit, HabitCategory, HabitFrequency } from "@/types/habit";
import { Check } from "lucide-react";
import { getAuthToken } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

interface SuggestedHabit extends Omit<Habit, 'category' | 'frequency'> {
  _id: string;
  name: string;
  description: string;
  category: HabitCategory;
  frequency: HabitFrequency;
}

export function SuggestedHabits() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [suggestedHabits, setSuggestedHabits] = useState<SuggestedHabit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuggestedHabits();
  }, []);

  const fetchSuggestedHabits = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast({
          title: "Erro",
          description: "Sessão expirada. Por favor, faça login novamente.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:3000/api/questionnaire/history", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast({
            title: "Erro",
            description: "Sessão expirada. Por favor, faça login novamente.",
            variant: "destructive",
          });
          navigate("/login");
          return;
        }
        throw new Error("Failed to fetch suggested habits");
      }

      const data = await response.json();
      setSuggestedHabits(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os hábitos sugeridos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddHabit = async (habit: SuggestedHabit) => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast({
          title: "Erro",
          description: "Sessão expirada. Por favor, faça login novamente.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:3000/api/habits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: habit.name,
          description: habit.description,
          category: habit.category,
          frequency: habit.frequency,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast({
            title: "Erro",
            description: "Sessão expirada. Por favor, faça login novamente.",
            variant: "destructive",
          });
          navigate("/login");
          return;
        }
        throw new Error("Failed to add habit");
      }

      toast({
        title: "Hábito adicionado",
        description: "O hábito foi adicionado com sucesso!",
      });

      setSuggestedHabits(prev => prev.filter(h => h._id !== habit._id));
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o hábito.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (suggestedHabits.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhum hábito sugerido encontrado.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {suggestedHabits.map((habit) => (
        <Card key={habit._id} className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="inline-block rounded-full bg-primary/20 text-primary px-2 py-1 text-xs font-medium">
                {habit.category}
              </span>
              <h3 className="mt-2 text-lg font-semibold">{habit.name}</h3>
              <p className="text-sm text-muted-foreground">{habit.description}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Frequência: {habit.frequency}
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => handleAddHabit(habit)}
              className="ml-4"
            >
              <Check className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
} 
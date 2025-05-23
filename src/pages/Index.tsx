import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData } from "@/lib/auth";
import { HabitProvider } from "@/context/HabitContext";
import { useHabits } from "@/context/HabitContext";
import { HabitCard } from "@/components/HabitCard";
import { AddHabitDialog } from "@/components/AddHabitDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { logout } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";

function HabitDashboard() {
  const { habits, addHabit, toggleHabit, deleteHabit, loading, updateHabitNotes } = useHabits();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 bg-background">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Meus Hábitos</h1>
          <p className="mt-2 text-foreground">
            Acompanhe seus hábitos e mantenha o foco nos seus objetivos
          </p>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button 
            variant="outline" 
            onClick={logout}
            className="gap-2 rounded-full"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
          <AddHabitDialog onAdd={addHabit} />
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)] pr-2 relative" scrollHideDelay={400}>
        <div className="grid gap-4 sm:grid-cols-2 pr-4">
          {habits.length === 0 ? (
            <div className="col-span-2 rounded-lg border-2 border-dashed p-12 text-center">
              <h3 className="text-lg font-medium text-foreground">
                Nenhum hábito ainda
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Comece adicionando seu primeiro hábito clicando no botão acima.
              </p>
            </div>
          ) : (
            habits.map((habit) => (
              <HabitCard
                key={habit._id}
                habit={habit}
                onToggle={toggleHabit}
                onDelete={deleteHabit}
                onUpdateNotes={updateHabitNotes}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export function Index() {
  const navigate = useNavigate();
  const userData = getUserData();

  return (
    <HabitProvider>
      <HabitDashboard />
      {!userData?.questionnaireCompleted && (
        <div className="fixed bottom-4 left-4 z-50">
          <Button
            onClick={() => navigate("/questionnaire")}
            className="gap-2 shadow-lg rounded-full"
            size="lg"
          >
            <ClipboardList className="h-5 w-5" />
            Questionário de Hábitos
          </Button>
        </div>
      )}
    </HabitProvider>
  );
}

export default Index;
import { HabitProvider } from "@/context/HabitContext";
import { useHabits } from "@/context/HabitContext";
import { HabitCard } from "@/components/HabitCard";
import { AddHabitDialog } from "@/components/AddHabitDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeToggle } from "@/components/ThemeToggle";

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
      <ThemeToggle />
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Meus Hábitos</h1>
          <p className="mt-2 text-foreground">
            Acompanhe seus hábitos e mantenha o foco nos seus objetivos
          </p>
        </div>
        <AddHabitDialog onAdd={addHabit} />
      </div>

      <ScrollArea className="h-[calc(100vh-16rem)] pr-4">
        <div className="grid gap-4 sm:grid-cols-2">
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

const Index = () => {
  return (
    <HabitProvider>
      <HabitDashboard />
    </HabitProvider>
  );
};

export default Index;
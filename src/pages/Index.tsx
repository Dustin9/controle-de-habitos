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
import { LogOut, Plus, Trophy, Calendar, BarChart2 } from "lucide-react";
import { logout } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

function HabitDashboard() {
  const { habits, addHabit, toggleHabit, deleteHabit, loading, updateHabitNotes } = useHabits();
  const [showAddHabit, setShowAddHabit] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const completedHabits = habits.filter(habit => habit.completedDates.length > 0).length;
  const completionRate = habits.length > 0 ? (completedHabits / habits.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Meus Hábitos
            </h1>
            <p className="mt-2 text-muted-foreground">
              Acompanhe seus hábitos e mantenha o foco nos seus objetivos
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button 
              variant="outline" 
              onClick={logout}
              className="gap-2 rounded-full hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
            <AddHabitDialog 
              open={showAddHabit}
              onOpenChange={setShowAddHabit}
              onAdd={addHabit}
            />
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <Card className="p-6 bg-primary/5 border-primary/20">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hábitos Completados</p>
                <h3 className="text-2xl font-bold">{completedHabits}</h3>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-primary/5 border-primary/20">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Hábitos</p>
                <h3 className="text-2xl font-bold">{habits.length}</h3>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-primary/5 border-primary/20">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <BarChart2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Conclusão</p>
                <h3 className="text-2xl font-bold">{completionRate.toFixed(1)}%</h3>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Habits Grid */}
        <ScrollArea className="h-[calc(100vh-24rem)] pr-2 relative" scrollHideDelay={400}>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pr-4"
          >
            {habits.length === 0 ? (
              <div className="col-span-full rounded-lg border-2 border-dashed p-12 text-center bg-muted/5">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 cursor-pointer hover:bg-primary/20 transition-colors"
                  onClick={() => setShowAddHabit(true)}
                >
                  <Plus className="h-8 w-8 text-primary" />
                </motion.div>
                <h3 className="text-lg font-medium text-foreground">
                  Nenhum hábito ainda
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Clique no botão acima para adicionar seu primeiro hábito.
                </p>
              </div>
            ) : (
              habits.map((habit) => (
                <motion.div
                  key={habit._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <HabitCard
                    habit={habit}
                    onToggle={toggleHabit}
                    onDelete={deleteHabit}
                    onUpdateNotes={updateHabitNotes}
                  />
                </motion.div>
              ))
            )}
          </motion.div>
        </ScrollArea>
      </div>
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
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 left-4 z-50"
        >
          <Button
            onClick={() => navigate("/questionnaire")}
            className="gap-2 shadow-lg rounded-full bg-primary hover:bg-primary/90"
            size="lg"
          >
            <ClipboardList className="h-5 w-5" />
            Questionário de Hábitos
          </Button>
        </motion.div>
      )}
    </HabitProvider>
  );
}

export default Index;
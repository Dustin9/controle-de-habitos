import { useState } from "react";
import { Check, Flame } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Habit } from "@/types/habit";
import { cn } from "@/lib/utils";
import { HabitDetails } from "./HabitDetails";
import { MotivationalQuote } from "./MotivationalQuote";

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
}

export function HabitCard({ habit, onToggle, onDelete, onUpdateNotes }: HabitCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showQuote, setShowQuote] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const isCompletedToday = habit.completedDates.includes(today);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isCompletedToday) {
      setShowQuote(true);
    }
    onToggle(habit._id);
  };

  return (
    <>
      <div 
        className={cn(
          "rounded-xl p-4 shadow-sm transition-all hover:shadow-md cursor-pointer relative overflow-hidden",
          {
            "bg-card border-2 border-blue-500/20 dark:border-blue-500/30": habit.category === "Saúde",
            "bg-card border-2 border-green-500/20 dark:border-green-500/30": habit.category === "Trabalho",
            "bg-card border-2 border-purple-500/20 dark:border-purple-500/30": habit.category === "Estudo",
            "bg-card border-2 border-orange-500/20 dark:border-orange-500/30": habit.category === "Lazer",
            "bg-card border-2 border-slate-500/20 dark:border-slate-500/30": habit.category === "Outros"
          }
        )}
        onClick={() => setShowDetails(true)}
      >
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent to-current opacity-20"></div>
        <div className="flex items-start justify-between">
          <div>
            <span className={cn(
              "inline-block rounded-full px-2 py-1 text-xs font-medium",
              {
                "bg-blue-100 text-blue-700 dark:bg-blue-500 dark:text-white": habit.category === "Saúde",
                "bg-green-100 text-green-700 dark:bg-green-500 dark:text-white": habit.category === "Trabalho",
                "bg-purple-100 text-purple-700 dark:bg-purple-500 dark:text-white": habit.category === "Estudo",
                "bg-orange-100 text-orange-700 dark:bg-orange-500 dark:text-white": habit.category === "Lazer",
                "bg-slate-100 text-slate-700 dark:bg-slate-400 dark:text-white": habit.category === "Outros"
              }
            )}>
              {habit.category}
            </span>
            <h3 className={cn(
              "mt-2 text-lg font-semibold",
              {
                "text-blue-700 dark:text-blue-400": habit.category === "Saúde",
                "text-green-700 dark:text-green-400": habit.category === "Trabalho",
                "text-purple-700 dark:text-purple-400": habit.category === "Estudo",
                "text-orange-700 dark:text-orange-400": habit.category === "Lazer",
                "text-slate-700 dark:text-slate-300": habit.category === "Outros"
              }
            )}>
              {habit.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              Frequência: {habit.frequency}
            </p>
          </div>
          <button
            onClick={handleToggle}
            className={cn(
              "rounded-full p-2 transition-colors",
              isCompletedToday
                ? "bg-success text-white hover:bg-success/90"
                : "bg-gray-100 text-gray-400 hover:bg-gray-200"
            )}
          >
            <Check className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-4 space-y-2">
          {habit.frequency === "Todo dia" ? (
            <div className="flex items-center gap-2 text-sm">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-gray-600">Sequência:</span>
              <span className="font-medium text-orange-500">{habit.streak || 0} dias</span>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progresso</span>
                <span className={cn(
                  "font-medium",
                  {
                    "text-blue-500 dark:text-blue-400": habit.category === "Saúde",
                    "text-green-500 dark:text-green-400": habit.category === "Trabalho",
                    "text-purple-500 dark:text-purple-400": habit.category === "Estudo",
                    "text-orange-500 dark:text-orange-400": habit.category === "Lazer",
                    "text-slate-500 dark:text-slate-300": habit.category === "Outros"
                  }
                )}>
                  {Math.round(habit.progress)}%
                </span>
              </div>
              <Progress 
                value={habit.progress}
                className={cn(
                  "h-2.5 rounded-full",
                  {
                    "bg-muted/50 [&>div]:bg-blue-500": habit.category === "Saúde",
                    "bg-muted/50 [&>div]:bg-green-500": habit.category === "Trabalho",
                    "bg-muted/50 [&>div]:bg-purple-500": habit.category === "Estudo",
                    "bg-muted/50 [&>div]:bg-orange-500": habit.category === "Lazer",
                    "bg-muted/50 [&>div]:bg-slate-500": habit.category === "Outros"
                  }
                )} 
              />
            </>
          )}
        </div>
      </div>

      <HabitDetails
        habit={habit}
        open={showDetails}
        onOpenChange={setShowDetails}
        onDelete={onDelete}
        onUpdateNotes={onUpdateNotes}
      />

      <MotivationalQuote
        open={showQuote}
        onOpenChange={setShowQuote}
      />
    </>
  );
}
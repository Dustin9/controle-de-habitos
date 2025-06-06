import { useState } from "react";
import { Check, Flame, ChevronRight, Calendar, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Habit } from "@/types/habit";
import { cn } from "@/lib/utils";
import { HabitDetails } from "./HabitDetails";
import { MotivationalQuote } from "./MotivationalQuote";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
}

export function HabitCard({ habit, onToggle, onDelete, onUpdateNotes }: HabitCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showQuote, setShowQuote] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const isCompletedToday = habit.completedDates.includes(today);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isCompletedToday) {
      setShowQuote(true);
    }
    onToggle(habit._id);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Saúde":
        return "blue";
      case "Trabalho":
        return "green";
      case "Estudo":
        return "purple";
      case "Lazer":
        return "orange";
      default:
        return "slate";
    }
  };

  const color = getCategoryColor(habit.category);

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={cn(
          "group rounded-xl p-6 shadow-sm transition-all duration-300 cursor-pointer relative overflow-hidden",
          `bg-card border-2 border-${color}-500/20 dark:border-${color}-500/30`,
          "hover:shadow-lg hover:border-primary/50"
        )}
        onClick={() => setShowDetails(true)}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-current opacity-5 pointer-events-none" />
        
        {/* Category Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
            `bg-${color}-100 text-${color}-700 dark:bg-${color}-500/20 dark:text-${color}-300`
          )}>
            {habit.category}
          </span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleToggle}
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-full transition-all duration-300",
                  isCompletedToday
                    ? "bg-success text-white hover:bg-success/90"
                    : "bg-muted hover:bg-primary/10"
                )}
              >
                <Check className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isCompletedToday ? "Hábito completado hoje" : "Marcar como completado"}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Title and Description */}
        <div className="space-y-2">
          <h3 className={cn(
            "text-xl font-semibold tracking-tight",
            `text-${color}-700 dark:text-${color}-300`
          )}>
            {habit.title}
          </h3>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{habit.frequency}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{habit.completedDates.length} dias</span>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mt-6 space-y-3">
          {habit.frequency === "Todo dia" ? (
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="font-medium text-orange-500">{habit.streak || 0} dias</span>
              </div>
              <span className="text-muted-foreground">em sequência</span>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progresso semanal</span>
                <span className={cn(
                  "font-medium",
                  `text-${color}-500 dark:text-${color}-400`
                )}>
                  {Math.round(habit.progress)}%
                </span>
              </div>
              <Progress 
                value={habit.progress}
                className={cn(
                  "h-2.5 rounded-full",
                  `bg-muted/50 [&>div]:bg-${color}-500`
                )} 
              />
            </>
          )}
        </div>

        {/* View Details Button */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-4 right-4"
            >
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-muted-foreground hover:text-foreground"
              >
                Ver detalhes
                <ChevronRight className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

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
    </TooltipProvider>
  );
}
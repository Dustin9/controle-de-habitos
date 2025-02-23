
import { Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Habit } from "@/types/habit";
import { cn } from "@/lib/utils";

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string) => void;
}

export function HabitCard({ habit, onToggle }: HabitCardProps) {
  const today = new Date().toISOString().split("T")[0];
  const isCompletedToday = habit.completedDates.includes(today);

  return (
    <div className="bg-card rounded-xl p-4 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <span className="inline-block rounded-full bg-primary px-2 py-1 text-xs font-medium">
            {habit.category}
          </span>
          <h3 className="mt-2 text-lg font-semibold text-gray-800">{habit.name}</h3>
          <p className="text-sm text-gray-500">
            Frequência: {habit.frequency}
          </p>
        </div>
        <button
          onClick={() => onToggle(habit.id)}
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
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Progresso</span>
          <span className="font-medium">{Math.round(habit.progress)}%</span>
        </div>
        <Progress value={habit.progress} className="h-2" />
      </div>
    </div>
  );
}

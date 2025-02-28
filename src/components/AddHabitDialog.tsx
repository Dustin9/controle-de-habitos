import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { HabitCategory, HabitFormData, HabitFrequency } from "@/types/habit";
import { Plus } from "lucide-react";

interface AddHabitDialogProps {
  onAdd: (data: HabitFormData) => Promise<void>;
}

export function AddHabitDialog({ onAdd }: AddHabitDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<HabitFormData>({
    title: "",
    description: "",
    category: "Outros",
    frequency: "Diário",
    goal: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // If frequency is "Todo dia", remove the goal field
    const submitData = formData.frequency === "Todo dia" 
      ? { ...formData, goal: undefined }
      : formData;
    await onAdd(submitData);
    setOpen(false);
    setFormData({
      title: "",
      description: "",
      category: "Outros",
      frequency: "Diário",
      goal: 1,
    });
  };

  const handleFrequencyChange = (value: HabitFrequency) => {
    setFormData(prev => ({
      ...prev,
      frequency: value,
      // Reset goal if switching to "Todo dia"
      goal: value === "Todo dia" ? undefined : prev.goal
    }));
  };

  const categories: HabitCategory[] = [
    "Saúde",
    "Trabalho",
    "Estudo",
    "Lazer",
    "Outros",
  ];

  const frequencies: HabitFrequency[] = ["Diário", "Semanal", "Todo dia"];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-xl hover:rounded-xl transition-all">
          <Plus className="h-5 w-5" />
          Novo Hábito
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Hábito</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Nome do Hábito</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Ex: Beber água"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Descreva seu hábito..."
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select
              value={formData.category}
              onValueChange={(value: HabitCategory) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="frequency">Frequência</Label>
            <Select
              value={formData.frequency}
              onValueChange={handleFrequencyChange}
            >
              <SelectTrigger id="frequency">
                <SelectValue placeholder="Selecione uma frequência" />
              </SelectTrigger>
              <SelectContent>
                {frequencies.map((frequency) => (
                  <SelectItem key={frequency} value={frequency}>
                    {frequency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {formData.frequency !== "Todo dia" && (
            <div className="space-y-2">
              <Label htmlFor="goal">Meta (dias)</Label>
              <Input
                id="goal"
                type="number"
                min="1"
                value={formData.goal}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, goal: Number(e.target.value) }))
                }
                required
              />
            </div>
          )}
          <Button type="submit" className="w-full">
            Adicionar Hábito
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

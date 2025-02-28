

import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Habit } from "@/types/habit";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface HabitDetailsProps {
  habit: Habit;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
}

export function HabitDetails({ habit, open, onOpenChange, onDelete, onUpdateNotes }: HabitDetailsProps) {
  const [notes, setNotes] = useState(habit.description || "");
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const handleDelete = () => {
    onDelete(habit._id);
    onOpenChange(false);
  };

  const handleSaveNotes = () => {
    onUpdateNotes(habit._id, notes);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{habit.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Categoria</p>
              <p className="mt-1">{habit.category}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Frequência</p>
              <p className="mt-1">{habit.frequency}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Data de Criação</p>
              <p className="mt-1">
                {format(new Date(habit.createdAt), "PPP", { locale: ptBR })}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Meta</p>
              <p className="mt-1">{habit.goal} dias</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">
                Observações
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Adicione suas observações aqui..."
                className="min-h-[100px]"
              />
              <Button onClick={handleSaveNotes} className="w-full">
                Salvar Observações
              </Button>
            </div>
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => setShowDeleteAlert(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir Hábito
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o hábito e
              todos os seus dados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

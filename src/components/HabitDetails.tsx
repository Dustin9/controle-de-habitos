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
import { Trash2, Calendar, Clock, Target, Pencil, Save, X } from "lucide-react";
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
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotes, setEditedNotes] = useState(notes);

  const handleDelete = () => {
    onDelete(habit._id);
    onOpenChange(false);
  };

  const handleSaveNotes = () => {
    onUpdateNotes(habit._id, editedNotes);
    setNotes(editedNotes);
    setIsEditing(false);
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
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold">{habit.title}</DialogTitle>
              <span className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
                `bg-${color}-100 text-${color}-700 dark:bg-${color}-500/20 dark:text-${color}-300`
              )}>
                {habit.category}
              </span>
            </div>
          </DialogHeader>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Frequência</span>
                </div>
                <p className="font-medium">{habit.frequency}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Criado em</span>
                </div>
                <p className="font-medium">
                  {format(new Date(habit.createdAt), "PPP", { locale: ptBR })}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="h-4 w-4" />
                  <span>Meta</span>
                </div>
                <p className="font-medium">{habit.goal} dias</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Completado</span>
                </div>
                <p className="font-medium">{habit.completedDates.length} vezes</p>
              </div>
            </div>

            {/* Notes Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">
                  Observações
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (isEditing) {
                      setEditedNotes(notes);
                      setIsEditing(false);
                    } else {
                      setIsEditing(true);
                    }
                  }}
                  className="gap-1"
                >
                  {isEditing ? (
                    <>
                      <X className="h-4 w-4" />
                      Cancelar
                    </>
                  ) : (
                    <>
                      <Pencil className="h-4 w-4" />
                      Editar
                    </>
                  )}
                </Button>
              </div>
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    <Textarea
                      value={editedNotes}
                      onChange={(e) => setEditedNotes(e.target.value)}
                      placeholder="Adicione suas observações aqui..."
                      className="min-h-[100px] resize-none"
                    />
                    <Button 
                      onClick={handleSaveNotes} 
                      className="w-full gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Salvar Observações
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="rounded-lg border p-4 min-h-[100px] bg-muted/50"
                  >
                    {notes || (
                      <p className="text-sm text-muted-foreground">
                        Nenhuma observação adicionada ainda.
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Delete Button */}
            <Button
              variant="destructive"
              className="w-full gap-2"
              onClick={() => setShowDeleteAlert(true)}
            >
              <Trash2 className="h-4 w-4" />
              Excluir Hábito
            </Button>
          </motion.div>
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
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

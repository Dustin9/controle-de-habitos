import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sparkles } from "lucide-react";

interface MotivationalQuoteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const quotes = [
  "Cada pequeno passo te leva mais perto do seu objetivo!",
  "Não espere pela motivação – comece e ela vai te encontrar.",
  "Hoje é o dia perfeito para transformar seus hábitos!",
  "Erre, aprenda, cresça – a jornada é assim mesmo!",
  "Persistência é a chave: não desista, continue sempre.",
  "A mudança começa quando você decide agir.",
  "Todo esforço, mesmo o menor, vale a pena.",
  "Vamos juntos transformar o impossível em rotina!",
  "Não se trata de ser perfeito, mas de ser constante.",
  "Acredite em você e faça da disciplina seu melhor aliado."
];

export function MotivationalQuote({ open, onOpenChange }: MotivationalQuoteProps) {
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);

  useEffect(() => {
    if (open) {
      // Get a random quote that's different from the current one
      const availableQuotes = quotes.filter(quote => quote !== currentQuote);
      const randomIndex = Math.floor(Math.random() * availableQuotes.length);
      setCurrentQuote(availableQuotes[randomIndex]);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Parabéns!
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 text-center">
          <p className="text-lg font-medium text-foreground">{currentQuote}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { HabitCategory, HabitFrequency } from "@/types/habit";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { getUserData, setUserData, getAuthToken } from "@/lib/auth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Loader2, ChevronDown, ChevronUp, Trash2 } from "lucide-react";

interface SuggestedHabit {
  _id: string;
  name: string;
  description: string;
  category: HabitCategory;
  frequency: HabitFrequency;
}

interface QuestionnaireData {
  currentLifestyle: string;
  mainGoals: string;
  challenges: string;
  availableTime: string;
  preferredCategories: HabitCategory[];
}

interface ApiHabit {
  _id: string;
  name: string;
  description: string;
  category: HabitCategory;
  frequency: string;
  meta: number;
  weeklyMeta: number;
}

interface QuestionnaireResponse {
  _id: string;
  user: string;
  responses: QuestionnaireData;
  generatedHabits: ApiHabit[];
  createdAt: string;
}

interface ExistingHabit {
  _id: string;
  name: string;
  description: string;
  category: HabitCategory;
  frequency: HabitFrequency;
}

const categories: HabitCategory[] = ["Saúde", "Trabalho", "Estudo", "Lazer", "Outros"];

const TOTAL_QUESTIONS = 5;

interface HabitCardProps {
  habit: SuggestedHabit;
  isSelected: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

function HabitCard({ habit, isSelected, onToggle, onDelete }: HabitCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <Card className={`p-4 hover:shadow-md transition-shadow ${isSelected ? 'border-2 border-primary shadow-md' : 'border border-muted'}`}>
      <div className="flex items-start gap-4 w-full">
        <Checkbox
          id={habit._id}
          checked={isSelected}
          onCheckedChange={onToggle}
          className="h-6 w-6 rounded-full border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary mt-1"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">{habit.name}</h3>
            <div className="flex items-center gap-2">
              {confirmDelete ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setConfirmDelete(false)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={onDelete}
                    className="h-8 p-0 px-2"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    <span className="text-xs">Confirmar</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setConfirmDelete(true)}
                    className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="h-8 w-8 p-0 border-2"
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-primary" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-primary" />
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 items-center mb-2">
            <span className="inline-flex items-center rounded-full bg-primary/20 text-primary px-3 py-1 text-sm font-medium border border-primary/30">
              {habit.category}
            </span>
            <span className="inline-flex items-center rounded-full bg-secondary/20 text-secondary-foreground px-3 py-1 text-sm font-medium border border-secondary/30">
              Frequência: {habit.frequency}
            </span>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-2 border-t">
                  <p className="text-sm font-medium">
                    {habit.description}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Card>
  );
}

function mapFrequencyToHabitFrequency(frequency: string): HabitFrequency {
  if (frequency === "Todo dia" || frequency === "Diário") return "Todo dia";
  if (frequency === "Semanal") return "Semanal";
  return "Todo dia"; // Default fallback
}

export function Questionnaire() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [previousStep, setPreviousStep] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestedHabits, setSuggestedHabits] = useState<SuggestedHabit[]>([]);
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<QuestionnaireData>({
    currentLifestyle: "",
    mainGoals: "",
    challenges: "",
    availableTime: "",
    preferredCategories: []
  });

  useEffect(() => {
    const userData = getUserData();
    if (userData?.questionnaireCompleted) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      setIsLoading(true);
      const token = getAuthToken();
      if (!token) {
        toast({
          title: "Erro",
          description: "Sessão expirada. Por favor, faça login novamente.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:3000/api/questionnaire", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast({
            title: "Erro",
            description: "Sessão expirada. Por favor, faça login novamente.",
            variant: "destructive",
          });
          navigate("/login");
          return;
        }
        throw new Error("Failed to submit questionnaire");
      }

      const habitsResponse = await fetch("http://localhost:3000/api/questionnaire/history", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!habitsResponse.ok) {
        throw new Error("Failed to fetch suggested habits");
      }

      const questionnaires: QuestionnaireResponse[] = await habitsResponse.json();
      console.log("Received questionnaires:", questionnaires);

      // Get the most recent questionnaire (first in the array)
      const latestQuestionnaire = questionnaires[0];
      const habits = latestQuestionnaire.generatedHabits;

      console.log("Latest generated habits:", habits);

      const validatedHabits = habits.map((habit: ApiHabit) => ({
        _id: habit._id,
        name: habit.name,
        description: habit.description,
        category: habit.category,
        frequency: mapFrequencyToHabitFrequency(habit.frequency)
      }));

      console.log("Validated habits:", validatedHabits);
      setSuggestedHabits(validatedHabits);
      setSelectedHabits(validatedHabits.map((h: SuggestedHabit) => h._id));
      setShowSuggestions(true);

      const userData = getUserData();
      if (userData) {
        setUserData({ ...userData, questionnaireCompleted: true });
      }

      toast({
        title: "Questionário enviado",
        description: "Suas respostas foram salvas com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar o questionário. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (step < TOTAL_QUESTIONS) {
      setPreviousStep(step);
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setPreviousStep(step);
      setStep(step - 1);
    }
  };

  const handleCategoryToggle = (category: HabitCategory) => {
    setData(prev => ({
      ...prev,
      preferredCategories: prev.preferredCategories.includes(category)
        ? prev.preferredCategories.filter(c => c !== category)
        : [...prev.preferredCategories, category]
    }));
  };

  const handleHabitToggle = (habitId: string) => {
    setSelectedHabits(prev => 
      prev.includes(habitId)
        ? prev.filter(id => id !== habitId)
        : [...prev, habitId]
    );
  };

  const handleDeleteHabit = (habitId: string) => {
    setSuggestedHabits(prev => prev.filter(h => h._id !== habitId));
    setSelectedHabits(prev => prev.filter(id => id !== habitId));
  };

  const handleCreateHabits = async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      setIsLoading(true);
      const token = getAuthToken();
      if (!token) {
        toast({
          title: "Erro",
          description: "Sessão expirada. Por favor, faça login novamente.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      // First, get existing habits to avoid duplicates
      const existingHabitsResponse = await fetch("http://localhost:3000/api/habits", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!existingHabitsResponse.ok) {
        throw new Error("Failed to fetch existing habits");
      }
      
      const existingHabits = await existingHabitsResponse.json();
      const existingHabitNames = new Set(existingHabits.map((h: ExistingHabit) => h.name.toLowerCase().trim()));
      
      console.log("Existing habits:", existingHabitNames);
      
      // Get only the selected habits
      const selectedHabitsData = suggestedHabits.filter(h => selectedHabits.includes(h._id));
      
      // Keep track of created habit IDs and names to prevent duplicates
      const createdHabitNames = new Set();
      let createdCount = 0;
      let skippedCount = 0;
      
      for (const habit of selectedHabitsData) {
        const habitName = habit.name.toLowerCase().trim();
        
        // Skip if we've already created this habit or if it already exists
        if (createdHabitNames.has(habitName) || existingHabitNames.has(habitName)) {
          console.log(`Skipping duplicate habit: ${habit.name}`);
          skippedCount++;
          continue;
        }
        
        console.log(`Creating habit: ${habit.name}`);
        const response = await fetch("http://localhost:3000/api/habits", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            name: habit.name,
            description: habit.description,
            category: habit.category,
            frequency: habit.frequency,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to create habit: ${habit.name}`);
        }
        
        // Mark this habit as created
        createdHabitNames.add(habitName);
        createdCount++;
      }

      let message = `${createdCount} hábitos foram criados com sucesso!`;
      if (skippedCount > 0) {
        message += ` (${skippedCount} hábitos já existentes foram ignorados)`;
      }

      toast({
        title: "Hábitos criados",
        description: message,
      });

      // Use window.location to force a complete page reload
      window.location.href = "/";
    } catch (error) {
      console.error("Error creating habits:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar os hábitos. Tente novamente.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center space-y-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="p-6 bg-black/10 dark:bg-white/10 rounded-full shadow-lg border-4 border-black dark:border-white"
          >
            <Loader2 className="h-20 w-20 text-black dark:text-white animate-spin" />
          </motion.div>
          <p className="text-xl font-bold text-black dark:text-white bg-white/80 dark:bg-black/80 px-4 py-2 rounded-md shadow">
            Processando suas respostas...
          </p>
        </motion.div>
      ) : showSuggestions ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-6 max-w-2xl w-full"
        >
          <Card className="p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Hábitos Sugeridos</h2>
            <p className="text-muted-foreground mb-6">
              Com base nas suas respostas, selecione os hábitos que deseja criar:
            </p>
            <div className="grid gap-4">
              {suggestedHabits.length > 0 ? (
                suggestedHabits.map((habit) => (
                  <HabitCard
                    key={habit._id}
                    habit={habit}
                    isSelected={selectedHabits.includes(habit._id)}
                    onToggle={() => handleHabitToggle(habit._id)}
                    onDelete={() => handleDeleteHabit(habit._id)}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Nenhum hábito sugerido disponível.</p>
                  <Button onClick={() => navigate("/")} className="rounded-full">
                    Ir para o Dashboard
                  </Button>
                </div>
              )}
            </div>
          </Card>
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="rounded-full border-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Pular
            </Button>
            <Button
              onClick={handleCreateHabits}
              className="rounded-full bg-primary hover:bg-primary/90 font-medium text-primary-foreground shadow-md"
              disabled={selectedHabits.length === 0 || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  <span className="font-medium">Criar Hábitos Selecionados</span>
                </>
              ) : (
                <>
                  <Check className="h-5 w-5 mr-2" />
                  <span className="font-medium">Criar Hábitos Selecionados</span>
                </>
              )}
            </Button>
          </div>
        </motion.div>
      ) : (
        <Card className="p-8 rounded-xl max-w-2xl w-full shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Questionário de Hábitos</h2>
            <ThemeToggle />
          </div>

          {step === 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 text-center"
            >
              <p className="text-muted-foreground text-lg">
                Para personalizar sua experiência e sugerir hábitos relevantes, gostaríamos de fazer algumas perguntas.
              </p>
              <p className="text-muted-foreground">
                O questionário tem {TOTAL_QUESTIONS} perguntas e leva cerca de 5 minutos para ser respondido.
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="rounded-full"
                >
                  Pular por enquanto
                </Button>
                <Button 
                  onClick={() => setStep(1)}
                  className="rounded-full"
                >
                  Começar Questionário
                </Button>
              </div>
            </motion.div>
          )}

          {step > 0 && (
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: step > previousStep ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: step > previousStep ? -20 : 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Pergunta {step} de {TOTAL_QUESTIONS}
                  </p>
                  <div className="flex gap-2">
                    {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i + 1 <= step ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-lg font-semibold">Estilo de Vida Atual</h3>
                    <p className="text-sm text-muted-foreground">
                      Descreva seu estilo de vida atual e sua rotina diária.
                    </p>
                    <Textarea
                      value={data.currentLifestyle}
                      onChange={(e) => setData(prev => ({ ...prev, currentLifestyle: e.target.value }))}
                      placeholder="Ex: Trabalho em home office, estudo à noite, prática de exercícios 3x por semana..."
                      className="min-h-[100px] mt-4"
                    />
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-lg font-semibold">Objetivos Principais</h3>
                    <p className="text-sm text-muted-foreground">
                      Quais são seus principais objetivos que gostaria de alcançar?
                    </p>
                    <Textarea
                      value={data.mainGoals}
                      onChange={(e) => setData(prev => ({ ...prev, mainGoals: e.target.value }))}
                      placeholder="Ex: Melhorar saúde, aumentar produtividade, aprender novas habilidades..."
                      className="min-h-[100px] mt-4"
                    />
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-lg font-semibold">Desafios</h3>
                    <p className="text-sm text-muted-foreground">
                      Quais são os principais desafios que você enfrenta?
                    </p>
                    <Textarea
                      value={data.challenges}
                      onChange={(e) => setData(prev => ({ ...prev, challenges: e.target.value }))}
                      placeholder="Ex: Falta de tempo, procrastinação, dificuldade em manter consistência..."
                      className="min-h-[100px] mt-4"
                    />
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-lg font-semibold">Tempo Disponível</h3>
                    <p className="text-sm text-muted-foreground">
                      Quanto tempo você tem disponível para dedicar aos hábitos diariamente?
                    </p>
                    <Input
                      type="text"
                      value={data.availableTime}
                      onChange={(e) => setData(prev => ({ ...prev, availableTime: e.target.value }))}
                      placeholder="Ex: 1-2 horas por dia, 30 minutos pela manhã..."
                    />
                  </motion.div>
                )}

                {step === 5 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-lg font-semibold">Categorias Preferidas</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Selecione as categorias de hábitos que mais te interessam:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {categories.map((category) => {
                        const isSelected = data.preferredCategories.includes(category);
                        return (
                          <div
                            key={category}
                            className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? "border-primary bg-green-100 dark:bg-green-900 shadow-md"
                                : "border-muted hover:border-primary/50"
                            }`}
                            onClick={() => handleCategoryToggle(category)}
                          >
                            <div 
                              className={`flex h-7 w-7 items-center justify-center rounded-full border-2 ${
                                isSelected 
                                  ? "bg-green-500 border-green-600" 
                                  : "border-muted-foreground"
                              }`}
                            >
                              {isSelected && <Check className="h-4 w-4 text-white" />}
                            </div>
                            <Label
                              htmlFor={category}
                              className={`text-base font-medium cursor-pointer ${
                                isSelected
                                  ? "text-green-800 dark:text-green-100 font-bold"
                                  : "text-foreground"
                              }`}
                            >
                              {category}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                <div className="flex justify-between mt-6">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={step === 0}
                    className="rounded-full border-2 font-medium"
                  >
                    Voltar
                  </Button>
                  <Button 
                    onClick={handleNext}
                    className="rounded-full bg-primary font-medium shadow-md"
                  >
                    {step === TOTAL_QUESTIONS ? "Enviar" : "Próximo"}
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </Card>
      )}
    </div>
  );
} 
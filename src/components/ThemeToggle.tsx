import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "../hooks/use-theme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline" // Alterado para outline para melhor visibilidade
      size="icon"
      onClick={toggleTheme}
      className="fixed top-4 right-4 rounded-full border-2 border-muted-foreground/30 bg-background/80 shadow-lg hover:bg-background/90 hover:shadow-md dark:shadow-md dark:shadow-muted-foreground/20 transition-all duration-300 hover:scale-110"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}
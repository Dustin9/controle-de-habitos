import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { setAuthToken } from "@/lib/auth";

interface User {   
    "message": string,
    "token": string,
    "user": {
      "id": string,
      "email": string,
      "name": string
    }
}

interface LoginProps {
  user: User
  setUserdata: (data: User) => void
}

export default function Login({user, setUserdata}: LoginProps) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // Prevent multiple submissions
    
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setAuthToken(data.token);
        setUserdata(data);
        toast({
          title: "Login realizado com sucesso!",
          description: `Bem-vindo, ${data.user.name || data.user.email}!`,
        });
        navigate("/");
      } else {
        throw new Error(data.message || "Erro ao fazer login");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao fazer login",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <ThemeToggle />
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Entre na sua conta
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="identifier">Email ou Nome de Usuário</Label>
              <Input
                id="identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Email ou nome de usuario"
                className="w-full rounded-xl hover:rounded-xl transition-all"
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full rounded-xl hover:rounded-xl transition-all"
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-foreground hover:text-accent"
            >
              Esqueceu sua senha?
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium text-foreground hover:text-accent"
            >
              Criar conta
            </Link>
          </div>

          <Button 
            type="submit" 
            className="w-full rounded-xl hover:rounded-xl transition-all" 
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
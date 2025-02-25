import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "YOUR_BACKEND_URL/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        toast({
          title: "E-mail enviado",
          description:
            "Verifique sua caixa de entrada para redefinir sua senha.",
        });
      } else {
        throw new Error(data.message || "Erro ao enviar e-mail");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description:
          error instanceof Error ? error.message : "Erro ao enviar e-mail",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center space-y-6">
          <h2 className="text-3xl font-extrabold text-gray-900">
            E-mail enviado!
          </h2>
          <p className="text-gray-600">
            Verifique sua caixa de entrada para instruções sobre como redefinir
            sua senha.
          </p>
          <Link
            to="/login"
            className="text-primary hover:text-primary/90 font-medium"
          >
            Voltar para o login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Recuperar senha
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Digite seu e-mail para receber um link de recuperação de senha.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <Link
              to="/login"
              className="text-sm font-medium text-primary hover:text-primary/90"
            >
              Voltar para o login
            </Link>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Enviando..." : "Enviar e-mail de recuperação"}
          </Button>
        </form>
      </div>
    </div>
  );
}

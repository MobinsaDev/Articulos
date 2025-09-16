import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import style from "../css/login.module.scss";

export default function LoginPage() {
  const nav = useNavigate();
  const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);


  useEffect(() => {
    if (user) nav("/", { replace: true });
  }, [user, nav]);


  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login({ email, password });
      nav("/", { replace: true });
    } catch (e: any) {
      setError(e?.message || "Error al iniciar sesión");
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className={style.formLogin}>
      <form onSubmit={onSubmit}>
        <h1>Iniciar sesión</h1>
        {error && (
          <div>{error}</div>
        )}
        <div>
          <label>Email</label>
          <input

            type="email"
            placeholder="tu@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña</label>
          <input

            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className={style.buttons}>
          <button type="submit" disabled={submitting} className={style.send}>
            <span>{submitting ? "Entrando…" : "Entrar"}</span>
          </button>
          <h3>¿Olvidaste tu contraseña? Haz click <a href="">aquí</a></h3>
        </div>
      </form>
    </div>
  );
}
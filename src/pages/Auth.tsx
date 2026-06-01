import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Mail, Lock, AtSign, ArrowRight, Sparkles, ChevronLeft } from "lucide-react";
import { useStore, uid } from "@/data/store";
import { CURRENT_USER_ID } from "@/data/seed";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { CardArt } from "@/components/CardArt";
import type { Item } from "@/data/types";
import "./Auth.css";

const showcase: Item[] = [
  { id: "s1", ownerId: "x", name: "Charizard", category: "pokemon", rarity: "lendaria", description: "", setCode: "BS · 004/102", condition: "nm", artHue: 28, artSeed: 7, forTrade: true, createdAt: "" },
  { id: "s2", ownerId: "x", name: "Umbreon", category: "pokemon", rarity: "epica", description: "", setCode: "EVS · 215", condition: "nm", artHue: 290, artSeed: 3, forTrade: true, createdAt: "" },
  { id: "s3", ownerId: "x", name: "F1 Gold", category: "esportivas", rarity: "rara", description: "", setCode: "F1 · 044", condition: "nm", artHue: 78, artSeed: 2, forTrade: true, createdAt: "" },
];

export function Auth() {
  const { dispatch } = useStore();
  const location = useLocation();
  const initialMode =
    (location.state as { mode?: "entrar" | "criar" } | null)?.mode ?? "entrar";
  const [mode, setMode] = useState<"entrar" | "criar">(initialMode);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function enterDemo() {
    setBusy(true);
    dispatch({ type: "login", userId: CURRENT_USER_ID });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (mode === "entrar") {
      if (!email.trim() || !password) {
        setError("Informe e-mail e senha para entrar.");
        return;
      }
      setBusy(true);
      dispatch({ type: "login", userId: CURRENT_USER_ID });
      return;
    }
    // criar conta
    if (name.trim().length < 2 || username.trim().length < 3 || !email.trim() || password.length < 4) {
      setError("Preencha nome, usuário (3+), e-mail e senha (4+).");
      return;
    }
    setBusy(true);
    dispatch({
      type: "register",
      user: {
        id: uid("u"),
        username: username.trim().toLowerCase().replace(/\s+/g, "."),
        name: name.trim(),
        avatarHue: Math.floor(Math.random() * 360),
        bio: "Novo na CardLink. Montando minha vitrine!",
        location: "Brasil",
        joinedAt: new Date().toISOString(),
        ratingAvg: 0,
        ratingCount: 0,
        tradesCount: 0,
      },
    });
  }

  return (
    <div className="auth">
      <aside className="auth__showcase" aria-hidden="true">
        <div className="auth__glow" />
        <div className="auth__cards">
          {showcase.map((item, i) => (
            <div key={item.id} className={`auth__card auth__card--${i}`} data-cardhover>
              <CardArt item={item} />
            </div>
          ))}
        </div>
        <div className="auth__pitch">
          <h2>Sua vitrine de colecionador, num só lugar.</h2>
          <p>
            Exiba sua coleção, encontre quem tem o que falta e negocie trocas com
            quem já provou ser confiável.
          </p>
        </div>
      </aside>

      <main className="auth__panel">
        <div className="auth__formwrap">
          <Link to="/" className="auth__back">
            <ChevronLeft size={16} aria-hidden="true" />
            <Logo size={32} />
          </Link>

          <div className="auth__welcome">
            <h1>{mode === "entrar" ? "Bem-vindo de volta" : "Crie sua conta"}</h1>
            <p className="muted">
              {mode === "entrar"
                ? "Entre para continuar suas trocas."
                : "Comece a exibir e trocar sua coleção."}
            </p>
          </div>

          <div className="segmented auth__seg" role="tablist">
            <button role="tab" aria-selected={mode === "entrar"} className="segmented__btn" onClick={() => { setMode("entrar"); setError(""); }}>
              Entrar
            </button>
            <button role="tab" aria-selected={mode === "criar"} className="segmented__btn" onClick={() => { setMode("criar"); setError(""); }}>
              Criar conta
            </button>
          </div>

          <form className="auth__form" onSubmit={submit} noValidate>
            {mode === "criar" && (
              <>
                <div className="field">
                  <label className="field__label" htmlFor="au-name">Nome</label>
                  <input id="au-name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" autoComplete="name" />
                </div>
                <div className="field">
                  <label className="field__label" htmlFor="au-user">Nome de usuário</label>
                  <div className="input-icon">
                    <AtSign size={18} aria-hidden="true" />
                    <input id="au-user" className="input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="seu.usuario" autoComplete="username" />
                  </div>
                </div>
              </>
            )}
            <div className="field">
              <label className="field__label" htmlFor="au-email">E-mail</label>
              <div className="input-icon">
                <Mail size={18} aria-hidden="true" />
                <input id="au-email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" autoComplete="email" />
              </div>
            </div>
            <div className="field">
              <label className="field__label" htmlFor="au-pass">Senha</label>
              <div className="input-icon">
                <Lock size={18} aria-hidden="true" />
                <input id="au-pass" type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete={mode === "entrar" ? "current-password" : "new-password"} />
              </div>
            </div>

            {error && <p className="auth__error" role="alert">{error}</p>}

            <Button type="submit" size="lg" block loading={busy} iconEnd={<ArrowRight size={18} />}>
              {mode === "entrar" ? "Entrar" : "Criar conta e entrar"}
            </Button>
          </form>

          <div className="auth__divider"><span>ou</span></div>

          <button className="auth__demo" onClick={enterDemo} disabled={busy}>
            <Sparkles size={16} aria-hidden="true" />
            Explorar como demonstração
          </button>
          <p className="auth__note faint">
            Protótipo de validação. Os dados ficam apenas no seu navegador.
          </p>
        </div>
      </main>
    </div>
  );
}

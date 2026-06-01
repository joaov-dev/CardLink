import { useState, useEffect, type ReactNode } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Search,
  MessagesSquare,
  Star,
  LayoutGrid,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { CardArt } from "@/components/CardArt";
import { RatingStars } from "@/components/RatingStars";
import { Avatar } from "@/components/Avatar";
import { RarityBadge } from "@/components/RarityBadge";
import { categoryConfig } from "@/lib/taxonomy";
import type { Item, Rarity, Category } from "@/data/types";
import "./Landing.css";

const mk = (
  name: string,
  category: Category,
  rarity: Rarity,
  artHue: number,
  artSeed: number,
  setCode = "",
): Item => ({
  id: "l-" + name,
  ownerId: "x",
  name,
  category,
  rarity,
  description: "",
  setCode: setCode || "SET · 000",
  condition: "nm",
  artHue,
  artSeed,
  forTrade: true,
  createdAt: "",
});

const heroCards: Item[] = [
  mk("Venusaur Holo", "pokemon", "epica", 145, 4, "BS · 015/102"),
  mk("Charizard Holo", "pokemon", "lendaria", 28, 7, "BS · 004/102"),
  mk("Umbreon Alt", "pokemon", "epica", 290, 3, "EVS · 215"),
];

const railCards: Item[] = [
  mk("Rookie Prizm", "esportivas", "epica", 250, 9, "PRIZM · RC-21"),
  mk("Elsa Foil", "tcg", "epica", 210, 8, "LOR1 · 042"),
  mk("Legend Dourada", "figurinhas", "lendaria", 78, 13, "COPA70 · LEG"),
  mk("F1 Pole Gold", "esportivas", "rara", 78, 2, "F1-23 · 044"),
  mk("Mew Promo", "pokemon", "rara", 320, 11, "PROMO · 205"),
  mk("Selo Raro", "outros", "epica", 25, 15, "SELO · 1958"),
];

const steps = [
  {
    icon: LayoutGrid,
    title: "Monte sua vitrine",
    body: "Cadastre suas cartas e figurinhas com raridade, condição e edição. Sua coleção fica organizada e bonita de ver.",
  },
  {
    icon: Search,
    title: "Descubra o que falta",
    body: "Busque por nome, categoria ou raridade e veja na hora quem tem o item que você procura, disponível para troca.",
  },
  {
    icon: MessagesSquare,
    title: "Converse e combine",
    body: "Chat privado para alinhar a troca, mandar fotos dos cantos e combinar o envio. Tudo no mesmo lugar.",
  },
  {
    icon: Star,
    title: "Avalie e construa reputação",
    body: "Depois da troca, avaliem confiabilidade, comunicação e experiência. Boas trocas viram histórico que todos veem.",
  },
];

const rarityShowcase: Rarity[] = ["comum", "incomum", "rara", "epica", "lendaria"];

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

export function Landing() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goCreate = () => navigate("/entrar", { state: { mode: "criar" } });
  const goLogin = () => navigate("/entrar", { state: { mode: "entrar" } });

  return (
    <div className="lp">
      {/* ---------- Nav ---------- */}
      <header className={`lp-nav ${scrolled ? "is-scrolled" : ""}`}>
        <div className="lp-nav__inner">
          <Link to="/" className="lp-nav__brand" aria-label="CardLink, início">
            <Logo size={30} />
          </Link>
          <nav className="lp-nav__links" aria-label="Seções">
            <a href="#como-funciona">Como funciona</a>
            <a href="#confianca">Confiança</a>
            <a href="#categorias">Categorias</a>
          </nav>
          <div className="lp-nav__cta">
            <button className="lp-nav__login" onClick={goLogin}>Entrar</button>
            <Button size="sm" onClick={goCreate}>Criar conta</Button>
          </div>
          <button
            className="lp-nav__menu"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {menuOpen && (
          <div className="lp-nav__sheet">
            <a href="#como-funciona" onClick={() => setMenuOpen(false)}>Como funciona</a>
            <a href="#confianca" onClick={() => setMenuOpen(false)}>Confiança</a>
            <a href="#categorias" onClick={() => setMenuOpen(false)}>Categorias</a>
            <button className="lp-nav__login" onClick={goLogin}>Entrar</button>
            <Button block onClick={goCreate}>Criar conta</Button>
          </div>
        )}
      </header>

      {/* ---------- Hero ---------- */}
      <section className="lp-hero">
        <div className="lp-hero__glow" aria-hidden="true" />
        <div className="lp-hero__grid">
          <motion.div
            className="lp-hero__copy"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="lp-hero__kicker">Para colecionadores brasileiros</span>
            <h1 className="lp-hero__title">
              Sua coleção merece uma <span className="lp-hero__hl">vitrine</span>.
            </h1>
            <p className="lp-hero__sub">
              Exiba suas cartas, encontre quem tem o que falta na sua coleção e
              troque com gente que já provou ser confiável. Pokémon, esportivas,
              TCG e figurinhas, num lugar feito pro hobby.
            </p>
            <div className="lp-hero__actions">
              <Button size="lg" onClick={goCreate} iconEnd={<ArrowRight size={19} />}>
                Criar conta grátis
              </Button>
              <a className="lp-hero__secondary" href="#como-funciona">
                Ver como funciona
              </a>
            </div>
            <div className="lp-hero__cats">
              {(["pokemon", "esportivas", "tcg", "figurinhas"] as Category[]).map((c) => (
                <span key={c}>{categoryConfig[c].short}</span>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="lp-hero__stage"
            aria-hidden="true"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            {heroCards.map((item, i) => (
              <div key={item.id} className={`lp-hero__card lp-hero__card--${i}`} data-cardhover>
                <CardArt item={item} />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---------- Value / problem ---------- */}
      <section className="lp-value">
        <Reveal className="lp-value__inner">
          <p className="lp-value__lead">
            Trocar em grupo de mensagem é um tiro no escuro. Você não vê a
            condição da carta, não sabe se a pessoa some depois do combinado, e
            o item que falta vive perdido no meio de mil conversas.
          </p>
          <p className="lp-value__answer">
            No CardLink, cada item tem imagem, raridade e condição. Cada
            colecionador tem perfil, histórico e avaliações. A busca encontra o
            que você procura em segundos, e a negociação começa com confiança.
          </p>
        </Reveal>
      </section>

      {/* ---------- How it works ---------- */}
      <section className="lp-how" id="como-funciona">
        <Reveal>
          <h2 className="lp-section__title">Do primeiro cadastro à troca fechada</h2>
          <p className="lp-section__sub">
            Quatro passos, do jeito que um colecionador faria.
          </p>
        </Reveal>
        <ol className="lp-how__list">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.06} className="lp-how__item">
              <span className="lp-how__num">{String(i + 1).padStart(2, "0")}</span>
              <span className="lp-how__icon">
                <step.icon size={22} strokeWidth={2} aria-hidden="true" />
              </span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ---------- Trust ---------- */}
      <section className="lp-trust" id="confianca">
        <div className="lp-trust__grid">
          <Reveal className="lp-trust__copy">
            <h2 className="lp-section__title">Confiança que dá pra ver</h2>
            <p className="lp-section__sub">
              Antes de combinar qualquer coisa, você vê a reputação de quem está
              do outro lado. Cada troca concluída vira uma avaliação em três
              critérios, e a média acompanha o perfil pra sempre.
            </p>
            <ul className="lp-trust__points">
              <li><ShieldCheck size={18} aria-hidden="true" /> Histórico de trocas concluídas</li>
              <li><Star size={18} aria-hidden="true" /> Notas de confiabilidade, comunicação e experiência</li>
              <li><MessagesSquare size={18} aria-hidden="true" /> Conversa privada antes de fechar</li>
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="lp-trust__card">
            <div className="lp-profilecard panel">
              <div className="lp-profilecard__head">
                <Avatar name="Beatriz Antunes" hue={305} size={56} />
                <div>
                  <strong>Beatriz Antunes</strong>
                  <span className="mono faint">@bia.holo</span>
                </div>
              </div>
              <div className="lp-profilecard__rating">
                <RatingStars value={4.9} size={18} showValue count={64} />
              </div>
              <div className="lp-profilecard__trades">
                <ShieldCheck size={16} aria-hidden="true" />
                <span><strong>88</strong> trocas concluídas</span>
              </div>
              <p className="lp-profilecard__quote">
                “Empacotou impecável e respondeu rápido. Troca lisa, recomendo demais.”
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Categories / rarity ---------- */}
      <section className="lp-cats" id="categorias">
        <Reveal>
          <h2 className="lp-section__title">De comum a lendária, em todo tipo de coleção</h2>
          <p className="lp-section__sub">
            A mesma linguagem de raridade vale para Pokémon, cartas esportivas,
            TCG, figurinhas e o que mais você colecionar.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="lp-cats__rail">
            {railCards.map((item) => (
              <div key={item.id} className="lp-cats__card" data-cardhover>
                <CardArt item={item} />
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="lp-rarity">
            {rarityShowcase.map((r) => (
              <RarityBadge key={r} rarity={r} />
            ))}
          </div>
        </Reveal>
      </section>

      {/* ---------- Final CTA ---------- */}
      <section className="lp-cta">
        <Reveal className="lp-cta__inner">
          <div className="lp-cta__glow" aria-hidden="true" />
          <h2>Comece sua vitrine hoje</h2>
          <p>
            Crie sua conta, cadastre as primeiras cartas e descubra quem já está
            procurando o que você tem pra trocar.
          </p>
          <div className="lp-cta__actions">
            <Button size="lg" onClick={goCreate} iconEnd={<ArrowRight size={19} />}>
              Criar conta grátis
            </Button>
            <button className="lp-cta__login" onClick={goLogin}>
              Já tenho conta
            </button>
          </div>
        </Reveal>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="lp-foot">
        <div className="lp-foot__inner">
          <div className="lp-foot__brand">
            <Logo size={28} />
            <p>A vitrine dos colecionadores. Encontre, exiba e troque com segurança.</p>
          </div>
          <nav className="lp-foot__cols" aria-label="Rodapé">
            <div>
              <h4>Produto</h4>
              <a href="#como-funciona">Como funciona</a>
              <a href="#confianca">Confiança</a>
              <a href="#categorias">Categorias</a>
            </div>
            <div>
              <h4>Comunidade</h4>
              <span className="faint">Pokémon</span>
              <span className="faint">Esportivas</span>
              <span className="faint">TCG e figurinhas</span>
            </div>
            <div>
              <h4>Conta</h4>
              <button onClick={goLogin}>Entrar</button>
              <button onClick={goCreate}>Criar conta</button>
            </div>
          </nav>
        </div>
        <div className="lp-foot__base">
          <span>CardLink</span>
          <span className="faint">Protótipo de validação · {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
}

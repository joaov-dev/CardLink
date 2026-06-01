import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Compass, MessagesSquare, Plus, User2, LogOut } from "lucide-react";
import { useStore } from "@/data/store";
import { Logo } from "./Logo";
import { Avatar } from "./Avatar";
import { RatingStars } from "./RatingStars";
import "./AppShell.css";

const navItems = [
  { to: "/", label: "Descobrir", icon: Compass, end: true },
  { to: "/mensagens", label: "Mensagens", icon: MessagesSquare, end: false },
  { to: "/adicionar", label: "Adicionar", icon: Plus, end: false, accent: true },
  { to: "/perfil", label: "Perfil", icon: User2, end: false },
];

export function AppShell() {
  const { currentUser, conversations, messages, dispatch } = useStore();
  const location = useLocation();

  // unread = conversations where the last message is from the other person
  const unread = currentUser
    ? conversations.filter((c) => {
        const msgs = messages
          .filter((m) => m.conversationId === c.id)
          .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
        const last = msgs[msgs.length - 1];
        return last && last.senderId !== currentUser.id;
      }).length
    : 0;

  return (
    <div className="shell">
      <aside className="shell__sidebar">
        <NavLink to="/" className="shell__brand" aria-label="CardLink, ir para Descobrir">
          <Logo size={30} />
        </NavLink>

        <nav className="shell__nav" aria-label="Navegação principal">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `shell__navlink ${item.accent ? "shell__navlink--accent" : ""} ${isActive ? "is-active" : ""}`
              }
            >
              <span className="shell__nalicon">
                <item.icon size={20} strokeWidth={2} aria-hidden="true" />
                {item.to === "/mensagens" && unread > 0 && (
                  <span className="shell__badge" aria-hidden="true">
                    {unread}
                  </span>
                )}
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {currentUser && (
          <div className="shell__foot">
            <NavLink to="/perfil" className="shell__me">
              <Avatar name={currentUser.name} hue={currentUser.avatarHue} size={38} />
              <span className="shell__me-text">
                <strong>{currentUser.name}</strong>
                <RatingStars value={currentUser.ratingAvg} size={11} />
              </span>
            </NavLink>
            <button
              className="shell__reset"
              onClick={() => dispatch({ type: "logout" })}
              title="Sair e voltar para a página inicial"
            >
              <LogOut size={16} aria-hidden="true" />
              <span>Sair</span>
            </button>
          </div>
        )}
      </aside>

      <main className="shell__main" key={location.pathname.split("/")[1] || "root"}>
        <Outlet />
      </main>

      <nav className="shell__tabbar" aria-label="Navegação principal">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `shell__tab ${item.accent ? "shell__tab--accent" : ""} ${isActive ? "is-active" : ""}`
            }
          >
            <span className="shell__taicon">
              <item.icon size={item.accent ? 24 : 22} strokeWidth={2} aria-hidden="true" />
              {item.to === "/mensagens" && unread > 0 && (
                <span className="shell__badge" aria-hidden="true">
                  {unread}
                </span>
              )}
            </span>
            <span className="shell__tablabel">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

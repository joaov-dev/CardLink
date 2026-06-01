import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Send, ChevronLeft, Handshake, Star, CheckCheck } from "lucide-react";
import { useStore, uid } from "@/data/store";
import { useToast } from "@/components/Toast";
import { Avatar } from "@/components/Avatar";
import { CardArt } from "@/components/CardArt";
import { RarityBadge } from "@/components/RarityBadge";
import { Button } from "@/components/Button";
import { RateUserModal } from "@/components/RateUserModal";
import { Modal } from "@/components/Modal";
import { clockTime, dayLabel } from "@/lib/format";
import type { Message } from "@/data/types";
import { NotFound } from "./NotFound";
import "./Conversation.css";

const statusLabel = { ativa: "Conversando", negociando: "Negociando", concluida: "Troca concluída" };

export function Conversation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const {
    currentUser,
    conversations,
    conversationMessages,
    getUser,
    getItem,
    dispatch,
  } = useStore();

  const [draft, setDraft] = useState("");
  const [rating, setRating] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const conv = conversations.find((c) => c.id === id);
  const messages = useMemo(
    () => (id ? conversationMessages(id) : []),
    [id, conversationMessages],
  );

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages.length]);

  if (!conv || !currentUser) return <NotFound />;

  const otherId = conv.participants.find((p) => p !== currentUser.id)!;
  const other = getUser(otherId);
  const aboutItem = conv.aboutItemId ? getItem(conv.aboutItemId) : undefined;
  if (!other) return <NotFound />;

  function send(e: React.FormEvent) {
    e.preventDefault();
    const body = draft.trim();
    if (!body || !conv) return;
    dispatch({
      type: "sendMessage",
      message: {
        id: uid("m"),
        conversationId: conv.id,
        senderId: currentUser!.id,
        body,
        createdAt: new Date().toISOString(),
      },
    });
    if (conv.status === "ativa") {
      dispatch({ type: "setConversationStatus", id: conv.id, status: "negociando" });
    }
    setDraft("");
  }

  function concludeTrade() {
    if (!conv) return;
    dispatch({ type: "setConversationStatus", id: conv.id, status: "concluida" });
    dispatch({
      type: "sendMessage",
      message: {
        id: uid("m"),
        conversationId: conv.id,
        senderId: currentUser!.id,
        body: "Troca concluída! Foi um ótimo negócio 🤝",
        createdAt: new Date().toISOString(),
      },
    });
    setConfirmClose(false);
    toast("Troca marcada como concluída");
    setTimeout(() => setRating(true), 400);
  }

  // group messages by day
  const groups: { day: string; items: Message[] }[] = [];
  for (const m of messages) {
    const day = dayLabel(m.createdAt);
    const g = groups[groups.length - 1];
    if (g && g.day === day) g.items.push(m);
    else groups.push({ day, items: [m] });
  }

  return (
    <div className="convo">
      <header className="convo__bar">
        <div className="convo__head">
          <button className="convo__back" onClick={() => navigate("/mensagens")} aria-label="Voltar para mensagens">
            <ChevronLeft size={22} aria-hidden="true" />
          </button>
          <Link to={`/u/${other.username}`} className="convo__peer">
            <Avatar name={other.name} hue={other.avatarHue} size={40} />
            <span className="convo__peer-meta">
              <strong>{other.name}</strong>
              <span className={`statuspill statuspill--${conv.status}`}>{statusLabel[conv.status]}</span>
            </span>
          </Link>
        </div>
        {conv.status !== "concluida" ? (
          <Button size="sm" variant="secondary" iconStart={<Handshake size={16} />} onClick={() => setConfirmClose(true)}>
            Concluir
          </Button>
        ) : (
          <Button size="sm" iconStart={<Star size={15} />} onClick={() => setRating(true)}>
            Avaliar
          </Button>
        )}
      </header>

      <div className="convo__scroll">
        <div className="convo__inner">
          {aboutItem && (
            <Link to={`/item/${aboutItem.id}`} className="convo__about">
              <span className="convo__about-art">
                <CardArt item={aboutItem} chrome={false} />
              </span>
              <span className="convo__about-text">
                <span className="faint">Negociando</span>
                <strong>{aboutItem.name}</strong>
                <RarityBadge rarity={aboutItem.rarity} size="sm" />
              </span>
            </Link>
          )}

          {groups.map((group) => (
            <div key={group.day} className="convo__group">
              <div className="convo__day"><span>{group.day}</span></div>
              {group.items.map((m) => {
                const mine = m.senderId === currentUser.id;
                const refItem = m.itemRefId ? getItem(m.itemRefId) : undefined;
                return (
                  <div key={m.id} className={`bubble ${mine ? "bubble--mine" : "bubble--them"}`}>
                    {refItem && (
                      <Link to={`/item/${refItem.id}`} className="bubble__ref">
                        <span className="bubble__ref-art">
                          <CardArt item={refItem} chrome={false} />
                        </span>
                        <span>
                          <strong>{refItem.name}</strong>
                          <span className="faint">{refItem.setCode}</span>
                        </span>
                      </Link>
                    )}
                    <p>{m.body}</p>
                    <span className="bubble__time">
                      {clockTime(m.createdAt)}
                      {mine && <CheckCheck size={13} aria-hidden="true" />}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}

          {conv.status === "concluida" && (
            <div className="convo__concluded">
              <Handshake size={18} aria-hidden="true" />
              <span>Troca concluída. Que tal avaliar {other.name.split(" ")[0]}?</span>
              <button onClick={() => setRating(true)}>Avaliar agora</button>
            </div>
          )}
          <div ref={endRef} />
        </div>
      </div>

      <form className="composer" onSubmit={send}>
        <div className="composer__inner">
          <input
            className="input composer__input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`Mensagem para ${other.name.split(" ")[0]}…`}
            aria-label="Escrever mensagem"
          />
          <button type="submit" className="composer__send" disabled={!draft.trim()} aria-label="Enviar">
            <Send size={19} aria-hidden="true" />
          </button>
        </div>
      </form>

      <RateUserModal open={rating} onClose={() => setRating(false)} target={other} />

      <Modal
        open={confirmClose}
        onClose={() => setConfirmClose(false)}
        title="Concluir troca?"
        footer={
          <>
            <Button variant="ghost" block onClick={() => setConfirmClose(false)}>Ainda não</Button>
            <Button block iconStart={<Handshake size={17} />} onClick={concludeTrade}>Concluir troca</Button>
          </>
        }
      >
        <p className="convo__confirm">
          Marque a troca com <strong>{other.name}</strong> como concluída quando vocês combinarem o
          envio. Em seguida você poderá avaliar a experiência.
        </p>
      </Modal>
    </div>
  );
}

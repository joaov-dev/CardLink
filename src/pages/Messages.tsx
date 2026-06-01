import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MessagesSquare, Compass } from "lucide-react";
import { useStore } from "@/data/store";
import { Page } from "@/components/Page";
import { PageHeader } from "@/components/PageHeader";
import { Avatar } from "@/components/Avatar";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/Button";
import { relativeTime } from "@/lib/format";
import "./Messages.css";

const statusLabel = { ativa: "Conversando", negociando: "Negociando", concluida: "Concluída" };

export function Messages() {
  const { currentUser, conversations, messages, getUser, getItem } = useStore();
  const navigate = useNavigate();

  const rows = useMemo(() => {
    if (!currentUser) return [];
    return conversations
      .filter((c) => c.participants.includes(currentUser.id))
      .map((c) => {
        const otherId = c.participants.find((p) => p !== currentUser.id)!;
        const msgs = messages
          .filter((m) => m.conversationId === c.id)
          .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
        const last = msgs[msgs.length - 1];
        return {
          conv: c,
          other: getUser(otherId),
          last,
          unread: last ? last.senderId !== currentUser.id : false,
          item: c.aboutItemId ? getItem(c.aboutItemId) : undefined,
        };
      })
      .sort((a, b) =>
        (b.last?.createdAt ?? "").localeCompare(a.last?.createdAt ?? ""),
      );
  }, [currentUser, conversations, messages, getUser, getItem]);

  return (
    <Page narrow>
      <PageHeader brand title="Mensagens" />
      <div className="msgs__intro">
        <h1>Mensagens</h1>
        <p className="muted">Suas conversas de troca, do primeiro oi à negociação fechada.</p>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={MessagesSquare}
          title="Nenhuma conversa ainda"
          description="Encontre um item que você quer e chame o dono para negociar. As conversas aparecem aqui."
          action={
            <Button iconStart={<Compass size={18} />} onClick={() => navigate("/")}>
              Descobrir itens
            </Button>
          }
        />
      ) : (
        <ul className="msgs__list">
          {rows.map(({ conv, other, last, unread, item }) =>
            other ? (
              <li key={conv.id}>
                <Link to={`/mensagens/${conv.id}`} className={`msgrow ${unread ? "is-unread" : ""}`}>
                  <Avatar name={other.name} hue={other.avatarHue} size={52} />
                  <div className="msgrow__main">
                    <div className="msgrow__top">
                      <strong>{other.name}</strong>
                      <span className="msgrow__time">{last ? relativeTime(last.createdAt) : ""}</span>
                    </div>
                    <div className="msgrow__bottom">
                      <p className="msgrow__preview">
                        {last?.senderId === currentUser?.id && <span className="msgrow__you">Você: </span>}
                        {last?.body ?? "Conversa iniciada"}
                      </p>
                      {unread && <span className="msgrow__dot" aria-label="Não lida" />}
                    </div>
                    <div className="msgrow__meta">
                      <span className={`statuspill statuspill--${conv.status}`}>
                        {statusLabel[conv.status]}
                      </span>
                      {item && <span className="msgrow__about">sobre {item.name}</span>}
                    </div>
                  </div>
                </Link>
              </li>
            ) : null,
          )}
        </ul>
      )}
    </Page>
  );
}

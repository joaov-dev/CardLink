import { useParams, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import {
  MessageSquarePlus,
  MapPin,
  ArrowLeftRight,
  ShieldCheck,
  Tag,
  Layers,
  Sparkles,
  Lock,
  Pencil,
} from "lucide-react";
import { useStore, uid } from "@/data/store";
import { useToast } from "@/components/Toast";
import { Page } from "@/components/Page";
import { PageHeader } from "@/components/PageHeader";
import { CardArt } from "@/components/CardArt";
import { RarityBadge } from "@/components/RarityBadge";
import { Avatar } from "@/components/Avatar";
import { RatingStars } from "@/components/RatingStars";
import { Button } from "@/components/Button";
import { ItemCard } from "@/components/ItemCard";
import { NotFound } from "./NotFound";
import { categoryConfig, conditionConfig, rarityConfig } from "@/lib/taxonomy";
import "./ItemDetail.css";

export function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const {
    getItem,
    getUser,
    currentUser,
    conversations,
    userItems,
    dispatch,
  } = useStore();
  const [starting, setStarting] = useState(false);

  const item = id ? getItem(id) : undefined;
  if (!item) return <NotFound />;

  const owner = getUser(item.ownerId);
  const isMine = currentUser?.id === item.ownerId;
  const ownerOtherItems =
    owner && !isMine
      ? userItems(owner.id)
          .filter((i) => i.id !== item.id && !i.wishlist && i.forTrade)
          .slice(0, 4)
      : [];

  function startConversation() {
    if (!currentUser || !owner) return;
    setStarting(true);
    const existing = conversations.find(
      (c) =>
        c.participants.includes(currentUser.id) &&
        c.participants.includes(owner.id),
    );
    if (existing) {
      navigate(`/mensagens/${existing.id}`);
      return;
    }
    const convId = uid("c");
    dispatch({
      type: "startConversation",
      conversation: {
        id: convId,
        participants: [currentUser.id, owner.id],
        status: "ativa",
        aboutItemId: item!.id,
        createdAt: new Date().toISOString(),
      },
      message: {
        id: uid("m"),
        conversationId: convId,
        senderId: currentUser.id,
        body: `Oi ${owner.name.split(" ")[0]}! Tenho interesse na sua "${item!.name}". Podemos conversar sobre uma troca?`,
        itemRefId: item!.id,
        createdAt: new Date().toISOString(),
      },
    });
    toast("Conversa iniciada com " + owner.name.split(" ")[0]);
    navigate(`/mensagens/${convId}`);
  }

  const r = rarityConfig[item.rarity];

  return (
    <Page narrow>
      <PageHeader back title={categoryConfig[item.category].short} />

      <div className="detail">
        <div className="detail__stage">
          <div
            className="detail__cardwrap"
            data-cardhover
            style={{ "--rarity": r.color } as React.CSSProperties}
          >
            <CardArt item={item} />
          </div>
        </div>

        <div className="detail__info">
          <div className="detail__badges">
            <RarityBadge rarity={item.rarity} />
            <span className="chip">{categoryConfig[item.category].short}</span>
            {item.forTrade ? (
              <span className="chip detail__tradechip">
                <ArrowLeftRight size={13} aria-hidden="true" /> Disponível para troca
              </span>
            ) : (
              <span className="chip">
                <Lock size={13} aria-hidden="true" /> Não disponível
              </span>
            )}
          </div>

          <h1 className="detail__name">{item.name}</h1>
          <p className="detail__set mono">{item.setCode}</p>

          <p className="detail__desc">{item.description}</p>

          <dl className="detail__specs">
            <div>
              <dt><Sparkles size={15} aria-hidden="true" /> Raridade</dt>
              <dd>{r.label}</dd>
            </div>
            <div>
              <dt><Tag size={15} aria-hidden="true" /> Categoria</dt>
              <dd>{categoryConfig[item.category].label}</dd>
            </div>
            <div>
              <dt><Layers size={15} aria-hidden="true" /> Condição</dt>
              <dd title={conditionConfig[item.condition].full}>
                {conditionConfig[item.condition].full}
              </dd>
            </div>
          </dl>

          {/* owner / trust panel */}
          {owner && (
            <div className="detail__owner panel">
              <Link to={isMine ? "/perfil" : `/u/${owner.username}`} className="detail__owner-id">
                <Avatar name={owner.name} hue={owner.avatarHue} size={48} />
                <span className="detail__owner-text">
                  <strong>{owner.name}</strong>
                  <span className="detail__owner-loc muted">
                    <MapPin size={12} aria-hidden="true" /> {owner.location}
                  </span>
                </span>
              </Link>
              <div className="detail__owner-trust">
                <RatingStars value={owner.ratingAvg} size={15} showValue count={owner.ratingCount} />
                <span className="detail__owner-trades">
                  <ShieldCheck size={14} aria-hidden="true" /> {owner.tradesCount} trocas concluídas
                </span>
              </div>
            </div>
          )}

          {/* actions */}
          <div className="detail__actions">
            {isMine ? (
              <>
                <Button
                  variant="secondary"
                  block
                  iconStart={<Pencil size={17} />}
                  onClick={() =>
                    dispatch({
                      type: "updateItem",
                      id: item.id,
                      patch: { forTrade: !item.forTrade },
                    })
                  }
                >
                  {item.forTrade ? "Remover da troca" : "Disponibilizar para troca"}
                </Button>
                <p className="detail__mine-note muted">
                  Este item é seu. Gerencie a disponibilidade para troca acima.
                </p>
              </>
            ) : (
              <>
                <Button
                  block
                  size="lg"
                  loading={starting}
                  iconStart={<MessageSquarePlus size={19} />}
                  onClick={startConversation}
                >
                  Conversar sobre troca
                </Button>
                <Button
                  variant="secondary"
                  block
                  onClick={() => navigate(`/u/${owner?.username}`)}
                >
                  Ver perfil de {owner?.name.split(" ")[0]}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {ownerOtherItems.length > 0 && owner && (
        <section className="section detail__more">
          <div className="section__head">
            <h2>Mais de {owner.name.split(" ")[0]}</h2>
            <Link to={`/u/${owner.username}`} className="section__link">
              Ver coleção
            </Link>
          </div>
          <div className="itemgrid">
            {ownerOtherItems.map((i) => (
              <ItemCard key={i.id} item={i} showOwner={false} />
            ))}
          </div>
        </section>
      )}
    </Page>
  );
}

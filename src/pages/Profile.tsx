import { useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  MapPin,
  CalendarDays,
  ShieldCheck,
  Pencil,
  Plus,
  MessageSquarePlus,
  Star,
  Search,
  PackageOpen,
  Inbox,
  ArrowLeftRight,
  LogOut,
} from "lucide-react";
import { useStore, uid } from "@/data/store";
import { useToast } from "@/components/Toast";
import { Page } from "@/components/Page";
import { PageHeader } from "@/components/PageHeader";
import { Avatar } from "@/components/Avatar";
import { RatingStars } from "@/components/RatingStars";
import { Button } from "@/components/Button";
import { ItemCard } from "@/components/ItemCard";
import { CardArt } from "@/components/CardArt";
import { EmptyState } from "@/components/EmptyState";
import { Modal } from "@/components/Modal";
import { RateUserModal } from "@/components/RateUserModal";
import { RarityBadge } from "@/components/RarityBadge";
import { monthYear, relativeTime } from "@/lib/format";
import { NotFound } from "./NotFound";
import "./Profile.css";

type Tab = "colecao" | "procura" | "avaliacoes";

export function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const {
    currentUser,
    users,
    userItems,
    userRatings,
    getUser,
    conversations,
    dispatch,
  } = useStore();

  const profileUser = username
    ? users.find((u) => u.username === username)
    : currentUser;

  const [tab, setTab] = useState<Tab>("colecao");
  const [editing, setEditing] = useState(false);
  const [rating, setRating] = useState(false);

  const isMine = !!currentUser && profileUser?.id === currentUser.id;

  const collection = useMemo(
    () => (profileUser ? userItems(profileUser.id).filter((i) => !i.wishlist) : []),
    [profileUser, userItems],
  );
  const wishlist = useMemo(
    () => (profileUser ? userItems(profileUser.id).filter((i) => i.wishlist) : []),
    [profileUser, userItems],
  );
  const reviews = useMemo(
    () => (profileUser ? userRatings(profileUser.id) : []),
    [profileUser, userRatings],
  );

  if (!profileUser) return <NotFound />;

  const forTradeCount = collection.filter((i) => i.forTrade).length;

  const concludedWith =
    !isMine &&
    currentUser &&
    conversations.some(
      (c) =>
        c.status === "concluida" &&
        c.participants.includes(currentUser.id) &&
        c.participants.includes(profileUser.id),
    );

  function message() {
    if (!currentUser || !profileUser || isMine) return;
    const existing = conversations.find(
      (c) =>
        c.participants.includes(currentUser.id) &&
        c.participants.includes(profileUser.id),
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
        participants: [currentUser.id, profileUser.id],
        status: "ativa",
        createdAt: new Date().toISOString(),
      },
      message: {
        id: uid("m"),
        conversationId: convId,
        senderId: currentUser.id,
        body: `Oi ${profileUser.name.split(" ")[0]}! Vi seu perfil e queria trocar uma ideia sobre a coleção.`,
        createdAt: new Date().toISOString(),
      },
    });
    toast("Conversa iniciada com " + profileUser.name.split(" ")[0]);
    navigate(`/mensagens/${convId}`);
  }

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "colecao", label: "Coleção", count: collection.length },
    { id: "procura", label: "Procura", count: wishlist.length },
    { id: "avaliacoes", label: "Avaliações", count: reviews.length },
  ];

  return (
    <Page>
      <PageHeader
        back={!isMine}
        brand={isMine}
        title={isMine ? undefined : profileUser.name}
      />

      {/* header */}
      <header className="profile__head">
        <span className="profile__banner" style={{ "--hue": profileUser.avatarHue } as React.CSSProperties} />
        <div className="profile__id">
          <Avatar name={profileUser.name} hue={profileUser.avatarHue} size={92} className="profile__avatar" />
          <div className="profile__namewrap">
            <h1 className="profile__name">{profileUser.name}</h1>
            <span className="profile__handle mono">@{profileUser.username}</span>
          </div>
        </div>

        <p className="profile__bio">{profileUser.bio}</p>

        <div className="profile__facts">
          <span><MapPin size={14} aria-hidden="true" /> {profileUser.location}</span>
          <span><CalendarDays size={14} aria-hidden="true" /> Entrou em {monthYear(profileUser.joinedAt)}</span>
        </div>

        <div className="profile__trust">
          <div className="profile__trust-rating">
            <RatingStars value={profileUser.ratingAvg} size={18} showValue count={profileUser.ratingCount} />
          </div>
          <div className="profile__trust-trades">
            <ShieldCheck size={16} aria-hidden="true" />
            <span><strong>{profileUser.tradesCount}</strong> trocas concluídas</span>
          </div>
        </div>

        <div className="profile__actions">
          {isMine ? (
            <>
              <Button variant="secondary" iconStart={<Pencil size={17} />} onClick={() => setEditing(true)}>
                Editar perfil
              </Button>
              <Button iconStart={<Plus size={18} />} onClick={() => navigate("/adicionar")}>
                Adicionar item
              </Button>
            </>
          ) : (
            <>
              <Button iconStart={<MessageSquarePlus size={18} />} onClick={message}>
                Conversar
              </Button>
              <Button
                variant="secondary"
                iconStart={<Star size={17} />}
                onClick={() => setRating(true)}
                disabled={!concludedWith}
                title={concludedWith ? undefined : "Disponível após concluir uma troca"}
              >
                Avaliar
              </Button>
            </>
          )}
        </div>

        {isMine && (
          <button
            className="profile__logout"
            onClick={() => dispatch({ type: "logout" })}
          >
            <LogOut size={15} aria-hidden="true" />
            Sair da conta
          </button>
        )}
      </header>

      {/* tabs */}
      <div className="profile__tabs" role="tablist" aria-label="Conteúdo do perfil">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={`profile__tab ${tab === t.id ? "is-active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
            <span className="profile__tabcount">{t.count}</span>
          </button>
        ))}
      </div>

      {/* tab panels */}
      <div className="profile__panel" role="tabpanel">
        {tab === "colecao" &&
          (collection.length === 0 ? (
            <EmptyState
              icon={PackageOpen}
              title={isMine ? "Sua coleção está vazia" : "Coleção vazia"}
              description={
                isMine
                  ? "Adicione suas cartas e figurinhas para exibir na vitrine e disponibilizar para troca."
                  : "Este colecionador ainda não cadastrou itens."
              }
              action={
                isMine && (
                  <Button iconStart={<Plus size={18} />} onClick={() => navigate("/adicionar")}>
                    Adicionar primeiro item
                  </Button>
                )
              }
            />
          ) : (
            <>
              {forTradeCount > 0 && (
                <p className="profile__tradeline">
                  <ArrowLeftRight size={14} aria-hidden="true" />
                  {forTradeCount} {forTradeCount === 1 ? "item disponível" : "itens disponíveis"} para troca
                </p>
              )}
              <div className="itemgrid">
                {collection.map((item) => (
                  <ItemCard key={item.id} item={item} showOwner={false} />
                ))}
              </div>
            </>
          ))}

        {tab === "procura" &&
          (wishlist.length === 0 ? (
            <EmptyState
              icon={Search}
              title={isMine ? "Você não tem itens na lista de procura" : "Nada na lista de procura"}
              description={
                isMine
                  ? "Marque os itens que faltam na sua coleção para que outros colecionadores saibam o que oferecer."
                  : "Este colecionador não listou itens procurados."
              }
            />
          ) : (
            <div className="itemgrid">
              {wishlist.map((item) => (
                <Link key={item.id} to={`/item/${item.id}`} className="profile__wish" data-cardhover>
                  <span className="profile__wish-art">
                    <CardArt item={item} />
                    <span className="profile__wish-flag">
                      <Search size={11} strokeWidth={2.5} aria-hidden="true" /> Procura
                    </span>
                  </span>
                  <span className="profile__wish-name">{item.name}</span>
                  <RarityBadge rarity={item.rarity} size="sm" />
                </Link>
              ))}
            </div>
          ))}

        {tab === "avaliacoes" &&
          (reviews.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="Sem avaliações ainda"
              description={
                isMine
                  ? "Conclua trocas para receber avaliações de confiabilidade, comunicação e experiência."
                  : "Este colecionador ainda não recebeu avaliações."
              }
            />
          ) : (
            <ul className="reviews">
              {reviews.map((rev) => {
                const author = getUser(rev.fromUserId);
                const avg = (rev.confiabilidade + rev.comunicacao + rev.experiencia) / 3;
                return (
                  <li key={rev.id} className="review panel">
                    <div className="review__top">
                      <Link
                        to={author?.id === currentUser?.id ? "/perfil" : `/u/${author?.username}`}
                        className="review__author"
                      >
                        {author && <Avatar name={author.name} hue={author.avatarHue} size={36} />}
                        <span>
                          <strong>{author?.name}</strong>
                          <span className="faint">{relativeTime(rev.createdAt)}</span>
                        </span>
                      </Link>
                      <RatingStars value={avg} size={14} />
                    </div>
                    {rev.comment && <p className="review__comment">{rev.comment}</p>}
                    <div className="review__criteria">
                      <span><em>Confiabilidade</em> {rev.confiabilidade}/5</span>
                      <span><em>Comunicação</em> {rev.comunicacao}/5</span>
                      <span><em>Experiência</em> {rev.experiencia}/5</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          ))}
      </div>

      {isMine && (
        <EditProfileModal open={editing} onClose={() => setEditing(false)} />
      )}
      {!isMine && (
        <RateUserModal open={rating} onClose={() => setRating(false)} target={profileUser} />
      )}
    </Page>
  );
}

function EditProfileModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { currentUser, dispatch } = useStore();
  const toast = useToast();
  const [name, setName] = useState(currentUser?.name ?? "");
  const [bio, setBio] = useState(currentUser?.bio ?? "");
  const [location, setLocation] = useState(currentUser?.location ?? "");

  function save() {
    dispatch({ type: "updateProfile", patch: { name: name.trim(), bio: bio.trim(), location: location.trim() } });
    toast("Perfil atualizado");
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Editar perfil"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} block>Cancelar</Button>
          <Button onClick={save} disabled={!name.trim()} block>Salvar alterações</Button>
        </>
      }
    >
      <div className="editform">
        <div className="field">
          <label className="field__label" htmlFor="ep-name">Nome</label>
          <input id="ep-name" className="input" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} />
        </div>
        <div className="field">
          <label className="field__label" htmlFor="ep-loc">Localização</label>
          <input id="ep-loc" className="input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Cidade, UF" maxLength={48} />
        </div>
        <div className="field">
          <label className="field__label" htmlFor="ep-bio">Descrição</label>
          <textarea id="ep-bio" className="textarea" value={bio} onChange={(e) => setBio(e.target.value)} maxLength={200} placeholder="Conte o que você coleciona e como gosta de negociar." />
          <span className="field__hint">{bio.length}/200</span>
        </div>
      </div>
    </Modal>
  );
}

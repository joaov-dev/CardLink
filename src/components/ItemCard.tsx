import { Link } from "react-router-dom";
import { ArrowLeftRight } from "lucide-react";
import type { Item } from "@/data/types";
import { useStore } from "@/data/store";
import { categoryConfig } from "@/lib/taxonomy";
import { CardArt } from "./CardArt";
import { RarityBadge } from "./RarityBadge";
import { Avatar } from "./Avatar";
import "./ItemCard.css";

interface Props {
  item: Item;
  showOwner?: boolean;
}

export function ItemCard({ item, showOwner = true }: Props) {
  const { getUser } = useStore();
  const owner = getUser(item.ownerId);

  return (
    <Link to={`/item/${item.id}`} className="itemcard" data-cardhover>
      <span className="itemcard__art">
        <CardArt item={item} />
        {item.forTrade && (
          <span className="itemcard__trade" title="Disponível para troca">
            <ArrowLeftRight size={12} strokeWidth={2.5} aria-hidden="true" />
            Troca
          </span>
        )}
      </span>
      <span className="itemcard__body">
        <span className="itemcard__top">
          <span className="itemcard__name">{item.name}</span>
          <span className="itemcard__cat">{categoryConfig[item.category].short}</span>
        </span>
        <span className="itemcard__meta">
          <RarityBadge rarity={item.rarity} size="sm" />
          {showOwner && owner && (
            <span className="itemcard__owner">
              <Avatar name={owner.name} hue={owner.avatarHue} size={20} />
              <span>{owner.username}</span>
            </span>
          )}
        </span>
      </span>
    </Link>
  );
}

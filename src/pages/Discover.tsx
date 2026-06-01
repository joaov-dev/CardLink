import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal, X, SearchX, ArrowLeftRight } from "lucide-react";
import { useStore } from "@/data/store";
import { Page } from "@/components/Page";
import { PageHeader } from "@/components/PageHeader";
import { ItemCard } from "@/components/ItemCard";
import { CardArt } from "@/components/CardArt";
import { RarityBadge } from "@/components/RarityBadge";
import { CardSkeleton } from "@/components/Skeleton";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/Button";
import {
  categoryConfig,
  categoryOrder,
  rarityConfig,
  rarityOrder,
} from "@/lib/taxonomy";
import type { Category, Rarity } from "@/data/types";
import "./Discover.css";

type Sort = "recentes" | "raridade" | "nome";

export function Discover() {
  const { items, getUser } = useStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "todas">("todas");
  const [rarity, setRarity] = useState<Rarity | "todas">("todas");
  const [tradeOnly, setTradeOnly] = useState(false);
  const [sort, setSort] = useState<Sort>("recentes");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 360);
    return () => clearTimeout(t);
  }, []);

  const pool = useMemo(() => items.filter((i) => !i.wishlist), [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = pool.filter((i) => {
      if (category !== "todas" && i.category !== category) return false;
      if (rarity !== "todas" && i.rarity !== rarity) return false;
      if (tradeOnly && !i.forTrade) return false;
      if (q) {
        const owner = getUser(i.ownerId);
        const hay = `${i.name} ${categoryConfig[i.category].label} ${i.setCode} ${owner?.username ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sort === "nome") return a.name.localeCompare(b.name);
      if (sort === "raridade")
        return rarityConfig[b.rarity].order - rarityConfig[a.rarity].order;
      return b.createdAt.localeCompare(a.createdAt);
    });
    return list;
  }, [pool, query, category, rarity, tradeOnly, sort, getUser]);

  const featured = useMemo(
    () =>
      pool
        .filter((i) => i.forTrade && rarityConfig[i.rarity].order >= 3)
        .sort((a, b) => rarityConfig[b.rarity].order - rarityConfig[a.rarity].order)
        .slice(0, 6),
    [pool],
  );

  const hasActiveFilters =
    query !== "" || category !== "todas" || rarity !== "todas" || tradeOnly;

  const clearAll = () => {
    setQuery("");
    setCategory("todas");
    setRarity("todas");
    setTradeOnly(false);
  };

  return (
    <Page>
      <PageHeader brand />

      <div className="discover__intro">
        <h1>Descubra itens na vitrine</h1>
        <p>
          {pool.length} itens de {new Set(pool.map((i) => i.ownerId)).size}{" "}
          colecionadores. Busque o que falta na sua coleção.
        </p>
      </div>

      {/* search + filters */}
      <div className="discover__controls">
        <div className="input-icon discover__search">
          <Search size={18} aria-hidden="true" />
          <input
            className="input"
            type="search"
            placeholder="Buscar por nome, categoria ou colecionador"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Buscar itens"
          />
        </div>
        <button
          className={`discover__filterbtn ${showFilters ? "is-open" : ""}`}
          onClick={() => setShowFilters((s) => !s)}
          aria-expanded={showFilters}
        >
          <SlidersHorizontal size={18} aria-hidden="true" />
          <span>Filtros</span>
          {hasActiveFilters && <span className="discover__dot" aria-hidden="true" />}
        </button>
      </div>

      <div className="discover__cats" role="tablist" aria-label="Categorias">
        <button
          role="tab"
          aria-selected={category === "todas"}
          className={`discover__cat ${category === "todas" ? "is-active" : ""}`}
          onClick={() => setCategory("todas")}
        >
          Todas
        </button>
        {categoryOrder.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={category === c}
            className={`discover__cat ${category === c ? "is-active" : ""}`}
            onClick={() => setCategory(c)}
          >
            {categoryConfig[c].short}
          </button>
        ))}
      </div>

      {showFilters && (
        <div className="discover__panel panel">
          <div className="field discover__panelfield">
            <label className="field__label" htmlFor="f-rarity">
              Raridade
            </label>
            <select
              id="f-rarity"
              className="select"
              value={rarity}
              onChange={(e) => setRarity(e.target.value as Rarity | "todas")}
            >
              <option value="todas">Todas as raridades</option>
              {rarityOrder.map((r) => (
                <option key={r} value={r}>
                  {rarityConfig[r].label}
                </option>
              ))}
            </select>
          </div>
          <div className="field discover__panelfield">
            <label className="field__label" htmlFor="f-sort">
              Ordenar por
            </label>
            <select
              id="f-sort"
              className="select"
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
            >
              <option value="recentes">Mais recentes</option>
              <option value="raridade">Raridade</option>
              <option value="nome">Nome (A–Z)</option>
            </select>
          </div>
          <label className="discover__toggle">
            <input
              type="checkbox"
              checked={tradeOnly}
              onChange={(e) => setTradeOnly(e.target.checked)}
            />
            <span className="discover__switch" aria-hidden="true" />
            <span>Apenas disponíveis para troca</span>
          </label>
        </div>
      )}

      {/* featured carousel — only on the clean default view */}
      {!hasActiveFilters && !loading && featured.length > 0 && (
        <section className="discover__featured">
          <div className="section__head">
            <h2>Em destaque</h2>
            <span className="muted discover__featured-note">
              raros disponíveis para troca
            </span>
          </div>
          <div className="discover__rail">
            {featured.map((item) => {
              const owner = getUser(item.ownerId);
              return (
                <Link key={item.id} to={`/item/${item.id}`} className="discover__feat" data-cardhover>
                  <span className="discover__feat-art">
                    <CardArt item={item} />
                  </span>
                  <span className="discover__feat-info">
                    <strong>{item.name}</strong>
                    <RarityBadge rarity={item.rarity} size="sm" />
                    <span className="discover__feat-owner muted">por {owner?.username}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* results */}
      <section className="section">
        <div className="section__head">
          <h2>{hasActiveFilters ? "Resultados" : "Todos os itens"}</h2>
          {!loading && (
            <span className="muted discover__count" aria-live="polite">
              {filtered.length} {filtered.length === 1 ? "item" : "itens"}
              {hasActiveFilters && (
                <button className="discover__clear" onClick={clearAll}>
                  <X size={13} aria-hidden="true" /> limpar
                </button>
              )}
            </span>
          )}
        </div>

        {loading ? (
          <div className="itemgrid">
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="Nenhum item encontrado"
            description="Tente outra busca, troque a categoria ou limpe os filtros para ver tudo de novo."
            action={
              <Button variant="secondary" onClick={clearAll} iconStart={<X size={16} />}>
                Limpar filtros
              </Button>
            }
          />
        ) : (
          <div className="itemgrid itemgrid--rows">
            {filtered.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {!loading && !hasActiveFilters && (
        <p className="discover__hint">
          <ArrowLeftRight size={14} aria-hidden="true" />
          Itens com o selo <strong>Troca</strong> estão disponíveis para negociar.
        </p>
      )}
    </Page>
  );
}

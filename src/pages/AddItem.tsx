import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shuffle, Check, Sparkles } from "lucide-react";
import { useStore, uid } from "@/data/store";
import { useToast } from "@/components/Toast";
import { Page } from "@/components/Page";
import { PageHeader } from "@/components/PageHeader";
import { CardArt } from "@/components/CardArt";
import { Button } from "@/components/Button";
import {
  categoryConfig,
  categoryOrder,
  rarityConfig,
  rarityOrder,
  conditionConfig,
} from "@/lib/taxonomy";
import type { Category, Rarity, Condition, Item } from "@/data/types";
import "./AddItem.css";

const conditionOrder: Condition[] = ["nm", "sp", "mp", "hp", "dmg"];

export function AddItem() {
  const navigate = useNavigate();
  const toast = useToast();
  const { currentUser, dispatch } = useStore();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("pokemon");
  const [rarity, setRarity] = useState<Rarity>("rara");
  const [condition, setCondition] = useState<Condition>("nm");
  const [setCode, setSetCode] = useState("");
  const [description, setDescription] = useState("");
  const [forTrade, setForTrade] = useState(true);
  const [intent, setIntent] = useState<"colecao" | "procura">("colecao");
  const [artHue, setArtHue] = useState(() => Math.floor(Math.random() * 360));
  const [artSeed, setArtSeed] = useState(() => Math.floor(Math.random() * 99) + 1);
  const [touched, setTouched] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!currentUser) return null;

  const nameError = touched && name.trim().length < 2 ? "Dê um nome ao item." : "";

  const preview: Item = {
    id: "preview",
    ownerId: currentUser.id,
    name: name.trim() || "Nome do item",
    category,
    rarity,
    description,
    setCode: setCode.trim() || "SET · 000",
    condition,
    artHue,
    artSeed,
    forTrade,
    wishlist: intent === "procura",
    createdAt: new Date().toISOString(),
  };

  function shuffleArt() {
    setArtHue(Math.floor(Math.random() * 360));
    setArtSeed(Math.floor(Math.random() * 99) + 1);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (name.trim().length < 2) return;
    setSaving(true);
    const id = uid("i");
    dispatch({
      type: "addItem",
      item: {
        id,
        ownerId: currentUser!.id,
        name: name.trim(),
        category,
        rarity,
        description: description.trim() || "Sem descrição.",
        setCode: setCode.trim() || "—",
        condition,
        artHue,
        artSeed,
        forTrade: intent === "procura" ? false : forTrade,
        wishlist: intent === "procura",
        createdAt: new Date().toISOString(),
      },
    });
    toast(
      intent === "procura"
        ? "Adicionado à sua lista de procura"
        : "Item adicionado à sua coleção",
    );
    navigate(intent === "procura" ? "/perfil" : `/item/${id}`);
  }

  return (
    <Page narrow>
      <PageHeader back title="Adicionar item" />

      <div className="additem">
        {/* live preview */}
        <aside className="additem__preview">
          <div className="additem__previewcard" data-cardhover>
            <CardArt item={preview} />
          </div>
          <button type="button" className="additem__shuffle" onClick={shuffleArt}>
            <Shuffle size={15} aria-hidden="true" /> Trocar arte
          </button>
          <p className="additem__previewnote">
            <Sparkles size={13} aria-hidden="true" />
            Pré-visualização ao vivo da sua carta
          </p>
        </aside>

        {/* form */}
        <form className="additem__form" onSubmit={submit} noValidate>
          <div className="additem__intent" role="radiogroup" aria-label="Adicionar como">
            <button
              type="button"
              role="radio"
              aria-checked={intent === "colecao"}
              className={`additem__intentbtn ${intent === "colecao" ? "is-active" : ""}`}
              onClick={() => setIntent("colecao")}
            >
              <strong>Na minha coleção</strong>
              <span>um item que eu tenho</span>
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={intent === "procura"}
              className={`additem__intentbtn ${intent === "procura" ? "is-active" : ""}`}
              onClick={() => setIntent("procura")}
            >
              <strong>Estou procurando</strong>
              <span>um item que eu quero</span>
            </button>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="ai-name">Nome do item</label>
            <input
              id="ai-name"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched(true)}
              aria-invalid={!!nameError}
              placeholder="Ex: Charizard Holo, Rookie Prizm…"
              maxLength={48}
            />
            {nameError && <span className="field__error">{nameError}</span>}
          </div>

          <div className="additem__row">
            <div className="field">
              <label className="field__label" htmlFor="ai-cat">Categoria</label>
              <select id="ai-cat" className="select" value={category} onChange={(e) => setCategory(e.target.value as Category)}>
                {categoryOrder.map((c) => (
                  <option key={c} value={c}>{categoryConfig[c].label}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="field__label" htmlFor="ai-rar">Raridade</label>
              <select id="ai-rar" className="select" value={rarity} onChange={(e) => setRarity(e.target.value as Rarity)}>
                {rarityOrder.map((r) => (
                  <option key={r} value={r}>{rarityConfig[r].label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="additem__row">
            <div className="field">
              <label className="field__label" htmlFor="ai-cond">Condição</label>
              <select id="ai-cond" className="select" value={condition} onChange={(e) => setCondition(e.target.value as Condition)}>
                {conditionOrder.map((c) => (
                  <option key={c} value={c}>{conditionConfig[c].full}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="field__label" htmlFor="ai-set">
                Código / edição <span className="faint">(opcional)</span>
              </label>
              <input id="ai-set" className="input mono" value={setCode} onChange={(e) => setSetCode(e.target.value)} placeholder="BS · 004/102" maxLength={24} />
            </div>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="ai-desc">
              Descrição <span className="faint">(opcional)</span>
            </label>
            <textarea
              id="ai-desc"
              className="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Estado dos cantos, brilho do holo, detalhes que ajudam na troca…"
              maxLength={240}
            />
            <span className="field__hint">{description.length}/240</span>
          </div>

          {intent === "colecao" && (
            <label className="additem__trade">
              <input type="checkbox" checked={forTrade} onChange={(e) => setForTrade(e.target.checked)} />
              <span className="additem__switch" aria-hidden="true" />
              <span className="additem__tradetext">
                <strong>Disponível para troca</strong>
                <span className="faint">Outros colecionadores poderão te chamar para negociar.</span>
              </span>
            </label>
          )}

          <Button type="submit" size="lg" block loading={saving} iconStart={<Check size={19} />}>
            {intent === "procura" ? "Adicionar à procura" : "Adicionar à coleção"}
          </Button>
        </form>
      </div>
    </Page>
  );
}

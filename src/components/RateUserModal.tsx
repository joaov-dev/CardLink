import { useState } from "react";
import { useStore, uid } from "@/data/store";
import { useToast } from "./Toast";
import { Modal } from "./Modal";
import { StarInput } from "./StarInput";
import { Button } from "./Button";
import { Avatar } from "./Avatar";
import type { User } from "@/data/types";
import "./RateUserModal.css";

interface Props {
  open: boolean;
  onClose: () => void;
  target: User;
}

export function RateUserModal({ open, onClose, target }: Props) {
  const { currentUser, dispatch } = useStore();
  const toast = useToast();
  const [conf, setConf] = useState(0);
  const [com, setCom] = useState(0);
  const [exp, setExp] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const ready = conf > 0 && com > 0 && exp > 0;

  function submit() {
    if (!currentUser || !ready) return;
    setSubmitting(true);
    dispatch({
      type: "addRating",
      rating: {
        id: uid("r"),
        fromUserId: currentUser.id,
        toUserId: target.id,
        confiabilidade: conf,
        comunicacao: com,
        experiencia: exp,
        comment: comment.trim(),
        createdAt: new Date().toISOString(),
      },
    });
    toast(`Avaliação de ${target.name.split(" ")[0]} enviada`);
    onClose();
    // reset for next time
    setTimeout(() => {
      setConf(0);
      setCom(0);
      setExp(0);
      setComment("");
      setSubmitting(false);
    }, 300);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Avaliar ${target.name.split(" ")[0]}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} block>
            Cancelar
          </Button>
          <Button onClick={submit} loading={submitting} disabled={!ready} block>
            Enviar avaliação
          </Button>
        </>
      }
    >
      <div className="rate__head">
        <Avatar name={target.name} hue={target.avatarHue} size={44} />
        <div>
          <strong>{target.name}</strong>
          <p className="muted">Como foi negociar com {target.name.split(" ")[0]}?</p>
        </div>
      </div>

      <div className="rate__criteria">
        <StarInput
          label="Confiabilidade"
          hint="cumpriu o combinado?"
          value={conf}
          onChange={setConf}
        />
        <StarInput
          label="Comunicação"
          hint="respondeu bem e a tempo?"
          value={com}
          onChange={setCom}
        />
        <StarInput
          label="Experiência geral"
          hint="recomendaria a troca?"
          value={exp}
          onChange={setExp}
        />
      </div>

      <div className="field rate__comment">
        <label className="field__label" htmlFor="rate-comment">
          Comentário <span className="faint">(opcional)</span>
        </label>
        <textarea
          id="rate-comment"
          className="textarea"
          placeholder="Conte como foi o empacotamento, o prazo, a condição da carta…"
          value={comment}
          maxLength={280}
          onChange={(e) => setComment(e.target.value)}
        />
        <span className="field__hint">{comment.length}/280</span>
      </div>
    </Modal>
  );
}

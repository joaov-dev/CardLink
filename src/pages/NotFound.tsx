import { useNavigate } from "react-router-dom";
import { Compass, SearchX } from "lucide-react";
import { Page } from "@/components/Page";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/Button";

export function NotFound() {
  const navigate = useNavigate();
  return (
    <Page>
      <div style={{ minHeight: "60dvh", display: "grid", placeItems: "center" }}>
        <EmptyState
          icon={SearchX}
          title="Não encontramos esta página"
          description="O item ou a página que você procura pode ter saído da vitrine. Volte para Descobrir e continue explorando."
          action={
            <Button iconStart={<Compass size={18} />} onClick={() => navigate("/")}>
              Voltar para Descobrir
            </Button>
          }
        />
      </div>
    </Page>
  );
}

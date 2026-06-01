import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Logo } from "./Logo";

interface Props {
  title?: string;
  subtitle?: string;
  back?: boolean;
  /** show the brand wordmark instead of a title (top-level pages on mobile) */
  brand?: boolean;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, back, brand, actions }: Props) {
  const navigate = useNavigate();
  return (
    <header className={`pagehead ${brand ? "pagehead--brand" : ""}`}>
      <div className="pagehead__lead">
        {back && (
          <button
            className="pagehead__back"
            onClick={() => navigate(-1)}
            aria-label="Voltar"
          >
            <ChevronLeft size={22} aria-hidden="true" />
          </button>
        )}
        {brand ? (
          <Logo size={26} />
        ) : (
          <div className="pagehead__titles">
            <h1 className="pagehead__title">{title}</h1>
            {subtitle && <p className="pagehead__sub">{subtitle}</p>}
          </div>
        )}
      </div>
      {actions && <div className="pagehead__actions">{actions}</div>}
    </header>
  );
}

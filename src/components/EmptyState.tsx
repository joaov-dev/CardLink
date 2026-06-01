import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import "./EmptyState.css";

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="emptystate">
      <span className="emptystate__icon">
        <Icon size={26} strokeWidth={1.75} aria-hidden="true" />
      </span>
      <h3 className="emptystate__title">{title}</h3>
      <p className="emptystate__desc">{description}</p>
      {action && <div className="emptystate__action">{action}</div>}
    </div>
  );
}

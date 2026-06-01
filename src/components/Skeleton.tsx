import "./Skeleton.css";

export function Skeleton({
  width,
  height,
  radius = "var(--r-sm)",
  className,
}: {
  width?: string | number;
  height?: string | number;
  radius?: string;
  className?: string;
}) {
  return (
    <span
      className={`skeleton ${className ?? ""}`}
      style={{ width, height, borderRadius: radius }}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="cardskeleton" aria-hidden="true">
      <Skeleton height={0} radius="16px" className="cardskeleton__art" />
      <Skeleton width="80%" height={14} />
      <Skeleton width="55%" height={12} />
    </div>
  );
}

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
};

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref
}: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-ink-800/10 bg-white p-4 text-sm text-ink-800">
      <div className="text-sm font-semibold text-ink-950">{title}</div>
      <p className="mt-1 text-sm text-ink-800/80">{description}</p>
      {actionLabel && actionHref ? (
        <a
          className="mt-3 inline-flex rounded-full border border-ink-800/20 px-3 py-1 text-xs"
          href={actionHref}
        >
          {actionLabel}
        </a>
      ) : null}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="expenses-card">
      <div className="skeleton-stack">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="skeleton-bar" />
        ))}
      </div>
    </div>
  );
}

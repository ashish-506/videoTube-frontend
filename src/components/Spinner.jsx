export default function Spinner({ size = 24 }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="inline-block animate-spin rounded-full border-2 border-border border-t-gold"
      style={{ width: size, height: size }}
    />
  );
}

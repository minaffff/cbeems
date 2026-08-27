type ReservedCardProps = {
  label: string
  text: string
}

export function ReservedCard({ label, text }: ReservedCardProps) {
  return (
    <div className="reserved-card">
      <span className="reserved-mark" aria-hidden="true">i</span>
      <div>
        <strong>{label}</strong>
        <p>{text}</p>
      </div>
    </div>
  )
}

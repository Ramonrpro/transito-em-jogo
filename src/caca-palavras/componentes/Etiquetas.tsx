export default function Etiquetas({
  palavras,
  achadas,
  onDica,
}: {
  palavras: string[]
  /** Na ordem em que foram achadas: a posição no conjunto define a cor, igual à da grade. */
  achadas: ReadonlySet<string>
  onDica(grade: string): void
}) {
  const ordemAchada = [...achadas]
  const ordenadas = [...palavras].sort((a, b) => a.localeCompare(b))
  return (
    <div className="etiquetas">
      {ordenadas.map((grade) => {
        const k = ordemAchada.indexOf(grade)
        return (
          <button
            key={grade}
            type="button"
            className="etiqueta"
            data-cor={k >= 0 ? (k % 6) + 1 : undefined}
            aria-label={k >= 0 ? `${grade}, achada` : undefined}
            onClick={() => onDica(grade)}
          >
            {grade}
          </button>
        )
      })}
    </div>
  )
}

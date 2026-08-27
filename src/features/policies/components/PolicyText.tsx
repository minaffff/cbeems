import type { PolicyParagraph } from '../../../content/policies'

export function PolicyText({ paragraph }: { paragraph: PolicyParagraph }) {
  if (typeof paragraph === 'string') return paragraph

  return paragraph.parts.map((part, index) => {
    const content = part.emphasis ? <em>{part.text}</em> : part.text
    if (part.href) {
      return (
        <a key={index} href={part.href} target="_blank" rel="noreferrer">
          {content}
        </a>
      )
    }
    return <span key={index}>{content}</span>
  })
}

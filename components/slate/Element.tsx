import { FC } from 'react'
import type { RenderElementProps } from 'slate-react'

export const Element: FC<RenderElementProps> = props => {
  switch (props.element.type) {
    case 'code':
      return <CodeElement {...props} />
    default:
      return <DefaultElement {...props} />
  }
}
const CodeElement: FC<RenderElementProps> = ({ children, attributes }) => {
  return (
    <pre
      {...attributes}
      className="font-mono bg-neutral-200 dark:bg-neutral-700 rounded p-1"
    >
      <code>{children}</code>
    </pre>
  )
}

const DefaultElement: FC<RenderElementProps> = ({ attributes, children }) => {
  return <p {...attributes}>{children}</p>
}

export default Element

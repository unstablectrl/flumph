import { FC } from 'react'
import { RenderElementProps } from 'slate-react'

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
    <pre {...attributes}>
      <code className="font-mono bg-stone-700 rounded p-1">{children}</code>
    </pre>
  )
}

const DefaultElement: FC<RenderElementProps> = ({ attributes, children }) => {
  return <p {...attributes}>{children}</p>
}

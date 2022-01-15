import { FC } from 'react'
import type { RenderLeafProps } from 'slate-react'
import { hasOwnProperty } from 'utils/typescript'

const Leaf: FC<RenderLeafProps> = ({ attributes, children, leaf }) => {
  if (hasOwnProperty(leaf, 'bold') && leaf.bold)
    children = <strong>{children}</strong>
  if (hasOwnProperty(leaf, 'italic') && leaf.italic)
    children = <em>{children}</em>
  if (hasOwnProperty(leaf, 'underline') && leaf.underline)
    children = <u>{children}</u>
  if (hasOwnProperty(leaf, 'code') && leaf.code)
    children = (
      <code className="p-1 bg-neutral-200 dark:bg-neutral-700 rounded">
        {children}
      </code>
    )
  return <span {...attributes}>{children}</span>
}

export default Leaf

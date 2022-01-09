import { FC } from 'react'
import type { RenderLeafProps } from 'slate-react'
import { hasOwnProperty } from 'utils/typescript'

const Leaf: FC<RenderLeafProps> = ({ attributes, children, leaf }) => {
  if (hasOwnProperty(leaf, 'bold') && leaf.bold)
    return <strong {...attributes}>{children}</strong>
  return <span {...attributes}>{children}</span>
}

export default Leaf

// Import React dependencies.
import { Element } from 'components/CustomSlateElement'
import Head from 'next/head'
import Link from 'next/link'
import type { KeyboardEvent } from 'react'
import { FC, useCallback, useRef, useState } from 'react'
// TypeScript users only add this code
import type { BaseEditor, Descendant, Node } from 'slate'
// Import the Slate components and React plugin.
import { createEditor, Editor, Transforms } from 'slate'
import type { ReactEditor, RenderElementProps } from 'slate-react'
import { Editable, Slate, withReact } from 'slate-react'
import type { CustomElement } from 'types/slate'
import { hasOwnProperty } from 'utils/typescript'

interface HomeProps {}

const Home: FC<HomeProps> = () => {
  // Create a Slate editor object that won't change across renders.
  // Workaround for fast reloads
  // https://github.com/ianstormtaylor/slate/issues/4081
  const editorRef = useRef<BaseEditor & ReactEditor>()
  if (!editorRef.current) editorRef.current = withReact(createEditor())
  const editor = editorRef.current
  const initialValue: CustomElement[] = [
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }],
    },
  ]
  // Also you must annotate `useState<Descendant[]>` and the editor's initial value.
  const [value, setValue] = useState<Descendant[]>(initialValue)

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === '&') {
      event.preventDefault()
      editor.insertText('and')
    }
    if (event.key === '`' && event.ctrlKey) {
      // Prevent the "`" from being inserted by default.
      event.preventDefault()
      // Determine whether any of the currently selected blocks are code blocks.

      const [match] = Editor.nodes(editor, {
        match: (node: Node) => {
          if (hasOwnProperty(node, 'type')) return node.type === 'code'
          return false
        },
      })

      // const match = test.next()
      // Toggle the block type depending on whether there's already a match.
      Transforms.setNodes(
        editor,
        { type: match ? 'paragraph' : 'code' },
        { match: n => Editor.isBlock(editor, n) },
      )
    }
  }

  // Define a rendering function based on the element passed to `props`. We use
  // `useCallback` here to memoize the function for subsequent renders.
  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    [],
  )

  return (
    <div className="">
      <Head>
        <title>Editords</title>
      </Head>
      <div className="p-5">
        <Link href="/">
          <a>Links</a>
        </Link>
      </div>
      <div className="container m-auto">
        <Slate
          editor={editor}
          value={value}
          onChange={newValue => setValue(newValue)}
        >
          <Editable
            className="p-5 rounded-xl bg-neutral-50 dark:bg-neutral-900"
            autoFocus
            renderElement={renderElement}
            onKeyDown={onKeyDown}
          />
        </Slate>
      </div>
    </div>
  )
}

export default Home

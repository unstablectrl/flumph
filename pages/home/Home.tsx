import { CustomEditor, Element, Leaf } from 'components/slate'
import Head from 'next/head'
import Link from 'next/link'
import type { KeyboardEvent } from 'react'
import { FC, useCallback, useRef, useState } from 'react'
import type { BaseEditor, Descendant } from 'slate'
import { createEditor } from 'slate'
import type { ReactEditor } from 'slate-react'
import { Editable, Slate, withReact } from 'slate-react'
import type { CustomElement } from 'types/slate'

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

  const [value, setValue] = useState<Descendant[]>(initialValue)

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === '&') {
      event.preventDefault()
      editor.insertText('and')
    }
    if (!event.ctrlKey) return
    switch (event.key) {
      case '`': {
        event.preventDefault()
        CustomEditor.toggleCodeBlock(editor)
        break
      }

      case 'b': {
        event.preventDefault()
        CustomEditor.toggleBoldMark(editor)
        break
      }
    }
  }

  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])

  return (
    <div className="container m-auto">
      <Head>
        <title>Editords</title>
      </Head>
      <div className="p-5">
        <Link href="/">
          <a>Links</a>
        </Link>
      </div>
      <div className="px-5">
        <Slate
          editor={editor}
          value={value}
          onChange={newValue => setValue(newValue)}
        >
          <Editable
            className="p-5 rounded-xl bg-neutral-50 dark:bg-neutral-900"
            autoFocus
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onKeyDown={onKeyDown}
          />
        </Slate>
      </div>
    </div>
  )
}

export default Home

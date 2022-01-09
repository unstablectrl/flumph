import { CustomEditor, Element, Leaf } from 'components/slate'
import useStorage from 'hooks/useStorage'
import Head from 'next/head'
import Link from 'next/link'
import {
  FC,
  KeyboardEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { BaseEditor, Descendant } from 'slate'
import { createEditor } from 'slate'
import type { ReactEditor } from 'slate-react'
import { Editable, Slate, withReact } from 'slate-react'

interface HomeProps {}

const Home: FC<HomeProps> = () => {
  // Create a Slate editor object that won't change across renders.
  // Workaround for fast reloads
  // https://github.com/ianstormtaylor/slate/issues/4081
  const editorRef = useRef<BaseEditor & ReactEditor>()
  if (!editorRef.current) editorRef.current = withReact(createEditor())
  const editor = editorRef.current

  // With local storage there is a miss match from the server that prints a
  // warning in the console.
  // https://github.com/vercel/next.js/discussions/17443#discussioncomment-87097
  // Since the first render should match the initial render of the server
  // setting the value in a useEffect doesn't work I haven't discovered another
  // way to do it.
  // This will be solved when I fetch this data from a database instead.
  const { getItem, setItem } = useStorage('localStorage')
  const loadedValue = useMemo(() => {
    const content = getItem('content')
    return content ? JSON.parse(content) : null
  }, [getItem])

  const [value, setValue] = useState<Descendant[]>(
    loadedValue || [
      {
        type: 'paragraph',
        children: [{ text: 'A line of text in a paragraph.' }],
      },
    ],
  )

  const slateOnChange = (value: Descendant[]) => {
    setValue(value)
    const isAstChange = editor.operations.some(
      op => 'set_selection' !== op.type,
    )
    if (isAstChange) {
      //Save the value to Local Storage.
      const content = JSON.stringify(value)
      setItem('content', content)
    }
  }

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
        <Slate editor={editor} value={value} onChange={slateOnChange}>
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

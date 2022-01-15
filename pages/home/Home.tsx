import Button from 'components/atoms/Button'
import { CustomEditor, Element, Leaf } from 'components/slate'
import useStorage from 'hooks/useStorage'
import isHotkey from 'is-hotkey'
import Head from 'next/head'
import Link from 'next/link'
import type { MouseEvent } from 'react'
import {
  FC,
  KeyboardEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'
import { BaseEditor, createEditor, Descendant, Editor, Transforms } from 'slate'
import { withHistory } from 'slate-history'
import type { ReactEditor } from 'slate-react'
import { Editable, Slate, withReact } from 'slate-react'
import { hasOwnProperty } from 'utils/typescript'

interface HomeProps {}

const HOTKEYS: Record<string, string> = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

const Home: FC<HomeProps> = () => {
  // Create a Slate editor object that won't change across renders.
  // Workaround for fast reloads
  // https://github.com/ianstormtaylor/slate/issues/4081
  const editorRef = useRef<BaseEditor & ReactEditor>()
  if (!editorRef.current)
    editorRef.current = withReact(withHistory(createEditor()))
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
    for (const hotkey in HOTKEYS) {
      if (isHotkey(hotkey, event)) {
        event.preventDefault()
        const mark = HOTKEYS[hotkey]
        CustomEditor.toggleMark(editor, mark)
      }
    }
    if (event.key === '&') {
      event.preventDefault()
      editor.insertText('and')
    }
    if (!event.ctrlKey) return
    switch (event.key) {
      case ']': {
        event.preventDefault()
        CustomEditor.toggleCodeBlock(editor)
        break
      }

      case 'o': {
        event.preventDefault()
        CustomEditor.toggleBorderBlock(editor)
        break
      }

      // case 'b': {
      //   event.preventDefault()
      //   CustomEditor.toggleBoldMark(editor)
      //   break
      // }
    }
  }
  const handleOnClick = (e: MouseEvent<HTMLButtonElement>, action: string) => {
    e.stopPropagation()
    e.preventDefault()
    switch (action) {
      case 'transform':
        console.log('transform')
        const { selection } = editor
        if (!selection) return false
        Transforms.unwrapNodes(editor, {
          at: Editor.unhangRange(editor, selection), // Path of Editor
          match: node => {
            debugger
            return (
              !Editor.isEditor(node) &&
              hasOwnProperty(node, 'children') &&
              node.children?.every(child => Editor.isBlock(editor, child))
            )
          },
          mode: 'all', // also the Editor's children
        })
        break
      case 'select':
        console.log('select')
        Transforms.select(editor, {
          anchor: { path: [0, 0], offset: 0 },
          focus: { path: [2, 0], offset: 1 },
        })
        break
      case 'move':
        console.log('move')
        Transforms.move(editor, {
          distance: 3,
          unit: 'word',
          reverse: true,
        })
        break
      case 'isBlockActive':
        console.log('isBlockActive', CustomEditor.isBlockActive(editor, 'code'))
        break
      case 'NumberedList':
        console.log(
          'toggleBlock numbered-list',
          CustomEditor.toggleBlock(editor, 'numbered-list'),
        )
        break
      case 'CodeBlock':
        console.log('CodeBlock', CustomEditor.toggleBlock(editor, 'code'))
        break
      default:
        break
    }
  }

  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])

  return (
    <div className="container m-auto">
      <Head>
        <title>Editords</title>
      </Head>
      <div className="p-5 pt-5 space-y-4">
        <div>
          <Link href="/">
            <a>Links</a>
          </Link>
        </div>
        <Slate editor={editor} value={value} onChange={slateOnChange}>
          <div className="mb-5 flex space-x-4">
            <Button onMouseDown={e => handleOnClick(e, 'transform')}>
              transform
            </Button>
            <Button onMouseDown={e => handleOnClick(e, 'select')}>
              select
            </Button>
            <Button onMouseDown={e => handleOnClick(e, 'move')}>move</Button>
            <Button onMouseDown={e => handleOnClick(e, 'bold')}>bold</Button>
            <Button onMouseDown={e => handleOnClick(e, 'isBlockActive')}>
              isBlockCodeActive
            </Button>
            <Button onMouseDown={e => handleOnClick(e, 'NumberedList')}>
              NumberedList
            </Button>
            <Button onMouseDown={e => handleOnClick(e, 'CodeBlock')}>
              CodeBlock
            </Button>
          </div>
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

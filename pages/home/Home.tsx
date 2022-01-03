// Import React dependencies.
import { FC, useMemo, useState } from 'react'
// TypeScript users only add this code
import { BaseEditor, createEditor, Descendant } from 'slate'
// Import the Slate components and React plugin.
import { Editable, ReactEditor, Slate, withReact } from 'slate-react'

type CustomElement = { type: 'paragraph'; children: CustomText[] }
type CustomText = { text: string }

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}
interface HomeProps {}

const Home: FC<HomeProps> = () => {
  // Create a Slate editor object that won't change across renders.
  const editor = useMemo(() => withReact(createEditor()), [])
  // Also you must annotate `useState<Descendant[]>` and the editor's initial value.
  const initialValue: CustomElement[] = [
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }],
    },
  ]
  const [value, setValue] = useState<Descendant[]>(initialValue)

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={newValue => setValue(newValue)}
    >
      <Editable />
    </Slate>
  )
}

export default Home

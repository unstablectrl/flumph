import { Editor, Text, Transforms } from 'slate'
import { hasOwnProperty } from 'utils/typescript'

const CustomEditor = {
  isBoldMarkActive(editor: Editor) {
    const [match] = Editor.nodes(editor, {
      match: n => (hasOwnProperty(n, 'bold') ? n.bold === true : false),
      universal: true,
    })

    return !!match
  },

  isCodeBlockActive(editor: Editor) {
    const [match] = Editor.nodes(editor, {
      match: n => (hasOwnProperty(n, 'type') ? n.type === 'code' : false),
    })

    return !!match
  },

  toggleBoldMark(editor: Editor) {
    const isActive = CustomEditor.isBoldMarkActive(editor)
    Transforms.setNodes(
      editor,
      { bold: isActive ? undefined : true },
      { match: n => Text.isText(n), split: true },
    )
  },

  toggleCodeBlock(editor: Editor) {
    const isActive = CustomEditor.isCodeBlockActive(editor)
    Transforms.setNodes(
      editor,
      { type: isActive ? undefined : 'code' },
      { match: n => Editor.isBlock(editor, n) },
    )
  },
}

export default CustomEditor

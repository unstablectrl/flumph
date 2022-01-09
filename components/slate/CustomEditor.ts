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

  isBorderBlockActive(editor: Editor) {
    const [match] = Editor.nodes(editor, {
      match: n => (hasOwnProperty(n, 'type') ? n.type === 'border' : false),
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

  toggleBorderBlock(editor: Editor) {
    const isActive = CustomEditor.isBorderBlockActive(editor)
    Transforms.setNodes(
      editor,
      { type: isActive ? undefined : 'border' },
      { match: n => Editor.isBlock(editor, n) },
    )
    // Transforms.move(editor, {
    //   distance: 1,
    //   unit: 'character',
    //   reverse: false,
    // })
    // Transforms.select(editor, {
    //   anchor: { path: [0, 0], offset: 0 },
    //   focus: { path: [2, 0], offset: 1 },
    // })
  },
}

export default CustomEditor

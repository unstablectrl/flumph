import { Editor, Element, Text, Transforms } from 'slate'
import { hasOwnProperty } from 'utils/typescript'

const LIST_TYPES = ['numbered-list', 'bulleted-list']

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
    Transforms.move(editor, {
      distance: 1,
      unit: 'character',
      reverse: false,
    })
    // Transforms.select(editor, {
    //   anchor: { path: [0, 0], offset: 0 },
    //   focus: { path: [2, 0], offset: 1 },
    // })
  },

  isMarkActive(editor: Editor, format: string) {
    const marks = Editor.marks(editor)
    if (!marks) return false
    if (hasOwnProperty(marks, format)) return marks[format] === true
  },

  toggleMark(editor: Editor, format: string) {
    const isActive = this.isMarkActive(editor, format)
    if (isActive) {
      Editor.removeMark(editor, format)
    } else {
      Editor.addMark(editor, format, true)
    }
  },

  isBlockActive(editor: Editor, format: string) {
    const { selection } = editor
    // console.log('selection', selection)
    if (!selection) return false
    const [match] = Array.from(
      Editor.nodes(editor, {
        at: Editor.unhangRange(editor, selection),
        match: n => {
          // console.log('isEditor', Editor.isEditor(n))
          // console.log('isElement', Element.isElement(n))
          // console.log('type', Element.isElement(n) && n.type)
          return (
            !Editor.isEditor(n) && Element.isElement(n) && n.type === format
          )
        },
      }),
    )
    return !!match
  },

  toggleBlock(editor: Editor, format: any) {
    console.log('toggleBlock')
    const isActive = this.isBlockActive(editor, format)
    const isList = LIST_TYPES.includes(format)
    const isCode = 'code' === format
    Transforms.unwrapNodes(editor, {
      match: n => {
        return (
          !Editor.isEditor(n) &&
          Element.isElement(n) &&
          (LIST_TYPES.includes(n.type) || 'code' === n.type)
        )
      },
      split: true,
    })

    const newProperties: Partial<Element> = {}
    if (isActive || isCode) {
      newProperties.type = 'paragraph'
    } else if (isList) {
      newProperties.type = 'list-item'
    } else {
      newProperties.type = format
    }
    Transforms.setNodes<Element>(editor, newProperties)

    if (!isActive && (isList || isCode)) {
      const block = { type: format, children: [] }
      Transforms.wrapNodes(editor, block)
    }
  },
}

export default CustomEditor

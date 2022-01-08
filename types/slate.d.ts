import type { BaseEditor } from 'slate'
import type { ReactEditor } from 'slate-react'

export type CodeElement = { type: 'code'; children: CustomText[] }
export type DefaultElement = { type: 'paragraph'; children: CustomText[] }

export type CustomElement = CodeElement | DefaultElement

export type CustomText = {
  bold?: boolean
  italic?: boolean
  code?: boolean
  text: string
}

export type EmptyText = {
  text: string
}

export type CustomEditor = BaseEditor & ReactEditor

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
    Text: CustomText | EmptyText
  }
}
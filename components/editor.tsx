"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { Image } from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { Bold, Italic, Strikethrough, Underline as UnderlineIcon, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Link as LinkIcon, Image as ImageIcon } from 'lucide-react'
import { useState } from 'react'

interface EditorProps {
  content?: string
  onChange?: (content: string) => void
}

export default function Editor({ content = '', onChange }: EditorProps) {
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
        defaultAlignment: 'left',
      }),
      Placeholder.configure({
        placeholder: 'Start writing your story...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON()
      onChange?.(JSON.stringify(json))
    },
  })

  if (!editor) {
    return null
  }

  const addImage = () => {
    const url = window.prompt('Enter the URL of the image:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run()
      setLinkUrl('')
      setShowLinkInput(false)
    }
  }

  return (
    <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none">
      <div className="flex flex-wrap gap-2 p-2 border-b">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded ${editor.isActive('bold') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded ${editor.isActive('italic') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded ${editor.isActive('strike') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        >
          <Strikethrough className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded ${editor.isActive('underline') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded ${editor.isActive('textAlign', { textAlign: 'left' }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded ${editor.isActive('textAlign', { textAlign: 'center' }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded ${editor.isActive('textAlign', { textAlign: 'right' }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        >
          <AlignRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => setShowLinkInput(!showLinkInput)}
          className={`p-2 rounded ${editor.isActive('link') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          onClick={addImage}
          className="p-2 rounded hover:bg-gray-100"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
      </div>

      {showLinkInput && (
        <div className="p-2 border-b">
          <input
            type="text"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="Enter URL"
            className="p-2 border rounded w-full"
          />
          <button
            onClick={addLink}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Link
          </button>
        </div>
      )}

      <EditorContent editor={editor} className="p-4 min-h-[500px]" />
    </div>
  )
} 
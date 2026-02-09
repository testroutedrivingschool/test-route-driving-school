"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";

export default function EmailEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: value || "",
    immediatelyRender: false, // ✅ FIX FOR SSR
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-border-color rounded-md">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-2 border-b border-border-color bg-gray-50">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className="editor-btn">B</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className="editor-btn">I</button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className="editor-btn">U</button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="editor-btn">•</button>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="min-h-[260px] p-3 text-sm outline-none"
      />
    </div>
  );
}

"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function TipTapEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({
        placeholder: "Lebetkeun Eusi Dongeng...",
      }),
    ],
    content: value || "<p></p>",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "<p></p>");
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex gap-2 border-b pb-2">
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("bold") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("italic") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("underline") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="w-4 h-4" />
        </Button>

        {/* Alignments */}
        <Button
          type="button"
          size="sm"
          variant={
            editor.isActive({ textAlign: "left" }) ? "default" : "outline"
          }
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={
            editor.isActive({ textAlign: "center" }) ? "default" : "outline"
          }
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={
            editor.isActive({ textAlign: "right" }) ? "default" : "outline"
          }
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Editor */}
      <div
        className={`border rounded-lg p-3 min-h-[200px] ${
          editor.isFocused ? "ring-2 ring-gray-400" : "hover:border-gray-400"
        }`}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

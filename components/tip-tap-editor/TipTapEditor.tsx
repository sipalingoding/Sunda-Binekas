"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Highlighter,
  RotateCcw,
  RotateCw,
} from "lucide-react";
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
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Lebetkeun Eusi Dongeng..." }),
    ],
    content: value || "<p></p>",
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "<p></p>");
    }
  }, [value, editor]);

  if (!editor) return null;

  const ToolBtn = ({
    active,
    onClick,
    children,
    title,
    disabled,
  }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
    title: string;
    disabled?: boolean;
  }) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`sb-tt-btn${active ? " sb-tt-btn-active" : ""}${disabled ? " sb-tt-btn-disabled" : ""}`}
    >
      {children}
    </button>
  );

  return (
    <div className="sb-tt-wrap">
      <div className="sb-tt-toolbar">
        {/* Undo / Redo */}
        <div className="sb-tt-group">
          <ToolBtn
            title="Urungkan (Ctrl+Z)"
            active={false}
            disabled={!editor.can().undo()}
            onClick={() => editor.chain().focus().undo().run()}
          >
            <RotateCcw size={14} />
          </ToolBtn>
          <ToolBtn
            title="Ulang (Ctrl+Y)"
            active={false}
            disabled={!editor.can().redo()}
            onClick={() => editor.chain().focus().redo().run()}
          >
            <RotateCw size={14} />
          </ToolBtn>
        </div>

        <div className="sb-tt-divider" />

        {/* Text style */}
        <div className="sb-tt-group">
          <ToolBtn
            title="Bold (Ctrl+B)"
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold size={14} />
          </ToolBtn>
          <ToolBtn
            title="Italic (Ctrl+I)"
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic size={14} />
          </ToolBtn>
          <ToolBtn
            title="Underline (Ctrl+U)"
            active={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon size={14} />
          </ToolBtn>
          <ToolBtn
            title="Sorot teks"
            active={editor.isActive("highlight")}
            onClick={() => editor.chain().focus().toggleHighlight().run()}
          >
            <Highlighter size={14} />
          </ToolBtn>
        </div>

        <div className="sb-tt-divider" />

        {/* Block type */}
        <div className="sb-tt-group">
          <ToolBtn
            title="Judul (H2)"
            active={editor.isActive("heading", { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            <Heading2 size={14} />
          </ToolBtn>
          <ToolBtn
            title="Daptar titik"
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List size={14} />
          </ToolBtn>
          <ToolBtn
            title="Daptar nomer"
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered size={14} />
          </ToolBtn>
          <ToolBtn
            title="Kutipan"
            active={editor.isActive("blockquote")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <Quote size={14} />
          </ToolBtn>
        </div>

        <div className="sb-tt-divider" />

        {/* Alignment */}
        <div className="sb-tt-group">
          <ToolBtn
            title="Rata kiri"
            active={editor.isActive({ textAlign: "left" })}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          >
            <AlignLeft size={14} />
          </ToolBtn>
          <ToolBtn
            title="Rata tengah"
            active={editor.isActive({ textAlign: "center" })}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          >
            <AlignCenter size={14} />
          </ToolBtn>
          <ToolBtn
            title="Rata kanan"
            active={editor.isActive({ textAlign: "right" })}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          >
            <AlignRight size={14} />
          </ToolBtn>
          <ToolBtn
            title="Rata kiri-kanan"
            active={editor.isActive({ textAlign: "justify" })}
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          >
            <AlignJustify size={14} />
          </ToolBtn>
        </div>
      </div>

      <div className="sb-tt-content">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

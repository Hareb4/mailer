import { TextAlign } from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";

export function useEmailEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      FontFamily,
    ],
    immediatelyRender: false,
    content: "",
    editorProps: {
      attributes: {
        class: "focus:outline-none max-w-none p-4 text-[10.5pt]",
      },
    },
  });

  return { editor };
}

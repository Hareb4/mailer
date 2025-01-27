"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const fontOptions = [
  { value: "Arial", label: "Arial" },
  { value: "Helvetica", label: "Helvetica" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Courier", label: "Courier" },
  { value: "Verdana", label: "Verdana" },
  { value: "Georgia", label: "Georgia" },
  { value: "Tahoma", label: "Tahoma" },
];

interface MenuBarProps {
  editor: any;
}

export const MenuBar = ({ editor }: MenuBarProps) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 p-2 border-b">
      <div className="flex items-center gap-1 border-r pr-2">
        <Button
          size="sm"
          variant={editor.isActive("bold") ? "secondary" : "outline"}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="h-8 w-8 p-0"
          aria-label="Toggle bold">
          <span className="font-bold">B</span>
        </Button>
        <Button
          size="sm"
          variant={editor.isActive("italic") ? "secondary" : "outline"}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="h-8 w-8 p-0"
          aria-label="Toggle italic">
          <span className="italic">I</span>
        </Button>
        <Button
          size="sm"
          variant={editor.isActive("underline") ? "secondary" : "outline"}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className="h-8 w-8 p-0"
          aria-label="Toggle underline">
          <span className="underline">U</span>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Select
          onValueChange={(value) =>
            editor.chain().focus().setFontFamily(value).run()
          }>
          <SelectTrigger className="w-[140px] h-8">
            <SelectValue placeholder="Font" />
          </SelectTrigger>
          <SelectContent>
            {fontOptions.map((font) => (
              <SelectItem key={font.value} value={font.value}>
                {font.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) =>
            editor.chain().focus().setTextAlign(value).run()
          }>
          <SelectTrigger className="w-[120px] h-8">
            <SelectValue placeholder="Align" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
            <SelectItem value="justify">Justify</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

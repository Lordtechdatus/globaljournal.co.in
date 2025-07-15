import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button, ButtonGroup, Box, Tooltip } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import FormatClearIcon from '@mui/icons-material/FormatClear';

export default function TiptapEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || '',
    editorProps: {
      attributes: {
        class: 'tiptap',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
      
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '');
    }
  }, [content, editor]);

  return (
    <Box>
      {editor && (
        <ButtonGroup size="small" sx={{ mb: 1 }}>
          <Tooltip title="Bold"><Button onClick={() => editor.chain().focus().toggleBold().run()} color={editor.isActive('bold') ? 'primary' : 'inherit'}><FormatBoldIcon /></Button></Tooltip>
          <Tooltip title="Italic"><Button onClick={() => editor.chain().focus().toggleItalic().run()} color={editor.isActive('italic') ? 'primary' : 'inherit'}><FormatItalicIcon /></Button></Tooltip>
          <Tooltip title="Underline"><Button onClick={() => editor.chain().focus().toggleUnderline().run()} color={editor.isActive('underline') ? 'primary' : 'inherit'}><FormatUnderlinedIcon /></Button></Tooltip>
          <Tooltip title="Bullet List"><Button onClick={() => editor.chain().focus().toggleBulletList().run()} color={editor.isActive('bulletList') ? 'primary' : 'inherit'}><FormatListBulletedIcon /></Button></Tooltip>
          <Tooltip title="Ordered List"><Button onClick={() => editor.chain().focus().toggleOrderedList().run()} color={editor.isActive('orderedList') ? 'primary' : 'inherit'}><FormatListNumberedIcon /></Button></Tooltip>
          <Tooltip title="Undo"><Button onClick={() => editor.chain().focus().undo().run()}><UndoIcon /></Button></Tooltip>
          <Tooltip title="Redo"><Button onClick={() => editor.chain().focus().redo().run()}><RedoIcon /></Button></Tooltip>
          <Tooltip title="Clear Formatting"><Button onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}><FormatClearIcon /></Button></Tooltip>
        </ButtonGroup>
      )}
      <EditorContent editor={editor} className="tiptap" />
      <style>{`
        .tiptap {
        min-height: 120px;
        border: 1px solid #ccc;
        border-radius: 6px;
        padding: 10px;
        font-size: 1rem;
        outline: none;
        cursor: text;
      }
        .tiptap p { margin: 0; }
        .tiptap ul, .tiptap ol { padding-left: 1.5em; }
        .tiptap:focus { box-shadow: 0 0 0 2px #1976d2; }
        .MuiButtonGroup-root .MuiButton-root {
          min-width: 32px;
          padding: 4px 8px;
        }
        .MuiButton-root.Mui-selected, .MuiButton-root:hover {
          background: #e3f2fd;
        }
      `}</style>
    </Box>
  );
} 
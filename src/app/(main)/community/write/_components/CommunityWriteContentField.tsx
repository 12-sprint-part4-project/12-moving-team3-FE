'use client';

import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import { useEffect, useRef } from 'react';

import {
  getCommunityWriteEditorExtensions,
  getCommunityWriteEditorProps,
} from './communityWriteEditor';
import { CommunityWriteToolbar } from './CommunityWriteToolbar';
import { COMMUNITY_WRITE_LABEL_CLASS } from './communityWriteStyles';

interface CommunityWriteContentFieldProps {
  onEditorReady: (editor: Editor | null) => void;
  onEditorUpdate: (editor: Editor) => void;
  onLinkError?: (message: string) => void;
  className?: string;
}

/** 게시글 본문 — Tiptap 툴바 + EditorContent (Figma 15211:41641) */
export const CommunityWriteContentField = ({
  onEditorReady,
  onEditorUpdate,
  onLinkError,
  className = '',
}: CommunityWriteContentFieldProps) => {
  const onEditorUpdateRef = useRef(onEditorUpdate);

  useEffect(() => {
    onEditorUpdateRef.current = onEditorUpdate;
  }, [onEditorUpdate]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: getCommunityWriteEditorExtensions(),
    editorProps: getCommunityWriteEditorProps(),
    onUpdate: ({ editor: nextEditor }) => {
      onEditorUpdateRef.current(nextEditor);
    },
  });

  useEffect(() => {
    onEditorReady(editor);

    return () => {
      onEditorReady(null);
    };
  }, [editor, onEditorReady]);

  return (
    <section className={className}>
      <h2 className={COMMUNITY_WRITE_LABEL_CLASS}>내용</h2>

      <div className="mt-2.5">
        {editor !== null ? (
          <CommunityWriteToolbar editor={editor} onLinkError={onLinkError} />
        ) : null}
        <EditorContent editor={editor} />
      </div>
    </section>
  );
};

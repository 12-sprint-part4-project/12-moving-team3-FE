import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';

import { COMMUNITY_WRITE_CONTENT_EDITOR_CLASS } from './communityWriteStyles';

import type { Editor, Extensions } from '@tiptap/react';

export type CommunityWriteToolbarItemId =
  'bold' | 'italic' | 'heading1' | 'heading2' | 'bulletList' | 'orderedList';

type CommunityWriteToolbarItemKind = 'toggle';

export interface CommunityWriteToolbarItem {
  id: CommunityWriteToolbarItemId;
  kind: CommunityWriteToolbarItemKind;
  label: string;
  ariaLabel: string;
}

export const COMMUNITY_WRITE_TOOLBAR_ITEMS: CommunityWriteToolbarItem[] = [
  { id: 'bold', kind: 'toggle', label: 'B', ariaLabel: '굵게' },
  { id: 'italic', kind: 'toggle', label: 'I', ariaLabel: '기울임' },
  { id: 'heading1', kind: 'toggle', label: 'H1', ariaLabel: '제목 1' },
  { id: 'heading2', kind: 'toggle', label: 'H2', ariaLabel: '제목 2' },
  {
    id: 'bulletList',
    kind: 'toggle',
    label: '≡',
    ariaLabel: '글머리 기호 목록',
  },
  { id: 'orderedList', kind: 'toggle', label: '1.', ariaLabel: '번호 목록' },
];

const COMMUNITY_WRITE_CONTENT_PLACEHOLDER = '내용을 입력해 주세요.';

/** extensions 인스턴스 재생성·linkify 중복 등록 방지 */
const COMMUNITY_WRITE_EDITOR_EXTENSIONS: Extensions = [
  StarterKit.configure({
    heading: { levels: [1, 2] },
    link: false,
  }),
  Link.configure({
    autolink: true,
    defaultProtocol: 'https',
    openOnClick: false,
  }),
  Placeholder.configure({
    placeholder: COMMUNITY_WRITE_CONTENT_PLACEHOLDER,
  }),
];

const COMMUNITY_WRITE_EDITOR_PROPS = {
  attributes: {
    'aria-label': '게시글 내용',
    class: COMMUNITY_WRITE_CONTENT_EDITOR_CLASS,
  },
};

export const getCommunityWriteEditorExtensions = (): Extensions =>
  COMMUNITY_WRITE_EDITOR_EXTENSIONS;

export const getCommunityWriteEditorProps = () => COMMUNITY_WRITE_EDITOR_PROPS;

export const getCommunityWriteHtml = (editor: Editor): string =>
  editor.getHTML();

export const runCommunityWriteToolbarCommand = (
  editor: Editor,
  itemId: CommunityWriteToolbarItemId
) => {
  switch (itemId) {
    case 'bold':
      editor.chain().focus().toggleBold().run();
      return;
    case 'italic':
      editor.chain().focus().toggleItalic().run();
      return;
    case 'heading1':
      editor.chain().focus().toggleHeading({ level: 1 }).run();
      return;
    case 'heading2':
      editor.chain().focus().toggleHeading({ level: 2 }).run();
      return;
    case 'bulletList':
      editor.chain().focus().toggleBulletList().run();
      return;
    case 'orderedList':
      editor.chain().focus().toggleOrderedList().run();
  }
};

export const isCommunityWriteToolbarItemActive = (
  editor: Editor,
  itemId: CommunityWriteToolbarItemId
): boolean => {
  switch (itemId) {
    case 'bold':
      return editor.isActive('bold');
    case 'italic':
      return editor.isActive('italic');
    case 'heading1':
      return editor.isActive('heading', { level: 1 });
    case 'heading2':
      return editor.isActive('heading', { level: 2 });
    case 'bulletList':
      return editor.isActive('bulletList');
    case 'orderedList':
      return editor.isActive('orderedList');
  }
};

export const shouldShowToolbarItemPressed = (
  _item: CommunityWriteToolbarItem,
  isActive: boolean
): boolean => isActive;

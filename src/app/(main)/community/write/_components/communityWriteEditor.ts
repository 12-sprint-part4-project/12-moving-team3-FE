import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Markdown } from '@tiptap/markdown';
import type { Editor, Extensions } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { COMMUNITY_WRITE_CONTENT_EDITOR_CLASS } from './communityWriteStyles';

export type CommunityWriteToolbarItemId =
  | 'bold'
  | 'italic'
  | 'heading1'
  | 'heading2'
  | 'bulletList'
  | 'orderedList'
  | 'link';

type CommunityWriteToolbarItemKind = 'toggle' | 'action';

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
  { id: 'link', kind: 'action', label: '🔗', ariaLabel: '링크' },
];

const COMMUNITY_WRITE_CONTENT_PLACEHOLDER = '내용을 입력해 주세요.';

export const getCommunityWriteEditorExtensions = (): Extensions => [
  StarterKit.configure({
    heading: { levels: [1, 2] },
    link: false,
  }),
  Link.configure({
    autolink: true,
    defaultProtocol: 'https',
    openOnClick: false,
    protocols: ['http', 'https', 'mailto'],
  }),
  Placeholder.configure({
    placeholder: COMMUNITY_WRITE_CONTENT_PLACEHOLDER,
  }),
  Markdown,
];

export const getCommunityWriteEditorProps = () => ({
  attributes: {
    'aria-label': '게시글 내용',
    class: COMMUNITY_WRITE_CONTENT_EDITOR_CLASS,
  },
});

const ALLOWED_LINK_PROTOCOLS = new Set(['http:', 'https:', 'mailto:']);

/** http(s)/mailto만 허용 — 실패 시 error 메시지 */
export const parseCommunityWriteLinkHref = (
  input: string
): { href: string } | { error: string } => {
  const trimmed = input.trim();

  if (trimmed === '') {
    return { error: '링크 URL을 입력해 주세요.' };
  }

  const hasProtocol = /^[a-z][a-z0-9+.-]*:/i.test(trimmed);

  try {
    const url = new URL(hasProtocol ? trimmed : `https://${trimmed}`);

    if (!ALLOWED_LINK_PROTOCOLS.has(url.protocol)) {
      return { error: 'http, https, mailto 링크만 등록할 수 있습니다.' };
    }

    return { href: url.href };
  } catch {
    return { error: '올바른 URL 형식이 아닙니다.' };
  }
};

interface CommunityWriteToolbarCommandOptions {
  onLinkError?: (message: string) => void;
}

const applyLinkFromPrompt = (
  editor: Editor,
  options: CommunityWriteToolbarCommandOptions
) => {
  const previousUrl = editor.getAttributes('link').href;
  const url = window.prompt(
    '링크 URL을 입력해 주세요.',
    typeof previousUrl === 'string' ? previousUrl : ''
  );

  if (url === null) {
    return;
  }

  if (url.trim() === '') {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    return;
  }

  const parsed = parseCommunityWriteLinkHref(url);

  if ('error' in parsed) {
    options.onLinkError?.(parsed.error);
    return;
  }

  editor
    .chain()
    .focus()
    .extendMarkRange('link')
    .setLink({ href: parsed.href })
    .run();
};

export const runCommunityWriteToolbarCommand = (
  editor: Editor,
  itemId: CommunityWriteToolbarItemId,
  options: CommunityWriteToolbarCommandOptions = {}
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
      return;
    case 'link':
      applyLinkFromPrompt(editor, options);
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
    case 'link':
      return editor.isActive('link');
  }
};

export const shouldShowToolbarItemPressed = (
  _item: CommunityWriteToolbarItem,
  isActive: boolean
): boolean => isActive;

'use client';

import { useEffect, useState } from 'react';

import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';

import {
  COMMUNITY_WRITE_TOOLBAR_ITEMS,
  isCommunityWriteToolbarItemActive,
  runCommunityWriteToolbarCommand,
  shouldShowToolbarItemPressed,
  type CommunityWriteToolbarItemId,
} from './communityWriteEditor';
import {
  COMMUNITY_WRITE_TOOLBAR_BUTTON_CLASS,
  COMMUNITY_WRITE_TOOLBAR_CLASS,
} from './communityWriteStyles';

import type { Editor } from '@tiptap/react';

interface CommunityWriteToolbarProps {
  editor: Editor;
}

/** 게시글 작성 본문 서식 툴바 */
export const CommunityWriteToolbar = ({
  editor,
}: CommunityWriteToolbarProps) => {
  const { t } = useTranslation();
  const [, setToolbarRevision] = useState(0);

  useEffect(() => {
    const handleToolbarRefresh = () => {
      setToolbarRevision((previous) => previous + 1);
    };

    editor.on('selectionUpdate', handleToolbarRefresh);
    editor.on('update', handleToolbarRefresh);

    return () => {
      editor.off('selectionUpdate', handleToolbarRefresh);
      editor.off('update', handleToolbarRefresh);
    };
  }, [editor]);

  const handleToolbarClick = (itemId: CommunityWriteToolbarItemId) => {
    runCommunityWriteToolbarCommand(editor, itemId);
  };

  return (
    <div
      className={COMMUNITY_WRITE_TOOLBAR_CLASS}
      role="group"
      aria-label={t('community.toolbarAria')}
    >
      {COMMUNITY_WRITE_TOOLBAR_ITEMS.map((item) => {
        const isActive = isCommunityWriteToolbarItemActive(editor, item.id);

        return (
          <button
            key={item.id}
            type="button"
            aria-label={t(`community.editor.${item.id}`)}
            aria-pressed={shouldShowToolbarItemPressed(item, isActive)}
            onClick={() => handleToolbarClick(item.id)}
            className={cn(
              COMMUNITY_WRITE_TOOLBAR_BUTTON_CLASS,
              item.id === 'bold' && 'font-bold',
              item.id === 'italic' && 'italic',
              isActive && 'text-black-400'
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};

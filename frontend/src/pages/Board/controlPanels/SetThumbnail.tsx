import React, { useState } from 'react';
import { IoMdImages } from 'react-icons/io';
import { getSvgAsImage, useEditor } from '@tldraw/tldraw';
import { useMutation } from '@tanstack/react-query';
import { setBoardThumbnail, updateBoard } from 'api/boards';
import _ from 'lodash';
import ContextMenu from 'ui/ContextMenu/ContextMenu';
import { RxReset } from 'react-icons/rx';
import { IoMdCheckmark } from 'react-icons/io';
import TooltipNotification from 'ui/TooltipNotification/TooltipNotification';
import { TooltipNotificationState } from 'types/alert';

interface Props {
  boardId: string,
}

const SetThumbnail: React.FC<Props> = (props) => {
  const editor = useEditor();

  const [notification, setNotification] = useState<TooltipNotificationState | null>(null);

  const { mutate: setThumbnail } = useMutation({
    mutationFn: setBoardThumbnail.request,
    onSuccess: () => {
      setNotification({
        message: 'Thumbnail set!',
        variant: 'success',
      });
    },
    onError: () => {
      setNotification({
        message: 'Failed to set thumbnail :(',
        variant: 'error',
      });
    },
  });

  const { mutate: resetThumbnail } = useMutation({
    mutationFn: updateBoard.request,
    onSuccess: () => {
      setNotification({
        message: 'Thumbnail reset!',
        variant: 'success',
      });
    },
    onError: () => {
      setNotification({
        message: 'Failed to reset thumbnail :(',
        variant: 'error',
      });
    },
  });

  const handleResetThumbnail = () => {
    resetThumbnail({
      id: props.boardId,
      customThumbnail: false,
    });
  };

  const handleSetThumbnail = async () => {
    // adapted from: https://github.com/Octoframes/tldraw-selection-to-png/blob/main/src/App.jsx
    const allShapes = editor.getCurrentPageShapes();
    const selectedShapes = editor.getSelectedShapes();
    const svg = await editor.getSvg(_.isEmpty(selectedShapes) ? allShapes : selectedShapes);
    if (!svg) {
      setNotification({
        message: 'Add some shapes first!',
        variant: 'error',
      });
      return;
    }

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const img = await getSvgAsImage(svg, isSafari, {
      type: 'png',
      quality: 10,
      scale: 1,
    });

    if (!img) {
      setNotification({
        message: 'Something went wrong',
        variant: 'error',
      });
      return;
    }

    setThumbnail({
      thumbnail: img,
      boardId: props.boardId,
    });
  };

  const actions = [
    {
      title: 'Set as thumbnail',
      onClick: handleSetThumbnail,
      icon: <IoMdCheckmark />,
    },
    {
      title: 'Reset thumbnail',
      onClick: handleResetThumbnail,
      icon: <RxReset />,
    },
  ];

  return (
    <>
      <TooltipNotification
        id="thumbnailAction"
        notification={notification}
        onClose={() => setNotification(null)}
      />
      <ContextMenu
        id="setThumbnailTooltip"
        actions={actions}
        offset={25}
      >
        <IoMdImages
          size={30}
          data-tooltip-id="thumbnailAction"
        />
      </ContextMenu>
    </>
  );
};

export default SetThumbnail;
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchTemplate, updateTemplate } from 'api/templates';
import Loader from 'ui/Loader/Loader';
import NotFound from 'ui/NotFound/NotFound';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { appHeaderState } from 'store/app';
import s from 'pages/Board/Board.module.css';
import {
  createTLStore,
  defaultShapeUtils,
  Editor,
  setUserPreferences,
  Tldraw,
  TLUiMenuGroup,
  TLUiOverrides,
} from '@tldraw/tldraw';
import TemplateCustomPanel from 'pages/Template/TemplateCustomPanel';
import { themeState } from 'store/theme';

const Template: React.FC = () => {
  const { id } = useParams();
  const saveInterval = useRef<number | null>(null);
  const theme = useRecoilValue(themeState);

  const [store] = useState(() => {
    return createTLStore({
      shapeUtils: [...defaultShapeUtils],
    });
  });

  const { data: template, isLoading, isFetched } = useQuery({
    queryKey: [fetchTemplate.name, id],
    queryFn: () => fetchTemplate.request(id ?? ''),
  });

  const { mutate: updateSnapshot } = useMutation({
    mutationFn: updateTemplate.request,
  });

  const setAppHeader = useSetRecoilState(appHeaderState);

  const saveTemplateSnapshot = () => {
    updateSnapshot({
      templateId: id as string,
      snapshot: store.getSnapshot('all'),
    });
  };

  useEffect(() => {
    setAppHeader(false);

    return () => {
      setAppHeader(true);
    };
  }, []);

  useEffect(() => {
    setUserPreferences({ id: '', isDarkMode: theme === 'dark', isSnapMode: true });
  }, [theme]);

  useEffect(() => {
    if (saveInterval.current) {
      clearInterval(saveInterval.current);
    }

    if (template) {
      store.loadSnapshot(template.snapshot);
      saveInterval.current = window.setInterval(saveTemplateSnapshot, 3000);
    }

    return () => {
      if (saveInterval.current) {
        clearInterval(saveInterval.current);
      }

      if (template) {
        saveTemplateSnapshot();
      }
    };
  }, [template]);

  if (!template && isFetched) {
    return (
      <NotFound
        text="Template does not exist"
        link="/templates"
      />
    );
  }

  if (isLoading || !template) {
    return (
      <div className={s.noContentContainer}>
        <Loader />
      </div>
    );
  }

  const overrides: TLUiOverrides = {
    helpMenu: (editor, schema) => {
      (schema[0] as TLUiMenuGroup).children.shift();
      return schema;
    },
  };

  const handleBoardMount = (editor: Editor) => {
    editor.updateInstanceState({ isDebugMode: false, isReadonly: false });
  };

  return (
    <div className={s.canvas}>
      <Tldraw
        onMount={handleBoardMount}
        overrides={overrides}
        store={store}
      >
        <TemplateCustomPanel
          template={template}
        />
      </Tldraw>
    </div>
  );
};

export default Template;
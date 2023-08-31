import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { TPagedList } from '@cromwell/core';

const idObj = new Proxy(
  {},
  {
    get: function getter(target, key) {
      if (key === '__esModule') {
        return true;
      }
      return (props) => React.createElement('span', null, props.children);
    },
  },
);

// For perfomance reasons
jest.doMock('@mui/icons-material', () => {
  return idObj;
});

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    ...originalModule,
    useParams: () => ({ id: '1' }),
    Link: () => null,
    useHistory: () => {},
    withRouter: (c) => c,
    block: () => null,
  };
});

jest.mock('@react-hook/window-size/throttled', () => {
  return {
    useWindowWidth: () => 1000,
  };
});

const pageInfo = new Proxy(
  {},
  {
    get: function getter() {
      return {};
    },
  },
);

jest.doMock('../constants/PageInfos', () => {
  return pageInfo;
});

jest.doMock('@constants/PageInfos', () => {
  return pageInfo;
});

jest.mock('@helpers/editor', () => {
  return {
    getEditorData: () => {},
    getEditorHtml: () => '',
    initTextEditor: () => null,
    destroyEditor: () => null,
  };
});

jest.mock('../helpers/editor', () => {
  return {
    getEditorData: () => {},
    getEditorHtml: () => '',
    initTextEditor: () => null,
    destroyEditor: () => null,
  };
});

jest.mock('@cromwell/core-frontend', () => {
  const loadable = jest.requireActual('@loadable/component')?.default;
  return {
    CList: (props: any) => {
      const Comp = loadable(async () => {
        const items: TPagedList<any> = await props.loader();
        const ListItem = props.ListItem;
        return () => (
          <div>
            {items.elements?.map((it) => {
              return <ListItem key={it.id} data={it} listItemProps={props.listItemProps} />;
            })}
          </div>
        );
      });
      return <Comp />;
    },
    Lightbox: () => <></>,
    getRestApiClient: () => {
      return {
        getCmsStatus: () => null,
      };
    },
    getCStore: () => {
      return {
        getPriceWithCurrency: jest.fn().mockImplementation((val) => val + ''),
      };
    },
  };
});

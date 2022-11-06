import { render, screen } from '@testing-library/react';
import React from 'react';
import loadable from '@loadable/component';

import FileManager from './FileManager';
import { getFileManager } from './helpers';

jest.mock('@cromwell/core-frontend', () => {
  return {
    getRestApiClient: () => {
      return {
        readPublicDir: jest.fn().mockImplementation(() => ['_test1_']),
      };
    },
    CList: (props: any) => {
      const Comp = loadable(async () => () => (
        <div>
          {props.dataList.map((it) => {
            return <p key={it}>{it}</p>;
          })}
        </div>
      ));
      return <Comp />;
    },
  };
});

describe('FileManager component', () => {
  it('renders public dir', async () => {
    render(<FileManager isActive={true} />);
    getFileManager()?.getPhoto();
    await screen.findByText('_test1_');
  });
});

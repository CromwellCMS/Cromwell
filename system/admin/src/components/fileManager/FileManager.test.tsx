import { render, screen, act } from '@testing-library/react';
import React from 'react';

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
      return (
        <div>
          {props.dataList.map((it) => {
            return <p key={it}>{it}</p>;
          })}
        </div>
      );
    },
    Lightbox: () => <></>,
  };
});

describe('FileManager component', () => {
  it('renders public dir', async () => {
    act(() => {
      render(<FileManager isActive={true} />);
    });
    await screen.findByTestId('FileManagerContainer');

    act(() => {
      getFileManager()?.getPhoto();
    });

    await screen.findByText('_test1_');
  });
});

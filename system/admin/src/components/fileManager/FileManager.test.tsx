import { render, screen, act } from '@testing-library/react';
import React from 'react';

import FileManager from './FileManager';
import { getFileManager } from './helpers';

const frontend = require('@cromwell/core-frontend');
frontend.getRestApiClient = () => {
  return {
    getCmsStatus: () => null,
    readPublicDir: jest.fn().mockImplementation(() => ['_test1_']),
  };
};

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

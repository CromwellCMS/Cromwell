import { render } from '@testing-library/react';
import React from 'react';

jest.doMock('@cromwell/core-frontend', () => {
  const originalModule = jest.requireActual('@cromwell/core-frontend');
  return {
    ...originalModule,
    CPlugin: (props) => <div {...props}></div>,
  };
});

import { CategoryFilter } from './CategoryFilter';

describe('CategoryFilter', () => {
  it('renders', async () => {
    // It should render a plugin, but without
    // api server just check it renders container with a css class
    const { container } = render(<CategoryFilter classes={{ plugin: '_test1_' }} />);

    expect(container.getElementsByClassName('_test1_')).toBeTruthy();
  });
});

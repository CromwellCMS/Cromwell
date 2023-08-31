import { render, screen } from '@testing-library/react';
import React from 'react';

jest.mock('@cromwell/core-frontend', () => {
  return {
    CGallery: (props) => props.gallery?.slides ?? null,
    Link: (props) => props.children,
  };
});

import Showcase from '../../src/frontend/index';

describe('plugin frontend', () => {
  it('renders showcase items', async () => {
    render(
      <Showcase
        pluginName="showcase"
        blockName="showcase"
        data={{
          products: {
            elements: [
              {
                id: 1,
                name: '_test1_',
              },
            ],
          },
        }}
      />,
    );

    await screen.findByText('_test1_');
  });
});

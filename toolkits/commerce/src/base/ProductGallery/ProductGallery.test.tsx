import { render } from '@testing-library/react';
import React from 'react';

jest.mock('react-resize-detector', () => {
  return (props) => <>{props.children({ width: 400, height: 400 })}</>;
});

import { ProductGallery } from './ProductGallery';

describe('ProductGallery', () => {

  it("renders", async () => {
    const { container } = render(<ProductGallery
      product={{
        id: 1,
        name: '_test1_',
        images: ['_test2_']
      }}
    />);
    expect(container.innerHTML.includes('_test2_')).toBeTruthy();
  });

})
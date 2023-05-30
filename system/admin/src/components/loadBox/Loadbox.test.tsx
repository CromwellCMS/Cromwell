import { render } from '@testing-library/react';
import React from 'react';

import LoadBox from './LoadBox';

describe('LoadBox component', () => {
  it('renders props', () => {
    const { container } = render(<LoadBox className={'_test_'} />);
    const loadboxInner = container.getElementsByClassName('_test_');
    expect(loadboxInner.length).toBeTruthy();
  });
});

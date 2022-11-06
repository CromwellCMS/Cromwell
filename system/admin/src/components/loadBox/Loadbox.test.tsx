import React from 'react';
import LoadBox from './LoadBox';
import { render, screen } from '@testing-library/react';

describe('LoadBox component', () => {
  it('renders props', () => {
    const { container } = render(<LoadBox className={'_test_'} />);
    const loadboxInner = container.getElementsByClassName('_test_');
    expect(loadboxInner.length).toBeTruthy();
  });
});

import { Button } from '@mui/material';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import ConfirmationModal, { modalStyles } from './Confirmation';

describe('ConfirmationModal component', () => {
  it('renders title', async () => {
    render(<ConfirmationModal title="_test_modal_" open={true} />);
    await screen.findByText('_test_modal_');
  });

  it('fires actions', () => {
    let confirmed = false;
    let closed = false;
    render(
      <ConfirmationModal
        title="_test_modal_"
        open={true}
        onConfirm={() => {
          confirmed = true;
        }}
        onClose={() => {
          closed = true;
        }}
      />,
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length === 2).toBeTruthy();

    buttons.forEach((btn) => {
      fireEvent.click(btn);
    });
    expect(confirmed).toBeTruthy();
    expect(closed).toBeTruthy();
  });
});

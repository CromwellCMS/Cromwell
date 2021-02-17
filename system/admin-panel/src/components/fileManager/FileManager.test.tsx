import { render, screen } from '@testing-library/react';
import React from 'react';

import FileManager from './FileManager';
import { getFileManager } from './helpers';

describe('FileManager component', () => {

    it("renders content", async () => {
        render(<FileManager />);
        getFileManager()?.getPhoto();
        await screen.findByText('Select');
    });

})

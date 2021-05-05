import { connectDatabase, mockWorkingDirectory } from '../helpers';
import { getServerDefaultEmailsDir, getServerTempEmailsDir } from '../../src/helpers/paths';
import { getEmailTemplate } from '../../src/helpers/emailing';

import fs from 'fs-extra';
import { resolve } from 'path';

describe('emailing', () => {

    beforeAll(async () => {
        await mockWorkingDirectory('emailing');
        await connectDatabase();
    });

    it('reads template and places HBS variables', async () => {
        const testText = 'hello_test';
        const testVarName = '{{ testVar }}';
        const content = `<p>${testVarName}</p>`;
        const fileName = 'test.html';

        await fs.outputFile(resolve(getServerTempEmailsDir(), fileName), content);
        const temp = await getEmailTemplate(fileName, {
            testVar: testText
        });
        expect(temp).toEqual(content.replace(testVarName, testText));
    });

});

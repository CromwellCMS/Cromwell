import fs from 'fs-extra';
import Handlebars from 'handlebars';
import nodemailer from 'nodemailer';
import { resolve } from 'path';

import { getCmsSettings } from './cms-settings';
import { getLogger } from './logger';
import { getServerDir, getServerTempDir } from './paths';


let nodemailerTransporter;
let sendmailTransporter;

export const getEmailTemplate = async (fileName: string, props?: Record<string, any>): Promise<string | undefined> => {
    // User can create his own template and override original 
    const mailUserPath = resolve(getServerTempDir(), 'emails', fileName);
    const serverDir = getServerDir();
    const mailOriginalPath = serverDir ? resolve(serverDir, 'static/emails', fileName) : undefined;

    let emailContent;
    if (await fs.pathExists(mailUserPath)) {
        emailContent = (await fs.readFile(mailUserPath)).toString();
    } else if (mailOriginalPath && await fs.pathExists(mailOriginalPath)) {
        emailContent = (await fs.readFile(mailOriginalPath)).toString();
    }

    if (emailContent) {
        emailContent = Handlebars.compile(emailContent)(props ?? {});
    }

    return emailContent;
}

export const sendEmail = async (addresses: string[], subject: string, htmlContent: string): Promise<boolean> => {
    const cmsSettings = await getCmsSettings();
    const logger = getLogger();

    const { sendFromEmail, smtpConnectionString } = cmsSettings ?? {};

    const sendFrom = (sendFromEmail && sendFromEmail !== '') ? sendFromEmail : 'Service@CromwellCMS.com';
    const messageContent = {
        from: sendFrom,
        to: addresses.join(', '),
        subject: subject,
        html: htmlContent,
    };

    // Define sender service.
    // If SMTP connection string provided, use nodemailer
    if (smtpConnectionString && smtpConnectionString !== '') {
        if (!nodemailerTransporter) {
            nodemailerTransporter = nodemailer.createTransport(smtpConnectionString);
        }
        try {
            await nodemailerTransporter.sendMail(messageContent);
            return true;
        } catch (e) {
            logger.error(e);
            return false;
        }

    } else {
        // Otherwise use local SMTP client via sendmail

        if (!sendmailTransporter) {
            sendmailTransporter = require('sendmail')({
                logger: {
                    debug: logger.log,
                    info: logger.log,
                    warn: logger.log,
                    error: logger.error
                },
                silent: false,
            })
        }
        return new Promise(done => {
            setTimeout(() => done(false), 120000);

            sendmailTransporter(messageContent, (err, reply) => {
                logger.log(reply);
                if (err)
                    logger.error(err && err.stack);
                err ? done(false) : done(true);
            });
        })

    }
}

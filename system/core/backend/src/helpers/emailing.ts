import { getServerDir, getServerTempDir } from './paths';
import { getLogger } from './constants';
import { getCmsSettings } from './cmsEntity';
import { getStoreItem } from '@cromwell/core';
import fs from 'fs-extra';
import Handlebars from 'handlebars';
import { resolve } from 'path';
import nodemailer from 'nodemailer';

const logger = getLogger('detailed');

let nodemailerTransporter;
let sendmailTransporter;

export const getEmailTemplate = async (tempType: 'forgot-password' | 'order', props?: Record<string, any>) => {
    let mailFileName;
    switch (tempType) {
        case 'order':
            mailFileName = 'order.html';
            break;
        case 'forgot-password':
            mailFileName = 'forgot-password.html';
            break;
    }
    if (!mailFileName) return;

    // User can create his own template and override original 
    const mailUserPath = resolve(getServerTempDir(), 'emails', mailFileName);
    const serverDir = getServerDir();
    const mailOriginalPath = serverDir ? resolve(serverDir, 'static/emails', mailFileName) : undefined;

    let emailContent;
    if (await fs.pathExists(mailUserPath)) {
        emailContent = (await fs.readFile(mailUserPath)).toString();
    } else if (mailOriginalPath && await fs.pathExists(mailOriginalPath)) {
        emailContent = (await fs.readFile(mailOriginalPath)).toString();
    }

    if (emailContent && props) {
        emailContent = Handlebars.compile(emailContent)(props);
    }

    return emailContent;
}

export const sendEmail = async (addresses: string[], subject: string, htmlContent: string): Promise<boolean> => {
    const cmsSettings = await getCmsSettings();

    const sendFrom = (cmsSettings?.sendFromEmail && cmsSettings.sendFromEmail !== '') ? cmsSettings.sendFromEmail : 'Service@CromwellCMS.com';
    const messageContent = {
        from: sendFrom,
        to: addresses.join(', '),
        subject: subject,
        html: htmlContent,
    };

    // Define sender service.
    // If SMTP connection string provided, use nodemailer
    if (cmsSettings?.smtpConnectionString && cmsSettings.smtpConnectionString !== '') {
        if (!nodemailerTransporter) {
            nodemailerTransporter = nodemailer.createTransport(cmsSettings.smtpConnectionString);
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
                    info: logger.info,
                    warn: logger.warn,
                    error: logger.error
                },
                silent: false,
            })
        }
        return new Promise(done => {
            sendmailTransporter(messageContent, (err, reply) => {
                logger.log(reply);
                if (err)
                    logger.error(err && err.stack);
                err ? done(false) : done(true);
            });
        })

    }
}

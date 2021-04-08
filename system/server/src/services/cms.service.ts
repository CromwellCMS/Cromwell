import { getStoreItem, setStoreItem, TCmsConfig, TCmsSettings, TPackageCromwellConfig } from '@cromwell/core';
import { getCmsEntity, getLogger, getNodeModuleDir, readCMSConfig, serverLogFor } from '@cromwell/core-backend';
import { Injectable } from '@nestjs/common';
import fs from 'fs-extra';
import { join, resolve } from 'path';
import stream from 'stream';
import { getCustomRepository } from 'typeorm';
import * as util from 'util';

import { CmsConfigDto } from '../dto/cms-config.dto';
import { CmsConfigUpdateDto } from '../dto/cms-config.update.dto';
import { GenericCms } from '../helpers/genericEntities';

const logger = getLogger('detailed');


// Don't re-read cmsconfig.json but update info from DB
export const getCmsSettings = async (): Promise<TCmsSettings | undefined> => {
    let config: TCmsConfig | undefined = undefined;
    const cmsSettings = getStoreItem('cmsSettings');
    if (!cmsSettings) config = await readCMSConfig();

    if (!cmsSettings && !config) {
        serverLogFor('errors-only', 'getCmsSettings: Failed to read CMS config', 'Error');
        return;
    }

    const entity = await getCmsEntity();

    const settings: TCmsSettings = Object.assign({}, cmsSettings, config, entity);
    delete settings.defaultSettings;

    //@ts-ignore
    if (settings._currencies) {
        try {
            //@ts-ignore
            settings.currencies = JSON.parse(settings._currencies)
        } catch (e) { serverLogFor('errors-only', 'getCmsSettings: Failed parse currencies', 'Error'); }
        //@ts-ignore
        delete settings._currencies;
    }

    setStoreItem('cmsSettings', settings);
    return settings;
}

@Injectable()
export class CmsService {

    public getSettings = getCmsSettings;

    public async setThemeName(themeName: string) {
        const entity = await getCmsEntity();
        if (entity) {
            entity.themeName = themeName;
            const cmsRepo = getCustomRepository(GenericCms.repository);
            await cmsRepo.save(entity);
            return true;
        }
        return false;
    }

    async uploadFile(req: any, dirName: string): Promise<any> {
        //Check request is multipart
        if (!req.isMultipart()) {
            return
        }

        const handler = async (field: string, file: any, filename: string, encoding: string, mimetype: string): Promise<void> => {
            const fullPath = join(`${dirName}/${filename}`);
            if (await fs.pathExists(fullPath)) return;

            const pipeline = util.promisify(stream.pipeline);
            const writeStream = fs.createWriteStream(fullPath); //File path
            try {
                await pipeline(file, writeStream);
            } catch (err) {
                console.error('Pipeline failed', err);
            }
        }

        const mp = await req.multipart(handler, (err) => {

        });
        // for key value pairs in request
        mp.on('field', function (key: any, value: any) {
            console.log('form-data', key, value);
        });
    }


    public async parseModuleConfigImages(moduleInfo: TPackageCromwellConfig, moduleName: string) {
        if (moduleInfo?.icon) {
            const moduleDir = await getNodeModuleDir(moduleName);
            // Read icon and convert to base64
            if (moduleDir) {
                const imgPath = resolve(moduleDir, moduleInfo?.icon);
                if (await fs.pathExists(imgPath)) {
                    const data = (await fs.readFile(imgPath))?.toString('base64');
                    if (data) moduleInfo.icon = data;
                }
            }
        }

        if (moduleInfo?.previewImage) {
            // Read image and convert to base64
            const moduleDir = await getNodeModuleDir(moduleName);
            if (moduleDir) {
                const imgPath = resolve(moduleDir, moduleInfo.previewImage);
                if (await fs.pathExists(imgPath)) {
                    const data = (await fs.readFile(imgPath))?.toString('base64');
                    if (data) moduleInfo.previewImage = data;
                }
            }
        }
    }

    public async installCms() {
        const cmsEntity = await getCmsEntity();
        if (cmsEntity.installed) {
            logger.error('CMS already installed');
            return false;
        }

        cmsEntity.installed = true;
        const cmsRepo = getCustomRepository(GenericCms.repository);
        await cmsRepo.save(cmsEntity);

        const settings = await getCmsSettings();
        if (settings) {
            setStoreItem('cmsSettings', settings)
        }

        return true;
    }

    public async updateCmsConfig(input: CmsConfigUpdateDto): Promise<CmsConfigDto | undefined> {
        const entity = await getCmsEntity();
        if (!entity) throw new Error('!entity');

        entity.protocol = input.protocol;
        entity.defaultPageSize = input.defaultPageSize;
        entity.currencies = input.currencies;
        entity.timezone = input.timezone;
        entity.language = input.language;
        entity.favicon = input.favicon;
        entity.logo = input.logo;
        entity.headerHtml = input.headerHtml;
        entity.footerHtml = input.footerHtml;

        await entity.save();
        return this.getSettings();
    }

}

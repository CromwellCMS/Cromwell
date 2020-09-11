import { Router } from 'express';
import fs from 'fs-extra';
import {
    serviceLocator, apiV1BaseRoute
} from '@cromwell/core';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { projectRootDir } from '../constants';

export const getManagerController = (): Router => {
    const managerController = Router();
    const managerUrl = `${serviceLocator.getManagerUrl()}/${apiV1BaseRoute}`;

    /**
     * @swagger
     * 
     * /manager/change-theme/{themeName}:
     *   get:
     *     description: Changes current theme
     *     tags: 
     *       - Manager
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: themeName
     *         description: Name of a new theme to change
     *         in: path
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: true
     */
    managerController.get(`/change-theme/:themeName`, async (req, res) => {
        const themeName = req.params.themeName;
        let success = false;
        if (themeName && themeName !== '') {
            const url = `${managerUrl}/renderer/change-theme/${themeName}`;
            console.log('url', url);
            try {
                success = (await axios.get(url)).data;
            } catch (e) {
                console.log(e);
            }
        }
        res.send(success);
    });

    return managerController;
}


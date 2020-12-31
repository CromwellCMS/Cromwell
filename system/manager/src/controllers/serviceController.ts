import { Router } from 'express';

import { changeTheme, rebuildTheme } from '../managers/baseManager';
import { ManagerState } from '../managerState';
import { getAllServices } from '../utils/cacheManager';


export const getServiceController = (): Router => {

    const serviceController = Router();

    /**
      * @swagger
      * 
      * /services:
      *   get:
      *     description: Returns list of currently runnig services
      *     tags: 
      *       - Services
      *     produces:
      *       - application/json
      *     responses:
      *       200:
      *         description: list of currently runnig services
      */
    serviceController.get(`/`, function (req, res) {
        getAllServices((cache) => {
            res.send(cache);
        });
    });


    /**
      * @swagger
      * 
      * /services/change-theme/{themeName}:
      *   get:
      *     description: Changes current theme for Renderer and AdminPanel services
      *     tags: 
      *       - Services
      *     produces:
      *       - application/json
      *     parameters:
      *       - name: themeName
      *         description: Name of a new theme to change
      *         in: query
      *         required: true
      *         type: string
      *     responses:
      *       200:
      *         description: true
      */
    serviceController.get(`/change-theme`, async function (req, res) {
        const themeName = req.query?.themeName;
        if (themeName && themeName !== '' && typeof themeName === 'string') {
            ManagerState.clearLog();
            const success = await changeTheme(themeName, ManagerState.getLogger('base', true));
            res.send(success);
        } else {
            res.send(false);
        }
    });

    /**
      * @swagger
      * 
      * /services/rebuild-theme:
      *   get:
      *     description: Rebulds current theme for Renderer and AdminPanel services
      *     tags: 
      *       - Services
      *     produces:
      *       - application/json
      *     responses:
      *       200:
      *         description: true
      */
    serviceController.get(`/rebuild-theme`, async function (req, res) {
        ManagerState.clearLog();
        const success = await rebuildTheme(ManagerState.getLogger('base', true));
        res.send(success);
    });

    return serviceController;
}
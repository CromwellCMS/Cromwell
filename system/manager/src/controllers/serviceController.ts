
import { Router } from 'express';
import fs from 'fs-extra';
import { getAllServices, saveProcessPid, loadCache } from '../utils/cacheManager';
import { closeServer } from '../managers/serverManager';
import { buildAndStart } from '../managers/rendererManager';

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
      * /services/renderer/build-and-start:
      *   get:
      *     description: Runs Next.js build and starts Next.js server
      *     tags: 
      *       - Theme
      *     produces:
      *       - application/json
      * 
      *     responses:
      *       200:
      *         description: list of currently runnig services
      */
    serviceController.get(`/renderer/build-and-start`, function (req, res) {
        buildAndStart(() => {
            res.send(true);
        });
    });

    return serviceController;
}
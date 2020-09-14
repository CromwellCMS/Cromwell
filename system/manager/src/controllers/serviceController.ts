
import { Router } from 'express';
import fs from 'fs-extra';
import { getAllServices, saveProcessPid, loadCache } from '../utils/cacheManager';

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

    return serviceController;
}
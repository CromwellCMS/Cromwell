
import { Router } from 'express';
import { buildAndStart, changeTheme } from '../managers/rendererManager';
import { ManagerState } from '../managerState';

export const getRendererController = (): Router => {

    const rendererController = Router();


    /**
      * @swagger
      * 
      * /renderer/build-and-start:
      *   get:
      *     description: Runs Next.js build and starts Next.js server
      *     tags: 
      *       - Renderer
      *     produces:
      *       - application/json
      *     responses:
      *       200:
      *         description: true
      */
    rendererController.get(`/build-and-start`, function (req, res) {
        buildAndStart(() => {
            res.send(true);
        });
    });

    /**
      * @swagger
      * 
      * /renderer/change-theme/{themeName}:
      *   get:
      *     description: Changes current theme and re-runs renderer with build (if no previous builds found) and start.
      *     tags: 
      *       - Renderer
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
    rendererController.get(`/change-theme/:themeName`, function (req, res) {
        const themeName = req.params.themeName;
        if (themeName && themeName !== '') {
            ManagerState.log = [];
            changeTheme(themeName, (success) => {
                res.send(success);
            }, ManagerState.logLine);
        } else {
            res.send(false);
        }
    });

    return rendererController;
}
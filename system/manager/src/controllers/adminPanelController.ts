import { Router } from 'express';

import { rebuildAdminPanelWeb } from '../managers/adminPanelManager';
import { ManagerState } from '../managerState';


export const getAdminPanelController = (): Router => {

    const adminPanelController = Router();

    /**
      * @swagger
      * 
      * /admin-panel/rebuild:
      *   get:
      *     description: Rebulds web of AdminPanel.
      *     tags: 
      *       - AdminPanel
      *     produces:
      *       - application/json
      *     responses:
      *       200:
      *         description: true
      */
    adminPanelController.get(`/rebuild`, function (req, res) {
        ManagerState.clearLog();
        rebuildAdminPanelWeb((success) => {
            res.send(success);
        }, ManagerState.getLogger('adminPanel', true));
    });

    return adminPanelController;

}
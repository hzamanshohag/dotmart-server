import express from 'express';

import auth from '../../middlewares/auth';
import { announcementController } from './announcement.controller';

const router = express.Router();


// admin only
router.post('/announcement', auth('ADMIN'), announcementController.createAnnouncement);
router.get('/announcement',  announcementController.getAllAnnouncements);
router.get('/announcement/:announcementId', auth('ADMIN'), announcementController.getAnnouncementById);
router.put('/announcement/:announcementId', auth('ADMIN'), announcementController.updateAnnouncement);
router.delete('/announcement/:announcementId', auth('ADMIN'), announcementController.deleteAnnouncement);

export const AnnouncementRoutes = router;

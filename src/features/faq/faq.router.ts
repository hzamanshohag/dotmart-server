import express from 'express';
import auth from '../../middlewares/auth';
import { faqController } from './faq.controller';

const router = express.Router();


// admin only
router.post('/faq', auth('ADMIN'), faqController.createFaq);
router.get('/faq', faqController.getAllFaqs);
router.get('/faq/:faqId', auth('ADMIN'), faqController.getFaqById);
router.put('/faq/:faqId', auth('ADMIN'), faqController.updateFaq);
router.delete('/faq/:faqId', auth('ADMIN'), faqController.deleteFaq);

export const FaqRoutes = router;

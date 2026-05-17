import { Router } from 'express';
import { 
  createLead, 
  getLeads, 
  getLeadById, 
  updateLead, 
  deleteLead 
} from '../controllers/leadController';
import { protect } from '../middlewares/authMiddleware';

// 1. Import our new authorize middleware and our UserRole enum
import { authorize } from '../middlewares/roleMiddleware';
import { UserRole } from '../models/User';

const router = Router();

// 2. Protect ALL routes requiring a valid JWT token
router.use(protect);

router.route('/')
  .post(createLead)
  .get(getLeads);

// 3. Apply the authorize middleware specifically to the DELETE route
router.route('/:id')
  .get(getLeadById)
  .put(updateLead)
  .delete(authorize(UserRole.ADMIN), deleteLead); // ONLY Admins can reach deleteLead

export default router;
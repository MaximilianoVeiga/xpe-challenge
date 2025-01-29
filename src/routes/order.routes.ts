import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { body } from 'express-validator';

const router = Router();

const orderValidation = [
  body('orderNumber').notEmpty().withMessage('orderNumber is required'),
  body('customerName').notEmpty().withMessage('customerName is required'),
  body('totalValue').isNumeric().withMessage('totalValue must be a number'),
];

router.get('/count/all/orders', OrderController.count);
router.get('/customerName/:name', OrderController.findByCustomerName);

router.post('/', orderValidation, OrderController.create);
router.get('/', OrderController.findAll);
router.get('/:id', OrderController.findById);
router.put('/:id', orderValidation, OrderController.update);
router.delete('/:id', OrderController.delete);

export default router;

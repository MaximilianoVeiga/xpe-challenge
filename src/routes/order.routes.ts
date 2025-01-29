import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { body } from 'express-validator';

const router = Router();

const orderValidation = [
  body('orderNumber')
    .notEmpty()
    .withMessage('orderNumber is required')
    .isString()
    .withMessage('orderNumber must be a string')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('orderNumber must be between 3 and 50 characters')
    .matches(/^[A-Za-z0-9-]+$/)
    .withMessage('orderNumber can only contain letters, numbers and hyphens'),

  body('customerName')
    .notEmpty()
    .withMessage('customerName is required')
    .isString()
    .withMessage('customerName must be a string')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('customerName must be between 2 and 100 characters')
    .matches(/^[A-Za-z\s'-]+$/)
    .withMessage(
      'customerName can only contain letters, spaces, hyphens and apostrophes',
    ),

  body('totalValue')
    .notEmpty()
    .withMessage('totalValue is required')
    .isFloat({ min: 0.01, max: 999999.99 })
    .withMessage('totalValue must be between 0.01 and 999999.99')
    .custom((value) => {
      if (!/^\d+(\.\d{1,2})?$/.test(value.toString())) {
        throw new Error('totalValue can only have up to 2 decimal places');
      }
      return true;
    }),
];

router.get('/count/all/orders', OrderController.count);
router.get('/customerName/:name', OrderController.findByCustomerName);

router.post('/', orderValidation, OrderController.create);
router.get('/', OrderController.findAll);
router.get('/:id', OrderController.findById);
router.put('/:id', orderValidation, OrderController.update);
router.delete('/:id', OrderController.delete);

export default router;

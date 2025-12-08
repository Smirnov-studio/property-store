const express = require('express');
const router = express.Router();
const complexController = require('../controllers/complexController');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const { body } = require('express-validator');

// Публичные маршруты
router.get('/', complexController.getAllComplexes);
router.get('/:id', complexController.getComplexById);
router.post('/calculate', complexController.calculatePrice);
router.get('/:id/price-history', complexController.getPriceHistory);

// Защищенные маршруты (только авторизованные)
router.use(authenticateToken);

// Маршруты администратора
router.post('/', isAdmin, [
  body('name').notEmpty().trim(),
  body('description').notEmpty().trim(),
  body('location').notEmpty().trim(),
  body('pricePerSquare').isFloat({ min: 10000 }),
  body('constructionStage').isIn(['planning', 'construction', 'completed'])
], complexController.createComplex);

router.put('/:id', isAdmin, [
  body('name').optional().notEmpty().trim(),
  body('pricePerSquare').optional().isFloat({ min: 10000 })
], complexController.updateComplex);

router.delete('/:id', isAdmin, complexController.deleteComplex);

router.post('/:id/layouts', isAdmin, [
  body('rooms').isInt({ min: 1 }),
  body('area').isFloat({ min: 10 })
], complexController.addLayout);

router.delete('/:id/layouts/:layoutId', isAdmin, complexController.removeLayout);

module.exports = router;
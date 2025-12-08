const ResidentialComplex = require('../models/ResidentialComplex');
const { validationResult } = require('express-validator');

exports.getAllComplexes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filters = {
      constructionStage: req.query.stage,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice
    };

    const complexes = await ResidentialComplex.findAll(page, limit, filters);
    const totalResult = await db.query(
      'SELECT COUNT(*) as count FROM residential_complexes WHERE is_published = true'
    );
    const total = parseInt(totalResult.rows[0].count);

    res.json({
      complexes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Ошибка получения ЖК:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

exports.getComplexById = async (req, res) => {
  try {
    const complex = await ResidentialComplex.findById(req.params.id);
    if (!complex) {
      return res.status(404).json({ error: 'ЖК не найден' });
    }
    res.json(complex);
  } catch (error) {
    console.error('Ошибка получения ЖК:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

exports.createComplex = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const complex = await ResidentialComplex.create(req.body, req.user.id);
    res.status(201).json(complex);
  } catch (error) {
    console.error('Ошибка создания ЖК:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

exports.updateComplex = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const complex = await ResidentialComplex.update(req.params.id, req.body, req.user.id);
    if (!complex) {
      return res.status(404).json({ error: 'ЖК не найден' });
    }
    res.json(complex);
  } catch (error) {
    console.error('Ошибка обновления ЖК:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

exports.deleteComplex = async (req, res) => {
  try {
    const complex = await ResidentialComplex.delete(req.params.id);
    if (!complex) {
      return res.status(404).json({ error: 'ЖК не найден' });
    }
    res.json({ message: 'ЖК успешно удален', id: complex.id });
  } catch (error) {
    console.error('Ошибка удаления ЖК:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

exports.addLayout = async (req, res) => {
  try {
    const layout = await ResidentialComplex.addLayout(req.params.id, req.body);
    res.status(201).json(layout);
  } catch (error) {
    console.error('Ошибка добавления планировки:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

exports.removeLayout = async (req, res) => {
  try {
    const layout = await ResidentialComplex.removeLayout(req.params.layoutId);
    if (!layout) {
      return res.status(404).json({ error: 'Планировка не найдена' });
    }
    res.json({ message: 'Планировка удалена', id: layout.id });
  } catch (error) {
    console.error('Ошибка удаления планировки:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

exports.calculatePrice = async (req, res) => {
  try {
    const { complexId, rooms, area } = req.body;

    // Получаем ЖК с ценой
    const complexResult = await db.query(
      `SELECT rc.name, cp.price_per_square 
       FROM residential_complexes rc
       JOIN complex_prices cp ON rc.id = cp.complex_id
       WHERE rc.id = $1`,
      [complexId]
    );

    if (complexResult.rows.length === 0) {
      return res.status(404).json({ error: 'ЖК не найден' });
    }

    const complex = complexResult.rows[0];
    const totalPrice = complex.price_per_square * area;

    // Сохраняем расчет в историю, если пользователь авторизован
    if (req.user) {
      await db.query(
        `INSERT INTO calculation_history 
         (user_id, complex_id, rooms, area, price_per_square, total_price)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [req.user.id, complexId, rooms, area, complex.price_per_square, totalPrice]
      );
    }

    res.json({
      complexName: complex.name,
      pricePerSquare: complex.price_per_square,
      area,
      totalPrice,
      rooms
    });
  } catch (error) {
    console.error('Ошибка расчета стоимости:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

exports.getPriceHistory = async (req, res) => {
  try {
    const history = await db.query(
      `SELECT ph.*, u.email as changed_by_email 
       FROM price_history ph
       LEFT JOIN users u ON ph.changed_by = u.id
       WHERE ph.complex_id = $1
       ORDER BY ph.change_date DESC`,
      [req.params.id]
    );
    res.json(history.rows);
  } catch (error) {
    console.error('Ошибка получения истории цен:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};
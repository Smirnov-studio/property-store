require('dotenv').config(); // Загружаем .env в начале файла

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001; // Используем переменную из .env


console.log('🔧 Environment:', process.env.NODE_ENV);
console.log('🌐 Backend URL:', `http://localhost:${PORT}`);
console.log('🔗 API URL:', `http://localhost:${PORT}/api`);

// Middleware
app.use(cors());
app.use(express.json());

// Mock данные
const mockComplexes = [
  {
    id: 1,
    name: 'ЖК Северный',
    description: 'Современный жилой комплекс в экологически чистом районе с развитой инфраструктурой. Рядом парк, школы и детские сады.',
    price_per_square: 120000,
    location: 'ул. Северная, 15',
    address: 'ул. Северная, 15',
    developer: 'СтройГарант',
    construction_stage: 'construction',
    delivery_date: '2024-12-31',
    amenities: ['паркинг', 'детская площадка', 'фитнес-центр', 'охрана'],
    images: [],
    layouts: [
      { rooms: 1, area: 45, floorPlans: [] },
      { rooms: 2, area: 65, floorPlans: [] },
      { rooms: 3, area: 85, floorPlans: [] }
    ],
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    name: 'ЖК Южные Сады',
    description: 'Комфортабельный комплекс с собственной инфраструктурой для комфортной жизни. Бассейн, спортивные площадки, зоны отдыха.',
    price_per_square: 135000,
    location: 'пр. Южный, 42',
    address: 'пр. Южный, 42',
    developer: 'ЮгСтрой',
    construction_stage: 'completed',
    delivery_date: '2023-06-15',
    amenities: ['бассейн', 'спортивная площадка', 'подземный паркинг', 'детский клуб'],
    images: [],
    layouts: [
      { rooms: 1, area: 40, floorPlans: [] },
      { rooms: 2, area: 60, floorPlans: [] },
      { rooms: 3, area: 80, floorPlans: [] },
      { rooms: 4, area: 100, floorPlans: [] }
    ],
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z'
  },
  {
    id: 3,
    name: 'ЖК Центральный',
    description: 'Элитный комплекс в историческом центре города с уникальной архитектурой. Высокий уровень безопасности, премиальная отделка.',
    price_per_square: 180000,
    location: 'ул. Центральная, 7',
    address: 'ул. Центральная, 7',
    developer: 'ЭлитСтрой',
    construction_stage: 'planning',
    delivery_date: '2025-09-30',
    amenities: ['консьерж', 'VIP отделка', 'охраняемая территория', 'зимний сад'],
    images: [],
    layouts: [
      { rooms: 2, area: 55, floorPlans: [] },
      { rooms: 3, area: 75, floorPlans: [] },
      { rooms: 4, area: 95, floorPlans: [] }
    ],
    created_at: '2024-02-01T00:00:00.000Z',
    updated_at: '2024-02-01T00:00:00.000Z'
  }
];

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running with mock data',
    timestamp: new Date().toISOString()
  });
});

// Получить все ЖК
app.get('/api/complexes', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  
  const paginated = mockComplexes.slice(offset, offset + limit);
  
  res.json({
    complexes: paginated,
    pagination: {
      page,
      limit,
      total: mockComplexes.length,
      totalPages: Math.ceil(mockComplexes.length / limit)
    }
  });
});

// Получить ЖК по ID
app.get('/api/complexes/:id', (req, res) => {
  const complex = mockComplexes.find(c => c.id === parseInt(req.params.id));
  
  if (!complex) {
    return res.status(404).json({ error: 'ЖК не найден' });
  }
  
  res.json(complex);
});

// Рассчитать стоимость
app.post('/api/complexes/calculate', (req, res) => {
  const { complexId, rooms, area } = req.body;
  
  const complex = mockComplexes.find(c => c.id === complexId);
  
  if (!complex) {
    return res.status(404).json({ error: 'ЖК не найден' });
  }
  
  const totalPrice = complex.price_per_square * area;
  
  res.json({
    complexName: complex.name,
    pricePerSquare: complex.price_per_square,
    area,
    totalPrice,
    rooms
  });
});

// Аутентификация (заглушки)
app.post('/api/auth/register', (req, res) => {
  res.json({
    user: {
      id: 1,
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      role: 'user',
      createdAt: new Date().toISOString()
    },
    token: 'mock-jwt-token-' + Date.now()
  });
});

app.post('/api/auth/login', (req, res) => {
  res.json({
    user: {
      id: 1,
      email: req.body.email,
      firstName: 'Тестовый',
      lastName: 'Пользователь',
      role: 'user',
      createdAt: '2024-01-01T00:00:00.000Z'
    },
    token: 'mock-jwt-token-' + Date.now()
  });
});

app.get('/api/auth/profile', (req, res) => {
  res.json({
    id: 1,
    email: 'test@example.com',
    firstName: 'Тестовый',
    lastName: 'Пользователь',
    role: 'user',
    createdAt: '2024-01-01T00:00:00.000Z'
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`🔗 API доступен по адресу http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🏢 Комплексы: http://localhost:${PORT}/api/complexes`);
  console.log(`🌍 Frontend: ${process.env.FRONTEND_URL}`);
});
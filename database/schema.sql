-- Пользователи
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Жилые комплексы
CREATE TABLE residential_complexes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(500),
    address VARCHAR(500),
    developer VARCHAR(255),
    construction_stage VARCHAR(50) CHECK (construction_stage IN ('planning', 'construction', 'completed')),
    delivery_date DATE,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    rating DECIMAL(3, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    is_published BOOLEAN DEFAULT true
);

-- Текущая стоимость квадратного метра
CREATE TABLE complex_prices (
    id SERIAL PRIMARY KEY,
    complex_id INTEGER REFERENCES residential_complexes(id) ON DELETE CASCADE,
    price_per_square DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- История изменений цен
CREATE TABLE price_history (
    id SERIAL PRIMARY KEY,
    complex_id INTEGER REFERENCES residential_complexes(id) ON DELETE CASCADE,
    old_price DECIMAL(12, 2) NOT NULL,
    new_price DECIMAL(12, 2) NOT NULL,
    changed_by INTEGER REFERENCES users(id),
    change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reason TEXT
);

-- Планировки квартир
CREATE TABLE apartment_layouts (
    id SERIAL PRIMARY KEY,
    complex_id INTEGER REFERENCES residential_complexes(id) ON DELETE CASCADE,
    rooms INTEGER NOT NULL CHECK (rooms > 0),
    area DECIMAL(8, 2) NOT NULL CHECK (area > 0),
    total_apartments INTEGER DEFAULT 0,
    sold_apartments INTEGER DEFAULT 0,
    features JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Удобства ЖК
CREATE TABLE amenities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(50),
    category VARCHAR(50)
);

-- Связь ЖК и удобств
CREATE TABLE complex_amenities (
    complex_id INTEGER REFERENCES residential_complexes(id) ON DELETE CASCADE,
    amenity_id INTEGER REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (complex_id, amenity_id)
);

-- Изображения ЖК
CREATE TABLE complex_images (
    id SERIAL PRIMARY KEY,
    complex_id INTEGER REFERENCES residential_complexes(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    image_type VARCHAR(50) CHECK (image_type IN ('main', 'gallery', 'plan')),
    description VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Планы этажей
CREATE TABLE floor_plans (
    id SERIAL PRIMARY KEY,
    layout_id INTEGER REFERENCES apartment_layouts(id) ON DELETE CASCADE,
    plan_url VARCHAR(500) NOT NULL,
    floor_number INTEGER,
    description VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Избранные ЖК пользователей
CREATE TABLE user_favorites (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    complex_id INTEGER REFERENCES residential_complexes(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, complex_id)
);

-- История расчетов пользователей
CREATE TABLE calculation_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    complex_id INTEGER REFERENCES residential_complexes(id),
    rooms INTEGER NOT NULL,
    area DECIMAL(8, 2) NOT NULL,
    price_per_square DECIMAL(12, 2) NOT NULL,
    total_price DECIMAL(12, 2) NOT NULL,
    calculation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание индексов для производительности
CREATE INDEX idx_complexes_location ON residential_complexes(location);
CREATE INDEX idx_complexes_stage ON residential_complexes(construction_stage);
CREATE INDEX idx_layouts_complex_rooms ON apartment_layouts(complex_id, rooms);
CREATE INDEX idx_prices_complex ON complex_prices(complex_id);
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_favorites_user ON user_favorites(user_id);

-- Вставка тестовых данных
INSERT INTO amenities (name, icon, category) VALUES
    ('Паркинг', 'parking', 'Инфраструктура'),
    ('Детская площадка', 'child', 'Инфраструктура'),
    ('Фитнес-центр', 'fitness', 'Спорт'),
    ('Бассейн', 'pool', 'Спорт'),
    ('Подземный паркинг', 'underground', 'Инфраструктура'),
    ('Охрана', 'security', 'Безопасность'),
    ('Камеры наблюдения', 'camera', 'Безопасность'),
    ('Ландшафтный дизайн', 'garden', 'Территория'),
    ('Детский клуб', 'child-club', 'Дети'),
    ('Зимний сад', 'winter-garden', 'Территория'),
    ('Консьерж', 'concierge', 'Сервис'),
    ('VIP отделка', 'vip', 'Отделка'),
    ('Спортивная площадка', 'sport', 'Спорт');

-- Создание администратора (пароль: admin123)
INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES
    ('admin@example.com', '$2b$10$YourHashedPasswordHere', 'Admin', 'User', 'admin');
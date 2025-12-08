const db = require('../config/database');

class ResidentialComplex {
  static async findAll(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;
    let query = `
      SELECT 
        rc.*,
        cp.price_per_square,
        json_agg(DISTINCT a.name) as amenities,
        COUNT(DISTINCT al.id) as layouts_count
      FROM residential_complexes rc
      LEFT JOIN complex_prices cp ON rc.id = cp.complex_id
      LEFT JOIN complex_amenities ca ON rc.id = ca.complex_id
      LEFT JOIN amenities a ON ca.amenity_id = a.id
      LEFT JOIN apartment_layouts al ON rc.id = al.complex_id
      WHERE rc.is_published = true
    `;
    
    const params = [];
    let paramCount = 1;
    
    if (filters.constructionStage) {
      query += ` AND rc.construction_stage = $${paramCount}`;
      params.push(filters.constructionStage);
      paramCount++;
    }
    
    if (filters.minPrice && filters.maxPrice) {
      query += ` AND cp.price_per_square BETWEEN $${paramCount} AND $${paramCount + 1}`;
      params.push(filters.minPrice, filters.maxPrice);
      paramCount += 2;
    }
    
    query += `
      GROUP BY rc.id, cp.price_per_square
      ORDER BY rc.created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;
    
    params.push(limit, offset);
    
    const result = await db.query(query, params);
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query(
      `SELECT 
        rc.*,
        cp.price_per_square,
        json_agg(DISTINCT a.name) as amenities,
        json_agg(DISTINCT jsonb_build_object('rooms', al.rooms, 'area', al.area)) as layouts
      FROM residential_complexes rc
      LEFT JOIN complex_prices cp ON rc.id = cp.complex_id
      LEFT JOIN complex_amenities ca ON rc.id = ca.complex_id
      LEFT JOIN amenities a ON ca.amenity_id = a.id
      LEFT JOIN apartment_layouts al ON rc.id = al.complex_id
      WHERE rc.id = $1
      GROUP BY rc.id, cp.price_per_square`,
      [id]
    );
    return result.rows[0];
  }

  static async create(complexData, userId) {
    const {
      name,
      description,
      location,
      address,
      developer,
      constructionStage,
      deliveryDate,
      pricePerSquare,
      amenities
    } = complexData;

    // Начинаем транзакцию
    const client = await db.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Создаем ЖК
      const complexResult = await client.query(
        `INSERT INTO residential_complexes 
         (name, description, location, address, developer, construction_stage, delivery_date, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [name, description, location, address, developer, constructionStage, deliveryDate, userId]
      );

      const complex = complexResult.rows[0];

      // Добавляем цену
      await client.query(
        'INSERT INTO complex_prices (complex_id, price_per_square) VALUES ($1, $2)',
        [complex.id, pricePerSquare]
      );

      // Добавляем удобства
      if (amenities && amenities.length > 0) {
        for (const amenityName of amenities) {
          await client.query(
            `INSERT INTO complex_amenities (complex_id, amenity_id)
             SELECT $1, id FROM amenities WHERE name = $2`,
            [complex.id, amenityName]
          );
        }
      }

      await client.query('COMMIT');
      return complex;

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async update(id, complexData, userId) {
    const {
      name,
      description,
      location,
      address,
      developer,
      constructionStage,
      deliveryDate,
      pricePerSquare,
      amenities
    } = complexData;

    const client = await db.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Обновляем ЖК
      const complexResult = await client.query(
        `UPDATE residential_complexes 
         SET name = $1, description = $2, location = $3, address = $4, 
             developer = $5, construction_stage = $6, delivery_date = $7,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $8
         RETURNING *`,
        [name, description, location, address, developer, constructionStage, deliveryDate, id]
      );

      // Получаем старую цену
      const oldPriceResult = await client.query(
        'SELECT price_per_square FROM complex_prices WHERE complex_id = $1',
        [id]
      );

      const oldPrice = oldPriceResult.rows[0]?.price_per_square;

      // Если цена изменилась
      if (pricePerSquare !== oldPrice) {
        // Обновляем текущую цену
        await client.query(
          'UPDATE complex_prices SET price_per_square = $1, updated_at = CURRENT_TIMESTAMP WHERE complex_id = $2',
          [pricePerSquare, id]
        );

        // Записываем в историю
        if (oldPrice) {
          await client.query(
            `INSERT INTO price_history (complex_id, old_price, new_price, changed_by)
             VALUES ($1, $2, $3, $4)`,
            [id, oldPrice, pricePerSquare, userId]
          );
        }
      }

      // Обновляем удобства
      await client.query('DELETE FROM complex_amenities WHERE complex_id = $1', [id]);

      if (amenities && amenities.length > 0) {
        for (const amenityName of amenities) {
          await client.query(
            `INSERT INTO complex_amenities (complex_id, amenity_id)
             SELECT $1, id FROM amenities WHERE name = $2`,
            [id, amenityName]
          );
        }
      }

      await client.query('COMMIT');
      return complexResult.rows[0];

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async delete(id) {
    const result = await db.query(
      'DELETE FROM residential_complexes WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  }

  static async addLayout(complexId, layoutData) {
    const { rooms, area, totalApartments, features } = layoutData;
    
    const result = await db.query(
      `INSERT INTO apartment_layouts (complex_id, rooms, area, total_apartments, features)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [complexId, rooms, area, totalApartments || 0, features || {}]
    );
    
    return result.rows[0];
  }

  static async removeLayout(layoutId) {
    const result = await db.query(
      'DELETE FROM apartment_layouts WHERE id = $1 RETURNING id',
      [layoutId]
    );
    return result.rows[0];
  }
}

module.exports = ResidentialComplex;
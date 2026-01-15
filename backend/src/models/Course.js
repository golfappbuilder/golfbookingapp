const db = require('../config/database');

const Course = {
  async findAll() {
    const result = await db.query(
      `SELECT * FROM courses ORDER BY name`
    );
    return result.rows;
  },

  async findById(id) {
    const result = await db.query(
      'SELECT * FROM courses WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  async create({ name, description, address, city, state, zip, phone, holes, parTotal, priceWeekday, priceWeekend }) {
    const result = await db.query(
      `INSERT INTO courses (name, description, address, city, state, zip, phone, holes, par_total, price_weekday, price_weekend)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [name, description, address, city, state, zip, phone, holes, parTotal, priceWeekday, priceWeekend]
    );
    return result.rows[0];
  },

  async update(id, fields) {
    const setClause = Object.keys(fields)
      .map((key, i) => `${key} = $${i + 2}`)
      .join(', ');
    const values = [id, ...Object.values(fields)];

    const result = await db.query(
      `UPDATE courses SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`,
      values
    );
    return result.rows[0];
  },
};

module.exports = Course;

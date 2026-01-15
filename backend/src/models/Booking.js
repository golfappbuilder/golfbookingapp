const db = require('../config/database');

const Booking = {
  async create({ userId, teeTimeId, players, totalPrice }) {
    const result = await db.query(
      `INSERT INTO bookings (user_id, tee_time_id, players, total_price, status)
       VALUES ($1, $2, $3, $4, 'confirmed')
       RETURNING *`,
      [userId, teeTimeId, players, totalPrice]
    );

    // Mark tee time as booked
    await db.query(
      'UPDATE tee_times SET available_slots = available_slots - $1 WHERE id = $2',
      [players, teeTimeId]
    );

    return result.rows[0];
  },

  async findByUser(userId) {
    const result = await db.query(
      `SELECT b.*, t.tee_date, t.tee_time, c.name as course_name
       FROM bookings b
       JOIN tee_times t ON b.tee_time_id = t.id
       JOIN courses c ON t.course_id = c.id
       WHERE b.user_id = $1
       ORDER BY t.tee_date DESC, t.tee_time DESC`,
      [userId]
    );
    return result.rows;
  },

  async findById(id) {
    const result = await db.query(
      `SELECT b.*, t.tee_date, t.tee_time, c.name as course_name, c.address, c.city
       FROM bookings b
       JOIN tee_times t ON b.tee_time_id = t.id
       JOIN courses c ON t.course_id = c.id
       WHERE b.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async cancel(id) {
    const booking = await this.findById(id);
    if (!booking) return null;

    await db.query(
      'UPDATE bookings SET status = $1 WHERE id = $2',
      ['cancelled', id]
    );

    // Restore available slots
    await db.query(
      'UPDATE tee_times SET available_slots = available_slots + $1 WHERE id = $2',
      [booking.players, booking.tee_time_id]
    );

    return { ...booking, status: 'cancelled' };
  },
};

module.exports = Booking;

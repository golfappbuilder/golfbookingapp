const db = require('../config/database');

const TeeTime = {
  async findAvailable(courseId, date) {
    const result = await db.query(
      `SELECT * FROM tee_times
       WHERE course_id = $1
       AND tee_date = $2
       AND available_slots > 0
       ORDER BY tee_time`,
      [courseId, date]
    );
    return result.rows;
  },

  async findById(id) {
    const result = await db.query(
      `SELECT t.*, c.name as course_name, c.price_weekday, c.price_weekend
       FROM tee_times t
       JOIN courses c ON t.course_id = c.id
       WHERE t.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async create({ courseId, teeDate, teeTime, availableSlots = 4 }) {
    const result = await db.query(
      `INSERT INTO tee_times (course_id, tee_date, tee_time, available_slots)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [courseId, teeDate, teeTime, availableSlots]
    );
    return result.rows[0];
  },

  async generateForDate(courseId, date, startHour = 6, endHour = 18, intervalMinutes = 10) {
    const teeTimes = [];
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += intervalMinutes) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const teeTime = await this.create({
          courseId,
          teeDate: date,
          teeTime: timeStr,
        });
        teeTimes.push(teeTime);
      }
    }
    return teeTimes;
  },
};

module.exports = TeeTime;

const pool = require('../utils/pool');

module.exports = class Clip {
  id;
  clip_link;
  users_id;
  o_site;

  constructor(row) {
    this.id = row.id;
    this.clip_link = row.clip_link;
    this.users_id = row.users_id;
    this.o_site = row.o_site;
  }

  static async getClipsById(id) {
    const { rows } = await pool.query(`
      select * from user_clips where users_id=$1
    `, [id]);

    return rows.map(clip => new Clip(clip));
  }
};

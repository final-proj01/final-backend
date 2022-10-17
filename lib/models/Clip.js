const pool = require('../utils/pool');

module.exports = class Clip {
  id;
  clip_link;
  users_id;
  o_site;
  created_at;
  description;
  title;

  constructor(row) {
    this.id = row.id;
    this.clip_link = row.clip_link;
    this.users_id = row.users_id;
    this.o_site = row.o_site;
    this.created_at = row.created_at;
    this.title = row.title;
    this.description = row.description;
  }

  static async getClipsById(id) {
    const { rows } = await pool.query(`
      select * from user_clips where users_id=$1
    `, [id]);

    return rows.map(clip => new Clip(clip));
  }
};

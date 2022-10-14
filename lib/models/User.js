const pool = require('../utils/pool');

module.exports = class User {
  id;
  GamerTag;
  email;
  #password_hash;
  bio;
  platforms;
  avatar_png;
  channelLinks;

  constructor(row) {
    this.id = row.id;
    this.GamerTag = row.GamerTag;
    this.email = row.email;
    this.password_hash = row.password_hash;
    this.bio = row.bio;
    this.platforms = row.platforms;
    this.avatar_png = row.avatar_png;
    this.channelLinks = row.channelLinks;
  }

  static async createUser({ GamerTag, email, password_hash }) {
    const { rows } = await pool.query(
      `
        INSERT INTO users (GamerTag, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING *
        `, 
      [GamerTag, email, password_hash]
    );
    return new User(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM users');
    return rows.map((row) => new User(row));
  }

  static async getByEmail(email) {
    const { rows } = await pool.query(
      `
        SELECT * FROM users WHERE email=$1
        `, [email]
    );

    if (!rows[0]) return null;

    return new User(rows[0]);
  }

  static async getByGamerTag(GamerTag) {
    const { rows } = await pool.query(
      `
        SELECT * FROM users 
        WHERE GamerTag ILIKE $1
        `, [GamerTag]
    );

    if (!rows[0]) return null;

    return new User(rows[0]);
  }

  static async addUserBio({ bio, platforms, channelLinks, email }) {
    const { rows } = await pool.query(
      `
          PUT INTO users (bio, platforms, channelLinks)
          VALUES ($1, $2, $3) 
          WHERE email=$4
          RETURNING *
          `, [bio, platforms, channelLinks, email]
    );
    return new User(rows[0]);
  }

  static async uploadAvatar(avatar_png) {
    const { rows } = await pool.query(
      `
        PUT INTO users (avatar_png)
        VALUES $1
        RETURNING *
        `, [avatar_png]
    );
    return new User(rows[0]);
  }

  get password_hash() {
    return this.#password_hash;
  }
};

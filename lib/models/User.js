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
    this.GamerTag = row.gamertag;
    this.email = row.email;
    this.#password_hash = row.password_hash;
    this.bio = row.bio;
    this.platforms = row.platforms;
    this.avatar_png = row.avatar_png;
    this.channelLinks = row.channellinks;
  }

  static async createUser({ GamerTag, email, password_hash }) {
    const { rows } = await pool.query(
      `
        INSERT INTO users (gamertag, email, password_hash)
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


  static async signIn({ email, password_hash }) {
    const { rows } = await pool.query(
      `
      SELECT * FROM users WHERE (email, password_hash) = ($1, $2)
      `, [email, password_hash]
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
  static async getById(id) {
    const { rows } = await pool.query(`
    select * from users where id = $1
    `, [id]);

    return new User(rows[0]);
  }

  static async updateUser(id, updatedUser) {
    const user = User.getById(id);
    if (!user) return null;

    const { bio, platforms, channelLinks } = { ...user, ...updatedUser };

    const { rows } = await pool.query(
      `
      update users set bio = $1, platforms = $2, channelLinks = $3
      where id = $4
      RETURNING *
          `, [bio, platforms, channelLinks, id]
    );
    return new User(rows[0]);
  }

  static async updateLogo({ avatar_png }, id) {
    const { rows } = await pool.query(
      `
      update users set avatar_png = $1
      where id = $2
      RETURNING *
        `, [avatar_png, id]
    );
    return new User(rows[0]);
  }

  get password_hash() {
    return this.#password_hash;
  }
};

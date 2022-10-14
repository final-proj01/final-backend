const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = class UserService {
  static async create ({ gamerTag, email, password }) {
    const password_hash = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );


    const user = await User.signIn({
      gamerTag,
      email,
      password_hash,
    });

    return user;
  }

  static async signIn({ email, password = '' }) {
    try {
      const user = await User.getByEmail(email);

      if (!user) throw new Error('Invalid Email');
    
      if (!bcrypt.compareSync(password, user.passwordHash))
        throw new Error('Invalid Password');

      const token = jwt.sign({ ...user }, process.env.JWT_SECRET, {
        expiresIn: '1 day',
      });

      return token;
    } catch (error) {
      error.status = 401;
    // eslint-disable-next-line no-undef
    } throw error;
  }
};

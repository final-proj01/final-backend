const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const User = require('../models/User');
const UserService = require('../services/UserService');


const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  
  .post('/', async (req, res, next) => {
    try {
      const user = await UserService.create(req.body);
      res.json(user);
    } catch (e) {
      next(e);
    }
  })

  .post('/sessions', async (req, res, next) => {
    try {
      const token = await UserService.signIn(req.body);
      res
        .cookie(process.env.COOKIE_NAME, token, {
          httpOnly: true,
          secure: process.env.SECURE_COOKIES === 'true',
          sameSite: process.env.SECURE_COOKIES === 'true' ? 'none' : 'strict',
          maxAge: ONE_DAY_IN_MS,
        })
        .json({ message: 'Signed in Success!' });
    } catch (e) {
      next(e);
    }
  })

  .get('/me', authenticate, async (req, res, next) => {
    try {
      const user = await User.getById(req.user.id);
      res.json(user);
    } catch (e) {
      next(e); 
    }
    
  })

  .get('/:id', authenticate, async (req, res, next) => {
    try {
      const user = await User.getById(req.params.id);
      res.json(user).status(200);
    } catch (e) {
      next(e);
    }
  })

  .get('/to/protected', authenticate, async (req, res) => {
    res.json({ message: 'Going to a protected route' });
  })

  .get('/', [authenticate], async (req, res, next) => {
    try {
      const users = await User.getAll();
      res.json(users);
    } catch (e) {
      next(e);
    }
  })

  .delete('/sessions', (req, res) => {
    res
      .clearCookie(process.env.COOKIE_NAME, {
        httpOnly: true,
        secure: process.env.SECURE_COOKIES === 'true',
        sameSite: process.env.SECURE_COOKIES === 'true' ? 'none' : 'strict',
        maxAge: ONE_DAY_IN_MS,
      })
      .status(204)
      .send();
  })

  .put('/logo/:id', authenticate, async (req, res, next) => {
    try {
      const updatedData = { avatar_png: req.body.avatar_png };
      const user = await User.updateLogo(updatedData, req.params.id);
      res.status(200);
      res.json(user);
    } catch (e) {
      next(e);
    }
  })

  .put('/:id', authenticate, async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await User.updateUser(id, req.body);

      res.status(200);
      res.json(user);
    } catch (e) {
      next(e);
    }
  });

const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
// const authorize = require('../middleware/authorize');
const Clip = require('../models/Clip');

module.exports = Router()
  .get('/user', authenticate, async (req, res, next) => {
    try { 
      const body = await Clip.getClipsById(req.user.id);

      res.json(body);
      res.status(200);
    } catch (e) {
      next(e);
    }
  });

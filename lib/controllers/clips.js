const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
// const authorize = require('../middleware/authorize');
const Clip = require('../models/Clip');

module.exports = Router()
  .post('/user', authenticate, async (req, res, next) => {
    try {
      const clip = await Clip.insertClip(req.body, req.user.id);

      res.json(clip);
      res.status(200);
    } catch (e) {
      next(e);
    }
  })
  .get('/user', authenticate, async (req, res, next) => {
    try { 
      const body = await Clip.getClipsById(req.user.id);

      res.json(body);
      res.status(200);
    } catch (e) {
      next(e);
    }
  })
  .delete('/:id', authenticate, async (req, res, next) => {
    try {
      const body = await Clip.delById(req.params.id);

      res.json(body);
      res.status(200);
    } catch (e) {
      next(e);
    }
  })
  .put('/:id', authenticate, async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await Clip.updateById(id, req.body);

      res.json(data).status(202);
    } catch (e) {
      next(e);
    }
  })
  .get('/', authenticate, async (req, res, next) => {
    try {
      const body = await Clip.getAllClips();

      res.json(body).status(200);
    } catch (e) {
      next(e);
    }
  });

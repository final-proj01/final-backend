/* eslint-disable no-empty */
const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
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

  .post('/comment', authenticate, async (req, res, next) => {
    try {
      const body = await Clip.addComment(req.body, req.clip.id);
      res.json(body);
      res.status(200);
    } catch(e) {
      next(e);
    }
  })

  .get('/comments/:id', authenticate, async (req, res, next) => {
    try {
      const comments = await Clip.getCommentsById(req.body, req.comment.id);
      res.json(comments);
      res.status(200);
    } catch (e) {
      next(e);
    }
  })

  .get('votes/:id', authenticate, async (req, res, next) => {
    try {
      const votes = await Clip.getVotesById(req.body, req.votes.id);
      res.json(votes);
      res.status(200);
    } catch(e) {
      next(e);
    }
  })


  .post('/vote', authenticate, async (req, res, next) => {
    try {
      const body = await Clip.addVote(req.body, req.vote.id);
      res.json(body);
      res.status(200);
    } catch(e) {
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

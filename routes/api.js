const router = require('express').Router();
const { Item } = require('../models');

// /api
router.get('/items', (req, res, next) => {
  Item.findAll({})
    .then(items => res.json(items))
    .catch(next);
});

router.post('/items', (req, res, next) => {
  Item.create({
    title: req.body.title,
  })
    .then(item => res.send(item))
    .catch(next);
});

router.put('/items/:id', (req, res, next) => {
  Item.findByPk(req.params.id)
    .then(item => item.update(req.body))
    .then(() => res.sendStatus(204))
    .catch(next);
});

router.delete('/items/:id', (req, res, next) => {
  Item.findByPk(req.params.id)
    .then(item => item.destroy())
    .then(() => res.sendStatus(204))
    .catch(next);
});


module.exports = router;

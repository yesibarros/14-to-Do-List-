const router = require('express').Router();
const path = require('path');
const api = require('./api');

router.get('/', (req, res) => {
  const indexFilePath = path.resolve(`${__dirname}/../public/index.html`);
  res.sendFile(indexFilePath);
});

router.use('/api', api);

module.exports = router;

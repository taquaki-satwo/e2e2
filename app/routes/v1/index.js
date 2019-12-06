var express = require('express');
var router = express.Router();

router.use('/search', require('./search.js'));
router.use('/confirm', require('./confirm.js'));

module.exports = router;
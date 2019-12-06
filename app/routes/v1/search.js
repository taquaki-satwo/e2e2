var express = require('express');
var router = express.Router();
var fs = require("fs");

router.get('/', function (req, res) {
	res.json(JSON.parse(fs.readFileSync('./json/search.json', 'utf8')));
});

module.exports = router;

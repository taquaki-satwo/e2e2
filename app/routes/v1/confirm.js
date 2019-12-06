var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	res.json({
		paySelectCredit: true,
		paySelectCOD: false
	});
});

module.exports = router;

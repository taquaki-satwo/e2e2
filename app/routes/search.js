var express = require('express');
var fs = require('fs');
var router = express.Router();
var exec = require('child_process').exec;

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('search');
});

router.post('/confirm', function(req, res, next) {
	var data = {
		sex: req.body.sex,
		p_tycname: req.body.p_tycname,
		p_tyname: req.body.p_tyname,
		dord: req.body.dord,
		p_stype: req.body.p_stype,
		wrapping: req.body.wrapping
	};
	fs.writeFile('./json/search.json', JSON.stringify(data), function(err, result) {
		if (err) console.log('error', err);
	});
	res.render('confirm');
});

router.get('/complete', function(req, res, next) {
	exec('cd ../&&npm start', (err, stdout, stderr) => {
		if (err) { console.log(err); }
		console.log(stdout);
	});

	res.render('complete');
});

module.exports = router;

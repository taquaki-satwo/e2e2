import request from 'request-promise';
import puppeteer from 'puppeteer';
import moment from 'moment';
import dotenv from 'dotenv';
dotenv.config();
const CONFING = process.env;

function getJSON(uri) {
	let options = {
		uri: uri,
		method: 'GET',
		transform: function(body) {
			return JSON.parse(body);
		}
	};
	return request(options);
}

(async () => {
	const PARAMS = {
		user: {
			id: CONFING.USER_ID,
			pass: CONFING.USER_PASS
		},
		search: {},
		confirm: {}
	};

	await getJSON('http://localhost:3000/api/v1/search/')
		.then(function(json) {
			PARAMS.search = json;
		})
		.catch(function(err) {
			console.log(err);
		});

	await getJSON('http://localhost:3000/api/v1/confirm/')
		.then(function(json) {
			PARAMS.confirm = json;
		})
		.catch(function(err) {
			console.log(err);
		});

	const browser = await puppeteer.launch({
		headless: false,
		slowMo: 0
	});
	const page = await browser.newPage();
	await page.setViewport({
		width: 1200,
		height: 800
	});
	await page.setExtraHTTPHeaders({
		Authorization: `Basic ${Buffer.from(`${CONFING.BASIC_AUTH_USER_NAME}:${CONFING.BASIC_AUTH_PSSSWORD}`).toString(
			'base64'
		)}`
	});
	await page.goto(`${CONFING.TARGET_URL}_member/login.html`);
	await page.waitForSelector('input[name=memid]');
	await page.type('input[name=memid]', PARAMS.user.id);
	await page.type('input[name=mempw]', PARAMS.user.pass);
	await page.screenshot({ path: `./screenshot/${moment().format('YYYYMMDDHHmmssSSS')}_login.png`, fullPage: true });
	await page.click('input[value="ログイン"]');

	let sex = PARAMS.search.sex ? `${PARAMS.search.sex}-` : '';
	let p_stype = PARAMS.search.p_stype ? '&p_stype=1' : '';
	let wrapping = PARAMS.search.wrapping ? '&wrapping=1' : '';

	await page.goto(
		`${CONFING.TARGET_URL}${sex}category/${PARAMS.search.p_tycname}/${PARAMS.search.p_tyname}/?dord=${PARAMS.search
			.dord}${p_stype}${wrapping}`
	);
	await page.waitForSelector('a[class=catalog-link]:nth-child(1)');
	await page.screenshot({ path: `./screenshot/${moment().format('YYYYMMDDHHmmssSSS')}_search.png`, fullPage: true });
	await page.click('a[class=catalog-link]:nth-child(1)');

	await page.waitForSelector('input[value="カートへ入れる"]:nth-child(1)');
	await page.screenshot({ path: `./screenshot/${moment().format('YYYYMMDDHHmmssSSS')}_goods.png`, fullPage: true });
	await page.click('input[value="カートへ入れる"]:nth-child(1)');

	await page.waitForSelector('input[value="レジへ進む"]:nth-child(1)');
	await page.screenshot({ path: `./screenshot/${moment().format('YYYYMMDDHHmmssSSS')}_cart.png` });
	await page.click('input[value="レジへ進む"]:nth-child(1)');

	await page.waitForSelector('#confirmation .btn:nth-child(1) a');
	await page.screenshot({ path: `./screenshot/${moment().format('YYYYMMDDHHmmssSSS')}_confirm.png`, fullPage: true });
	await page.click('#confirmation .btn:nth-child(1) a');

	await page.waitForSelector('#arigato');
	await page.screenshot({ path: `./screenshot/${moment().format('YYYYMMDDHHmmssSSS')}_arigato.png`, fullPage: true });
	await browser.close();
})();

process.on('unhandledRejection', console.dir);

const puppeteer = require("puppeteer");

const sleep = async (s) => new Promise((resolve) => setTimeout(resolve, s));
const check = async (hash, privateKey) => {
	let browser;
	try {
		browser = await puppeteer.launch({
			headless: true,
			args: [
				"--disable-gpu",
				"--no-sandbox",
				"--js-flags=--noexpose_wasm,--jitless",
			],
			// executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
			executablePath: "/usr/bin/chromium-browser",
		});
		const context = await browser.createIncognitoBrowserContext();
		const page = await context.newPage();

		page.once("dialog", (keyDialog) => {
			keyDialog.accept(privateKey);
			page.once("dialog", (confirmDialog) => {
				confirmDialog.accept('1')
			})
		});

		await page.goto(`http://127.0.0.1:3000/view?hash=${hash}`);
		console.log(await page.$eval('#content', element => element.textContent))
		await sleep(3000);
		await browser.close();
	} catch (e) {
		console.log(e);
	} finally {
		if (browser) await browser.close();
	}
};

module.exports = { check };
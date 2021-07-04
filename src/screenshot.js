const puppeteer = require('puppeteer');

let browser;

(async () => {
    const screenshotOpts = {
        clip: {
            x: 100,
            y: 100,
            width: 1280,
            height: 720
        },
        type: 'jpeg',
        quality: 100,
        path: './out/screenshot.jpg',
    };
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:8080/');
    await page.waitForTimeout(1000);
    await page.screenshot(screenshotOpts);
    await browser.close();
})().catch(async (err) => {
    console.error(err);
    await browser.close();
});
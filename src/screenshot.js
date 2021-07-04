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
    await page.goto('file:///C:/main/code/osu-thumbnail-generator/public/index.html');
    await page.screenshot(screenshotOpts);
    await browser.close();
})().catch(async (err) => {
    console.error(err);
    await browser.close();
});
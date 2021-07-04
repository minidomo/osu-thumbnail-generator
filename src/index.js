const config = require('../config.json');

const fs = require('fs');
const Jimp = require('jimp');
const osu = require('node-osu');
const osuApi = new osu.Api(process.env.OSU_API_KEY);

const mapRegex = /[^\d]+(\d+)[^\d]+(\d+).*/g;

/**
 * 
 * @returns {string}
 */
const getBackgroundPath = () => {
    const [, mapSetId, beatmapId] = mapRegex.exec(config.data.map);
    const [mapSetDir] = fs.readdirSync(config.osu.path, { encoding: 'utf8', withFileTypes: true })
        .filter(f => f.isDirectory() && f.name.startsWith(mapSetId))
        .map(f => f.name);
    const [beatmapFile] = fs.readdirSync(`${config.osu.path}/${mapSetDir}`, { encoding: 'utf8', withFileTypes: true })
        .filter(f => f.isFile() && f.name.endsWith('.osu'))
        .map(f => f.name)
        .filter(name => {
            const [curBeatmapId] = fs.readFileSync(`${config.osu.path}/${mapSetDir}/${name}`, { encoding: 'utf8' })
                .split(/[\r\n]+/)
                .filter(line => line.startsWith('BeatmapID'))
                .map(line => line.split(/:/)[1]);
            return curBeatmapId === beatmapId;
        });
    const backgroundLine = fs.readFileSync(`${config.osu.path}/${mapSetDir}/${beatmapFile}`, { encoding: 'utf8' })
        .split('//Background and Video events')[1]
        .split(/[\r\n]+/)[1];
    const backgroundFile = backgroundLine.substring(backgroundLine.indexOf('"') + 1, backgroundLine.lastIndexOf('"'));
    return `${config.osu.path}/${mapSetDir}/${backgroundFile}`;
};

/**
 * 
 * @param {string} bgPath 
 * @returns {Promise<Jimp>}
 */
const getOriginalBackground = async (bgPath) => {
    return await Jimp.read(bgPath);
};

/**
 * 
 * @param {string} bgPath 
 * @returns {Promise<Jimp>}
 */
const getProcessedBackground = async (bgPath) => {
    const bg = await Jimp.read(bgPath);
    // const resizedHeight = bg.resize(1280, Jimp.AUTO).getHeight();
    // const resizedWidth = bg.resize(Jimp.AUTO, 720).getWidth();
    return bg
        .resize(1280, 720)
        .blur(10)
        .brightness(-.6);
};

/**
 * 
 * @param {string} bgPath 
 * @returns {Promise<Jimp>}
 */
const getCroppedBackground = async (bgPath) => {
    const bg = await Jimp.read(bgPath);
    return bg
        .resize(1280, 720)
        .resize(1200, Jimp.AUTO)
        .crop(0, 222, 1200, 230)
        .brightness(-.4);
};

/**
 * 
 * @param {number} userId 
 * @returns {Promise<Jimp>}
 */
const getAvatar = async (userId) => {
    console.log(`https://a.ppy.sh/${userId}`);
    const avatar = await Jimp.read(`https://a.ppy.sh/${userId}`);
    return avatar
        .resize(160, 160);
};

/**
 * 
 * @param {Jimp[]} images 
 */
const writeThumbnail = (...images) => {
    const id = fs.readdirSync(config.out, { encoding: 'utf8', withFileTypes: true })
        .filter(f => f.isFile() && f.name.endsWith('.png'))
        .length;
    images.forEach((img, i) => {
        img.write(`${config.out}/image${id + i}.png`);
    });
};

const writeJsonData = () => {
    fs.writeFileSync(`${config.out}/data.json`, JSON.stringify(config.data, null, 4), { encoding: 'utf8' });
};

(async () => {
    const bgPath = getBackgroundPath();
    const processedBg = await getProcessedBackground(bgPath);
    const croppedBg = await getCroppedBackground(bgPath);

    const user1 = await osuApi.getUser({ u: config.data.usernames[0] });
    const user2 = await osuApi.getUser({ u: config.data.usernames[1] });

    const avatar1 = await getAvatar(user1.id);
    const avatar2 = await getAvatar(user2.id);

    const originalBg = await getOriginalBackground(bgPath);

    console.log(`${processedBg.getWidth()} x ${processedBg.getHeight()}`);

    writeThumbnail(processedBg, croppedBg, avatar1, avatar2, originalBg);
    writeJsonData();
})();
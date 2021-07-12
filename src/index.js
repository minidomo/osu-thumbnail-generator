const config = require('../config.json');

const fs = require('fs');
const Jimp = require('jimp');

const mapRegex = /[^\d]+(\d+)[^\d]+(\d+).*/g;

/**
 * 
 * @returns {string}
 */
const getBackgroundPath = () => {
    const [, mapSetId, beatmapId] = mapRegex.exec(config.data.map);
    const [mapSetDir] = fs.readdirSync(config.osuSongsDir, { encoding: 'utf8', withFileTypes: true })
        .filter(f => f.isDirectory() && f.name.startsWith(mapSetId))
        .map(f => f.name);
    const [beatmapFile] = fs.readdirSync(`${config.osuSongsDir}/${mapSetDir}`, { encoding: 'utf8', withFileTypes: true })
        .filter(f => f.isFile() && f.name.endsWith('.osu'))
        .map(f => f.name)
        .filter(name => {
            const [curBeatmapId] = fs.readFileSync(`${config.osuSongsDir}/${mapSetDir}/${name}`, { encoding: 'utf8' })
                .split(/[\r\n]+/)
                .filter(line => line.startsWith('BeatmapID'))
                .map(line => line.split(/:/)[1]);
            return curBeatmapId === beatmapId;
        });
    const backgroundLine = fs.readFileSync(`${config.osuSongsDir}/${mapSetDir}/${beatmapFile}`, { encoding: 'utf8' })
        .split('//Background and Video events')[1]
        .split(/[\r\n]+/)
        .filter(line => line.startsWith('0,0'))[0];
    const backgroundFile = backgroundLine.substring(backgroundLine.indexOf('"') + 1, backgroundLine.lastIndexOf('"'));
    return `${config.osuSongsDir}/${mapSetDir}/${backgroundFile}`;
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
 * @param {string} userId 
 * @returns {Promise<Jimp>}
 */
const getAvatar = async (userId) => {
    const avatar = await Jimp.read(`https://a.ppy.sh/${userId}`);
    return avatar
        .resize(160, 160);
};

/**
 * 
 * @param {Jimp[]} images 
 */
const writeThumbnail = (...images) => {
    const id = fs.readdirSync('./out', { encoding: 'utf8', withFileTypes: true })
        .filter(f => f.isFile() && f.name.endsWith('.png'))
        .length;
    images.forEach((img, i) => {
        img.write(`${'./out'}/image${id + i}.png`);
    });
};

const writeJsonData = () => {
    fs.writeFileSync(`${'./out'}/data.json`, JSON.stringify(config.data, null, 4), { encoding: 'utf8' });
};

(async () => {
    const bgPath = getBackgroundPath();
    const processedBg = await getProcessedBackground(bgPath);
    const croppedBg = await getCroppedBackground(bgPath);

    const userId0 = config.data.players[0].userId;
    const userId1 = config.data.players[1].userId;

    const avatar1 = await getAvatar(userId0);
    const avatar2 = await getAvatar(userId1);

    const originalBg = await getOriginalBackground(bgPath);

    writeThumbnail(processedBg, croppedBg, avatar1, avatar2, originalBg);
    writeJsonData();
})();
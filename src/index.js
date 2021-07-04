const config = require('../config.json');

const fs = require('fs');
const Jimp = require('jimp');

/**
 * 
 * @returns {string}
 */
const getBackgroundPath = () => {
    const [mapSetDir] = fs.readdirSync(config.osu.path, { encoding: 'utf8', withFileTypes: true })
        .filter(f => f.isDirectory() && f.name.startsWith(config.map.mapSetId))
        .map(f => f.name);
    const [beatmapFile] = fs.readdirSync(`${config.osu.path}/${mapSetDir}`, { encoding: 'utf8', withFileTypes: true })
        .filter(f => f.isFile() && f.name.endsWith('.osu'))
        .map(f => f.name)
        .filter(name => {
            const [beatmapID] = fs.readFileSync(`${config.osu.path}/${mapSetDir}/${name}`, { encoding: 'utf8' })
                .split(/[\r\n]+/)
                .filter(line => line.startsWith('BeatmapID'))
                .map(line => parseInt(line.split(/:/)[1]));
            return beatmapID === config.map.beatmapId;
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
 * @param {Jimp} processedBg 
 * @param {Jimp} croppedBg 
 * @param {Jimp} avatar1
 * @param {Jimp} avatar2 
 */
const writeThumbnail = (processedBg, croppedBg, avatar1, avatar2) => {
    const id = fs.readdirSync(config.out, { encoding: 'utf8', withFileTypes: true })
        .filter(f => f.isFile() && f.name.endsWith('.png'))
        .length;
    processedBg.write(`${config.out}/image${id}.png`);
    croppedBg.write(`${config.out}/image${id + 1}.png`);
    avatar1.write(`${config.out}/image${id + 2}.png`);
    avatar2.write(`${config.out}/image${id + 3}.png`);
};

(async () => {
    const bgPath = getBackgroundPath();
    const processedBg = await getProcessedBackground(bgPath);
    const croppedBg = await getCroppedBackground(bgPath);
    const avatar1 = await getAvatar(config.team1.userId);
    const avatar2 = await getAvatar(config.team2.userId);

    console.log(`${processedBg.getWidth()} x ${processedBg.getHeight()}`);

    writeThumbnail(processedBg, croppedBg, avatar1, avatar2);
})();
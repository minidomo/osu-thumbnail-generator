const fs = require('fs');

fs.readdir('./out', { encoding: 'utf8', withFileTypes: true }, (err, files) => {
    if (err) {
        console.error(err);
        return;
    }
    files.filter((file) => file.isFile() && file.name.startsWith('image'))
        .forEach((file) => {
            fs.copyFile(`./out/${file.name}`, `./public/assets/${file.name}`, (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
            });
        });
    const dataFile = files.find((file) => file.isFile() && file.name === 'data.json');
    if (dataFile) {
        fs.copyFile(`./out/${dataFile.name}`, `./public/${dataFile.name}`, (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });
    }
});
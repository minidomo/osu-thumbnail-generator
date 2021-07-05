const fs = require('fs');

fs.readdir('./out', { encoding: 'utf8', withFileTypes: true }, (err, files) => {
    if (err) {
        console.error(err);
        return;
    }
    files.filter((file) => file.isFile() && !file.name.endsWith('.gitkeep'))
        .forEach((file) => {
            fs.unlink(`./out/${file.name}`, (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
            })
        });
});
const loadData = () => {
    $.getJSON('../data.json', (data) => {
        document.getElementById('username0').textContent = data.usernames[0];
        document.getElementById('username1').textContent = data.usernames[1];
        document.getElementById('title').textContent = data.title;
        document.getElementById('round').textContent = data.round;
        document.getElementById('message-middle').textContent = data.message.middle;
        document.getElementById('message-custom').textContent = data.message.custom;
    });
};

const updateColor = () => {
    const assignColor = (img) => {
        Vibrant.from(img).getPalette((err, palette) => {
            if (err) {
                console.error(err);
                return;
            }
            const [r, g, b] = palette.Vibrant.getRgb();
            document.documentElement.style.setProperty('--main-color', `rgba(${r},${g},${b},1)`);
            document.documentElement.style.setProperty('--transparent-color', `rgba(${r},${g},${b},.4)`);
        });
    };
    const img = document.querySelector('[id="background-original"]');
    if (img.complete) {
        assignColor(img);
    } else {
        img.onload = () => assignColor(img);
    }
};

window.onload = () => {
    loadData();
    updateColor();
};

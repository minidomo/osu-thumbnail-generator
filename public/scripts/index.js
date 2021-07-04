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
        const colors = colorThief.getColor(img);
        document.documentElement.style.setProperty('--main-color', `rgba(${colors[0]},${colors[1]},${colors[2]},1)`);
        document.documentElement.style.setProperty('--transparent-color', `rgba(${colors[0]},${colors[1]},${colors[2]},.4)`);
    };
    const colorThief = new ColorThief();
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

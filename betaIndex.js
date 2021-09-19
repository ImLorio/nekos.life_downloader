const Axios = require('axios');
const fs = require('fs'), Path = require('path');
const { writer } = require('repl');

downloadImage()

async function downloadImage(url) {
    url = 'https://cdn.nekos.life/v3/sfw/img/cat/cat_181.jpg';
    const path = Path.resolve(__dirname, 'cat.jpg');
    const stream = fs.createWriteStream(path)

    const response = await Axios({
        url, method: 'GET', responseType: 'stream'
    });

    response.data.pipe(stream);

    return new Promise((resolve, reject) => {
        stream.on('finish', resolve)
        stream.on('error', reject)
    });
}

/*axios.get(`https://api.nekos.dev/api/v3/images/sfw/img/cat`).then(res => {
    if (res.status === 200) {} else return;
    console.log('ok')
});*/
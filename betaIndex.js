const Axios = require('axios');
const fs = require('fs'), Path = require('path');
const chalk = require('chalk');

main()
async function main() {
    console.log(await getApiList())
    setInterval(async () => {
        imgUrl = await getImageLink('https://api.nekos.dev/api/v3/images/sfw/img/cat')
        if (!imgUrl) return;
        downloadImage(imgUrl)
    }, 5000);
}



// downloadImage()

async function getApiList() {
    const response = await Axios({
        url: 'https://api.nekos.dev/api/v3/docs/', method: 'GET'
    });

    let sfw = response.data.data.response.endpoints.images[0].categories.sfw
    let nsfw = response.data.data.response.endpoints.images[0].categories.nsfw
    
    return {
        sfw: sfw, 
        nsfw: nsfw
    }

}

async function getImageLink(apiUrl) {
    if (!apiUrl) return error(`'apiUrl' is not definned in 'getImageLink()'`)
    // apiUrl = 'https://api.nekos.dev/api/v3/images/sfw/img/cat';
    const response = await Axios({
        url: apiUrl, method: 'GET'
    });

    return response.data.data.response.url;
}

async function downloadImage(imgUrl, dir) {
    if (!imgUrl) return error(`'imgUrl' is not definned in 'downloadImage()'`)
    dir = '';
    const path = Path.resolve(__dirname, dir, 'cat.jpg');
    const stream = fs.createWriteStream(path)

    const response = await Axios({
        url: imgUrl, method: 'GET', responseType: 'stream'
    });

    response.data.pipe(stream);

    return new Promise((resolve, reject) => {
        stream.on('finish', resolve)
        stream.on('error', reject)
    });
}

const error = (data) => console.log(chalk.red('[Error] ' + data))

/*axios.get(`https://api.nekos.dev/api/v3/images/sfw/img/cat`).then(res => {
    if (res.status === 200) {} else return;
    console.log('ok')
});*/
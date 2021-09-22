const Axios = require('axios');
const fs = require('fs'),
    Path = require('path');
const chalk = require('chalk'),
    inquirer = require('inquirer');

const baseApiUrl = "https://api.nekos.dev/api/v3/images/"
const error = (data) => console.log(chalk.red(`[Error] ${data}`))
const downloaded = (data) => console.log(chalk.green(`[Downloaded] ${data}`))
const setTitle = (title) => process.stdout.write(String.fromCharCode(27) + ']0;' + title + String.fromCharCode(7))

async function main() {
    console.clear()
    setTitle(`Nekos.life Downloader ~ By github.com/ImLorio`)
    const urls = await getUserNeed()
    for (const url of urls) {
        let apiUrl = `${baseApiUrl}${url}`;
        setInterval(async () => {
            let imageLink = await getImageLink(apiUrl)
            downloadImage(imageLink, url, imageLink.split('/').at(-1))
            downloaded(`${url}/${imageLink.split('/').at(-1)}`)
        }, 500);
    }
}

async function getUserNeed() {
    const apiList = await getApiList()
    let questions = await {
        type: 'checkbox',
        message: 'Select what you want to download',
        name: 'wwd',
        pageSize: 32,
        choices: []
    }
    for (const imagesType in apiList) {
        for (const imagesTypeFiles in apiList[imagesType]) {
            questions.choices.push(new inquirer.Separator(chalk.yellow.bold(` = ${imagesType} | ${imagesTypeFiles} = `)))
            for (const image of apiList[imagesType][imagesTypeFiles]) {
                if (image.includes('shinobu')) break;
                await questions.choices.push(`${imagesType}/${imagesTypeFiles === "gif" ? imagesTypeFiles : "img"}/${image}`)
            }
        }
    }

    const answers = await inquirer.prompt([questions]);
    return answers.wwd
}

async function getApiList() {
    const response = await Axios({
        url: 'https://api.nekos.dev/api/v3/docs/',
        method: 'GET'
    }).catch(error => console.log(error.response.status));

    const sfw = response.data.data.response.endpoints.images[0].categories.sfw;
    const nsfw = response.data.data.response.endpoints.images[0].categories.nsfw;

    return {
        sfw: sfw,
        nsfw: nsfw
    };
}
async function getImageLink(apiUrl) {
    if (!apiUrl) return error(`'apiUrl' is not defined in 'getImageLink()'`)
    const response = await Axios({
        url: apiUrl,
        method: 'GET'
    }).catch(error => {
        if (error.response.status == 500) return;
        error(`error ${error.response.status} in 'getImageLink()`)
        return setTimeout(() => {
            getImageLink(apiUrl)
        }, 500);;
    });
    if (!response) return

    return response.data.data.response.url;
}
async function downloadImage(imgUrl, dir, filename) {
    if (!imgUrl) return error(`'imgUrl' is not defined in 'downloadImage()'`)
    if (!dir) return error(`'dir' is not defined in 'downloadImage()'`)
    if (!filename) return error(`'filename' is not defined in 'downloadImage()'`) 
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const path = Path.resolve(__dirname, dir, filename);
    const stream = fs.createWriteStream(path)

    const response = await Axios({
        url: imgUrl,
        method: 'GET',
        responseType: 'stream'
    });

    response.data.pipe(stream);

    stream.on('error', async (err) => error(err))

    return new Promise((resolve, reject) => {
        stream.on('finish', resolve)
        stream.on('error', reject)
    });
}

function renameKey(obj, oldKey, newKey) {
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
}

main()
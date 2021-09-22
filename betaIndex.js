const Axios = require('axios');
const fs = require('fs'),
    Path = require('path');
const chalk = require('chalk'),
    inquirer = require('inquirer');

const baseApiUrl = "https://api.nekos.dev/api/v3/images/"

main()
async function main() {

    const urls = await getUserNeed()
    for (const url of urls) {
        console.log(`${baseApiUrl}${url}`)
    }
    
}

async function getUserNeed() {
    const apiList = await getApiList()
    let questions = await {
        type: 'checkbox',
        message: 'Select what you want to download',
        name: 'wwd',
        pageSize: 12,
        choices: []
    }
    for (const imagesType in apiList) {
        for (const imagesTypeFiles in apiList[imagesType]) {
            questions.choices.push(new inquirer.Separator(chalk.yellow.bold(` = ${imagesType} | ${imagesTypeFiles} = `)))
            for (const image of apiList[imagesType][imagesTypeFiles]) {
                await questions.choices.push(`${imagesType}/${imagesTypeFiles === "gif" ? imagesTypeFiles : "img"}/${image}`)
            }
        }
    }

    const answers = await inquirer.prompt([questions]);
    return answers.wwd
}

// download()
async function download() {
    console.log(await getApiList())
    setInterval(async () => {
        imgUrl = await getImageLink('https://api.nekos.dev/api/v3/images/sfw/img/cat')
        if (!imgUrl) return;
        downloadImage(imgUrl)
    }, 6000);
}

async function getApiList() {
    const response = await Axios({
        url: 'https://api.nekos.dev/api/v3/docs/',
        method: 'GET'
    });

    const sfw = response.data.data.response.endpoints.images[0].categories.sfw;
    const nsfw = response.data.data.response.endpoints.images[0].categories.nsfw;

    return {
        sfw: sfw,
        nsfw: nsfw
    };
}
async function getImageLink(apiUrl) {
    if (!apiUrl) return error(`'apiUrl' is not definned in 'getImageLink()'`)
    const response = await Axios({
        url: apiUrl,
        method: 'GET'
    });

    return response.data.data.response.url;
}
async function downloadImage(imgUrl, dir) {
    if (!imgUrl) return error(`'imgUrl' is not definned in 'downloadImage()'`)
    if (!dir) dir = 'cat.jpg';
    const path = Path.resolve(__dirname, dir);
    const stream = fs.createWriteStream(path)

    const response = await Axios({
        url: imgUrl,
        method: 'GET',
        responseType: 'stream'
    });

    response.data.pipe(stream);

    return new Promise((resolve, reject) => {
        stream.on('finish', resolve)
        stream.on('error', reject)
    });
}

function renameKey(obj, oldKey, newKey) {
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
}

const error = (data) => console.log(chalk.red('[Error] ' + data))
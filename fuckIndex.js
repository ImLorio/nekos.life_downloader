const Axios = require('axios');
const fs = require('fs'),
    Path = require('path');
const chalk = require('chalk'),
    inquirer = require('inquirer');

const baseApiUrl = "https://api.nekos.dev/api/v3/images/"
const error = (data) => console.log(chalk.red(`[Error] ${data}`))
const downloaded = (data) => console.log(chalk.green(`[Downloaded] ${data}`))
const setTitle = (title) => process.stdout.write(String.fromCharCode(27) + ']0;' + title + String.fromCharCode(7))

/*

    I D K      W H Y      M Y      C O D E      C R A S H
    W I T H O U T      R E A S O N      S O      F U C K
    L E T S      U S E      I N D E X      V . 1
    A N D      U P G R A D E       I T            :)

    have a good day

*/

async function main() {
    console.clear()
    setTitle(`Nekos.life Downloader ~ By github.com/ImLorio`)
    const urls = await getUserNeed()
    for (const url of urls) {
        let apiUrl = `${baseApiUrl}${url}`;
        setInterval(async () => {
            let imageLink = await getImageLink(apiUrl)
            if (!imageLink) return error(`no imageLink in 'main()'`)
            downloadImage(imageLink, url, imageLink.split('/').at(-1))
            // downloaded(`${url}/${imageLink.split('/').at(-1)}`)
        }, 1000);
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
    }).catch(err => console.log(err.response.status));

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
    }).catch(err => {
        throw new Error(err)
    });
    if (response && response.data && response.data.data) return response.data.data.response.url;
    else return error(`error in 'getImageLink()', no data`)
}
async function downloadImage(imgUrl, dir, filename) {
    if (!imgUrl) return error(`'imgUrl' is not defined in 'downloadImage()'`);
    if (!dir) return error(`'dir' is not defined in 'downloadImage()'`);
    if (!filename) return filename = Path.basename(imgUrl);
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
        stream.on('finish', () => downloaded(`${imgUrl}`))
        stream.on('error', reject)
    });
}

main()
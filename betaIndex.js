const superagent = require('superagent');
const download = require('image-downloader');
const fs = require('fs');
const colors = require('colors');
const { get } = require('superagent');

Array.prototype.sample = function(){
    return this[Math.floor(Math.random()*this.length)];
}

const baseApiUrl = "https://api.nekos.dev/api/v3/images/"
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

const urls = await getUserNeed()

for (const url of urls) getImg(`${baseApiUrl}${url}`)
async function getImg(url) {
    let folder = url.split('/')[7]
    let folder2 = url.split('/')[8]
    const {
        body
    } = await superagent.get(url);
    if (body.data.status.code != 200) return getImg(url);

    if (!fs.existsSync(`./${folder}`)) fs.mkdirSync(`./${folder}`);
    if (!fs.existsSync(`./${folder}/${folder2}`)) fs.mkdirSync(`./${folder}/${folder2}`);
    if (fs.existsSync(`./${folder}/${folder2}/${body.data.response.url.split('/')[7]}`)) {
        console.log(colors.blue(`${colors.yellow(`[INFO]`)} Already exists ! (${folder}/${folder2})`));
        return getImg(url);;
    }
    await download.image({
        url: body.data.response.url,
        dest: `${folder}/${folder2}`
        })
        .then(out => console.log(colors.gray(`${colors.yellow(`[INFO]`)} ${colors.red(out.filename)} downloaded`)))
        .catch((err) => console.error(err));
        
    getImg(url)
}
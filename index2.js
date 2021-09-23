const superagent = require('superagent');
const download = require('image-downloader');
const inquirer = require('inquirer');
const fs = require('fs');
const colors = require('colors');

Array.prototype.sample = function(){
    return this[Math.floor(Math.random()*this.length)];
}

const baseApiUrl = "https://api.nekos.dev/api/v3/images/"

async function main() {
    const urls = await getUserNeed();
    for (const url of urls) getImg(`${baseApiUrl}${url}`)
    async function getImg(url) {
        let folder = url.split('/').slice(-4).slice(1).join('/')
        const { body } = await superagent.get(url);
        if (body.data.status.code != 200) return getImg(url);
    
        if (!fs.existsSync(`./${folder}`)) fs.mkdirSync(`./${folder}`, { recursive: true });
        if (fs.existsSync(`./${folder}/${body.data.response.url.split('/').at(-1)}`)) {
            console.log(colors.blue(`${colors.yellow(`[INFO]`)} Already exists ! (${folder})`));
            return getImg(url);;
        }

        await download.image({
            url: body.data.response.url,
            dest: `${folder}`
            })
            .then(out => console.log(colors.gray(`${colors.yellow(`[INFO]`)} ${colors.red(out.filename)} downloaded`)))
            .catch((err) => console.error(err));
    
        getImg(url)
    }
}
async function getUserNeed() {
    const apiList = await getApiList()
    let questions = await {
        type: 'checkbox',
        message: 'Select what you want to download',
        name: 'wwd',
        pageSize: 18,
        choices: []
    }
    for (const imagesType in apiList) {
        for (const imagesTypeFiles in apiList[imagesType]) {
            questions.choices.push(new inquirer.Separator(colors.yellow.bold(` = ${imagesType} | ${imagesTypeFiles} = `)))
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
    const {
        body
    } = await superagent.get('https://api.nekos.dev/api/v3/docs/');
    if (body.data.status.code != 200) return getApiList();

    const sfw = body.data.response.endpoints.images[0].categories.sfw;
    const nsfw = body.data.response.endpoints.images[0].categories.nsfw;

    return {
        sfw: sfw,
        nsfw: nsfw
    };
}
main()
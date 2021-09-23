const superagent = require('superagent');
const download = require('image-downloader');
const fs = require('fs');
const colors = require('colors');
const { get } = require('superagent');

Array.prototype.sample = function(){
    return this[Math.floor(Math.random()*this.length)];
}

// Change here URL ⤵️
let links = [
    "https://api.nekos.dev/api/v3/images/sfw/img/neko",
    "https://api.nekos.dev/api/v3/images/sfw/img/cat",
    "https://api.nekos.dev/api/v3/images/sfw/img/holo",
    "https://api.nekos.dev/api/v3/images/sfw/img/smug",
    "https://api.nekos.dev/api/v3/images/sfw/img/waifu",
    "https://api.nekos.dev/api/v3/images/nsfw/img/anal_lewd",
    "https://api.nekos.dev/api/v3/images/nsfw/img/keta_lewd",
    "https://api.nekos.dev/api/v3/images/nsfw/img/solo_lewd",
    "https://api.nekos.dev/api/v3/images/nsfw/img/yuri_ero",
    "https://api.nekos.dev/api/v3/images/nsfw/img/yiff_lewd"
]
// Change here URL ⤴️

for (const link of links) getimg(link)

async function getimg(link, thread) {
    let folder = link.split('/')[7]
    let folder2 = link.split('/')[8]
    const {
        body
    } = await superagent.get(link);
    if (body.data.status.code != 200) return getimg(link);

    if (!fs.existsSync(`./${folder}`)) fs.mkdirSync(`./${folder}`);
    if (!fs.existsSync(`./${folder}/${folder2}`)) fs.mkdirSync(`./${folder}/${folder2}`);
    if (fs.existsSync(`./${folder}/${folder2}/${body.data.response.url.split('/')[7]}`)) {
        console.log(colors.blue(`${colors.yellow(`[INFO]`)} Already exists ! (${folder}/${folder2})`));
        return getimg(link);;
    }
    await download.image({
        url: body.data.response.url,
        dest: `${folder}/${folder2}`
        })
        .then(out => console.log(colors.gray(`${colors.yellow(`[INFO]`)} ${colors.red(out.filename)} downloaded`)))
        .catch((err) => console.error(err));
        
    getimg(link)
}

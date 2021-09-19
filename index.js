const superagent = require('superagent');
const download = require('image-downloader');
const fs = require('fs');
const colors = require('colors');

Array.prototype.sample = function(){
    return this[Math.floor(Math.random()*this.length)];
}

// Change here URL ⤵️
let link = [
    "https://api.nekos.dev/api/v3/images/sfw/img/neko",
    "https://api.nekos.dev/api/v3/images/sfw/img/cat",
    "https://api.nekos.dev/api/v3/images/sfw/img/holo"
]
// Change here URL ⤴️

for (let i = 0; i < 25; i++) getimg(link.sample(), i);

async function getimg(link, thread) {
    let folder = link.split('/')[7]
    let folder2 = link.split('/')[8]
    const {
        body
    } = await superagent.get(link);
    if (body.data.status.code != 200) return getimg(link, thread);

    if (!fs.existsSync(`./${folder}`)) fs.mkdirSync(`./${folder}`);
    if (!fs.existsSync(`./${folder}/${folder2}`)) fs.mkdirSync(`./${folder}/${folder2}`);
    if (fs.existsSync(`./${folder}/${folder2}/${body.data.response.url.split('/')[7]}`)) {
        console.log(colors.blue(`${colors.yellow(`[${thread}]`)} Already exists ! (${folder}/${folder2})`));
        return getimg(link, thread);;
    }
    await download.image({
        url: body.data.response.url,
        dest: `${folder}/${folder2}`
        })
        .then(out => console.log(colors.gray(`${colors.yellow(`[${thread}]`)} ${colors.red(out.filename)} downloaded`)))
        .catch((err) => console.error(err));
        
    getimg(link, thread)
}

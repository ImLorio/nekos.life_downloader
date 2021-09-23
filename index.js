const superagent = require('superagent');
const download = require('image-downloader');
const fs = require('fs');
const colors = require('colors');
const { get } = require('superagent');

Array.prototype.sample = function(){
    return this[Math.floor(Math.random()*this.length)];
}

// Change here URLs ⤵️
let links = [
    "https://api.nekos.dev/api/v3/images/nsfw/gif/feet",
    "https://api.nekos.dev/api/v3/images/nsfw/gif/cum",
    "https://api.nekos.dev/api/v3/images/nsfw/gif/girls_solo",
    "https://api.nekos.dev/api/v3/images/nsfw/gif/tits",
    "https://api.nekos.dev/api/v3/images/nsfw/gif/blow_job",
    "https://api.nekos.dev/api/v3/images/nsfw/gif/pussy_wank",
    "https://api.nekos.dev/api/v3/images/nsfw/gif/pussy",
    "https://api.nekos.dev/api/v3/images/nsfw/gif/yuri",
    "https://api.nekos.dev/api/v3/images/nsfw/gif/neko",
    "https://api.nekos.dev/api/v3/images/nsfw/gif/yiff",
    "https://api.nekos.dev/api/v3/images/nsfw/gif/spank",
    "https://api.nekos.dev/api/v3/images/nsfw/gif/kuni",
    "https://api.nekos.dev/api/v3/images/nsfw/gif/classic",
    "https://api.nekos.dev/api/v3/images/nsfw/gif/anal",
    "https://api.nekos.dev/api/v3/images/nsfw/gif/all_tags",
    "https://api.nekos.dev/api/v3/images/nsfw/img/peeing_lewd",
    "https://api.nekos.dev/api/v3/images/nsfw/img/keta_lewd",
    "https://api.nekos.dev/api/v3/images/nsfw/img/anal_lewd",
    "https://api.nekos.dev/api/v3/images/nsfw/img/yiff_lewd",
    "https://api.nekos.dev/api/v3/images/nsfw/img/kemonomimi_lewd",
    "https://api.nekos.dev/api/v3/images/nsfw/img/yuri_ero",
    "https://api.nekos.dev/api/v3/images/nsfw/img/pantyhose_ero",
    "https://api.nekos.dev/api/v3/images/nsfw/img/piersing_lewd",
    "https://api.nekos.dev/api/v3/images/nsfw/img/all_tags_ero",
    "https://api.nekos.dev/api/v3/images/nsfw/img/all_tags_lewd",
    "https://api.nekos.dev/api/v3/images/nsfw/img/ahegao_avatar",
    "https://api.nekos.dev/api/v3/images/nsfw/img/solo_lewd",
    "https://api.nekos.dev/api/v3/images/nsfw/img/bdsm_lewd",
    "https://api.nekos.dev/api/v3/images/nsfw/img/kitsune_lewd",
    "https://api.nekos.dev/api/v3/images/nsfw/img/holo_lewd",
    "https://api.nekos.dev/api/v3/images/nsfw/img/wallpaper_lewd",
    "https://api.nekos.dev/api/v3/images/nsfw/img/kemonomimi_ero",
    "https://api.nekos.dev/api/v3/images/nsfw/img/hplay_ero",
    "https://api.nekos.dev/api/v3/images/nsfw/img/piersing_ero",
    "https://api.nekos.dev/api/v3/images/nsfw/img/yuri_lewd",
    "https://api.nekos.dev/api/v3/images/nsfw/img/ero_wallpaper_ero",
    "https://api.nekos.dev/api/v3/images/nsfw/img/holo_avatar",
    "https://api.nekos.dev/api/v3/images/nsfw/img/neko_lewd",
    "https://api.nekos.dev/api/v3/images/nsfw/img/feet_lewd",
    "https://api.nekos.dev/api/v3/images/nsfw/img/kitsune_ero",
    "https://api.nekos.dev/api/v3/images/nsfw/img/feet_ero",
    "https://api.nekos.dev/api/v3/images/nsfw/img/cum_lewd",
    "https://api.nekos.dev/api/v3/images/nsfw/img/holo_ero",
    "https://api.nekos.dev/api/v3/images/nsfw/img/tits_lewd",
    "https://api.nekos.dev/api/v3/images/nsfw/img/classic_lewd",
    "https://api.nekos.dev/api/v3/images/nsfw/img/smallboobs_lewd",
    "https://api.nekos.dev/api/v3/images/nsfw/img/blowjob_lewd",
    "https://api.nekos.dev/api/v3/images/nsfw/img/keta_avatar",
    "https://api.nekos.dev/api/v3/images/nsfw/img/pussy_lewd",
    "https://api.nekos.dev/api/v3/images/nsfw/img/cosplay_lewd",
    "https://api.nekos.dev/api/v3/images/nsfw/img/futanari_lewd",
    "https://api.nekos.dev/api/v3/images/nsfw/img/trap_lewd",
    "https://api.nekos.dev/api/v3/images/nsfw/img/pantyhose_lewd",
    "https://api.nekos.dev/api/v3/images/nsfw/img/femdom_lewd",
    "https://api.nekos.dev/api/v3/images/nsfw/img/anus_lewd",
    "https://api.nekos.dev/api/v3/images/nsfw/img/neko_ero",
    "https://api.nekos.dev/api/v3/images/sfw/gif/smug",
    "https://api.nekos.dev/api/v3/images/sfw/gif/cuddle",
    "https://api.nekos.dev/api/v3/images/sfw/gif/slap",
    "https://api.nekos.dev/api/v3/images/sfw/gif/pat",
    "https://api.nekos.dev/api/v3/images/sfw/gif/poke",
    "https://api.nekos.dev/api/v3/images/sfw/gif/feed",
    "https://api.nekos.dev/api/v3/images/sfw/gif/neko",
    "https://api.nekos.dev/api/v3/images/sfw/gif/baka",
    "https://api.nekos.dev/api/v3/images/sfw/gif/hug",
    "https://api.nekos.dev/api/v3/images/sfw/gif/kiss",
    "https://api.nekos.dev/api/v3/images/sfw/gif/tickle",
    "https://api.nekos.dev/api/v3/images/sfw/img/smug",
    "https://api.nekos.dev/api/v3/images/sfw/img/8ball",
    "https://api.nekos.dev/api/v3/images/sfw/img/neko_avatars_avatar",
    "https://api.nekos.dev/api/v3/images/sfw/img/gecg",
    "https://api.nekos.dev/api/v3/images/sfw/img/holo",
    "https://api.nekos.dev/api/v3/images/sfw/img/lizard",
    "https://api.nekos.dev/api/v3/images/sfw/img/neko",
    "https://api.nekos.dev/api/v3/images/sfw/img/no_tag_avatar",
    "https://api.nekos.dev/api/v3/images/sfw/img/holo_avatar",
    "https://api.nekos.dev/api/v3/images/sfw/img/kitsune",
    "https://api.nekos.dev/api/v3/images/sfw/img/wallpaper",
    "https://api.nekos.dev/api/v3/images/sfw/img/waifu",
    "https://api.nekos.dev/api/v3/images/sfw/img/keta_avatar",
    "https://api.nekos.dev/api/v3/images/sfw/img/cat",
    "https://api.nekos.dev/api/v3/images/sfw/img/kiminonawa"
]
// Change here URLs ⤴️

for (const link of links) getimg(link)

async function getimg(link) {
    let folder = url.split('/').slice(-4).slice(1).join('/')
    const {
        body
    } = await superagent.get(link);
    if (body.data.status.code != 200) return getimg(link);

    if (!fs.existsSync(`./${folder}`)) fs.mkdirSync(`./${folder}`, { recursive: true });
    if (fs.existsSync(`./${folder}/${body.data.response.url.split('/').at(-1)}`)) {
        console.log(colors.blue(`${colors.yellow(`[INFO]`)} Already exists ! (${folder})`));
        return getImg(url);;
    }
    
    await download.image({
        url: body.data.response.url,
        dest: `${folder}/${folder2}`
        })
        .then(out => console.log(colors.gray(`${colors.yellow(`[INFO]`)} ${colors.red(out.filename)} downloaded`)))
        .catch((err) => console.error(err));
        
    getimg(link)
}

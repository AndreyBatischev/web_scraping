import axios from 'axios';
import jsdom from 'jsdom';
import { pause } from './helpers/utils.js';
import  db, { Ad, Collection } from './helpers/database.js';
import { compareCollections } from './helpers/utils.js';

const { JSDOM } = jsdom;

(async () => {

  await pause(500);

  let html: string;
  try {
    const resp = await axios.get('https://nn.hh.ru/search/vacancy?text=Node+NOT+php+NOT+devops+NOT+Vue.js+NOT+Senior+NOT+%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D0%B8%D1%82%D0%B5%D0%BB%D1%8C+NOT+Ruby-on-Rails&salary=&no_magic=true&ored_clusters=true&items_on_page=100&enable_snippets=true&search_period=1&area=2', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
     html = resp.data
  } catch (error) {
    console.log("🚀 ~ file: main.ts:9 ~ error:", error)

  }

  const dom = new JSDOM(html)
  const document = dom.window.document
  const items = document.querySelectorAll('.serp-item')


const newAds: Collection<Ad> = {}

items.forEach(node => {
  let titleCard = node.querySelector('.serp-item__title').textContent
  
  
  newAds[titleCard] = {
    id: titleCard,
    url: node.querySelector('.serp-item__title').getAttribute('href'),
    title: titleCard
  }
})

  const saveAds = await db.getSavedAds()

  const newIds = compareCollections(saveAds, newAds)

  for(const id of newIds){
    await db.setNewAd(newAds[id])
    await pause(300);
  }

process.exit(1)

})()
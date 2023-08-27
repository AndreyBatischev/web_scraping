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
    const resp = await axios.get('https://nn.hh.ru/search/vacancy?no_magic=true&L_save_area=true&text=Nodejs+developer+NOT+php&excluded_text=&area=2&salary=&currency_code=RUR&experience=doesNotMatter&order_by=relevance&search_period=1&items_on_page=100', {
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
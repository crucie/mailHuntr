import readline from 'readline'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { config } from './config.js'


const rl = readline.createInterface({
    input: process.stdin,
    output:  process.stdout
});

rl.question('Give a domain name? ' , (answer) => {

    //put it in database or use it the whole crawl logic to be fed here....
    console.log('you said this: ', answer);
    fetchPage(`https://www.${answer}`);

    rl.close();
})

async function fetchPage(url) {
    try {  
        const response = await axios.get(url, config);
        console.log(response.data);
        return response.data
    } catch (error) {
        console.log(`Error Fetching: ${url}, ${error.message}`);
        return null;
    }
};


async function fetchEmails(html, domain) {

    const $ = cheerio.load(html);
    const emails = new Set();

    // $('p')
    
    // $('body').find('*').each(i, elem)
    
}
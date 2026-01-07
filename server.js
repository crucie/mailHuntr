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
    const emails = new Set(); // Use Set for unique emails
    const links = [];

    // Find emails: Scan all text and mailto: links
    $('body').find('*').each((i, elem) => {
        const text = $(elem).text().trim();
        const href = $(elem).attr('href');
        
        // Simple regex for emails matching your domain (improve as needed)
        const emailRegex = new RegExp(`[\\w\\.-]+@${domain.replace('.', '\\.')}`, 'gi');
        const matches = text.match(emailRegex);
        if (matches) matches.forEach(email => emails.add(email));
        
        // Also check mailto: links
        if (href && href.startsWith('mailto:')) {
        const email = href.replace('mailto:', '').split('?')[0];
        if (email.endsWith(`@${domain}`)) emails.add(email);
        }
    });

    // Find internal links for crawling
    $('a[href]').each((i, elem) => {
        let href = $(elem).attr('href');
        if (href && (href.startsWith('/') || href.includes(domain))) {
        // Make relative links absolute
        if (href.startsWith('/')) href = `https://www.${domain}${href}`;
        links.push(href);
        }
    });

    return { emails: Array.from(emails), links };
    // $('p')
    
    // $('body').find('*').each(i, elem)
    
}
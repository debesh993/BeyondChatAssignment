import axios from 'axios';
import * as cheerio from 'cheerio';

const LARAVEL_API_ORIGINAL = 'http://127.0.0.1:8000/api/original-articles';

async function scrapeArticles() {
    try {
        const url = 'https://beyondchats.com/blogs/';
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const articles = [];

        $('h2 a').each((i, elem) => {
            const title = $(elem).text().trim();
            const link = $(elem).attr('href');

            if (link && title && articles.length < 5) {
                articles.push({ title, link });
            }
        });

        if (articles.length === 0) {
            console.log('No articles found — selector may need adjustment.');
            return;
        }

        for (const article of articles) {
            const articleLink = article.link.startsWith('http')
                ? article.link
                : 'https://beyondchats.com' + article.link;

            const { data: articlePage } = await axios.get(articleLink);
            const $$$ = cheerio.load(articlePage);

            const content =
                $$$('.blog-content').text().trim() ||
                $$$('.entry-content').text().trim() ||
                $$$('article').text().trim() ||
                'Content not found';

            await axios.post(
                LARAVEL_API_ORIGINAL,
                {
                    title: article.title,
                    content,
                    source: 'beyondchats'
                },
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            console.log(`Saved: ${article.title}`);
        }

        console.log('Done saving 5 oldest articles!');
    } catch (e) {
        console.error('Error saving articles:', e.message);
    }
}

scrapeArticles();

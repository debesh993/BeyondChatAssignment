import axios from 'axios';
import * as cheerio from 'cheerio';
import SerpApi from 'google-search-results-nodejs';
import { OpenRouter } from '@openrouter/sdk';

const LARAVEL_API_ORIGINAL = 'http://127.0.0.1:8000/api/original-articles';
const LARAVEL_API_UPDATED = 'http://127.0.0.1:8000/api/updated-articles';
const SERP_API_KEY = '3ca43f9250b800900a09f8b6f1dcf2c0307e023f6e9c0c7ce9060d9fb766bb6a';
const OPENROUTER_API_KEY = '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';

const client = new SerpApi.GoogleSearch(SERP_API_KEY);
const openrouter = new OpenRouter({ apiKey: OPENROUTER_API_KEY });

async function getLatestOriginalArticle() {
    try {
        const { data: articles } = await axios.get(LARAVEL_API_ORIGINAL);
        if (!articles || articles.length === 0) return null;

        const latest = articles.reduce((prev, current) => (prev.id > current.id ? prev : current));
        return latest;
    } catch (err) {
        console.error('Error fetching original articles:', err.message);
        return null;
    }
}

async function searchTopArticles(title) {
    return new Promise((resolve) => {
        client.json({ q: title, engine: "google", num: 5 }, (data) => {
            if (data && data.organic_results) {
                const links = data.organic_results
                    .map(r => r.link)
                    .filter(link => link.includes('blog') || link.includes('article'))
                    .slice(0, 2);
                resolve(links);
            } else resolve([]);
        });
    });
}

async function scrapeArticleContent(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const selectors = ['article', '.article-body', '.content', '.post-content', '.entry-content'];
        let content = '';
        for (const sel of selectors) {
            const text = $(sel).text().trim();
            if (text.length > 200) { content = text; break; }
        }
        if (!content) content = $('body').text().trim().substring(0, 1000);
        return content.replace(/\s+/g, ' ').trim();
    } catch (err) {
        console.error('Error scraping article content:', err.message);
        return '';
    }
}

async function generateUpdatedArticle(originalTitle, originalContent, references) {
    const prompt = `
You are an expert content writer. Rewrite the following article to improve clarity, structure, and depth.
Use the information from reference articles to make it more informative.
Keep the meaning intact and include a "References" section.

Original Title: ${originalTitle}
Original Content: ${originalContent}

Reference Articles:
${references.map(r => r.content.substring(0, 500) + "\nURL: " + r.link).join('\n\n')}
`;

    try {
        const response = await openrouter.chat.send({
            model: "xiaomi/mimo-v2-flash:free",
            messages: [{ role: "user", content: prompt }]
        });

        return response.choices[0].message.content || "No content generated.";
    } catch (err) {
        console.error('Error generating updated article:', err.message);
        return originalContent; 
    }
}

async function saveUpdatedArticle(originalArticle, updatedContent, references) {
    try {
        await axios.post(LARAVEL_API_UPDATED, {
            original_article_id: originalArticle.id,
            title: originalArticle.title,
            content: updatedContent,
            references: references.map(r => r.link).join(', ')
        }, { headers: { 'Content-Type': 'application/json' } });

        console.log(`Updated article saved for Original Article ID: ${originalArticle.id}`);
    } catch (err) {
        console.error('Error saving updated article:', err.message);
    }
}

(async () => {
    try {
        const latestArticle = await getLatestOriginalArticle();
        if (!latestArticle) return console.log("No original articles found.");

        console.log(`Latest Original Article ID: ${latestArticle.id}, Title: ${latestArticle.title}`);

        const topLinks = await searchTopArticles(latestArticle.title);
        console.log('Top 2 article links:', topLinks);

        const references = [];
        for (const link of topLinks) {
            const content = await scrapeArticleContent(link);
            references.push({ link, content });
        }

        const updatedContent = await generateUpdatedArticle(latestArticle.title, latestArticle.content, references);
        await saveUpdatedArticle(latestArticle, updatedContent, references);

    } catch (err) {
        console.error("Workflow Error:", err.message);
    }
})();

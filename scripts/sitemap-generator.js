const fs = require('fs');
const globby = require('globby');
const prettier = require('prettier');

const getDate = new Date().toISOString();

const WEBSITE_DOMAIN = 'https://zuma-lab.com';
const SITEMAP_XML = 'sitemap.xml';

const formatted = (sitemap) => prettier.format(sitemap, { parser: 'html' });

(async () => {
  const pages = await globby([
    // include
    'src/pages/*.tsx', // index.tsxなど固定ページをsitemapに含める
    'src/posts/*.md', // markdownをsitemapに含める
    // exclude
    '!src/pages/_*.tsx', // _app.tsx _document.tsxを除外する
  ]);

  const pagesSitemap = `
    ${pages
      .map((page) => {
        const path = page
          .replace('src/pages/', '')
          .replace('src/', '')
          .replace('.tsx', '')
          .replace('.md', '')
          .replace(/\/index/g, '');
        const routePath = path === 'index' ? '' : path;
        return `
          <url>
            <loc>${WEBSITE_DOMAIN}/${routePath}</loc>
            <lastmod>${getDate}</lastmod>
          </url>
        `;
      })
      .join('')}
  `;

  const generatedSitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
    >
      ${pagesSitemap}
    </urlset>
  `;

  fs.writeFileSync(`public/${SITEMAP_XML}`, formatted(generatedSitemap), 'utf8');
})();

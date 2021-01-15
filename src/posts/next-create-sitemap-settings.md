---
title: 'Next.js/TypeScriptプロジェクトのbuild時にsitemap.xmlを自動生成する'
date: '2021-01-15'
isPublished: true
metaDescription: 'Next.js/TypeScriptプロジェクトのbuild時にsitemap.xmlを自動生成する方法です。ブログ記事やコンテンツの作成・更新毎に生成サイトなどで sitemap.xml を作成していた手間を自動化しましょう。'
tags:
  - 'Next.js'
  - 'TypeScript'
  - 'SEO'
---

Next.js/TypeScript プロジェクトの build 時に sitemap.xml を自動生成する方法です。

ブログ記事やコンテンツの作成・更新毎に生成サイトなどで sitemap.xml を作成していた手間を自動化しましょう。

### 環境

- macOS Catalina 10.15.5(19F101)
- VSCode 1.52.1
- Next 10.0.5
- React 16.14.0
- TypeScript 4.0.5
- Yarn 1.22.4
- Node 14.9.0

## 前提

以下のディレクトリ構成を想定します。

プロジェクトルートディレクトリ(package.json がある階層)配下にソースコードがある `src/pages` 、ブログ記事の markdown がある `src/posts` と大きく２つのディレクトリがあるディレクトリ構成です。

```
src/.
├── pages
│   ├── _app.tsx
│   ├── _document.tsx
│   ├── index.tsx
│   ├── posts
│   │   └── [id].tsx
│   └── privacy.tsx
├── posts
│   ├── post1.md
│   ├── post2.md
│   └── post3.md
```

## Prettier package を install する

sitemap.xml のフォーマット処理を行う為、コードフォーマッターの Prettier を install します。

```
yarn add -D prettier
```

## sitemap.xml を出力するスクリプトを実装する

プロジェクトルートディレクトリ(package.json がある階層)に `scripts` という名前のディレクトリを作成し、 `scripts/sitemap-generator.js` ファイルを作成します。

以下実装内容です。

```js:scripts/sitemap-generator.js
const fs = require('fs');
const globby = require('globby');
const prettier = require('prettier');

const getDate = new Date().toISOString();

const WEBSITE_DOMAIN = 'https://website.com';
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
```

この sitemap.xml 生成スクリプトは Node.js で動作させる為、 `import` は `require` になっていたり Node.js の記述になっています。

`src/pages` と `src/posts` 配下のファイル名から 固定ページと記事ページの URL を生成して sitemap の xml を構築し、`public/sitemap.xml` として出力します。

`WEBSITE_DOMAIN` は対象の website ドメインに修正してください。

## sitemap.xml が出力されるか確認する

プロジェクトルートディレクトリから以下コマンドを実行します。

```
node scripts/sitemap-generator.js
```

`public` ディレクトリ配下に以下 `sitemap.xml` が出力されていれば成功です。

```xml:sitemap.xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
>
  <url>
    <loc>https://website.com/</loc>
    <lastmod>2021-01-15T04:30:55.379Z</lastmod>
  </url>

  <url>
    <loc>https://website.com/privacy</loc>
    <lastmod>2021-01-15T04:30:55.379Z</lastmod>
  </url>

  <url>
    <loc>https://website.com/posts/post1</loc>
    <lastmod>2021-01-15T04:30:55.379Z</lastmod>
  </url>

  <url>
    <loc>https://website.com/posts/post2</loc>
    <lastmod>2021-01-15T04:30:55.379Z</lastmod>
  </url>

  <url>
    <loc>https://website.com/posts/post3</loc>
    <lastmod>2021-01-15T04:30:55.379Z</lastmod>
  </url>
</urlset>
```

## build 時に sitemap.xml を自動生成する設定ファイル next.config.js 作成

プロジェクトルートディレクトリ直下に `next.config.js` を作成してください。

以下設定内容です。

```js:next.config.js
module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      require('scripts/sitemap-generator');
    }
    return config;
  },
};
```

`isServer=false` 時(クライアントビルド時)に `scripts/sitemap-generator` を読み込んで sitemap.xml を生成しています。

`yarn dev` か `yarn build` コマンドを実行してください。

`public/sitemap.xml` ファイルが生成されていれば成功です。

これで build 時の sitemap.xml の自動生成設定は完了です。

## robots.txt の作成

Google のクローラーに sitemap.xml の場所を教えてクロールの促進をさせる為、`public` ディレクトリ直下に `robots.txt` を作成します。

設定内容としては以下となります。

```
User-Agent: *
Disallow:
Sitemap:https://your.website.com/sitemap.xml
```

`User-Agent: *` で全てクローラーを対象として、 `Disallow:` で全てのページのクローリングを許可します。

最後に `Sitemap:` に sitemap.xml がある URL を指定します。

この後 Google Search Console に sitemap.xml を登録するので、ホスティングサービスにデプロイして sitemap.xml を公開してください。

## Google Search Console に sitemap.xml を登録する

<img src='/images/posts/2021-01-15-1.png' class='img' alt='post image' />

Google Search Console を開き、ドメインを登録します。

ドメイン名を入力して `続行` ボタンをクリックしてください。

<img src='/images/posts/2021-01-15-2.png' class='img' alt='post image' />

ドメインの所有権を確認する為、 `TXTレコード` をコピーしてください。

<img src='/images/posts/2021-01-15-3.png' class='img' alt='post image' />

筆者の場合、お名前.com でドメインを取得したので、お名前.com の DNS レコードの作成から、Google Search Console の TXT レコードを登録しました。

<img src='/images/posts/2021-01-15-4.png' class='img' alt='post image' />

Google Search Console に戻り、先程のドメイン所有権の確認ダイアログの `確認` ボタンをクリックしてください。

DNS の変更が適用されるまでに時間がかかる場合があるので、所有権の確認が取れない場合は時間を置いて再度試してください。

筆者の場合、所有権の確認が取れるまで 1 時間程かかりました。

<img src='/images/posts/2021-01-15-5.png' class='img' alt='post image' />

最後にサイトマップ画面を開いて、先程公開した sitemap.xml の URL を入力し `送信` ボタンをクリックして sitemap.xml の登録は完了です。

## おわりに

sitemap.xml を記事作成・更新時に生成サイトなどで都度生成するのはやはり手間がかかります。

build 時に sitemap.xml を自動生成・更新しておけば記事を書くハードルが一つ下がるので是非お試し下さい。

こちらは sitemap.xml 自動生成設定をした本 Web サイト repository になりますので参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="kazuma-fujita/zuma-lab: ZUMA Lab website repository." src="https://hatenablog-parts.com/embed?url=https://github.com/kazuma-fujita/zuma-lab" frameborder="0" scrolling="no"></iframe>

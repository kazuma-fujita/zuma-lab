---
title: 'Node.js/PuppeteerでGoogleの店舗クチコミ情報をスクレイピングする'
date: '2021-01-26'
isPublished: true
metaDescription: 'Node.js/PuppeteerでGoogleの店舗クチコミ情報をスクレイピングします。今回は実装サンプルとして、外部ファイルから検索ワードの取得、Google 検索実行、店舗情報取得、店舗クチコミ情報取得、取得結果を csv ファイルに出力します。'
tags:
  - 'Node.js'
  - 'Puppeteer'
  - 'Scraping'
---

今回は Node.js/Puppeteer で Google の店舗クチコミ情報を Web スクレイピングします。

Google クチコミ検索の場合、Google のクチコミ一覧ダイアログは JavaScript で描写される為、スクレイピングするにはヘッドレスブラウザが必要になります。

Puppeteer は install するだけで Chromium がバンドルされ利用できるので、手軽にヘッドレスブラウザを利用したスクレイピングを始めることができます。

今回は実装サンプルとして、外部ファイルから検索ワードの取得、Google 検索実行、店舗情報取得、店舗クチコミ情報取得、取得結果を csv ファイルに出力します。

それでは見ていきましょう。

※ Web 上のデータにも著作権があるので、スクレイピングしたデータは解析用に自分で使う程度にしましょう。

### 環境

- OS
  - macOS Big Sur 11.1
- VSCode
  - 1.52.1
- Node
  - 14.9.0
- yarn
  - 1.22.4

## 作業ディレクトリを作成する

以下コマンドを実行して作業ディレクトリを作成します。

```
mkdir node-scraping-sample && cd node-scraping-sample
```

補足ですが、git 管理をする場合は `.gitignore` を作成しておきましょう。

ignore する内容は [gitignore/Node.gitignore](https://github.com/github/gitignore/blob/master/Node.gitignore) が参考になります。

## Puppeteer を install する

以下コマンドで puppeteer を install します。

```
yarn add puppeteer
```

install が完了したら package を確認します。

```
$ yarn list --depth=0 | grep -e puppeteer
warning package.json: No license field
warning No license field
├─ puppeteer@5.5.0
```

## 画面のスクリーンショットを撮る

それでは最初に簡単な画面スクリーンショットを撮ってみます。

その前にソースを置くディレクトリとスクリーンショットを置くディレクトリを作成します。

```
mkdir src screenshot
```

`src/screenshot.js` ファイルを作成して以下追記してください。

```js:screenshot.js
const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://www.google.com");
  await page.screenshot({ path: "screenshot/screenshot.png" });

  await browser.close();
})();
```

`puppeteer.launch()` でヘッドレスモードでブラウザを起動します。

`page.goto()` で指定した URL のページを開きます。

`page.screenshot()` で指定したパスにスクリーンショットを保存します。

以下コマンドでプログラムを実行します。

```
node src/screenshot.js
```

先程作成した screenshot ディレクトリ配下に screenshot.png が作成されています。

以下のコマンドでファイルを開いてスクリーンショットを確認できます。

```
open screenshot/screenshot.png
```

## Google 検索をする

次に Google 検索をしてみます。

`src/search.js` ファイルを作成して以下追記してください。

```js:search.js
const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false, // 動作確認するためheadlessモードにしない
    slowMo: 50, // 動作確認しやすいようにpuppeteerの操作を遅延させる
  });
  const page = await browser.newPage();

  await page.goto("https://www.google.com/");
  await page.type("input[name=q]", "Puppeteer", { delay: 100 });
  await Promise.all([
    page.waitForNavigation(),
    page.click('input[type="submit"]'),
  ]);
  await page.screenshot({ path: "screenshot/search.png", fullPage: true });

  await browser.close();
})();

```

`headless: false` でヘッドレスモードを OFF にしてブラウザを起動します。

`slowMo` で puppeteer の動作を遅延させます。

この値は大きすぎると実行速度が遅くなるので、ブラウザ挙動を確認しながら決定します。

以下コマンドでプログラムを実行します。

```
node src/search.js
```

ブラウザが立ち上がって、検索されるのが分かると思います。

先程作成した screenshot ディレクトリ配下に search.png が作成されています。

`fullPage: true` を指定しているので全画面の screenshot が保存されます。

## Google のクチコミをスクレイピングする

それでは本題の Google のクチコミをスクレイピングします。

事前準備として、スクレイピング結果を csv 形式でファイル保存するので、`csv-writer` を install してください。
またファイル名に日付を付与する為、 `date-fns` も install します。

```
yarn add csv-writer date-fns
```

`src` 配下にスクレイピングするソースコードを置くディレクトリ、検索ワードの入力ファイル・ディレクトリ、スクレイピング結果をファイル出力するディレクトリを作成します。

```
mkdir -p src/review/lib src/review/output src/review/input
```

## 構成

最終的に以下のようなファイル構成になります。

```
├── src
│   ├── review
│   │   ├── input
│   │   │   └── search_keywords.txt
│   │   ├── lib
│   │   │   ├── files.js
│   │   │   ├── shop-information.js
│   │   │   └── shop-review.js
│   │   ├── main.js
│   │   ├── output
│   │   │   └── shop_review_2021-01-26.csv
│   │   └── scraping.js
```

## ファイルの入出力をする処理を実装する

まず検索する店舗名の検索を記述する `src/review/input/search_keywords.txt` ファイルを作成します。

検索したい店舗の検索キーワードを追記してください。

注意点として、必ず検索結果にクチコミが存在する検索キーワードを追記してください。

クチコミが存在しない場合、スクリプト実行時にエラーを返します。

- src/review/input/search_keywords.txt

```
中華そば 初代修
麺や くぬぎ
中華そば ムタヒロ 1号店
```

次に、ファイルの入出力をする処理を記述した `src/review/lib/files.js` を作成します。

- src/review/lib/files.js

```js:src/review/lib/files.js
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const format = require("date-fns/format");
const ja = require("date-fns/locale/ja");
const fs = require("fs");

// 出力csvファイル名のpostfix用に現在日時取得
const formattedDate = format(new Date(), "yyyy-MM-dd", { locale: ja });

// 検索キーワードファイルパス
const inputPath = "src/review/input/search_keywords.txt";

// csv出力ファイルパス
const outputPath = `src/review/output/shop_review_${formattedDate}.csv`;

// csvヘッダー
const csvHeader = [
  { id: "name", title: "施設名" },
  { id: "address", title: "住所" },
  { id: "telephoneNumber", title: "電話番号" },
  { id: "score", title: "レビュースコア" },
  { id: "reviewCount", title: "クチコミ数" },
  { id: "review", title: "クチコミ" },
];

const fileEncoding = "utf8";

exports.getSearchKeywords = function () {
  // 検索キーワードファイル読み込み
  var text = fs.readFileSync(inputPath, fileEncoding);
  var lines = text.toString().split("\n");
  if (lines.length === 0)
    throw Error("The line of the read file does not exist.");
  return lines;
};

exports.writeScv = async function (outputData) {
  // csvファイル出力設定
  const csvWriter = createCsvWriter({
    // 出力ファイル名
    path: outputPath,
    // csvヘッダー設定
    header: csvHeader,
    encoding: fileEncoding,
  });
  // csv出力
  await csvWriter
    .writeRecords(outputData)
    .then(() => console.log("Output csv complete."))
    .catch((error) => console.error(error));
};
```

ここでは `getSearchKeywords` で検索キーワードファイルから検索キーワード配列を返却しています。

`writeScv` で csv 出力を実行しています。

先程作成した `output` ディレクトリ配下に日付入りに csv ファイルが出力されます。

csv のヘッダーを変更する場合は、 `csvHeader` オブジェクト配列の id と title を変更します。

## 店舗名・住所・電話番号・レビュースコア・クチコミ数を取得する処理を実装する

`src/review/lib/shop-information.js` ファイルを作成して以下を追記します。

- src/review/lib/shop-information.js

```js:src/review/lib/shop-information.js
exports.getShopName = async function (page) {
  const element = await page.$('[data-attrid="title"]');
  if (!element) throw Error('data-attrid="title" not found.');
  return await (await element.getProperty("innerText")).jsonValue();
};

exports.getShopAddress = async function (page) {
  const elements = await page.$$(
    '[data-attrid="kc:/location/location:address"] > div > div > span'
  );
  return 2 === elements.length
    ? await (await elements[1].getProperty("innerText")).jsonValue()
    : "";
};

exports.getShopTelephoneNumber = async function (page) {
  const elements = await page.$$(
    '[data-attrid="kc:/collection/knowledge_panels/has_phone:phone"] > div > div > span'
  );
  return 2 === elements.length
    ? await (await elements[1].getProperty("innerText")).jsonValue()
    : "";
};

const getScoreElements = async function (page) {
  const elements = await page.$$(
    '[data-attrid="kc:/collection/knowledge_panels/local_reviewable:star_score"] > div > div > span'
  );
  if (2 !== elements.length)
    throw Error(
      'data-attrid="kc:/collection/knowledge_panels/local_reviewable:star_score" not found.'
    );
  return elements;
};

exports.getShopScore = async function (page) {
  const elements = await getScoreElements(page);
  return await (await elements[0].getProperty("innerText")).jsonValue();
};

exports.getShopReviewCount = async function (page) {
  const elements = await getScoreElements(page);
  const reviewText = await (
    await elements[1].getProperty("innerText")
  ).jsonValue();
  const reviewCount = reviewText.match(/\d+/)[0];
  return reviewCount;
};
```

Google の検索結果から店舗名・住所・電話番号・レビュースコア・クチコミ数を取得する関数を実装しています。

注意点として、 `page.$$` で指定しているセレクターが Google 側で変更されるとスクレイピングが失敗します。

実装しているのは 2021/01/26 現在のセレクターですので、セレクターは適宜変更してください。

## クチコミを取得する処理を実装する

`src/review/lib/shop-review.js` ファイルを作成して以下を追記します。

- src/review/lib/shop-review.js

```js:src/review/lib/shop-review.js
exports.openShopReviewDialog = async function (page) {
  // 「Googleのクチコミ(n)」リンク取得
  const reviewDialogLink = await page.waitForSelector(
    '[data-async-trigger="reviewDialog"]'
  );
  // ダイアログを開く時は waitForSelector に visible: true オプションをつける
  await Promise.all([
    page.waitForSelector("div.review-dialog-list", { visible: true }),
    reviewDialogLink.click(),
  ]);
};

exports.scrollShopReviewDialog = async function (page, reviewCount) {
  // evaluateブロック内のconsole.log出力の為、コンソールイベントを登録
  page.on("console", (msg) => {
    for (let i = 0; i < msg._args.length; ++i)
      console.log(`${i}: ${msg._args[i]}`);
  });
  // クチコミ全件表示の為、review数を10で割って四捨五入繰り上げ数分loop
  const loopCount = Math.ceil(parseInt(reviewCount, 10) / 10);
  // クチコミダイアログのセレクター名
  const reviewDialogSelector = "div.review-dialog-list";
  await page.evaluate(
    async ({ selector, loopCount }) => {
      await new Promise((resolve, _) => {
        // ダイアログのスクロール量
        let distance = 3000;
        // 次にスクロールするまでの間隔(ms)
        let interval = 1500;
        let count = 0;
        // クチコミダイアログのクチコミを全件表示するまでscroll
        let timer = setInterval(() => {
          document.querySelector(selector).scrollBy(0, distance);
          // loopCountに達したらscroll終了
          if (count++ === loopCount) {
            clearInterval(timer);
            resolve();
          }
        }, interval);
      });
    },
    { selector: reviewDialogSelector, loopCount }
  );
};

exports.clickAllMoreLink = async function (page) {
  // クチコミダイアログ内の「もっと見る」リンクを全て開く
  await page.$$eval("a.review-more-link", (links) =>
    links.map((link) => link.click())
  );
};

exports.getAllReviews = async function (page) {
  // クチコミダイアログの一覧要素を取得
  const reviewElements = await page.$$("div.gws-localreviews__google-review");
  if (reviewElements.length === 0) throw Error("There is no review count.");
  // クチコミ配列を取得
  const reviews = await Promise.all(
    reviewElements.map(
      async (elementHandle) =>
        await (await elementHandle.getProperty("innerText")).jsonValue()
    )
  );
  return reviews;
};
```

- `openShopReviewDialog` でクチコミダイアログを開きます
  - ダイアログを開く際は `page.waitForSelector("セレクター名", { visible: true }),` を指定します
- 全てのクチコミを取得する為、 `scrollShopReviewDialog` でクチコミダイアログをクチコミ件数分スクロールさせています
- `clickAllMoreLink` クチコミダイアログ内の「もっと見る」リンクを全て開きます
- `getAllReviews` でクチコミを全件取得します

ここでも注意点として、`page.$$` に指定するセレクターは変更になる可能性があるので、適宜修正してください。

## main スクリプトを実装する

`src/review/main.js` ファイルを作成して以下を追記します。

スクレイピングを実行する際はこの main.js を実行します。

- src/review/main.js

```js:src/review/main.js
const puppeteer = require("puppeteer");
const scraping = require("./scraping.js");
const files = require("./lib/files.js");
const WINDOW_WIDTH = 1600;
const WINDOW_HIGHT = 950;

(async () => {
  const browser = await puppeteer.launch({
    // 動作確認するためheadlessモードにしない
    headless: false,
    // 動作確認しやすいようにpuppeteerの操作を遅延
    slowMo: 10,
    args: [
      // Chromeウィンドウのサイズ
      `--window-size=${WINDOW_WIDTH}, ${WINDOW_HIGHT}`,
      // Chromeウィンドウのポジション
      "--window-position=100,50",
    ],
  });
  const page = await browser.newPage();
  // 画面の大きさ設定
  await page.setViewport({ width: WINDOW_WIDTH, height: WINDOW_HIGHT });
  try {
    // 検索キーワードファイル読み込み
    const keywords = files.getSearchKeywords();
    let outputData = [];
    // loop内を同期で処理する為 for of
    for (const keyword of keywords) {
      // 店舗レビューオブジェクト取得
      const shopReviews = await scraping.scrapingShopReviews(page, keyword);
      // 最終的に出力する配列に結合
      outputData = outputData.concat(shopReviews);
    }
    // csv出力
    await files.writeScv(outputData);
  } catch (error) {
    console.error("[ERROR] ", error);
    throw error;
  } finally {
    await browser.close();
  }
})();
```

ここでは先程実装した各ファイルから関数を呼び出して、検索キーワードファイルから検索キーワード読み込み、Google 検索実行、店舗クチコミ取得、結果を csv ファイル出力しています。

## スクレイピングを実行する

それでは以下コマンドを実行してスクレピングを実行しましょう。

```
node src/review/main.js
```

Chromium が立ち上がり、 `search_keywords.txt` に記述した検索キーワードで Google 検索が実行されます。

その後クチコミ一覧ダイアログが起動し画面スクロールして「もっと見る」リンクが開きます。

クチコミ件数が多いとこの処理に時間がかかりますが気長に待ちましょう。

以下のログが表示されたら処理の完了です。

```
Output csv complete.
```

`output` ディレクトリに `shop_review_yyyy-MM-dd.csv` が作成されていることを確認してください。

<img src='/images/posts/2021-01-26-1.png' class='img' alt='post image' />

ファイルを開いて内容を確認してください。

店舗電話番号は Google に情報が無い場合があります。

その場合のカラムは空白となります。

## おわりに

過去に Cypress を利用した Web スクレイピングをしました。

Cypress は E2E テストツールですが、スクレイピングも出来るので興味がある方は記事をご覧ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Cypress/TypeScriptでGoogleのクチコミをスクレイピングをする | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/cypress-web-scraping" frameborder="0" scrolling="no"></iframe>

今回 Node.js と Puppeteer を利用して、 JavaScript で DOM が構築される SPA のサイトも簡単にスクレイピング出来ることが分かりました。

Docker や AWS Lambda から Puppeteer を実行する場合、多少ソースコードの変更が必要になります。

クラウド上でスクレイピングを実行する需要がありそうなら、そちらも記事にしますのでお問い合わせフォームか、Twitter から連絡お願い致します。

最後に、今回実装したソースコードは Github にありますので参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="kazuma-fujita/node-scraping-sample: Web scraping with Node.js/Puppeteer." src="https://hatenablog-parts.com/embed?url=https://github.com/kazuma-fujita/node-scraping-sample" frameborder="0" scrolling="no"></iframe>

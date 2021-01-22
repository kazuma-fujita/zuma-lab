---
title: 'Node.js/PuppeteerでGoogleの店舗クチコミをスクレイピングする'
date: '2021-01-XX'
isPublished: false
metaDescription: 'Node.js/PuppeteerでGoogleの店舗クチコミをスクレイピングする'
tags:
  - 'Node.js'
  - 'Puppeteer'
  - 'Scraping'
---

今回は Node.js/Puppeteer で Web スクレイピングをします。

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

ブラウザが立ち上がって、キーワード検索されるのが分かると思います。

先程作成した screenshot ディレクトリ配下に search.png が作成されています。

`fullPage: true` を指定しているので全画面の screenshot が保存されます。

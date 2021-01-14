---
title: 'Next.js/TypeScriptで本番/ステージング/ローカル環境別にGoogle Analyticsを利用する'
date: '2021-01-14'
isPublished: true
metaDescription: 'Next.js/TypeScriptで本番/ステージング/ローカル環境別にGoogle Analyticsを利用する方法です。環境変数ファイル `.env` に測定 ID を設定して、本番環境、ステージング(preview)環境、ローカル環境でブラウザに表示する測定 ID を出し分けします。'
tags:
  - 'Next.js'
  - 'TypeScript'
  - 'Google Analytics'
---

Next.js/TypeScript で Google Analytics を利用する方法です。

今回は、環境変数ファイル `.env` に Google Analytics 測定 ID を設定して、本番環境、ステージング(preview)環境、ローカル環境別でトラッキングする測定 ID を出し分けします。

また、ローカル環境はトラッキングしたくない場合も解説します。

※ Google アカウント作成方法、Google Analytics のウェブストリームの設定方法は解説しません。

### 環境

- macOS Catalina 10.15.5(19F101)
- VSCode 1.52.1
- Next 10.0.5
- React 16.14.0
- TypeScript 4.0.5
- yarn 1.22.4

## Google Analytics の測定 ID を取得する

前提として既に Google Analytics のウェブストリームは作成済みとします。

Google Analytics コンソールを開き、左ペインの歯車アイコン `管理` 項目をクリックします。

<img src='/images/posts/2021-01-14-1.png' class='img' alt='post image' />

プロパティの `データストリーム` をからデータストリーム画面を開きます。

データストリーム画面で今回タグを設置する Web サイトを選択してウェブストリームの詳細画面を開きます。

<img src='/images/posts/2021-01-14-2.png' class='img' alt='post image' />

この後の設定で使用する `測定ID` をコピーします。

本番、ステージング環境で測定 ID を分けている場合はそれぞれ取得します。

## Google Analytics の 測定 ID を環境変数ファイル .env に記述する

プロジェクトルートディレクトリ(package.json がある階層)に環境変数ファイル .env ファイルを作成します。

.env ファイルに以下一行を記述します。

```
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID="{先程取得した測定ID}"
```

通常、環境変数は Node.js 環境でのみ使用出来ます。

`NEXT_PUBLIC` というプレフィックスが付いていると、その値はブラウザに送信される JavaScript にインライン化されます。

今回 JavaScript に測定 ID をに埋め込みたいので `NEXT_PUBLIC` プレフィックスを付けます。

詳しくは [Next.js - Exposing Environment Variables to the Browser](https://nextjs.org/docs/basic-features/environment-variables#exposing-environment-variables-to-the-browser) を参照ください。

ローカル環境はトラッキングしたく無い場合は、値を空にしてください。

## .gitignore に.env ファイルを追記する

プロジェクトを git で管理している場合、.gitignore を開き、以下一行を追記します。

```
.env
```

開発中、秘匿情報は.env ファイルに追記していくので gitignore しておくことをオススメします。

これだと他の開発メンバーは環境変数名が分からないので、プロジェクトルートディレクトリに以下一行を記述した `.env.sample` というファイルを作成します。

```
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=
```

こちらは環境変数のキーだけ記述して git に push しておきます。

他の開発メンバーは新規で repository を pull した後、 `.env.sample` をコピーして `.env` ファイルを作成し、環境変数の値をローカル管理して利用します。

本番、ステージング環境で測定 ID を分ける場合は、ホスティングする環境先で環境変数をそれぞれ設定します。

今回は Vercel を利用した例をこの後ご紹介します。

## Google Analytics イベントを発火する関数を実装する

Google Analytics イベントを発火する関数を実装するファイル `src/lib/gtag.ts` を作成します。

実装内容としては以下になります。

```ts:src/lib/gtag.ts
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || '';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string): void => {
  if (!GA_TRACKING_ID) return;
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
type GaEventProps = {
  action: string;
  category: string;
  label: string;
  value?: number;
};

export const event = ({ action, category, label, value }: GaEventProps): void => {
  if (!GA_TRACKING_ID) return;
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
```

`GA_TRACKING_ID` が無ければ return しイベントを発火しないようにしています。

ローカル環境で Google Analytics を利用しない場合、 `.env` の `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` の値を空にするとトラッキングされません。

## \_document.tsx に Google Analytics のスクリプトを埋め込む

Google Analytics のスクリプトを埋め込む為、 `/src/pages/_document.tsx` を作成します。

`_document.tsx` は Next.js の独自ファイルで HTML の `<html>` や `<body>` タグの拡張に使われます。

注意すべき点は `_document.js` はサーバーサイドのみでレンダリングされ、クライアントサイドでは使われません。

`onClick` のようなイベントハンドラはここに追加しないでください。

```ts:/src/pages/_document.tsx
class CustomDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang='ja'>
        <Head>
          {/* Google Analytics */}
          {GA_TRACKING_ID && (
            <>
              <script async={true} src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}', {
                  page_path: window.location.pathname,
                });`,
                }}
              />
            </>
          )}
        </Head>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;
```

`GA_TRACKING_ID` が無ければスクリプトが埋め込められないようにしています。

## \_app.tsx に PV カウントを発火するイベントを実装する

画面遷移時に PV カウントする PageView イベントを発火させる為、 `/src/pages/_app.tsx` を作成します。

`_app.tsx` は全画面共通で呼ばれる処理を記述します。

`_app.tsx` の実装は以下になります。

```ts:/src/pages/_app.tsx
const CustomApp = ({ Component, pageProps }: AppProps): JSX.Element => {

  // Google Analyticsをページ遷移時にも対応させる
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <Component {...pageProps} />
  );
};

export default CustomApp;
```

Next.js のサイトは SPA である為、ページを遷移する時に JavaScript で URL を書き換えます。

その際、Google Analytics はアクセスした最初のページしか PV 測定のイベントを送信しません。

ユーザがページ遷移した時の PV 数も取得出来るように `useRouter` を利用して遷移時に PV カウントする PageView イベントを発火させます。

## gtag の型定義をする為 @types/gtag.js をインストールする

最後に TypeScript の gtag の型定義をする為、 `@types/gtag.js` package をインストールします。

```
yarn add -D @types/gtag.js
```

参考までに `@types/gtag.js` では以下のように型定義されています。

```ts:@types/gtag.js
declare var gtag: Gtag.Gtag;
declare namespace Gtag {
  interface Gtag {
    (command: 'config', targetId: string, config?: ControlParams | EventParams | CustomParams): void;
    (command: 'set', targetId: string, config: CustomParams): void;
    (command: 'set', config: CustomParams): void;
    (command: 'js', config: Date): void;
    (command: 'event', eventName: EventNames | string, eventParams?: ControlParams | EventParams | CustomParams): void;
  }

  interface CustomParams {
    [key: string]: any;
  }

  interface ControlParams {
    groups?: string | string[];
    send_to?: string | string[];
    event_callback?: () => void;
    event_timeout?: number;
  }
             :
             :
}
```

以上で Next.js/TypeScript プロジェクトの基本的な Google Analytics 設置が完了です。

## Vercel で本番/ステージングの測定 ID の環境変数を設定する

後はホスティング先で測定 ID の環境変数を設定します。

今回は Vercel の設定方法を説明します。

Vercel のコンソールで対象のプロジェクトを開きます。

Settings から Environment Variables 画面を開きます。

<img src='/images/posts/2021-01-14-3.png' class='img' alt='post image' />

Add New の `Which type of Environment Variable do you want to add?` は `Plaintext` を選択します。

`What's its name and value?` の NAME には `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` VALUE に測定 ID を入力します。

`In which Environments would you like to make it available?` には設定する環境を選択します。

環境を複数選択して、共通の環境変数を設定することも可能です。

Vercel のこの柔軟さは素晴らしいです。

`Save` ボタンを押して設定完了です。

<img src='/images/posts/2021-01-14-4.png' class='img' alt='post image' />

設定後の値が問題無いか確認してください。

設定後、アプリケーションをデプロイしてください。

デプロイされた Web サイトの HTML を確認すると以下 script タグが出力されるはずです。

```html
<script async="" src="https://www.googletagmanager.com/gtag/js?id=XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', 'XXXXXXXXXXX', {
    page_path: window.location.pathname,
  });
</script>
```

## おわりに

今回は Next.js/TypeScript で Google Analytics を利用する方法でした。

Google Analytics 設置については色んな記事で書かれていますが、本番、ステージング、ローカル環境別で測定 ID を出し分ける実用的な記事になったかなと思います。

こちらは Google Analytics 設定をした本 Web サイト repository になりますので参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="kazuma-fujita/zuma-lab: ZUMA Lab website repository." src="https://hatenablog-parts.com/embed?url=https://github.com/kazuma-fujita/zuma-lab" frameborder="0" scrolling="no"></iframe>

---
title: 'Next/Typescript/Material-UIの初期環境構築手順'
date: '2021-01-04'
isPublished: true
---

## 環境

- OS
  - macOS Catalina 10.15.5(19F101)
- VSCode
  - 1.52.1
- next
  - 10.0.4
- react
  - 16.14.0
- typescript
  - 4.0.5
- yarn
  - 1.22.4

## Next/Typescript 設定

### yarn create next-app 実行

`yarn create next-app` を実行し雛形を作成する。第一引数に任意のプロジェクト名を指定。

ミソは `--example with-typescript` で、Typescript のテンプレートを指定することにより、一発で Typescript 設定された雛形が作成される。

```
yarn create next-app sample-app --example with-typescript
```

本当にこれだけで Typescript の package や `tsconfig.json` などが揃っているので便利。

### install package 確認

```
$ yarn list --depth=0 |grep -e next -e typescript
├─ @next/env@10.0.4
├─ @next/polyfill-module@10.0.4
├─ @next/react-dev-overlay@10.0.4
├─ @next/react-refresh-utils@10.0.4
├─ next-tick@1.0.0
├─ next@10.0.4
├─ process-nextick-args@2.0.1
├─ typescript@4.0.5
```

雛形が作成されたら、 `yarn dev` でアプリケーションを起動し、 [http://localhost:3000](http://localhost:3000) を開いて Next の初期画面が表示されることを確認する。

### src ディレクトリの作成

create-next-app した初期状態では src ディレクトリが無いので作成して他の階層を src ディレクトリに移動する

```
cd sample-app && mkdir src && mv components interfaces pages src/.
```

この作業は好みだが、CRA で開発をする時は基本プロダクトソースコードを src ディレクトリ配下に置くので、慣例として実行する。

## Material-UI 設定

Next ではデフォルト Material-UI が利用出来ない。というより Material-UI が Next の SSR に対応していないので対応させる。

### material-ui package install

```
yarn add @material-ui/core @material-ui/icons styled-components
```

```
yarn add -D @types/styled-components babel-plugin-styled-components
```

### .babelrc を作成する

package.json がある階層と同じ階層に `.babelrc` ファイルを作成する。

```json:.babelrc
{
  "presets": [
    "next/babel"
  ],
  "plugins": [
    [
      "styled-components",
      {
        "ssr": true,
        "displayName": true,
        "preprocess": false
      }
    ]
  ]
}
```

### \_app.tsx を作成する

material-ui と styled-components を全画面共通で利用出来るよう `src/pages/_app.tsx` を作成する

`MaterialUIThemeProvider` と `StyledComponentsThemeProvider` でどこでも material-ui と styled-components を利用できるようにしている。

```tsx:_app.tsx
import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';
import { ThemeProvider as MaterialUIThemeProvider } from '@material-ui/core/styles';
import { StylesProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../styles/theme';

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  useEffect(() => {
    const jssStyles: any = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <StylesProvider injectFirst>
      <MaterialUIThemeProvider theme={theme}>
        <StyledComponentsThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </StyledComponentsThemeProvider>
      </MaterialUIThemeProvider>
    </StylesProvider>
  );
};

export default App;
```

### \_document.tsx 作成

material-ui / styled-components を SSR に対応させる為、 `src/pages/_document.tsx` を作成する

`_document.tsx` は Next の独自ファイルで HTML の `<html>` や `<body>` タグの拡張に使われる。

`_document.tsx` はブラウザで実行されることは無く、サーバ再度でのみ実行される。

material-ui や styled-components で指定した CSS はこのファイルに設定を用意すれば、SSR 対応出来る。

```tsx: _document.tsx
import Document, { DocumentContext, Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet as StyledComponentSheets } from 'styled-components';
import { ServerStyleSheets as MaterialUiServerStyleSheets } from '@material-ui/styles';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const styledComponentSheets = new StyledComponentSheets();
    const materialUiServerStyleSheets = new MaterialUiServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props =>
            styledComponentSheets.collectStyles(
              materialUiServerStyleSheets.collect(<App {...props} />)
            )
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {styledComponentSheets.getStyleElement()}
            {materialUiServerStyleSheets.getStyleElement()}
          </>
        )
      };
    } finally {
      styledComponentSheets.seal();
    }
  }

  render() {
    return (
      <Html lang="ja">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
```

## Material-UI 用の theme を作成

最後に、 `src/styles/theme.ts` を作成する

```ts:theme.ts
import { createMuiTheme } from '@material-ui/core';
const theme = createMuiTheme();
export default theme;
```

これで Next のアプリでも Typescript を利用、かつ Material-UI と styled-components を利用することが出来る。

## 参考

[Material-UI と styled components で，next.js の css をいい感じに管理する (Jest/TypeScript 対応版)](https://qiita.com/o3c9/items/2551820edc156704edba)

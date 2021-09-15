---
title: 'Next.js/TypeScriptプロジェクトにMaterial-UI/styled-componentsを対応させる'
date: '2021-01-12'
isPublished: true
metaDescription: 'Next.js/TypescriptプロジェクトにMaterial-UI/styled-componentsを対応させます。'
tags:
  - 'Next.js'
  - 'TypeScript'
  - 'Material-UI'
  - 'styled-components'
---

Next.js/Typescript プロジェクトに Material-UI/styled-components を対応させます。

Next ではデフォルト Material-UI/styled-components が利用出来ません。

というより Material-UI/styled-components が Next の SSR に対応していないので対応させます。

### 環境

- macOS Catalina 10.15.5(19F101)
- VSCode 1.52.1
- Next 10.0.4
- React 16.14.0
- TypeScript 4.0.5
- yarn 1.22.4

## create next-app を実行してアプリケーションの雛形を作成する

`yarn create next-app` で `sample-app` という名前の雛形を作成します。

今回はあらかじめ TypeScript が設定された `with-typescript` テンプレートを流用します。

```
yarn create next-app sample-app --example with-typescript
```

## src ディレクトリの作成

`create next-app` した初期状態では `src` ディレクトリがありません。

`src` ディレクトリを作成して他の階層を `src` ディレクトリに移動します。

この作業は好みですが、CRA で開発をする時は基本プロダクトソースコードを `src` ディレクトリ配下に置くので、慣例として実行します。

```
cd sample-app && mkdir src && mv components interfaces pages utils src/.
```

雛形を作成したら、 `yarn dev` でアプリケーションを起動し、 [http://localhost:3000](http://localhost:3000) を開いて Next の初期画面が表示されることを確認します。

## Material-UI/styled-components package を install する

- dependencies package

```
yarn add @material-ui/core @material-ui/icons @material-ui/lab styled-components
```

- devDependencies package

```
yarn add -D @types/styled-components babel-plugin-styled-components
```

### install した package を確認する

```
$ yarn list --depth=0 |grep -e material-ui -e styled-components
(standard input):30:├─ @material-ui/core@4.12.3
(standard input):31:├─ @material-ui/icons@4.11.2
(standard input):32:├─ @material-ui/lab@4.0.0-alpha.60
(standard input):33:├─ @material-ui/styles@4.11.4
(standard input):34:├─ @material-ui/system@4.12.1
(standard input):35:├─ @material-ui/types@5.1.0
(standard input):36:├─ @material-ui/utils@4.11.2
(standard input):58:├─ @types/styled-components@5.1.14
(standard input):81:├─ babel-plugin-styled-components@1.13.2
(standard input):366:├─ styled-components@5.3.1
```

## .babelrc を作成する

package.json と同じ階層に `.babelrc` ファイルを作成し、先程 install した　`babel-plugin-styled-components` を有効化します。

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

## Material-UI 用の theme を作成する

Material-UI の theme 作成の為、 `src/styles/theme.ts` を作成します。

こちらのファイルは今後開発中に Material-UI のデフォルト theme を変更したい時に利用します。

```ts:theme.ts
import { createTheme } from '@material-ui/core';
const theme = createTheme();
export default theme;
```

## \_app.tsx を作成する

material-ui と styled-components を全画面共通で利用出来るよう `src/pages/_app.tsx` を作成します。

`_app.tsx` ファイルに `MaterialUIThemeProvider` と `StyledComponentsThemeProvider` を設定することで Material-UI と styled-components を利用できるようにしています。

```jsx:_app.tsx
import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';
import { ThemeProvider as MaterialUIThemeProvider } from '@material-ui/core/styles';
import { StylesProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../styles/theme';

const CustomApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  useEffect(() => {
    const jssStyles: Element | null = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
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

export default CustomApp;
```

## \_document.tsx 作成

最後に material-ui / styled-components を SSR に対応させる為、 `src/pages/_document.tsx` を作成します。

material-ui や styled-components で指定した CSS はこのファイルに設定を追加すれば、SSR 対応出来ます。

`_document.tsx` は Next の独自ファイルで HTML の `<html>` や `<body>` タグの拡張に使われます。

注意すべき点は `_document.js` はサーバーサイドのみでレンダリングされ、クライアントサイドでは使われません。

`onClick` のようなイベントハンドラはここに追加しないでください。

```jsx:_document.tsx
import Document, { DocumentContext, Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet as StyledComponentSheets } from 'styled-components';
import { ServerStyleSheets as MaterialUiServerStyleSheets } from '@material-ui/styles';

class CustomDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang='ja'>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;

CustomDocument.getInitialProps = async (ctx: DocumentContext) => {
  const styledComponentSheets = new StyledComponentSheets();
  const materialUiServerStyleSheets = new MaterialUiServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  try {
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) =>
          styledComponentSheets.collectStyles(materialUiServerStyleSheets.collect(<App {...props} />)),
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
      ),
    };
  } finally {
    styledComponentSheets.seal();
  }
};
```

これで Next.js/TypeScript のプロジェクトでも Material-UI と styled-components を利用することが出来ます。

## おわりに

今回作成したサンプルアプリケーションは Github にありますので参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="kazuma-fujita/next-ts-lint-mui-template: Next.js/TypeScript/ESLint/Prettier/Material-UI Template." src="https://hatenablog-parts.com/embed?url=https://github.com/kazuma-fujita/next-ts-lint-mui-template" frameborder="0" scrolling="no"></iframe>

## 参考

[Material-UI と styled components で，next.js の css をいい感じに管理する (Jest/TypeScript 対応版)](https://qiita.com/o3c9/items/2551820edc156704edba)

---
title: 'Next.js/TypeScript/ESLint/Prettier/Material-UI/styled-componentsの自作テンプレートを作る'
date: '2021-01-13'
isPublished: true
metaDescription: 'Next.js/TypeScript/ESLint/Prettier/Material-UI/styled-componentsの自作テンプレートを作成して公開しました。どなたでもご利用可能ですのでぜひお試しください。'
tags:
  - 'Next.js'
  - 'TypeScript'
  - 'ESLint'
  - 'Prettier'
  - 'Material-UI'
  - 'styled-components'
---

Next.js/TypeScript/ESLint/Prettier/Material-UI/styled-components の自作テンプレートを作りました。

- 2021/09/13 update
  - Next.js11 に対応しました。

作ったテンプレートは Github に公開してますので、以下のコマンドでどなたでもご利用可能です。

- Next11 + Typescript + ESLint + Prettier

```
yarn create next-app sample-app --example "https://github.com/kazuma-fujita/next11-ts-lint-template"
```

- Next11 + Typescript + ESLint + Prettier + Material-UI + styled-component

```
yarn create next-app sample-app --example "https://github.com/kazuma-fujita/next11-ts-lint-mui-template"
```

TypeScript/ESLint/Prettier を個別に設定されたい方は以下ファイルをそれぞれ調整してください。

- TypeScript
  - `tsconfig.json`
- Prettier
  - `.prettierrc.json`
- ESlint
  - `.eslintrc.json`

また、テンプレートに含まれるサンプルのソースコードはデフォルトで `src` ディレクトリ配下にあります。

ソースコードの import 文は `src` ディレクトリからの絶対パスで記述出来るように設定していますので、詳細はこちらの記事を参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Reactのimport文を絶対パスで設定する(TypeScript版) | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/typescript-import-absolute-path-settings" frameborder="0" scrolling="no"></iframe>

## 自作テンプレート作成手順

ここからは自作テンプレートを作成した時の作業手順です。

備忘録として残しておきます。

### 環境

- macOS Catalina 10.15.5(19F101)
- VSCode 1.59.1
- Next 11.1.2
- React 17.0.2
- TypeScript 4.0.8
- yarn 1.22.5

## テンプレートを作成する

`yarn create next-app` で今回公開する `next11-ts-lint-mui-template` という名前の雛形を作成します。

今回はあらかじめ TypeScript が設定された `with-typescript` テンプレートを流用します。

```
yarn create next-app next11-ts-lint-mui-template --example with-typescript
```

雛形が作成されたら、 `yarn dev` でアプリケーションを起動し、 [http://localhost:3000](http://localhost:3000) を開いて Next の初期画面が表示されることを確認します。

## src ディレクトリの作成

`create next-app` した初期状態では `src` ディレクトリがありません。

`src` ディレクトリを作成して他の階層を `src` ディレクトリに移動します。

この作業は好みですが、CRA で開発をする時は基本プロダクトソースコードを `src` ディレクトリ配下に置くので、慣例として実行します。

```
cd next11-ts-lint-mui-template && mkdir src && mv components interfaces pages utils src/.
```

## import 文を src ディレクトリからの絶対パスに設定する

こちらに詳しい設定方法の記事を書きましたので参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Reactのimport文を絶対パスで設定する(TypeScript版) | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/typescript-import-absolute-path-settings" frameborder="0" scrolling="no"></iframe>

## ESLint/Prettier を設定をする

こちらに詳しい設定方法の記事を書きましたので参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="TypeScriptのプロジェクトにESLintとPrettierを併用してVSCodeの保存時に自動フォーマットをする | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/eslint-prettier-settings" frameborder="0" scrolling="no"></iframe>

## Material-UI/styled-components を設定する

こちらに詳しい設定方法の記事を書きましたので参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Next.js/TypeScriptプロジェクトにMaterial-UI/styled-componentsを対応させる | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/next-material-ui-styled-components-settings" frameborder="0" scrolling="no"></iframe>

## Github に作成したテンプレートを push する

Github に public repository を作成します。

今回は `next11-ts-lint-mui-template` という名前にしました。

ローカルリポジトリに リモートリポジトリを追加します。

```
git remote add origin git@github.com.zuma:kazuma-fujita/next11-ts-lint-mui-template.git
```

通常は `git flow init` などで develop ブランチを作成し、main ブランチ read-only にしますが、今回は割愛して直接 main に push します。

```
git push origin main
```

Github の public repository に置くだけでテンプレートの公開は完了です。

## おわりに

独自テンプレートを作成しておけば、新規プロジェクト毎に ESLint や Prettier の設定をせずに済むのでぜひお試しください。

今回作成したテンプレートはこちらにありますので参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="kazuma-fujita/next11-ts-lint-mui-template: Next.js11/TypeScript/ESLint/Prettier/Material-UI Template." src="https://hatenablog-parts.com/embed?url=https://github.com/kazuma-fujita/next11-ts-lint-mui-template" frameborder="0" scrolling="no"></iframe>

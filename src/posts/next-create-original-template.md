---
title: 'Next.jsのTypeScript/ESLint/Prettier/Material-UI/styled-componentsの自作テンプレートを作る'
date: '2021-01-13'
isPublished: false
metaDescription: 'Next.jsのTypeScript/ESLint/Prettier/Material-UI/styled-componentsの自作テンプレートを作成して公開しました。どなたでもご利用可能ですのでぜひお試しください。'
---

Next.js の TypeScript/ESLint/Prettier/Material-UI/styled-components の自作テンプレートを作りました。

作ったテンプレートは Github に公開してますので、以下のコマンドでどなたでもご利用可能です。

```
yarn create next-app --example "https://github.com/kazuma-fujita/next-ts-lint-mui-template" sample-app
```

テンプレートには以下 package が含まれます。(version は 2021/01/12 時点のものです)

- Next 10.0.5
- React 16.14.0
- TypeScript 4.0.5
- EsLint 7.17.0
- Prettier 2.2.1
- Material-UI 4.11.2
- styled-components 5.2.1

TypeScript/ESLint/Prettier 設定は筆者の設定ですので、個別に設定されたい方は TypeScript 設定ファイル `tsconfig.json` 、 Prettier 設定ファイル `.prettierrc.json` 、ESlint 設定ファイル `.eslintrc.json` を調整してください。

また、テンプレートに含まれるサンプルのソースコードはデフォルトで `src` ディレクトリ配下にあります。

ソースコードの import 文は `src` ディレクトリからの絶対パスで記述出来るように設定していますので、詳細はこちらの記事を参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Reactのimport文を絶対パスで設定する(TypeScript版) | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/typescript-import-absolute-path-settings" frameborder="0" scrolling="no"></iframe>

## 自作テンプレート作成手順

ここからは自作テンプレートを作成した時の作業手順です。

備忘録として残しておきます。

### 環境

- macOS Catalina 10.15.5(19F101)
- VSCode 1.52.1
- Next 10.0.5
- React 16.14.0
- TypeScript 4.0.5
- yarn 1.22.4

## テンプレートを作成する

`yarn create next-app` で今回公開する `next-ts-lint-mui-template` という名前の雛形を作成します。

今回はあらかじめ TypeScript が設定された `with-typescript` テンプレートを流用します。

```
yarn create next-app --example with-typescript next-ts-lint-mui-template
```

雛形が作成されたら、 `yarn dev` でアプリケーションを起動し、 [http://localhost:3000](http://localhost:3000) を開いて Next の初期画面が表示されることを確認します。

## src ディレクトリの作成

`create next-app` した初期状態では `src` ディレクトリがありません。

`src` ディレクトリを作成して他の階層を `src` ディレクトリに移動します。

この作業は好みですが、CRA で開発をする時は基本プロダクトソースコードを `src` ディレクトリ配下に置くので、慣例として実行します。

```
cd next-ts-lint-mui-template && mkdir src && mv components interfaces pages utils src/.
```

## import 文を src ディレクトリからの絶対パスに設定する

こちらに詳しい設定方法の記事を書きましたので参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Reactのimport文を絶対パスで設定する(TypeScript版) | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/typescript-import-absolute-path-settings" frameborder="0" scrolling="no"></iframe>

## ESLint/Prettier を設定をする

こちらに詳しい設定方法の記事を書きましたので参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="TypeScriptのプロジェクトにESLintとPrettierを併用してVSCodeの保存時に自動フォーマットをする | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/eslint-prettier-settings" frameborder="0" scrolling="no"></iframe>

## Material-UI を設定する

こちらに詳しい設定方法の記事を書きましたので参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="TypeScriptのプロジェクトにESLintとPrettierを併用してVSCodeの保存時に自動フォーマットをする | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/eslint-prettier-settings" frameborder="0" scrolling="no"></iframe>

## Github に作成したテンプレートを push する

Github に public repository を作成します。

今回は `next-ts-lint-mui-template` という名前にしました。

ローカルリポジトリに リモートリポジトリを追加します。

```
git remote add origin git@github.com.zuma:kazuma-fujita/next-ts-lint-mui-template.git
```

通常は `git flow init` などで develop ブランチを作成し、main ブランチ read-only にしますが、今回は割愛して直接 main に push します。

```
git push origin main
```

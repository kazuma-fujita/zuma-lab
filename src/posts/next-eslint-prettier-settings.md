---
title: 'Next.jsにESLintとPrettierを併用して静的解析と自動フォーマットを行う'
date: '2021-11-11'
isPublished: true
metaDescription: 'Next12とTypescriptのプロジェクトにNextにPrettier/ESLintを併用してコードフォーマットします。かつTypeScriptに対応させます。Prettier はコードフォーマット、ESLint は構文チェックツールとして併用します。さらにVSCodeの保存時に自動フォーマットをする設定をします。'
tags:
  - 'Next.js'
  - 'TypeScript'
  - 'ESLint'
  - 'Prettier'
---

Next.js と TypeScript のプロジェクトに ESLint と Prettier を併用して静的解析と VSCode の保存時に自動フォーマットを実行します。

Prettier (プリティア) とはコードフォーマッターで、ソースコードを整形してくれます。

デフォルトで HTML/JavaScript/CSS/JSON/YAML の他、 JSX、TypeScript や Markdown、GraphQL、styled-components など様々な形式に対応しています。

ESLint 単体コードフォーマットが可能なのですが、Prettier では ESLint では整形出来ないコードも整形してくれます。

今回、 Prettier はコードフォーマット、ESLint は構文チェックツールとして併用します。

### 環境

- macOS Big Sur 11.6
- Next 12.0.3
- React 17.0.2
- TypeScript 4.4.4

### Next.js プロジェクトの作成

Next.js11 以降デフォルトで ESLint に対応しました。

create-next-app を実行すると eslint と eslint-config-next が install されます。

```txt
$ npx create-next-app sample-app --template typescript
Creating a new Next.js app in /Users/kazuma/Documents/github/next/nomoca-order.

Using npm.

Installing dependencies:
- react
- react-dom
- next

npm WARN deprecated querystring@0.2.1: The querystring API is considered Legacy. new code should use the URLSearchParams API instead.
npm WARN deprecated querystring@0.2.0: The querystring API is considered Legacy. new code should use the URLSearchParams API instead.

added 321 packages, and audited 322 packages in 14s

50 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

Installing devDependencies:
- eslint
- eslint-config-next
- typescript
- @types/react
```

デフォルトで install される eslint は構文解析のエンジン、eslint-config-next は Next.js 専用の ESLint のルールです。

Next10 以前は ESLint を install する必要があったのですが、Next11 以降は Next に最適化された設定で ESLint がデフォルトで使用できます。

以下コマンドで静的解析を実行し動作確認を行うことができます。

- npm

```
npm run lint
```

- yarn

```
yarn lint
```

## Prettier を install する

- prettier 関連 package

  - prettier
    - prettier 本体
  - eslint-config-prettier
    - prettier が整形したコードに対して ESLint がエラーを出力しないようにするプラグイン

- npm

```
npm install -D prettier eslint-config-prettier
```

- yarn

```
yarn add -D prettier eslint-config-prettier
```

※ `eslint-plugin-prettier` を install する方法がありますが、現在非推奨となっいる為、今回利用しません。

## eslint と prettier package を確認する

- npm

```
$ npm list --depth=0 |grep -e prettier -e eslint
├── eslint-config-next@12.0.3
├── eslint-config-prettier@8.3.0
├── eslint@7.32.0
├── prettier@2.4.1
```

- yarn

```
$ yarn list --depth=0 |grep -e prettier -e eslint
├── eslint-config-next@12.0.3
├── eslint-config-prettier@8.3.0
├── eslint@7.32.0
├── prettier@2.4.1
```

## ESLint 設定ファイル .eslintrc.json の編集

Prettier 設定をする為、package.json と同じ階層にある `.eslintrc.json` を編集します。

以下のように記述することで、ESLint と Prettier のコード整形がバッティングしないようになります。

```json:.eslintrc.json
{
  "extends": ["next/core-web-vitals", "prettier"],
}
```

ESLint のチェック項目は [ESLint - Rules](https://eslint.org/docs/rules/) にあるので自分で設定したい場合は参照ください。

以下のような便利設定が豊富に取り揃えられています。

- eslint:recommended
  - チェック項目をひとつずつ追加しなくても ESLint が推奨するチェック項目でまとめてチェックすることができる
  - これだけでも基本的なソースの不備を手軽にチェックできる

## ESLint の対象範囲を変更する

ESLint の静的解析対象はデフォルトで以下ディレクトリのソースとなっています。

- pages
- lib
- components

プロジェクト初期では問題ないかもしれませんが、プロジェクト規模によってはおそらく上記以外のディレクトリにソースコードを配置することになります。

どのディレクトリのソースコードにも静的解析を適用させたい場合の方法の一つとして、全てのソースコードディレクトリを `src` 配下に集約する方法があります。

例えば筆者の場合は以下のようなディレクトリ構成にしています。

```txt
root
└── src
    ├── components
    │   ├── atoms
    │   ├── molecules
    │   ├── organisms
    │   └── templates
    ├── constants
    ├── graphql
    ├── hooks
    ├── pages
    ├── stores
    ├── styles
    └── utilities
```

静的解析の設定の方法は ESLint の lint コマンドの対象に `src` ディレクトリを指定します。

package.json の lint コマンドに `--dir src` を追記します。

```json
  "scripts": {
    ...
    "lint": "next lint --dir src"
    ...
  },
```

これで lint 実行時に `src` ディレクトリ全てを静的解析してくれます。

## Prettier option 設定ファイル .prettierrc.json を作成する

Prettier のコードフォーマットルールを設定する為、package.json と同じ階層に `.prettierrc.json` を新規作成します。

以下は参考までに設定の一例です。

```json:.prettierrc.json
{
  "printWidth": 120,
  "trailingComma": "all",
  "tabWidth": 2,
  "semi": true,
  "singleQuote": true,
  "jsxSingleQuote": true,
  "endOfLine": "lf"
}
```

- printWidth
  - 折り返す行の長さを指定
  - デフォルト 80 だと少なく感じたので筆者は 120 で設定
- trailingComma
  - オブジェクト、配列などの末尾にカンマを追加する設定。デフォルトで `es5` に準拠したルールで設定させる。 `all` だと全ての末尾にカンマを追加する
- tabWidth
  - インデントのスペースの数を指定
- semi
  - ステートメントの最後にセミコロンを追加
- singleQuote
  - JSX 以外でダブルクォートの代わりにシングルクォートを使用
- jsxSingleQuote
  - JSX でダブルクォートの代わりにシングルクォートを使用
- endOfLine
  - 改行の文字コードを指定

### 参考)Prettier option 設定のデフォルト値

```json:.prettierrc.json
	{
		"printWidth": 80,
		"tabWidth": 2,
		"useTabs": false,
		"semi": true,
		"singleQuote": false,
		"quoteProps": "as-needed",
		"jsxSingleQuote": false,
		"trailingComma": "none",
		"bracketSpacing": true,
		"jsxBracketSameLine": false,
		"arrowParens": "avoid",
		"rangeStart": 0,
		"rangeEnd": Infinity,
		"parser": "none",
		"filepath": "none",
		"requirePragma": false,
		"insertPragma": false,
		"proseWrap": "preserve",
		"htmlWhitespaceSensitivity": "css",
		"vueIndentScriptAndStyle": false,
		"endOfLine": "auto",
	}
```

`.prettierrc.json` ファイルを作成していない場合は、上記の設定が適用されます。

オプションの設定のついてもっと詳しく知りたい方は [Prettier - Options](https://prettier.io/docs/en/options.html) に詳細があるので参照してください。

## VSCode に ESLint/Prettier 拡張機能を install する

VSCode に以下 ESLint と Prettier 拡張機能を install します。

リンクを開いて `install` ボタンをクリックしてください。

- [ESLint(ESLint 拡張機能)](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier - Code formatter(Prettier 拡張機能)](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## VSCode の settings.json に自動フォーマット設定を追記する

VSCode の `settings.json` を開きます。

- コマンドパレットを開く
  - ショートカットキー `command + shift + P` または F1 でコマンドパレットを表示
- 検索ワードを入れる
  - settings と入力

開いた `settings.json` に自動フォーマット設定を追記します。

以下は参考までに設定の一例です。

```json:settings.json
{
  // formatter
  "editor.formatOnSave": true, // ファイル保存時の自動フォーマット有効
  "editor.formatOnPaste": true, // ペーストした文字の自動フォーマット有効
  "editor.formatOnType": true, // 文字入力行の自動フォーマット有効
  "editor.defaultFormatter": "esbenp.prettier-vscode", // デフォルトフォーマッターをPrettierに指定
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true // ファイル保存時に ESLint でフォーマット
  },
}
```

ここまでで ESLint/Prettier と VSCode の設定は完了です。

VSCode 開き直してファイルを保存をすると自動的にフォーマットがかかるはずです。

## おわりに

静的解析やコードフォーマットをかけるとプロジェクトソースの記述に一貫性が保たれ、チーム開発時にチームメンバーによる記述の揺らぎによるソースの可読性が下がることを防ぐことが出来ます。

なにより自動コードフォーマットで一番効果が発揮するのが、Pull Request 時のレビュワーによる構文チェックの工数を減らせることだと思っています。

個人開発では設定しなくても事足りますが、チーム開発時はレビュワー負担を減らす為にも設定したいですね。

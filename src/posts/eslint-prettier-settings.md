---
title: 'TypeScriptのプロジェクトにESLintとPrettierを併用してVSCodeの保存時に自動フォーマットをする'
date: '2021-01-11'
isPublished: true
metaDescription: 'Prettier/ESLintを併用してコードフォーマットします。かつTypeScriptに対応させます。Prettier はコードフォーマット、ESLint は構文チェックツールとして併用します。さらにVSCodeの保存時に自動フォーマットをする設定をします。'
tags:
  - 'Next.js'
  - 'TypeScript'
  - 'ESLint'
  - 'Prettier'
---

---

2021/11/11 update

この記事は Next.js10 以前の Ver.に対応した設定手順について書いています。

Next.js11 以降の設定手順については以下の記事を参照してください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Next.jsにESLintとPrettierを併用して静的解析と自動フォーマットを行う" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/next-eslint-prettier-settings" frameborder="0" scrolling="no"></iframe>

---

TypeScript のプロジェクトに ESLint と Prettier を併用して VSCode の保存時に自動フォーマットを実行します。

Prettier (プリティア) とはコードフォーマッターで、ソースコードを整形してくれます。

デフォルトで HTML/JavaScript/CSS/JSON/YAML の他、 JSX、TypeScript や Markdown、GraphQL、styled-components など様々な形式に対応しています。

今回、 Prettier はコードフォーマット、ESLint は構文チェックツールとして併用します。

ESLint 単体コードフォーマットが可能なのですが、Prettier では ESLint では整形出来ないコードも整形してくれます。

ESLint の構文チェックは TypeScript も対応させます。

最後に VSCode の保存時に自動フォーマットをする設定をします。

※ 前提として、TypeScript は install 済みとします。

### 環境

- macOS Catalina 10.15.5(19F101)
- VSCode 1.52.1
- Next 10.0.4
- React 16.14.0
- TypeScript 4.0.5
- yarn 1.22.4

## ESLint/Prettier package を install する

- ESLint 関連 package
  - ESLint
    - ESLint 本体
  - @typescript-eslint/parser
    - ESLint が TypeScript ソースを lint できるようにする ESLint パーサー
  - @typescript-eslint/eslint-plugin
    - TypeScript コードベースに lint ルールを提供する ESLint プラグイン

```
yarn add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

- prettier 関連 package
  - prettier
    - prettier 本体
  - eslint-config-prettier
    - prettier が整形したコードに対して ESLint がエラーを出力しないようにするプラグイン

```
yarn add -D prettier eslint-config-prettier
```

※ `eslint-plugin-prettier` を install する方法がありますが、現在非推奨となっいる為、今回利用しません。

## install した package を確認する

```
$ yarn list --depth=0 |grep -e prettier -e eslint
├─ @eslint/eslintrc@0.2.2
├─ @typescript-eslint/eslint-plugin@4.13.0
├─ @typescript-eslint/experimental-utils@4.13.0
├─ @typescript-eslint/parser@4.13.0
├─ @typescript-eslint/scope-manager@4.13.0
├─ @typescript-eslint/types@4.13.0
├─ @typescript-eslint/typescript-estree@4.13.0
├─ @typescript-eslint/visitor-keys@4.13.0
├─ eslint-config-prettier@7.1.0
├─ eslint-scope@5.1.1
├─ eslint-utils@2.1.0
├─ eslint-visitor-keys@1.3.0
├─ eslint@7.17.0
├─ prettier@2.2.1
```

## ESLint 設定ファイル .eslintrc.json を作成する

ESLint 設定をする為、package.json と同じ階層に `.eslintrc.json` を新規作成します。

以下は参考までに設定の一例です。

```json:.eslintrc.json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier",
    "prettier/@typescript-eslint"
  ],
  "plugins": ["@typescript-eslint"],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  "env": { "browser": true, "node": true, "es6": true },
  "rules": {
    // 個別に設定するESLintルールを記述
  }
}
```

- eslint:recommended
  - チェック項目をひとつずつ追加しなくても ESLint が推奨するチェック項目でまとめてチェックすることができる
  - これだけでも基本的なソースの不備を手軽にチェックできる
- plugin:@typescript-eslint/recommended
  - 型を必要としないプラグインの推奨ルールをすべて有効
- plugin:@typescript-eslint/recommended-requiring-type-checking
  - 型を必要とするプラグインの推奨ルールをすべて有効
  - TypeScript のビルド時間分が増えるので、気になる場合は設定を外す
- prettier/@typescript-eslint
  - ESLint で Prettier の規則もエラーとして検出する設定
  - ESLint のルールを上書きするために、最後の方に書く

ESLint のチェック項目は [ESLint - Rules](https://eslint.org/docs/rules/) にあるので自分で設定したい場合は参照ください。

## Prettier option 設定ファイル .prettierrc.json を作成する

Prettier のコードフォーマットルールを設定する為、package.json と同じ階層に `.prettierrc.json` を新規作成します。

以下は参考までに設定の一例です。

```json:.prettierrc.json
{
  "printWidth": 120,
  "trailingComma": "es5",
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
  - オブジェクト、配列などの末尾にカンマを追加する設定。デフォルトで `es5` に準拠したルールで設定させる
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

コードフォーマットをかけるとプロジェクトソースの記述に一貫性が保たれ、チーム開発時にチームメンバーによる記述の揺らぎによるソースの可読性が下がることを防ぐことが出来ます。

なにより自動コードフォーマットで一番効果が発揮するのが、Pull Request 時のレビュワーによる構文チェックの工数を減らせることだと思っています。

個人開発では設定しなくても事足りますが、チーム開発時はレビュワー負担を減らす為にも設定したいですね。

また、今回作成したサンプルアプリケーションは Github にありますので参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="kazuma-fujita/next-ts-lint-mui-template: Next.js/TypeScript/ESLint/Prettier/Material-UI Template." src="https://hatenablog-parts.com/embed?url=https://github.com/kazuma-fujita/next-ts-lint-mui-template" frameborder="0" scrolling="no"></iframe>

## 参考

[いつのまにか eslint-plugin-prettier が推奨されないものになってた](https://knote.dev/post/2020-08-29/duprecated-eslint-plugin-prettier/)

[VSCode で ESLint+typescript-eslint+Prettier を導入する（2020/11/14 修正）](https://qiita.com/madono/items/a134e904e891c5cb1d20)

[【VSCode】Prettier の使い方＆おすすめ設定を紹介](https://ma-vericks.com/vscode-prettier/)

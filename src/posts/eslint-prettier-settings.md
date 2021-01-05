---
title: 'ESLint/Prettierで自動フォーマットとgit commit時にlintチェックをする'
date: '2021-01-05'
---

Next で blog 作成をするにあたり、最低限の ESLint / Prettier 自動フォーマット設定はしようと思う。

更に git commit 時に Husky と lint-staged で lint チェックをする。

前提として、typescript は install 済みとする。

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

## ESLint/Prettier package install

- ESLint

```
yarn add -D eslint eslint-plugin-react @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

- prettier

```
yarn add -D prettier eslint-config-prettier
```

### install package の確認

```
$ yarn list --depth=0 |grep -e prettier -e eslint
├─ @eslint/eslintrc@0.2.2
├─ @typescript-eslint/eslint-plugin@4.12.0
├─ @typescript-eslint/experimental-utils@4.12.0
├─ @typescript-eslint/parser@4.12.0
├─ @typescript-eslint/scope-manager@4.12.0
├─ @typescript-eslint/types@4.12.0
├─ @typescript-eslint/typescript-estree@4.12.0
├─ @typescript-eslint/visitor-keys@4.12.0
├─ eslint-config-prettier@7.1.0
├─ eslint-scope@5.1.1
├─ eslint-utils@2.1.0
├─ eslint-visitor-keys@1.3.0
├─ eslint@7.17.0
├─ prettier@2.2.1
```

## ESLint/Prettier 設定ファイル追加

### .eslint.json の追加

プロジェクトルートディレクトリ(package.json があるディレクトリ)に `.eslint.json` を追加

```json:.eslint.json
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
  "rules": {}
}
```

### .prettierrc.json の追加

プロジェクトルートディレクトリに `.prettierrc.json` を追加

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

## VSCode 設定

### VSCode に ESLint/Prettier 拡張機能を install する

- [ESLint 拡張機能](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier 拡張機能](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

### VSCode の settings.json で自動フォーマット機能を有効化する

VSCode の settings.json を開き以下を追記

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

ここまでで ESLint と Prettier の設定は完了。

VSCode 開き直して適当にインデントのおかしいコードの記述、保存をすると自動的にフォーマットがかかるはずだ。

次に Husky/lint-staged を利用して git commit 時に lint チェックがかかるようにする。

## Husky/lint-staged package install

```
yarn add -D husky lint-staged
```

### install package 確認

```
$ yarn list --depth=0 |grep -e husky -e lint-staged
├─ husky@4.3.6
├─ lint-staged@10.5.3
```

### package.json に Husky と lint-staged 用の設定を追記

```json:package.json
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "prettier --write",
      "eslint --fix",
      "git add"
    ]
  },
```

ここまでで Husky と lint-staged の設定は完了。

試しに ts か tsx ファイルを変更して git commit すると自動的に lint チェックが走る。

暫くは VSCode の保存時自動フォーマットと git commit 時の lint チェックを併用して運用してみる。

## 参考

[いつのまにか eslint-plugin-prettier が推奨されないものになってた](https://knote.dev/post/2020-08-29/duprecated-eslint-plugin-prettier/)

[VSCode で ESLint+typescript-eslint+Prettier を導入する（2020/11/14 修正）](https://qiita.com/madono/items/a134e904e891c5cb1d20)

[Husky と lint-staged を使ってコミット時に lint チェックさせる](https://qiita.com/Captain_Blue/items/656843f7da2d7d10473e)

---
title: 'ESLint/Prettier設定手順'
date: '2021-01-04'
---

Next で blog 作成をするにあたり、最低限の ESLint / Prettier 設定はしようと思う。

前提として、既に typescript は install 済みとする。

# 環境

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

# ESLint/Prettier install

## ESLint

```
yarn add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

## Pettier

```
yarn add -D prettier eslint-config-prettier
```

### install された package

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

# ESLint/Prettier 設定ファイル追加

## .eslint.json の追加

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

## .prettierrc.json の追加

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

# VSCode 設定

## ESLint/Prettier 拡張機能 install

VSCode に以下拡張機能を install

- [ESLint 拡張機能](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier 拡張機能](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## VSCode の settings.json で自動フォーマット機能を有効化

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

## 参考

[いつのまにか eslint-plugin-prettier が推奨されないものになってた](https://knote.dev/post/2020-08-29/duprecated-eslint-plugin-prettier/)

[VSCode で ESLint+typescript-eslint+Prettier を導入する（2020/11/14 修正）](https://qiita.com/madono/items/a134e904e891c5cb1d20)

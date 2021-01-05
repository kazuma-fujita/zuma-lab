---
title: 'Husky と lint-staged で git commit 時に lint チェックをする（エラー発生未解決）'
date: '2021-01-05'
---

Husky/lint-staged を利用して git commit 時に lint チェックがかかるようにする。

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

試しに ts か tsx ファイルを変更して git commit すると自動的に lint チェックが走るはずなのだが。。。

以下エラーが発生して commit することが出来ない。

仕方ないので、package.json から husky/lint-staged 記述を削除して一旦 lint チェックを外した。

引き続き調査。

```
$ git commit -am 'test commit.'
husky > pre-commit (node v14.9.0)
⚠ Some of your tasks use `git add` command. Please remove it from the config since all modifications made by tasks will be automatically added to the git commit index.

✔ Preparing...
⚠ Running tasks...
  ❯ eslint --fix [FAILED]
    ✔ prettier --write
    ✖ eslint --fix [FAILED]
    ◼ git add
↓ Skipped because of errors from tasks. [SKIPPED]
✔ Reverting to original state because of errors...
✔ Cleaning up...

✖ eslint --fix:

Oops! Something went wrong! :(

ESLint: 7.17.0

ESLint couldn't find the plugin "eslint-plugin-react".

(The package "eslint-plugin-react" was not found when loaded as a Node module from the directory "/Users/kazuma".)

It's likely that the plugin isn't installed correctly. Try reinstalling by running the following:

    npm install eslint-plugin-react@latest --save-dev

The plugin "eslint-plugin-react" was referenced from the config file in "PersonalConfig".

If you still can't figure out the problem, please stop by https://eslint.org/chat/help to chat with the team.

husky > pre-commit hook failed (add --no-verify to bypass)

```

## 参考

[Husky と lint-staged を使ってコミット時に lint チェックさせる](https://qiita.com/Captain_Blue/items/656843f7da2d7d10473e)

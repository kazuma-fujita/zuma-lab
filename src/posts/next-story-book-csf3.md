---
title: 'Next.jsにStoryBookを導入してCSF3.0を試す'
date: '2021-11-16'
isPublished: true
metaDescription: ''
tags:
  - 'Next.js'
  - 'TypeScript'
  - 'StoryBook'
---

基本的には公式ドキュメントをベースに進めます。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="React 向け Storybook のチュートリアル | Storybook Tutorials" src="https://hatenablog-parts.com/embed?url=https://storybook.js.org/tutorials/intro-to-storybook/react/ja/get-started/" frameborder="0" scrolling="no"></iframe>

### 環境

- macOS Big Sur 11.6
- Next 12.0.3
- React 17.0.2
- TypeScript 4.4.4
- npm 8.1.2
- Node 17.1.0

### Next.js プロジェクトの作成

以下コマンドを実行して Next.js プロジェクトを作成します。

`--typescript` オプションで TypeScript を利用可能にします。

```txt
npx create-next-app next-storybook-csf3 --typescript
```

### Storybook の install

筆者は package 管理に npm を利用する為、 `--use-npm` オプションを指定しています。

yarn を利用される方はオプションを外してください。

```txt
npx -p @storybook/cli sb init --use-npm
```

次にプロジェクトのルートフォルダーに .env という名前で、以下の内容のファイルを作成してください。

```txt
SKIP_PREFLIGHT_CHECK=true
```

### Storybook の upgrade

CSF3.0 を利用するには Storybook version が 6.4.0 以降である必要があります。

ロードマップによると 2021/12/01 に 6.4.0 がリリースされる予定ですが、2021/11/16 現時点では Storybook version を upgrade する必要があります。

- ✅ 6.4.0-rc.0 2021-11-12
- 🏁 6.4.0 2021-12-01 (est)

upgrade をする為、以下コマンドを実行します。

```txt
npx sb@next upgrade --prerelease --use-npm
```

実行すると Storybook version が 6.4.0-rc.2 になります。

```txt
$ npx sb@next upgrade --prerelease --use-npm
Need to install the following packages:
  sb@next
Ok to proceed? (y) y
 • Checking for latest versions of '@storybook/*' packagesinfo ,Upgrading /Users/kazuma/Documents/github/next/next-storybook-csf3/package.json
info
info  @storybook/addon-actions     ^6.3.12  →  ^6.4.0-rc.2
info  @storybook/addon-essentials  ^6.3.12  →  ^6.4.0-rc.2
info  @storybook/addon-links       ^6.3.12  →  ^6.4.0-rc.2
info  @storybook/react             ^6.3.12  →  ^6.4.0-rc.2
info
info Run npm install to install new versions.
info
info ,
info
 • Installing upgrades • Preparing to install dependencies. ✓
```

install 途中で storybook 用の eslintPlugin を入れるか聞かれます。

筆者は ESLint で静的解析を行いたいので yes を選択しました。

```txt
✔ Do you want to run the 'eslintPlugin' fix on your project? … yes
✅ Adding dependencies: eslint-plugin-storybook

added 13 packages, changed 1 package, and audited 1828 packages in 6s

250 packages are looking for funding
  run `npm fund` for details

26 vulnerabilities (8 moderate, 16 high, 2 critical)

To address issues that do not require attention, run:
  npm audit fix

To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.
❌ error in eslintPlugin:
⚠️ The plugin was successfuly installed but failed to configure.

Found an .eslintrc config file with an unsupported automigration format: json.
Supported formats for automigration are: js, cjs.

Please refer to https://github.com/storybookjs/eslint-plugin-storybook#usage to finish setting up the plugin manually.
```

途中で `.eslintrc` ファイルに設定を書き込む処理があるのですが、 `.eslintrc.json` ファイルはサポートしてないとエラーとなるので、手動で `.eslintrc.json` ファイルに設定を書き込みます。

デフォルトでは以下の設定になっています。

```json
{
  "extends": "next/core-web-vitals"
}
```

以下のように `plugin:storybook/recommended` に書き換えます。

この設定をするだけでデフォルト `*.stories.*` と `*.story.*` が入ったファイル名のソースコードが静的解析の対象となります。

```json
{
  "extends": ["next/core-web-vitals", "plugin:storybook/recommended"]
}
```

その他、細かい ESLint の設定はこちらの issues に記述されています。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="storybookjs/eslint-plugin-storybook: Official ESLint plugin for Storybook" src="https://hatenablog-parts.com/embed?url=https://github.com/storybookjs/eslint-plugin-storybook#usage" frameborder="0" scrolling="no"></iframe>

### globals.css を書き換える

CSS を流用する為、公式チュートリアルに記載されている [GraphQL と React のチュートリアル](https://raw.githubusercontent.com/chromaui/learnstorybook-code/master/src/index.css) の CSS をコピーして `styles/globals.css` に貼り付けます。

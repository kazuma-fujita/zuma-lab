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
- Node 16.13.0

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

### Testing package を install

その他、Storybook で利用する各種 Testing package を install します。

こちらの Next.js オフィシャルの [Jest and React Testing Library](https://nextjs.org/docs/testing#jest-and-react-testing-library) を参照して進めます。

npm、yarn それぞれ以下コマンドを実行してください。

- npm

npm install -D babel-jest @testing-library/react @testing-library/jest-dom

identity-obj-proxy react-test-renderer

```txt
npm install --save-dev jest babel-jest @testing-library/react @testing-library/jest-dom @storybook/addon-storyshots react-test-renderer
```

- yarn

```txt
yarn add --dev jest @storybook/addon-storyshots react-test-renderer
```

それぞれ install package は以下の用途になります。

- babel-jest
  - Babel を使って jest を実行する
- jest
  - Storybook と Jest を利用した Snapshot test を実行する
- @testing-library/react
  - Storybook と react-testing-library を利用した unit test を実行する
- @testing-library/jest-dom
  - Jest カスタムマッチャーを利用可能にする
- @storybook/addon-storyshots
  - それぞれの Story で Snapshot test を作成する
- react-test-renderer
  - Snapshot test 実行時に snapshot を出力する
- identity-obj-proxy
  - CSS Modules をモックする

### Jest の設定

jest をコマンドラインから実行する為、package.json に `"test": "jest"` を追記します。

```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "storybook": "start-storybook -p 6006",
    "build-storybook": "build-storybook",
    "test": "jest"
  },
```

次にルートディレクトリに `jest.config.js` ファイルを作成して以下を追記します。

```js
module.exports = {
  collectCoverageFrom: ['**/*.{js,jsx,ts,tsx}', '!**/*.d.ts', '!**/node_modules/**'],
  moduleNameMapper: {
    /* Handle CSS imports (with CSS modules)
    https://jestjs.io/docs/webpack#mocking-css-modules */
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',

    // Handle CSS imports (without CSS modules)
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',

    /* Handle image imports
    https://jestjs.io/docs/webpack#handling-static-assets */
    '^.+\\.(jpg|jpeg|png|gif|webp|avif|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  testEnvironment: 'jsdom',
  transform: {
    /* Use babel-jest to transpile tests with the next/babel preset
    https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object */
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  transformIgnorePatterns: ['/node_modules/', '^.+\\.module\\.(css|sass|scss)$'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
```

細かい設定については [Configuring Jest](https://jestjs.io/docs/configuration) を参照ください。

最後に Jest カスタムマッチャーを利用出来るようにする為、ルートディレクトリに `jest.setup.js` ファイルを作成して以下を追記します。

```js
import '@testing-library/jest-dom/extend-expect';
```

### CSS と画像 Mock 設定

CSS や画像を import している場合、jest の実行時にエラーになる場合があります。

エラーを回避する為、CSS、画像に対してそれぞれ mock 化する必要があります。

ルートディレクトリに `__mocks__/fileMock.js` ファイルを作成して以下を追記してください。

```js
module.exports = 'test-file-stub';
```

次に `__mocks__/styleMock.js` ファイルを作成して以下を追記してください。

```js
module.exports = {};
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

その他、細かい ESLint の設定は [こちらの issues](https://hatenablog-parts.com/embed?url=https://github.com/storybookjs/eslint-plugin-storybook#usage) に記述されています。

### Storybook の main.js 設定

`.storybook/main.js` ファイルに Story の対象とするファイルパスを追記します。

今回 `src/components` 配下に component と stories ファイルを作成する為、以下のファイルパスを追加します。

元々記述してあったパスはサンプル用で不要ですのでコメントアウトするか削除してください。

```js
module.exports = {
  stories: [
    // '../stories/**/*.stories.mdx', comment out
    // '../stories/**/*.stories.@(js|jsx|ts|tsx)', comment out
    '../src/components/**/*.stories.@(js|jsx|ts|tsx)', // <- Added stories settings.
  ],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
};
```

### globals.css を書き換える

CSS を流用する為、公式チュートリアルに記載されている [GraphQL と React のチュートリアル](https://raw.githubusercontent.com/chromaui/learnstorybook-code/master/src/index.css) の CSS をコピーして `styles/globals.css` に貼り付けます。

また、font と icon を styles/assets 配下に DL します。

```txt
npx degit chromaui/learnstorybook-code/src/assets/font styles/assets/font
npx degit chromaui/learnstorybook-code/src/assets/icon styles/assets/icon
```

最後に Storybook に CSS を適用する為、 `.storybook/preview.js` 内で `styles/globals.css` を import します。

```js
import '../styles/globals.css'; // <- Added

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
```

### Task component と Story を実装する

`src/components/task.tsx` ファイルを作成して以下 component 実装をします。

公式チュートリアルのソースコードを TypeScript 化しました。

```tsx
import React from 'react';

type Props = {
  id: string;
  title: string;
  state: string;
  updatedAt: Date;
  onArchiveTask: (id: string) => void;
  onPinTask: (id: string) => void;
};

export const Task = ({ id, title, state, onArchiveTask, onPinTask }: Props) => {
  return (
    <div className={`list-item ${state}`}>
      <label className='checkbox'>
        <input type='checkbox' defaultChecked={state === 'TASK_ARCHIVED'} disabled={true} name='checked' />
        <span className='checkbox-custom' onClick={() => onArchiveTask(id)} />
      </label>
      <div className='title'>
        <input type='text' value={title} readOnly={true} placeholder='Input title' />
      </div>

      <div className='actions' onClick={(event) => event.stopPropagation()}>
        {state !== 'TASK_ARCHIVED' && (
          <a onClick={() => onPinTask(id)}>
            <span className={`icon-star`} />
          </a>
        )}
      </div>
    </div>
  );
};
```

次に `src/components/task.stories.ts` ファイルを作成し以下 Story 実装を行います。

公式チュートリアルの CSF2.0 のソースコードを CSF3.0 に書き換えて TypeScript 化しました。

```ts
import type { ComponentStoryObj } from '@storybook/react';
import { Task } from './task';

type Story = ComponentStoryObj<typeof Task>;

export default { component: Task };

export const Default: Story = {
  args: {
    id: '1',
    title: 'Test Task',
    state: 'TASK_INBOX',
    updatedAt: new Date(2021, 0, 10, 10, 0),
  },
};

export const Pinned: Story = {
  args: { ...Default.args, state: 'TASK_PINNED' },
};

export const Archived: Story = {
  args: { ...Default.args, state: 'TASK_ARCHIVED' },
};
```

CSF2.0 に比べて CSF3.0 はコード量が減り直感的に Story を書けるようになりました。

2.0 では以下のように `Template.bind({})` で関数のコピーを作成して props を設定する必要がありましたが、3.0 からは object だけで同様の事が出来るようになりました。

```ts
const Template = (args) => <Task {...args} />;

export const Default = Template.bind({});
Default.args = {
  task: {
    id: '1',
    title: 'Test Task',
    state: 'TASK_INBOX',
    updatedAt: new Date(2018, 0, 1, 9, 0),
  },
};
```

`npm run storybook` もしくは `yarn storybook` で Storybook を立ち上げると以下 Task component が表示されることを確認してください。

<img src='/images/posts/2021-11-17-1.png' class='img' />

### Snapshot test

Storybook を利用した Snapshot test をやってみます。

`src/components/task.test.ts` ファイルを作成して以下追記します。

```ts
import initStoryshots from '@storybook/addon-storyshots';
initStoryshots();
```

それぞれ以下コマンドを実行して Snapshot test を実行します。

- npm

```txt
npm run test
```

- yarn

```txt
yarn test
```

実行結果が以下のように PASS すると test ファイルがある階層に `__snapshots__` ディレクトリが作成されスナップショットファイルが生成されます。

```txt
$ npm run test --watch

> test
> jest

 PASS  src/components/task.test.ts
  Storyshots
    Task
      ✓ Default (18 ms)
      ✓ Pinned (3 ms)
      ✓ Archived (2 ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   3 passed, 3 total
Time:        2.833 s
Ran all test suites.
```

---
title: 'Next.jsにStorybook(CSF3.0)を導入してSnapshot TestやUnit Testを実行する'
date: '2021-11-24'
isPublished: true
metaDescription: 'Next.jsにStorybook(CSF3.0)を導入してSnapshot TestやUnit Testを実行する'
tags:
  - 'Next.js'
  - 'TypeScript'
  - 'Storybook'
  - 'CSF3.0'
---

Next.js と Typescript のプロジェクトに Storybook を導入して Snapshot Test や Unit Test を試してみます。

この記事では現時点で prerelease 版の Component Story Format 3.0 (以後 CSF3.0) を使用した Story を作成します。

CSF3.0 については以下公式の記事を参考にしました。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Component Story Format 3.0" src="https://hatenablog-parts.com/embed?url=https://storybook.js.org/blog/component-story-format-3-0/" frameborder="0" scrolling="no"></iframe>

CSF3.0 で 新たに追加される play 関数についても試してみます。

play 関数はフォームの値入力や button のクリックなどユーザーインタラクションを Story で表現できる便利な関数です。

play 関数のおかげで Storybook の表現の幅が広がり、Storybook の導入で Snapshot Test と併せて Unit Test が書きやすくなります。

個人的には Storybook は Component Catalog としての機能は大前提ですが、Unit Test の導入障壁を下げるツールとしても機能していると感じています。

それでがまず Next.js に Storybook の導入から始めましょう。

基本的には公式チュートリアルをベースに進めます。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="React 向け Storybook のチュートリアル | Storybook Tutorials" src="https://hatenablog-parts.com/embed?url=https://storybook.js.org/tutorials/intro-to-storybook/react/ja/get-started/" frameborder="0" scrolling="no"></iframe>

## 環境

- macOS Big Sur 11.6
- Next 12.0.3
- React 17.0.2
- TypeScript 4.4.4
- npm 8.1.2
- Node 16.13.0

## Next.js プロジェクトの作成

以下コマンドを実行して Next.js プロジェクトを作成します。

`--typescript` オプションで TypeScript を利用可能にします。

```txt
npx create-next-app next-storybook-csf3 --typescript
```

## Storybook の install

筆者は package 管理に npm を利用する為、 `--use-npm` オプションを指定しています。

yarn を利用される方はオプションを外してください。

```txt
npx -p @storybook/cli sb init --use-npm
```

次にプロジェクトのルートフォルダーに .env という名前で、以下の内容のファイルを作成してください。

```txt
SKIP_PREFLIGHT_CHECK=true
```

## Testing package を install

その他、Storybook で利用する Jest や React Testing Library(以後 RTL) の Testing package を install します。

Next.js への Jest、RTL 導入手順は Next.js オフィシャルの [Jest and React Testing Library](https://nextjs.org/docs/testing#jest-and-react-testing-library) を参照して進めます。

npm、yarn それぞれ以下コマンドを実行してください。

**注意**

@storybook/addon-storyshots@next @storybook/testing-react@next は Storybook6.4 prerelease 版に対応する為に @next を付けていますが、Storybook6.4 が stable になったら @next は外して実行してください。

- npm

```txt
npm install --save-dev jest babel-jest identity-obj-proxy react-test-renderer @testing-library/react @testing-library/jest-dom @testing-library/user-event @testing-library/react-hooks @storybook/addon-storyshots@next @storybook/testing-react@next
```

- yarn

```txt
yarn add --dev jest babel-jest identity-obj-proxy react-test-renderer @testing-library/react @testing-library/jest-dom @testing-library/user-event @testing-library/react-hooks @storybook/addon-storyshots@next @storybook/testing-react@next
```

それぞれ install package は以下の用途になります。

- babel-jest
  - Babel を使って jest を実行する
- jest
  - Storybook と Jest を利用した Snapshot test や Unit test を実行する
- @testing-library/react
  - Storybook と react-testing-library を利用した Unit test を実行する
- @testing-library/user-event
  - Unit test でクリックや文字入力などユーザーインタラクションを実行する
- @testing-library/jest-dom
  - Jest カスタムマッチャーを利用可能にする
- @testing-library/react-hooks
  - Unit Test で React Hooks を利用可能にする
- @storybook/addon-storyshots
  - 各 Story で Snapshot test を作成する
- react-test-renderer
  - Snapshot test 実行時に snapshot を出力する
- @storybook/testing-react
  - jest のテストコード中に Story を利用可能にする
- identity-obj-proxy
  - CSS Modules をモックする

## Jest の設定

jest をコマンドラインから実行する為、package.json に `"test": "jest"` を追記します。

```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "storybook": "start-storybook -p 6006",
    "build-storybook": "build-storybook",
    "test": "jest" // Added
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
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/style.mock.js',

    /* Handle image imports
    https://jestjs.io/docs/webpack#handling-static-assets */
    '^.+\\.(jpg|jpeg|png|gif|webp|avif|svg)$': '<rootDir>/__mocks__/file.mock.js',
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

**tsconfig.json の baseUrl を変更している場合**

tsconfig.json の baseUrl を `src` に変更している場合、jest.config.js に設定を追記する必要があります。

以下の moduleDirectories 設定を追記すれば component の import 文を `src` 配下からの相対パスとして認識してくれます。

```js
module.exports = {
  moduleDirectories: ['node_modules', 'src'],
};
```

## CSS と画像 Mock 設定

プロダクトコードに CSS modules 以外の CSS や画像を import している場合、Snapshot test で jest 実行時にエラーになります。

エラーを回避する為、CSS、画像に対してそれぞれ jest.config.js の moduleNameMapper で記述したファイルで mock 化する必要があります。

ルートディレクトリに `__mocks__/file.mock.js` ファイルを作成して以下を追記してください。

```js
module.exports = 'test-file-stub';
```

次に `__mocks__/style.mock.js` ファイルを作成して以下を追記してください。

```js
module.exports = {};
```

## Storybook の upgrade

CSF3.0 を利用するには Storybook version が 6.4.0 以降である必要があります。

ロードマップによると 2021/12/01 に 6.4.0 がリリースされる予定ですが、現時点では Storybook version を upgrade する必要があります。

- ✅ 6.4.0-rc.0 2021-11-12
- 🏁 6.4.0 2021-12-01 (est)

12/1 以降で既に 6.4.0 が stable になっている場合、以下作業はスキップしてください。

upgrade をする為には、以下コマンドを実行します。

```txt
npx sb@next upgrade --prerelease
```

実行すると Storybook version が 6.4.0-rc.2 になります。

```txt
$ npx sb@next upgrade --prerelease
Need to install the following packages:
  sb@next
Ok to proceed? (y) y
 • Checking for latest versions of '@storybook/*' packagesinfo ,Upgrading /Users/kazuma/Documents/github/next/next-storybook-csf3/package.json
info  @storybook/addon-actions     ^6.3.12  →  ^6.4.0-rc.2
info  @storybook/addon-essentials  ^6.3.12  →  ^6.4.0-rc.2
info  @storybook/addon-links       ^6.3.12  →  ^6.4.0-rc.2
info  @storybook/react             ^6.3.12  →  ^6.4.0-rc.2
info Run npm install to install new versions.
 • Installing upgrades • Preparing to install dependencies. ✓
```

install 途中で storybook 用の eslintPlugin を入れるか聞かれます。

筆者は ESLint で静的解析を行いたいので yes を選択しました。

```txt
✔ Do you want to run the 'eslintPlugin' fix on your project? … yes
✅ Adding dependencies: eslint-plugin-storybook

added 13 packages, changed 1 package, and audited 1828 packages in 6s
              :
							:
							:
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

## Storybook の main.js 設定

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

**Storybook 起動時に PostCSS DeprecationWarning が発生する場合**

Tailwind CSS や MUI を使用している場合、Storybook 起動時に PostCSS DeprecationWarning が発生する場合があります。

ライブラリが使用している PostCSS version と Storybook の PostCSS version が異なる為エラーが発生します。

version の整合性を取る為 addon を導入する必要があります。

- npm

```txt
npm install --save-dev @storybook/addon-postcss
```

- yarn

```txt
yarn add --dev @storybook/addon-postcss
```

`.storybook/main.js` の addons に `@storybook/addon-postcss` を追記します。

```js
module.exports = {
  stories: ['../src/components/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-postcss'],
};
```

**tsconfig.json の baseUrl を変更している場合**

tsconfig.json の baseUrl を src に変更している場合、main.js に Webpack 設定を追記する必要があります。

Storybook は Next.js とは別の Webpack で動作しています。

以下の Webpack 設定で Storybook が component の import 文を src 配下からの相対パスとして認識してくれます。

```js
const path = require('path'); // Added

module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-postcss'],
  // Add this
  webpackFinal: async (config, { configType }) => {
    config.resolve.modules.push(path.resolve(__dirname, '../src'));
    return config;
  },
};
```

**MUI を導入している場合**

MUI を導入している場合、Storybook の Docs(@storybook/addon-docs)が表示されません。

以下 Webpack 設定を追記することにより MUI が Docs に表示されます。

```js
const path = require('path');

module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-postcss'],
  webpackFinal: async (config, { configType }) => {
    config.resolve.modules.push(path.resolve(__dirname, '../src'));
    // Add this
    delete config.resolve.alias['emotion-theming'];
    delete config.resolve.alias['@emotion/styled'];
    delete config.resolve.alias['@emotion/core'];
    return config;
  },
};
```

## globals.css を書き換える

今回アプリで使用する CSS の準備をします。

公式チュートリアルに記載されている [GraphQL と React のチュートリアル](https://raw.githubusercontent.com/chromaui/learnstorybook-code/master/src/index.css) の CSS をコピーして `styles/globals.css` に貼り付けます。

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

以上で Storybook と Testing package の導入は完了です。

次に Component を実装して Storybook に表示させてみましょう。

## Task component と Story を実装する

`src/components/task-item.tsx` ファイルを作成して以下実装をします。

公式チュートリアルのソースコードを TypeScript 化しました。

```jsx
import React from 'react';

export type Task = {
  id: string,
  title: string,
  state: string,
  updatedAt: Date,
};

export type Props = {
  task: Task,
  onArchiveTask: (id: string) => void,
  onPinTask: (id: string) => void,
};

export const TaskItem = ({ task, onArchiveTask, onPinTask }: Props) => {
  return (
    <div className={`list-item ${task.state}`}>
      <label className='checkbox'>
        <input type='checkbox' defaultChecked={task.state === 'TASK_ARCHIVED'} disabled={true} name='checked' />
        <span className='checkbox-custom' onClick={() => onArchiveTask(task.id)} />
      </label>
      <div className='title'>
        <input type='text' value={task.title} readOnly={true} placeholder='Input title' />
      </div>

      <div className='actions' onClick={(event) => event.stopPropagation()}>
        {task.state !== 'TASK_ARCHIVED' && (
          <a onClick={() => onPinTask(task.id)}>
            <span className={`icon-star`} />
          </a>
        )}
      </div>
    </div>
  );
};
```

次に `src/components/task-item.stories.ts` ファイルを作成し以下 Story 実装を行います。

公式チュートリアルの CSF2.0 のソースコードを CSF3.0 に書き換えて TypeScript 化しました。

```ts
import type { ComponentStoryObj } from '@storybook/react';
import { TaskItem, Task } from './task-item';

type Story = ComponentStoryObj<typeof TaskItem>;

export default { component: TaskItem };

const defaultTask: Task = {
  id: '1',
  title: 'OK Test Task',
  state: 'TASK_INBOX',
  updatedAt: new Date(2021, 0, 10, 10, 0),
};

export const Default: Story = {
  args: { task: defaultTask },
};

export const Pinned: Story = {
  args: { task: { ...defaultTask, state: 'TASK_PINNED' } },
};

export const Archived: Story = {
  args: { task: { ...defaultTask, state: 'TASK_ARCHIVED' } },
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

## Storybook を起動する

以下コマンドで Storybook を立ち上げます。

- npm

```txt
npm run storybook
```

- yarn

```txt
yarn storybook
```

Storybook を起動すると以下のような画面が表示されます。

以下 Task component が表示されることを確認してください。

<img src='/images/posts/2021-11-17-1.png' class='img' />

## Snapshot test を実行する

アプリの品質を保つ上で重要な Component の差分を検出する Snapshot test を実行してみます。

Storybook を利用すれば簡単に Snapshot test を実行できます。

`src/components/task-item.test.ts` ファイルを作成して以下追記するだけです。

```ts
import initStoryshots from '@storybook/addon-storyshots';
initStoryshots();
```

それぞれ以下コマンドを実行して Snapshot test を実行します。

- npm

```txt
npm test
```

- yarn

```txt
yarn test
```

実行結果が以下のように PASS すると test ファイルがある階層に `__snapshots__` ディレクトリが作成されスナップショットファイルが生成されます。

```txt
$ npm test

> test
> jest

 PASS  src/components/task-test.test.ts
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

次に defaultTask を以下のように NG Test Task と書き換えます。

```ts
const defaultTask: Task = {
  id: '1',
  title: 'NG Test Task',
  state: 'TASK_INBOX',
  updatedAt: new Date(2021, 0, 10, 10, 0),
};
```

再度 test を実行すると以下のように過去に取得した snapshot と比較して差分がある為、test が fail となることが確認できます。

```txt
 FAIL  src/components/task-item.test.ts
  Storyshots
    Task
      ✕ Default (20 ms)
      ✕ Pinned (3 ms)
      ✕ Archived (3 ms)

  ● Storyshots › Task › Default

    expect(received).toMatchSnapshot()

    Snapshot name: `Storyshots Task Default 1`

    - Snapshot  - 1
    + Received  + 1

    @@ -20,11 +20,11 @@
        >
          <input
            placeholder="Input title"
            readOnly={true}
            type="text"
    -       value="Test Task"
    +       value="NG Test Task"
          />
        </div>
```

意図的に UI を修正した場合は snapshot を更新します。

test コマンドに以下オプションを付けて実行します。

```txt
npm test -- -u
```

実行後全ての snapshot が updated されたことが分かります。

```txt
$ npm test -- -u

 PASS  src/components/task-item.test.ts
  Storyshots
    Task
      ✓ Default (16 ms)
      ✓ Pinned (2 ms)
      ✓ Archived (2 ms)

 › 3 snapshots updated.
Snapshot Summary
 › 3 snapshots updated from 1 test suite.

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   3 updated, 3 total
Time:        3.781 s, estimated 4 s
Ran all test suites.
```

`-u` オプションは全ての snapshot を上書きします。

特定の snapshot を更新したい場合はオプション `-t` + test 名を付けて実行します。

```txt
npm test -- -u -t 'Storyshots Task Default'
```

Default test の snapshot のみ上書きされました。

```txt
$npm test -- -u -t 'Storyshots Task Default'

 PASS  src/components/task-item.test.ts
  Storyshots
    Task
      ✓ Default (15 ms)
      ○ skipped Pinned
      ○ skipped Archived

 › 1 snapshot updated.
Snapshot Summary
 › 1 snapshot updated from 1 test suite.

Test Suites: 1 passed, 1 total
Tests:       2 skipped, 1 passed, 3 total
Snapshots:   1 updated, 1 total
Time:        3.259 s
Ran all test suites with tests matching "Storyshots Task Default".
```

## Story を使った Unit Test を実行する

次に TaskItem の List を実装して、Storyboard の Story を使って Unit Test を実行してみます。

`src/components/task-list.tsx` を作成して以下を追記します。

こちらは公式チュートリアルのソースコードを Typescript 化したコードです。

```jsx
import React from 'react';
import { TaskItem, Task } from './task-item';

type Props = {
  loading: boolean,
  tasks: Task[],
  onPinTask: (id: string) => void,
  onArchiveTask: (id: string) => void,
};

export const TaskList = ({ loading, tasks, onPinTask, onArchiveTask }: Props) => {
  const events = {
    onPinTask,
    onArchiveTask,
  };

  const LoadingRow = (
    <div className='loading-item'>
      <span className='glow-checkbox' />
      <span className='glow-text'>
        <span>Loading</span> <span>cool</span> <span>state</span>
      </span>
    </div>
  );
  if (loading) {
    return (
      <div className='list-items'>
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
      </div>
    );
  }
  if (tasks.length === 0) {
    return (
      <div className='list-items'>
        <div className='wrapper-message'>
          <span className='icon-check' />
          <div className='title-message'>You have no tasks</div>
          <div className='subtitle-message'>Sit back and relax</div>
        </div>
      </div>
    );
  }
  const tasksInOrder = [
    ...tasks.filter((t) => t.state === 'TASK_PINNED'),
    ...tasks.filter((t) => t.state !== 'TASK_PINNED'),
  ];
  return (
    <div className='list-items'>
      {tasksInOrder.map((task) => (
        <TaskItem key={task.id} task={task} {...events} />
      ))}
    </div>
  );
};
```

次に `src/components/task-list.stories.ts` を作成して以下を追記します。

TaskList の状態を CSF3.0 の Story object で表現しています。

```ts
import type { ComponentStoryObj } from '@storybook/react';
import { Task } from './task-item';
import * as TaskItemStories from './task-item.stories';
import { TaskList } from './task-list';

type Story = ComponentStoryObj<typeof TaskList>;

export default { component: TaskList };

const defaultTask = TaskItemStories.Default.args?.task as Task;

const defaultTasks = Array.from({ length: 6 }, (_, i) => ({
  ...defaultTask,
  id: `${i + 1}`,
  title: `Task ${i + 1}`,
}));

export const Default: Story = {
  args: { tasks: defaultTasks },
};

export const WithPinnedTasks: Story = {
  args: {
    tasks: [
      ...defaultTasks.slice(0, 5),
      {
        id: '6',
        title: 'Task 6 (pinned)',
        state: 'TASK_PINNED',
        updatedAt: new Date(2021, 0, 10, 10, 0),
      },
    ],
  },
};

export const Loading: Story = {
  args: { tasks: [], loading: true },
};

export const Empty: Story = {
  args: { ...Loading.args, loading: false },
};
```

Storybook に With Pinned Tasks が追加されていることを確認してください。

Pinned された ListItem が List の先頭に表示されていることが分かります。

<img src='/images/posts/2021-11-17-2.png' class='img' />

この With Pinned Tasks の状態の Unit test を書いてみます。

`src/components/task-list.test.tsx` を作成して以下を追記します。

```ts
import initStoryshots from '@storybook/addon-storyshots';
import { composeStories } from '@storybook/testing-react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import * as stories from './task-list.stories';

initStoryshots();

describe('TaskList', () => {
  const { WithPinnedTasks } = composeStories(stories);
  test('renders pinned tasks at the start of the list', () => {
    const pinnedTitle = WithPinnedTasks.args!.tasks![5].title; // "Task 6 (pinned)"
    render(<WithPinnedTasks />);
    const values = screen.getAllByDisplayValue(/^Task/);
    expect(values).toHaveLength(6);
    expect(screen.getByDisplayValue(pinnedTitle)).toBeInTheDocument();
    expect((values[0] as HTMLInputElement).value).toBe(pinnedTitle);
  });
});
```

`yarn test` か `npm test` を実行してテストが Pass することを確認してください。

ポイントは composeStories で stories の各 Story を Unit test コード上で使用出来るようにしています。

次に `render` 関数で Story の状態を WithPinnedTasks component として render しています。

これはかなり便利で Story を使わなかった場合は、テスト対象の component の状態を Unit test 内で事前準備しないといけません。

Test case が増えてくると、同じような状態から派生したテストをするシチュエーションが発生します。

Story を使えばあらかじめ状態が準備された component を各 test case で使い回すことができます。

## Story を使って入力フォームの Unit test を実行する

次に、ログインフォームの Unit test を実行してみます。

入力フォームの Stories 作成にあたって、こちらの公式 Examples を参考にしました。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="storybook/AccountForm.stories.tsx at next · storybookjs/storybook" src="https://hatenablog-parts.com/embed?url=https://github.com/storybookjs/storybook/blob/next/examples/react-ts/src/AccountForm.stories.tsx" frameborder="0" scrolling="no"></iframe>

事前準備として、今回フォームに使用する package を install します。

- npm

```txt
npm install react-hook-form yup @hookform/resolvers
```

- yarn

```txt
yarn add react-hook-form yup @hookform/resolvers
```

次に `styles/globals.css` にフォームで使用する css を追記します。

```css
.wrap {
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: flex-start;
  height: 300px;
}

.content {
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  padding: 1em;
  margin: 0.5em;
}

.error {
  color: #ff4400;
  font-size: medium;
  padding-top: 0.5em;
}
```

次に `src/components/sign-in-form.tsx` を作成して以下を追記します。

こちらは form control に react-hook-form 、 入力 validation に yup を使用した簡易ログインフォームになります。

```jsx
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';

export const validationSchema = yup
  .object({
    mailAddress: yup.string().required('メールアドレスを入力してください'),
    password: yup.string().required('パスワードを入力してください'),
  })
  .required();

type Inputs = {
  mailAddress: string,
  password: string,
};

export const SignInForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm < Inputs > { resolver: yupResolver(validationSchema) };
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='wrap'>
        <div className='content'>
          <input type='text' placeholder='メールアドレス' {...register('mailAddress')} />
          {errors.mailAddress && (
            <div role='alert' className='error'>
              {errors.mailAddress.message}
            </div>
          )}
        </div>
        <div className='content'>
          <input type='password' placeholder='パスワード' {...register('password')} />
          {errors.password && (
            <div role='alert' className='error'>
              {errors.password.message}
            </div>
          )}
        </div>
        <div className='content'>
          <input type='submit' value='ログイン' />
        </div>
      </div>
    </form>
  );
};
```

次に `src/components/sign-in-form.stories.ts` を作成して以下を追記します。

こちらはログインフォームの状態を Story object で表現しています。

ポイントは `play` 関数で、textbox に文字を入力、button をクリックするなどユーザーインタラクションを表現できます。

```ts
import type { ComponentStoryObj } from '@storybook/react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SignInForm } from './sign-in-form';

type Story = ComponentStoryObj<typeof SignInForm>;

export default { component: SignInForm };

export const Default: Story = {};

export const EmptyError = {
  ...Default,
  play: async () => userEvent.click(screen.getByText(/ログイン/i)),
};

export const Filled = {
  ...Default,
  play: async () => {
    userEvent.type(screen.getByPlaceholderText('メールアドレス'), 'uesr@example.com');
    userEvent.type(screen.getByPlaceholderText('パスワード'), 'password');
  },
};

export const FilledSuccess = {
  ...Filled,
  play: async () => {
    await Filled.play();
    await EmptyError.play();
  },
};
```

Storybook に Empty Error、Filled Success が追加されていることを確認してください。

Empty Error では全項目未入力でログインボタンがクリックされた時の未入力 validation が表示されていることが分かります。

Storybook の表現力が格段に向上しており、個人的にはこの play 関数が CSF3.0 の大きな特徴だと思っています。

<img src='/images/posts/2021-11-17-3.png' class='img' />

次に Empty Error、Filled Success の Story を使った Unit test を実装します。

`src/components/sign-in-form.test.tsx` を作成して以下を追記してください。

```ts
import initStoryshots from '@storybook/addon-storyshots';
import { composeStories } from '@storybook/testing-react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import * as stories from './sign-in-form.stories';
import { EmptyError as emptyErrorStory, FilledSuccess as filledSuccessStory } from './sign-in-form.stories';

initStoryshots();

describe('SignInForm', () => {
  const { EmptyError, FilledSuccess } = composeStories(stories);
  test('Validate form blank errors', async () => {
    render(<EmptyError />);
    await emptyErrorStory.play();
    const alerts = await screen.findAllByRole('alert');
    expect(alerts).toHaveLength(2);
    expect(alerts[0]).toHaveTextContent('メールアドレスを入力してください');
    expect(alerts[1]).toHaveTextContent('パスワードを入力してください');
  });

  test('Filled valid input value', async () => {
    render(<FilledSuccess />);
    await filledSuccessStory.play();
    const mailAddressInput: HTMLInputElement = await screen.findByPlaceholderText('メールアドレス');
    const passwordInput: HTMLInputElement = await screen.findByPlaceholderText('パスワード');
    expect(mailAddressInput.value).toBe('uesr@example.com');
    expect(passwordInput.value).toBe('password');
    const alerts = screen.queryAllByRole('alert');
    expect(alerts).toHaveLength(0);
  });
});
```

ポイントはやはり play 関数で、各 Test case のフォームの入力やボタンクリックなどユーザーインタラクションを実行しています。

Test case が増えてくると同じようなフォーム入力状態を再現しなければなりませんが、play 関数を使うことによりユーザーインタラクションを各 Test case で使い回すことができ冗長なコードを避けることができます。

ここは本来 composeStories から取得した EmptyError から直接 EmptyError.play() と関数を実行したいのですが、私の知識不足もあり TS の型エラーが解決できませんでした。

代替策として `sign-in-form.stories` から import した emptyErrorStory と filledSuccessStory の play 関数を実行しています。

まだ CSF3.0 が prerelease ということもあり、また今後状況が変わるかもしれません。

最後に今回実装したサンプルアプリのソースコードは以下のリポジトリにあるので参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="kazuma-fujita/next-storybook-csf3: Using Storybook with Next.js sample app." src="https://hatenablog-parts.com/embed?url=https://github.com/kazuma-fujita/next-storybook-csf3" frameborder="0" scrolling="no"></iframe>

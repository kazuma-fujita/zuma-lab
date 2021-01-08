---
title: 'Next.jsのimport文を絶対パスで設定する(TypeScript版)'
date: '2021-01-08'
isPublished: true
metaDescription: 'Next.js/TypeScript で import 文を src ディレクトリからの絶対パスで設定する方法を解説します。設定はものすごく簡単で tsconfig.json の compilerOptions に `baseUrl` を追記します。'
---

Next.js/TypeScript の import 文を src ディレクトリからの絶対パスで設定する方法です。

ある程度実装を終えてから絶対パスに変更しようとすると修正漏れが発生しそうなので、自分は Next や CRA の作成直後に必ずこれを実施しています。

import 文の可読性が上がるのでぜひお試しください。

### 環境

- macOS Catalina 10.15.5(19F101)
- VSCode 1.52.1
- Next 10.0.4
- React 16.14.0
- TypeScript 4.0.5

### 設定方法

このような階層のファイルがあったとします。

```
├── src
│   ├── components
│   │   └── templates
│   │       ├── Layout.tsx
```

src 配下の別階層から `Layout` component を参照した場合、相対パスだとこうなります。

```ts
import Layout from '../../../../components/templates/Layout';
```

このように import の階層が深くなった場合に、絶対パスだと以下のように書けます。

```ts
import Layout from 'components/templates/Layout';
```

設定はものすごく簡単で tsconfig.json の compilerOptions に `baseUrl` を追記します。

あとは `include` に 対象のファイルを記載するだけです。

```json:tsconfig.json
{
  "compilerOptions": {
    "allowJs": true,
    "alwaysStrict": true,
    "strict": true,
           :
           :
           :
    "baseUrl": "./src" // 追加。import文をsrcからの絶対パスで記述出来る
  },
  "exclude": ["node_modules"],
  "include": ["src/**/*.ts", "src/**/*.tsx"]
}
```

アプリを起動している場合は再起動すると反映します。

## 参考

[Importing a Component / Absolute Imports](https://create-react-app.dev/docs/importing-a-component/#absolute-imports)

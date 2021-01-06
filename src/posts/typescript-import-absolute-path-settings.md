---
title: 'import文を絶対パスで設定する(TypeScript版)'
date: '2021-01-06'
isPublished: true
---

TypeScript で import 文を src ディレクトリからの絶対パスで設定する方法。

### 環境

- macOS Catalina 10.15.5(19F101)
- VSCode 1.52.1
- next 10.0.4
- react 16.14.0
- typescript 4.0.5

### 設定方法

このような階層のファイルがあったとする。

```
├── src
│   ├── components
│   │   └── templates
│   │       ├── Layout.tsx
```

src 配下の別階層から `Layout` component を参照した場合、相対パスだとこうなる。

```ts
import Layout from '../../../../components/templates/Layout';
```

このように import の階層が深くなった場合に、絶対パスだと以下のように書ける。

```ts
import Layout from 'components/templates/Layout';
```

設定はものすごく簡単で tsconfig.json の compilerOptions に `baseUrl` を追記。

あとは `include` に 対象のファイルを記載するだけ。

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

アプリを起動している場合は再起動すると反映する。

## 参考

[Importing a Component / Absolute Imports](https://create-react-app.dev/docs/importing-a-component/#absolute-imports)

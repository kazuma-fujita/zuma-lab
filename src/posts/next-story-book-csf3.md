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

### 環境

- macOS Big Sur 11.6
- Next 12.0.3
- React 17.0.2
- TypeScript 4.4.4

### Next.js プロジェクトの作成

以下コマンドを実行して Next.js プロジェクトを作成します。

`--template typescript` オプションで TypeScript を利用可能にします。

筆者は package 管理に npm を使用する為、 `--use-npm` オプションをつけています。

yarn をご利用の方はオプションを外して下さい。

```txt
npx create-react-app next-storybook-csf3 --template typescript --use-npm
```

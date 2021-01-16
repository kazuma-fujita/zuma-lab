---
title: 'Next/TypeScript/Material-UI/Vercelでブログ始めました'
date: '2021-01-03'
isPublished: true
metaDescription: 'この blog は Next/TypeScript で実装、デザインは Material-UI で組み、Vercel でホスティングしています。'
tags:
  - 'Next.js'
  - 'TypeScript'
  - 'Material-UI'
  - 'Vercel'
---

2021 年 を迎え、まったりと技術発信 blog というより備忘録を付けようと思います。

この blog は Next/TypeScript で実装、デザインは Material-UI で組み、Vercel でホスティングしています。

## やることリスト

この blog はフルスクラッチで実装している為、足りない機能だらけです。

以下は blog の機能追加や、環境整備など、当面のやることリスト、そしてやらないかもしれないリストです。

- 開発環境・初期設定
  - [x] Next/TypeScript 環境構築
  - [x] ESLint/Prettier 設定
  - [x] Google Analytics 設定
    - [x] .env で本番/preview/ローカル環境測定 ID 出し分け
- 画面実装
  - [ ] 記事一覧 画面実装
    - [ ] 新着記事ページング実装
    - [x] MainFeatured/Featured に記事リンク設定
  - [ ] 記事詳細 画面実装
    - [ ] AMP 対応
    - [ ] PWA 対応
    - [x] OGP 画像動的生成実装
    - [ ] パンくずリスト実装
    - [ ] 前後記事リンク設置
    - [x] Twitter/Facebook share ボタン設置
    - [ ] next/image component 埋め込み実装
    - [x] MainFeatured に記事タイトル設定
    - [x] Markdown から HTML 生成実装
    - [x] code タグ装飾実装
    - [x] シンタックスハイライト実装
  - [x] Profile 画面実装
  - [ ] Contact 画面実装
    - [ ] material-ui でフォーム実装
    - [ ] react-hooks-form で validation
    - [ ] static forms で serverless mail 送信
  - [ ] プライバシーポリシー 画面実装
  - [ ] 免責事項 画面実装
- 画面共通処理
  - [ ] Performance 改善(現状 Lighthouse 80 点)
  - [ ] Accessibility 改善(現状 Lighthouse 81 点)
    - [ ] eslint-plugin-jsx-a11y 導入
  - [ ] カスタム 404 画面実装
  - [x] Twitter OGP タグ設定
  - [ ] その他 SNS OGP タグ調査・設定
  - [ ] Meta タグ調査・設定
  - [x] sitemap.xml 自動生成実装
  - [x] Title タグ設定
  - [x] ページ先頭に戻るボタン設置
- Sidebar
  - [x] タグ一覧実装
  - [x] 新着記事一覧実装
    - [ ] 10 件以上は全ての記事を表示リンク設置
  - [x] 月別アーカイブ実装
  - [ ] Google AdSense 設定
  - [x] SNS アイコン設置
- Header
  - [ ] Contact リンク設置
  - [ ] RSS 購読ボタン設置
  - [x] SiteTitle に Top リンク設置
  - [x] SNS アイコン表示
  - [x] Profile リンク表示
- Footer
  - [x] Sections リンク設置
- Posts task
  - [x] GA 記事
  - [ ] ISR 記事
  - [ ] Markdown / Material-UI 記事
  - [ ] Contact / Serverless 記事
  - [ ] Amplify / TypeScript 記事
  - [ ] gray-matter / isPublished / tags 実装記事
  - [ ] breadcrumb 実装記事

実装完了したものからチェックを付けてますが、果たして全機能実装出来るのでしょうか。

ただ Next が既に様々に機能を用意してくれてるので、基本的な blog の機能だけなら 3 日くらいで実装は出来ると思います。

また Vercel でホスティングすれば、秒速で公開でき、更に Next の恩恵を最大限に得れるので生産性は爆上がりです。

後は頑張って機能追加していこうと思います！

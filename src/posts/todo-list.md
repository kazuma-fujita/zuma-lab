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

## TODO リスト

この blog はフルスクラッチで実装している為、足りない機能だらけです。

以下は blog の機能追加や、環境整備など、当面のやることリスト、そしてやらないかもしれないリストです。

- 開発環境・初期設定
  - [x] Next/TypeScript 環境構築
  - [x] ESLint/Prettier 設定
  - [x] Google Analytics 設定
    - [x] .env で本番/preview/ローカル環境測定 ID 出し分け
  - [x] Next/TypeScript/ESLint/Prettier/Material-UI/styled-component template 作成
- 画面実装
  - [ ] 記事一覧 画面実装
    - [ ] 新着記事ページング実装
    - [x] MainFeatured/Featured に記事リンク設定
  - [ ] 記事詳細 画面実装
    - [ ] AMP 対応
      - [ ] HTML 対応
      - [ ] JavaScript 対応
      - [ ] CSS 対応
    - [ ] PWA 対応
    - [ ] パンくずリスト実装
    - [ ] 前後記事リンク設置
    - [ ] next/image component 埋め込み実装
    - [ ] 画像ごとに img タグ alt 属性設定
    - [x] OGP 画像動的生成実装
    - [x] Twitter/Facebook share ボタン設置
    - [x] MainFeatured に記事タイトル設定
    - [x] Markdown から HTML 生成実装
    - [x] code タグ装飾実装
    - [x] シンタックスハイライト実装
  - [x] Profile 画面実装
    - [x] description の markdown 化
    - [ ] next/image component で画像 lazy-load 実装
  - [x] Contact 画面実装
    - [x] material-ui でフォーム実装
    - [x] react-hooks-form で validation
    - [ ] static forms で serverless mail 送信
  - [x] プライバシーポリシー 画面実装
    - [ ] 本文の markdown 化
    - [ ] GA など外部リンク設定
- 画面共通処理
  - [ ] Performance 改善(現状 Lighthouse 80 点)
  - [ ] Accessibility 改善(現状 Lighthouse 81 点)
    - [ ] 全 img タグ alt 属性設定
    - [ ] eslint-plugin-jsx-a11y 導入
  - [ ] next/Link をラップした material-ui/Link カスタム component 作成
    - [ ] next/Link 挙動調査 / Link 先画面の先読み検証
    - [ ] 全画面 Custom Link に差し替え
  - [x] sitemap.xml 自動生成実装
    - [x] 固定ページ/posts 配下 markdown ファイル更新日付を lastmod 属性に設定
    - [ ] tags/archives 一覧 URL の sitemap 出力実装
    - [ ] markdown meta 情報の isPublished=false 記事は sitemap から除外実装
  - [ ] カスタム 404 画面実装
  - [ ] その他 SNS OGP タグ調査・設定
  - [ ] Meta タグ調査・設定
  - [x] Twitter OGP タグ設定
  - [x] Title タグ設定
  - [x] ページ先頭に戻るボタン設置
- Sidebar
  - [ ] サイト内検索実装
  - [ ] おすすめ記事一覧実装
  - [x] 新着記事一覧実装
    - [ ] 10 件以上は全ての記事を表示リンク設置
  - [x] タグ一覧実装
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
  - [x] GA 設定　本番/ステージング/ローカル環境別測定 ID 出し分け 記事
  - [ ] AMP 記事
  - [ ] PWA 記事
  - [ ] サイト内検索を ISR で実装
  - [ ] Markdown を Material-UI で装飾
  - [ ] Contact / static forms / Serverless 実装
  - [ ] Amplify lambda / TypeScript 実装
  - [ ] gray-matter / isPublished / tags 実装
  - [ ] breadcrumb 実装
  - [ ] Flutter Freezed の build.yaml の field_rename: snake 対応記事
  - [ ] Flutter Freezed の fromJsonResponse 各種 json 配列パターン解析記事
  - [ ] Flutter Riverpod DI 箇所の MockWebServer を利用した UnitTest 記事
  - [ ] Flutter Riverpod DI 箇所の Mockito を利用した UnitTest 記事
  - [ ] Flutter Riverpod DI 箇所の WidgetTest を利用した UnitTest 記事
  - [ ] Flutter Riverpod DI 箇所の WidgetTest を利用した Loading 中処理の 記事

実装完了したものからチェックを付けてますが、果たして全機能実装出来るのでしょうか。

ただ Next が既に様々に機能を用意してくれてるので、基本的な blog の機能だけなら 3 日くらいで実装は出来ると思います。

また Vercel でホスティングすれば、秒速で公開でき、更に Next の恩恵を最大限に得れるので生産性は爆上がりです。

後は頑張って機能追加していこうと思います！

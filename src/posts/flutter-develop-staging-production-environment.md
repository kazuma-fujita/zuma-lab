---
title: 'FlutterでiOSの開発/ステージング/本番環境を切り替える'
date: '2021-03-XX'
isPublished: false
metaDescription: ''
tags:
  - 'Flutter'
  - 'Dart'
---

Flutter で開発/ステージング/本番環境を切り替える方法です。

プロダクト開発だと開発環境の他、本番環境、本番環境により近いステージング環境と 3 種類の環境を用意するケースが多いと思います。

ステージング環境は QA 環境やテスト環境とも呼んだりしますね。

Flutter で環境を切り替えるには Debug build/Release build で切り替える方法や Flavor を使う方法がありますが、今回は dart-define を利用して環境を切り替えてみます。

内容自体は @tetsufe さんの [こちらの記事](https://qiita.com/tetsufe/items/3f2257ac12f812d3f2d6) を参考にして加筆、修正した内容となっております。

### 環境

- macOS Big Sur 11.2.3
- Android Studio 4.1.3
- Flutter 2.0.3
- Dart 2.12.2

###

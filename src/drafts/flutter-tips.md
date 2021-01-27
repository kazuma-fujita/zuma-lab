---
title: 'Flutter Tips'
date: '2021-01-XX'
isPublished: false
metaDescription: ''
tags:
  - 'Flutter'
---

Flutter を勉強してる中で遭遇した Tips トラブルシューティングを書き溜めていきます。

### 環境

- Flutter 1.22.5
- Dart 2.10.4

## Flutter Version 確認方法

version を確認したい時は以下のコマンドを実行します。

```txt
flutter --version
```

実行結果には 現在の chanel や Dart の version も併せて表示されます。

```txt
$ flutter --version
Flutter 1.22.5 • channel stable • https://github.com/flutter/flutter.git
Framework • revision 7891006299 (7 weeks ago) • 2020-12-10 11:54:40 -0800
Engine • revision ae90085a84
Tools • Dart 2.10.4
```

## Flutter channel 切り替え方法

channel コマンド で Flutter SDK の 安定版や β 版を切り替えることができます。

現在どの channel なのか確認するには以下コマンドを実行します。

```
flutter channel
```

アスタリスクが付いているのが現在の channel になります。

```
Flutter channels:
  master
  dev
  beta
* stable
```

それぞれ内容は以下です。

- master
  - 現在の最新ソースがコミットされる開発ブランチ。最新の機能が取り込まれる反面、もっとも不安定ともいえるチャンネル
- dev
  - master の次フェーズに相当する最新のテスト済みブランチ。一定の品質は保たれているので、master よりは安心して使えるチャンネル
- beta
  - 前月で最も品質の良かった dev チャンネルのビルド。月 1 回のアップデートと dev チャンネルよりも更新は遅いが、品質的にはより安定したチャンネル
- stable
  - 利用が推奨される安定版チャンネル。四半期に 1 回アップデートされる

基本は stable を開発することになりますが、stable で取り込まれていない bugfix や新機能がある場合、beta や dev に切り替える場面が出てきます。

channel の切り替えは以下コマンドを実行します。

```txt
flutter channel {channel名}
```

channel を切り替えたら以下コマンドを実行して切り替えた channel の Flutter SDK を最新化します。

```txt
flutter upgrade
```

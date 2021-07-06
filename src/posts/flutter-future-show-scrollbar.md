---
title: 'Flutterで縦長の画面の右側にScrollbarを表示する'
date: '2021-07-06'
isPublished: true
metaDescription: 'Flutterで縦長の画面の右側にScrollbarを表示する方法です。'
tags:
  - 'Flutter'
  - 'Dart'
---

Flutter で ListView や SingleChildScrollView を利用して縦長の画面を構築した場合、デフォルトで画面右側に Scrollbar は表示されません。

ユーザーにとって縦長の画面で Scrollbar が表示されないと、どこまでその画面が Scroll できるか一見分かりません。

UX 向上の為、Scroll が必要な画面には Scrollbar を表示しましょう。

### 環境

- macOS Big Sur 11.4
- Android Studio 4.2.1
- Flutter 2.2.0
- Dart 2.13.0

## Scrollbar の表示方法

Scrollbar は material.dart パッケージを利用する為、以下 import します。

```dart
import 'package:flutter/material.dart';
```

後はとても簡単です。

Scrollbar を表示したい Widget を Scrollbar で囲むだけです。

ListView だけでは無く、SingleChildScrollView や CustomScrollView などスクロール可能な様々な Widget に適用可能です。

```dart
    return Scaffold(
      appBar: AppBar(
        title: const Text('Scrollbar View'),
      ),
      body: Scrollbar(
        child: ListView.builder(
```

```dart
    return Scaffold(
      appBar: AppBar(
        title: const Text('Scrollbar View'),
      ),
      body: Scrollbar(
        child: SingleChildScrollView(
          child: Container(
```

```dart
    return Scaffold(
      appBar: AppBar(
        title: const Text('Scrollbar View'),
      ),
      body: Scrollbar(
        child: CustomScrollView(
          slivers: <Widget>[
            SliverAppBar(
```

このように Scrollbar が表示できました。

<img src='/images/posts/2021-07-06-1.png' class='img' alt='posted image' style='width: 50%' />

Scrollbar には見た目をカスタマイズできるオプションも用意されています。

isAlwaysShown は常に Scrollbar を表示するオプションです。

thickness、hoverThickness で bar の太さを変更できます。

Web は デフォルト 8px、mobile だとデフォルト 4px です。

radius で bar の角丸を調整できます。

こちらはデフォルト 8px です。

```dart
body: Scrollbar(
  isAlwaysShown: true,
  thickness: 8,
  hoverThickness: 16,
  radius: Radius.circular(16),
```

極端にやるとこんな見た目に変更することも可能です。

<img src='/images/posts/2021-07-06-2.png' class='img' alt='posted image' style='width: 50%' />

その他のオプションは Flutter.dev を参照ください。

Flutter.dev では DartPad でインタラクティブに Widget の見た目を変更して確認できます。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Scrollbar class - material library - Dart API" src="https://hatenablog-parts.com/embed?url=https://api.flutter.dev/flutter/material/Scrollbar-class.html" frameborder="0" scrolling="no"></iframe>

以上、簡単ですが Flutter で縦長の画面に Scrollbar を表示させる方法でした。

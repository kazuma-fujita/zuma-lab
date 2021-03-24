---
title: 'Flutter公式のwebview_flutterでWebViewを表示する'
date: '2021-03-24'
isPublished: true
metaDescription: 'Flutter公式のwebview_flutterでWebViewを表示します。WebView 画面は読み込み中に LinearProgressIndicator を表示し、AppBar には Web サイト の title を表示まで実装します。'
tags:
  - 'Flutter'
  - 'Dart'
---

Flutter 公式の webview_flutter で WebView を表示します。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="webview_flutter | Flutter Package" src="https://hatenablog-parts.com/embed?url=https://pub.dev/packages/webview_flutter" frameborder="0" scrolling="no"></iframe>

WebView を起動する画面と WebView を表示する画面の 2 画面構成です。

WebView 画面は読み込み中に LinearProgressIndicator を表示し、AppBar には Web サイト の title を表示まで実装します。

完成後はこのようになります。

<img src='/images/posts/2021-03-24-1.gif' class='img' alt='posted movie'/>

### 環境

- macOS Big Sur 11.2.1
- Android Studio 4.1.2
- Flutter 2.0.3
- Dart 2.12.2

## webview_flutter を install する

pubspec.yaml に `webview_flutter` を追記します。

- pubspec.yaml

```yaml
environment:
  sdk: '>=2.12.2 <3.0.0'

dependencies:
  flutter:
    sdk: flutter
  webview_flutter:
```

追記したら忘れずに `flutter pub get` を実行します。

## /android/app/build.gradle の minSdkVersion を変更する

次に `/android/app/build.gradle` の minSdkVersion を 19 に変更します。

- `/android/app/build.gradle`

```gradle
android {
    defaultConfig {
        // Required by the Flutter WebView plugin.
        minSdkVersion 19
    }
}
```

これは後述する `SurfaceAndroidWebView` を利用する為の最低 API version が 19 である為に変更が必要になります。

## WebView を起動する画面を実装する

まず WebView を起動する初回表示画面を実装します。

- `lib/first_view.dart`

```dart
import 'package:flutter/material.dart';
import 'package:flutter_web_view/web_view_screen.dart';

class FirstView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: const Text('Web View Sample'),
        ),
        body: _FirstView(),
      ),
    );
  }
}

class _FirstView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: ElevatedButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute<WebViewScreen>(
              builder: (BuildContext _context) => WebViewScreen(),
            ),
          );
        },
        child: const Text('Launch Web View'),
      ),
    );
  }
}
```

WebView 画面を起動するボタンがあるシンプルな画面です。

次に `main.dart` に作成した FirstView を runApp に設定します。

- `lib/main.dart`

```dart
import 'package:flutter/material.dart';

import 'first_view.dart';

void main() {
  runApp(FirstView());
}
```

## WebView 画面を実装する

本題の WebView 画面を実装します。

- `lib/web_view_screen.dart`

```dart
import 'dart:async';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

class WebViewScreen extends StatefulWidget {
  @override
  _WebViewScreenState createState() => _WebViewScreenState();
}

class _WebViewScreenState extends State<WebViewScreen> {
  final Completer<WebViewController> _controller =
      Completer<WebViewController>();

  bool _isLoading = false;
  String _title = '';

  @override
  void initState() {
    super.initState();
    if (Platform.isAndroid) {
      WebView.platform = SurfaceAndroidWebView();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_title),
      ),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    return Column(
      children: [
        if (_isLoading) const LinearProgressIndicator(),
        Expanded(
          child: _buildWebView(),
        ),
      ],
    );
  }

  Widget _buildWebView() {
    return WebView(
      initialUrl: 'https://flutter.dev',
      // jsを有効化
      javascriptMode: JavascriptMode.unrestricted,
      // controllerを登録
      onWebViewCreated: _controller.complete,
      // ページの読み込み開始
      onPageStarted: (String url) {
        // ローディング開始
        setState(() {
          _isLoading = true;
        });
      },
      // ページ読み込み終了
      onPageFinished: (String url) async {
        // ローディング終了
        setState(() {
          _isLoading = false;
        });
        // ページタイトル取得
        final controller = await _controller.future;
        final title = await controller.getTitle();
        setState(() {
          if (title != null) {
            _title = title;
          }
        });
      },
    );
  }
}
```

まず WebViewController を定義します。

この WebViewController は Web サイトタイトルを取得する為に必要になります。

```dart
  final Completer<WebViewController> _controller =
      Completer<WebViewController>();
```

次にローディング中状態を保持する `_isLoading` フラグと、Web サイトタイトルを保持する `_title` を定義します。

```dart
  bool _isLoading = false;
  String _title = '';
```

このプロパティを setState で状態変更してローディング状態や、AppBar に表示する Web サイトタイトルを管理します。

### Android で日本語入力できるようにする

Android はデフォルトの WebView 設定では日本語入力ができません。

そこで initState の初期化処理で WebView に `SurfaceAndroidWebView` を設定します。

```
  @override
  void initState() {
    super.initState();
    if (Platform.isAndroid) {
      WebView.platform = SurfaceAndroidWebView();
    }
  }
```

キーボード入力が必要な場合は、Hybrid Composition ベースの PlatformView を使うことが推奨されています。

上記のコードを追加することで Hybrid Composition ベースの PlatformView を使うので、日本語入力等出来るようになるわけです。

### ローディング状態や Web サイトタイトルを画面に反映させる

setState で変更された状態が画面に反映される処理をいれます。

```dart
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_title),
      ),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    return Column(
      children: [
        if (_isLoading) const LinearProgressIndicator(),
        Expanded(
          child: _buildWebView(),
        ),
      ],
    );
  }
```

ここでは AppBar に先程定義した \_title プロパティを設定しています。

また、先程定義した \_isLoading フラグが true の場合 AppBar の下部に `LinearProgressIndicator` を表示する実装をしています。

## WebView Widget を実装する

最後に WebView Widget を実装します。

```dart
  Widget _buildWebView() {
    return WebView(
      initialUrl: 'https://flutter.dev',
      // jsを有効化
      javascriptMode: JavascriptMode.unrestricted,
      // controllerを登録
      onWebViewCreated: _controller.complete,
      // ページの読み込み開始
      onPageStarted: (String url) {
        // ローディング開始
        setState(() {
          _isLoading = true;
        });
      },
      // ページ読み込み終了
      onPageFinished: (String url) async {
        // ローディング終了
        setState(() {
          _isLoading = false;
        });
        // ページタイトル取得
        final controller = await _controller.future;
        final title = await controller.getTitle();
        setState(() {
          if (title != null) {
            _title = title;
          }
        });
      },
    );
  }
```

`initialUrl` に表示したいサイト URL を設定します。

プロダクトでは動的に URL を設定する思いますが、今回はサンプルの為ハードコーディングしています。

JavaScript はデフォルトで無効になっているので、`JavascriptMode.unrestricted` で 有効にします。

`onWebViewCreated` で `WebViewController` を WebView に登録します。

`onPageStarted` で Web サイトの読み込みが開始した場合の処理を実装します。

今回は読み込み中にローディングインジケーターを表示するので、 \_isLoading = true としています。

`onPageFinished` で Web サイトの読み込み終了した場合の処理を実装します。

読み込み中のローディングインジケーターを非表示にする為、 \_isLoading = false としています。

最後に `controller.getTitle()` で web サイトタイトルを取得、 \_title プロパティに代入して AppBar にタイトルを表示します。

## おわりに

Flutter 初学者の筆者でも簡単に WebView で Web サイトを表示することができました。

ソースコードは Github にもあるので参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="kazuma-fujita/flutter_web_view: Practice WebView." src="https://hatenablog-parts.com/embed?url=https://github.com/kazuma-fujita/flutter_web_view" frameborder="0" scrolling="no"></iframe>

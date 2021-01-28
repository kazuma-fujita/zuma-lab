---
title: 'Flutter Tips集'
date: '2021-01-xx'
isPublished: true
metaDescription: ''
tags:
  - 'Flutter'
  - 'Dart'
---

Flutter 開発時に個人的に使えた Tips 集です。

### 環境

- Flutter 1.22.6
- Dart 2.10.5
- Android Studio 4.1.2

# 新規プロジェクト作成時の設定

プロジェクトの新規作成後にはまず以下の設定をしていきます。

## レイアウト構成を見ながら作業をする設定

レイアウト構成を確認しながら作業をしたい場合は、`rendering.dart` package を import して `debugPaintSizeEnabled` を有効にします。

```dart
import 'package:flutter/rendering.dart'; // Add

void main() {
  debugPaintSizeEnabled = true; // Add
  runApp(MyApp());
}
```

## Linter 設定

静的解析をする為、Lint 設定をします。

- プロジェクトルートディレクトリに `analysis_options.yaml` 作成

```yml:analysis_options.yaml
# https://pub.dev/packages/pedantic_mono
include: package:pedantic_mono/analysis_options.yaml
```

- `pubspec.yaml` の `dev_dependencies` に `pedantic_mono: any` を追記

```yml:pubspec.yaml
dev_dependencies:
  flutter_test:
    sdk: flutter
  pedantic_mono: any # add
```

最後に以下コマンドを実行して package を install して Lint 設定の完了です。

```txt
flutter pub get
```

---
title: 'Flutterのプロジェクトを新規作成したらする設定(コード自動フォーマット/Lint静的解析/Visual Debugging設定)'
date: '2021-02-03'
isPublished: true
metaDescription: 'Flutterのプロジェクトを新規作成したらする設定です。コード自動フォーマットやLint静的解析、Visual Debugging設定の設定を解説します。'
tags:
  - 'Flutter'
  - 'Dart'
  - 'Android Studio'
---

筆者は Flutter 歴まだ浅い初心者なのですが、その中で筆者が学んだオススメ設定を紹介します。

筆者は Flutter の Widget を試す度に Android Studio のプロジェクトの新規作成を繰り返すので、プロジェクト新規作成したら真っ先にする設定です。

特にある程度開発をしてから静的解析をするとほぼコードを修正するハメになるので、Lint 設定はマストでいれています。

コード保存時の自動フォーマットや Lint 静的解析、Visual Debugging、画像の設定は最初にしておいた方が良いので順番に解説していきます。

前提として OS は macOS で IDE は Android Studio となります。

### 環境

- macOS Big Sur 11.1
- Android Studio 4.1.2
- Flutter 1.22.6
- Dart 2.10.5

## コード保存時に自動フォーマットをする設定

コードの保存時に dartfmt でコードの自動フォーマットをする設定です。

設定は簡単で Android Studio の `Preferences` (ショートカット `command + ,`) から `Languages & Frameworks` > `Flutter` を選択します。

<img src='/images/posts/2021-02-03-1.png' class='img' alt='post image' />

ハイライトされてる部分の `Format code on save` にチェックを付けて `Apply` ボタンを押下して完了です。

`Organize imports on save` は保存時に import 文の並び順の最適化、また使用していない import 文の削除をしてくれます。

ここはお好みでチェックをいれてください。

ちなみに Widget の要素の末尾に カンマ(`,`) をつけると、format でキレイに整形されます。

保存時に自動でカンマを付与して欲しいのですが、現状その機能が見つけれられなかったので私は常にカンマをつけるように手癖にしています。

## レイアウト構成を見ながら作業ができる Visual Debugging 設定

レイアウト構成を確認しながら作業をしたい場合は、`rendering.dart` package を import して `debugPaintSizeEnabled` を有効にします。

アプリの Run 時に必ず実行される `main` メソッドに以下追記します。

```dart
import 'package:flutter/rendering.dart'; // Add

void main() {
  debugPaintSizeEnabled = true; // Add
  runApp(MyApp());
}
```

<img src='/images/posts/2021-02-03-2.png' class='img' alt='post image' style='width: 40%' />

`debugPaintSizeEnabled` を有効にするとこのように margin や padding、リストの向きなどが可視化され Visual Debugging することができます。

## Lint 静的解析設定

静的解析をする為の Lint 設定をするにはプロジェクトルート(`pubspec.yaml`がある階層)に `analysis_options.yaml` というファイルを作成して Lint ルールを記述します。

- analysis_options.yaml

```yml:analysis_options.yaml
include: package:pedantic_mono/analysis_options.yaml
```

筆者はまだ個別の細かい Lint ルールを把握していないので、ここでは mono さんが作成した推奨設定がまとまっている `pedantic_mono` package を利用しています。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Dart/Flutter の静的解析強化のススメ. プロジェクトには analysis_options.yaml… | by mono  | Flutter 🇯🇵 | Medium" src="https://hatenablog-parts.com/embed?url=https://medium.com/flutter-jp/analysis-b8dbb19d3978" frameborder="0" scrolling="no"></iframe>

個別設定する場合の Lint ルールは [Linter for Dart - Supported Lint Rules](https://dart-lang.github.io/linter/lints/) に記載されています。

次に `pubspec.yaml` の `dev_dependencies` に `pedantic_mono:` を追記します。

- pubspec.yaml

```yml:pubspec.yaml
dev_dependencies:
  flutter_test:
    sdk: flutter
  pedantic_mono: # add
```

最後に以下コマンドを実行するか、Android Studio から pub get をして `pedantic_mono` package を install して Lint 設定の完了です。

```txt
flutter pub get
```

## ローカル画像を扱えるようにする設定

大なり小なりアプリ開発では画像を扱うことになります。

最初に assets の設定をしてローカルの画像ファイルを扱えるようにしましょう。

まずプロジェクトルートディレクトリに `assets/images` ディレクトリを作成します。

次に `images/images` 配下に画像を配置します。

構成は以下のようになります。

```txt
sample_project
├── assets
│   └── images
│       ├── images1.jpg
│       ├── images2.jpg
│       ├── images3.jpg
│       ├── images4.jpg
│       └── images5.jpg
```

次に `pubspec.yaml` に以下のコードを追加します。

以下の指定で `assets/images` 配下の全てのローカル画像ファイルを対象とします。

```yaml:pubspec.yaml
  assets:
    -  assets/images/
```

コードからの呼び出し方は以下になります。

```dart
Image.asset('assets/images/images1.jpg')
```

## 終わりに

筆者はまだ Flutter 歴が浅いのでもっと有用な設定が他にもあると思います。

もし他にもこんな便利な設定があるよ、という方はぜひ [Twitter](https://twitter.com/____ZUMA____) で DM していただくか [Contact](/contact) で連絡お願いします。

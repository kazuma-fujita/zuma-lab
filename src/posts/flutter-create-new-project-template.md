---
title: 'Android StudioのFlutterテンプレートをカスタマイズしてLint静的解析/Visual Debugging設定/画像設定を自動化する'
date: '2021-02-04'
isPublished: true
metaDescription: 'Android StudioのFlutterテンプレートをカスタマイズする方法です。プロジェクト作成時のLint静的解析、Visual Debugging設定を自動化できます。'
tags:
  - 'Flutter'
  - 'Dart'
  - 'Android Studio'
---

筆者は Flutter の Widget を試す度に Android Studio のプロジェクトの新規作成を繰り返します。

プロジェクト新規作成したらコード保存時の自動フォーマットや Lint 静的解析、Visual Debugging、画像の設定を行います。

こちらにその設定手順を記事にしました。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Flutterのプロジェクトを新規作成したらする設定(コード自動フォーマット/Lint静的解析/Visual Debugging設定) | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/flutter-initial-settings" frameborder="0" scrolling="no"></iframe>

ただこの作業をプロジェクト作成毎に行うのは手間だし手順を飛ばしてしまったりするので、Flutter テンプレートをカスタマイズして設定を自動化しましょう。

Flutter テンプレートは Flutter SDK をインストールしたディレクトリ配下にあります。

```txt
{flutter-sdk-path}/flutter/packages/flutter_tools/templates/app/
```

それではテンプレートをカスタマイズしていきましょう。

### 環境

- macOS Big Sur 11.1
- Android Studio 4.1.2
- Flutter 1.22.6
- Dart 2.10.5

## レイアウト構成を見ながら作業ができる Visual Debugging 設定

レイアウト構成を確認しながら作業をしたい場合は、`rendering.dart` package を import して `debugPaintSizeEnabled` を有効にします。

<img src='/images/posts/2021-02-03-2.png' class='img' alt='post image' style='width: 40%' />

`debugPaintSizeEnabled` を有効にするとこのように margin や padding、リストの向きなどが可視化され Visual Debugging することができます。

設定をプロジェクト新規作成時のテンプレートに反映するにはアプリの Run 時に必ず実行される `main` メソッドがある `main.dart.tmpl` に設定を追記します。

`main.dart.tmpl` の場所は以下になります。

```txt
{flutter-sdk-path}/flutter/packages/flutter_tools/templates/app/lib/main.dart.tmpl
```

ファイルを開いてコメントの `add` のコードを追記します。

```dart
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart'; // add
{{#withDriverTest}}
import 'package:flutter_driver/driver_extension.dart';
{{/withDriverTest}}
{{#withPluginHook}}
import 'dart:async';

import 'package:flutter/services.dart';
import 'package:{{pluginProjectName}}/{{pluginProjectName}}.dart';
{{/withPluginHook}}

void main() {
{{#withDriverTest}}
  // Enable integration testing with the Flutter Driver extension.
  // See https://flutter.dev/testing/ for more info.
  enableFlutterDriverExtension();
{{/withDriverTest}}
  debugPaintSizeEnabled = true; // Add
  runApp(MyApp());
}
```

## Lint 静的解析設定

静的解析をする為の Lint 設定をするにはプロジェクトルート(`pubspec.yaml`がある階層)に `analysis_options.yaml` というファイルを作成して Lint ルールを記述します。

`analysis_options.yaml` のテンプレートとして以下の階層に `analysis_options.yaml.tmpl` を作成します。

```txt
{flutter-sdk-path}/flutter/packages/flutter_tools/templates/app/analysis_options.yaml.tmpl
```

`analysis_options.yaml.tmpl` に以下 1 行を追記します。

```yml:analysis_options.yaml
include: package:pedantic_mono/analysis_options.yaml
```

筆者はまだ個別の細かい Lint ルールを把握していないので、ここでは mono さんが作成した推奨設定がまとまっている `pedantic_mono` package を利用しています。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Dart/Flutter の静的解析強化のススメ. プロジェクトには analysis_options.yaml… | by mono  | Flutter 🇯🇵 | Medium" src="https://hatenablog-parts.com/embed?url=https://medium.com/flutter-jp/analysis-b8dbb19d3978" frameborder="0" scrolling="no"></iframe>

個別設定する場合の Lint ルールは [Linter for Dart - Supported Lint Rules](https://dart-lang.github.io/linter/lints/) に記載されています。

次に以下に階層にある `pubspec.yaml` のテンプレート `pubspec.yaml.tmpl` を開きます。

```
{flutter-sdk-path}/flutter/packages/flutter_tools/templates/app/pubspec.yaml.tmpl
```

`pubspec.yaml.tmpl` の `dev_dependencies` に `pedantic_mono:` を追記します。

```yml:pubspec.yaml
dev_dependencies:
  flutter_test:
    sdk: flutter
  pedantic_mono: # add
```

## ローカル画像を扱えるようにする設定

大なり小なりアプリ開発では画像を扱うことになります。

assets の設定をしてローカルの画像ファイルを扱えるようにしましょう。

まず Flutter テンプレートディレクトリに `assets.tmpl/images` ディレクトリを作成します。

```txt
mkdir -p {flutter-sdk-path}/flutter/packages/flutter_tools/templates/app/assets.tmpl/images
```

`assets.tmpl` というディレクトリはテンプレートからプロジェクト作成時に `assets` というディレクトリ名にリネームされます。

次になんでもいいので画像ファイルを `assets.tmpl/images` 以下に配置します。

```txt
cp sample_image.jpeg {flutter-sdk-path}/flutter/packages/flutter_tools/templates/app/assets.tmpl/images/sample_image.jpeg
```

最後に以下に階層にある `pubspec.yaml` のテンプレート `pubspec.yaml.tmpl` を編集します。

```txt
{flutter-sdk-path}/flutter/packages/flutter_tools/templates/app/pubspec.yaml.tmpl
```

`pubspec.yaml.tmpl` に 以下を追記してください。

```yaml:pubspec.yaml
  assets:
    -  assets/images/
```

上記設定で　`assets/images` 配下の全てのローカル画像ファイルを扱うことができます。

プロジェクト作成後は以下コードでローカル画像を呼び出すことができます。

```dart
Image.asset('assets/images/sample_image.jpeg')
```

## template_manifest.json にプロジェクト作成時にコピーするファイルを追記する

以下の場所に `template_manifest.json` があるので、新規で追加したテンプレートファイルを追記していきます。

```
{flutter-sdk-path}/flutter/packages/flutter_tools/templates/template_manifest.json
```

今回 `analysis_options.yaml.tmpl` を新規で作成しているのでファイルパスを追記します。

また `assets.tmpl` ディレクトリを追加しているのでそちらも追記します。

```
{
    "version": 1.0,
    "_comment": "A listing of all possible template output files.",
    "files": [
        "templates/app/analysis_options.yaml.tmpl",
        "templates/app/assets.tmpl/images/sample_image.jpeg",
```

`template_manifest.json` にテンプレートファイルを追記するとプロジェクト新規作成にファイルをコピーしてくれます。

以上でプロジェクト新規作成時の Flutter テンプレート作成を完了です。

## プロジェクトを新規作成する

それでは Android Studio を開いて、 `Create New Flutter Project` > `Flutter Application` から新規プロジェクトを作成しましょう。

<img src='/images/posts/2021-02-04-1.png' class='img' alt='post image' />

このようにプロジェクトに今回新規で追加したテンプレートの `analysis_options.yaml` `assets/images/sample_image.jpeg` が作成されています。

また、`main.dart` には Visual Debugging の設定が追記されています。

<img src='/images/posts/2021-02-04-2.png' class='img' alt='post image' />

`pubspec.yaml` には今回追加した package `pedantic_mono` と `assets` 設定が追記されています。

## 終わりに

他にも有用な設定は Flutter テンプレートをカスタマイズすれば自由に設定の自動化が可能です。

筆者はまだ Flutter 歴が浅いのでもっと有用な設定が他にもあると思います。

もし他にもこんな便利な設定があるよ、という方はぜひ [Twitter](https://twitter.com/zuma_lab) で DM していただくか [Contact](/contact) で連絡お願いします。

最後に今回カスタマイズしたテンプレートは github にあるので参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="kazuma-fujita/flutter-create-new-project-template: Customization sample of flutter template." src="https://hatenablog-parts.com/embed?url=https://github.com/kazuma-fujita/flutter-create-new-project-template" frameborder="0" scrolling="no"></iframe>

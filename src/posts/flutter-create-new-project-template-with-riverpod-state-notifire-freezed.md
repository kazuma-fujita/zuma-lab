---
title: 'Android StudioのFlutterテンプレートをカスタマイズして Riverpod / StateNotifier / Freezed をデフォルトで使用できるプロジェクトを作成する'
date: '2021-02-16'
isPublished: true
metaDescription: 'Android StudioのFlutterテンプレートをカスタマイズする方法です。今回は Flutter の画面状態を直感的に、そして immutable に管理できる Riverpod、StateNotifier、Freezed の package をプロジェクト新規作成時から使用できるようにしたいと思います。'
tags:
  - 'Flutter'
  - 'Dart'
  - 'Android Studio'
---

筆者は Flutter の Widget を試す度に Android Studio のプロジェクトの新規作成を繰り返します。

プロジェクト新規作成したらコード保存時の自動フォーマットや Lint 静的解析、Riverpod/StateNotifier/Freezed、画像の設定を行います。

ただこの作業をプロジェクト作成毎に行うのは手間だし手順を飛ばしてしまったりするので、Flutter テンプレートをカスタマイズして設定を自動化しましょう。

Lint 静的解析の設定やローカル画像を最初から利用できるようにする設定は過去の記事で紹介してますので、こちらを参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Android StudioのFlutterテンプレートをカスタマイズしてLint静的解析/Visual Debugging設定/画像設定を自動化する | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/flutter-create-new-project-template" frameborder="0" scrolling="no"></iframe>

今回は Flutter の画面状態を直感的に、そして immutable に管理できる Riverpod、StateNotifier、Freezed の package をプロジェクト新規作成時から使用できるようにしたいと思います。

Riverpod、StateNotifier、Freezed についてはこちらの記事で紹介しています。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="FlutterのTodoアプリで Riverpod / useProvider / StateNotifier / Freezed の基本的な使い方を覚える | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/flutter-todo-list-riverpod-use-provider-state-notifier-freezed" frameborder="0" scrolling="no"></iframe>

Flutter テンプレートは Flutter SDK をインストールしたディレクトリ配下にあります。

```
{flutter-sdk-path}/flutter/packages/flutter_tools/templates/app/
```

それではテンプレートをカスタマイズしていきましょう。

### 環境

- macOS Big Sur 11.1
- Android Studio 4.1.2
- Flutter 1.22.6
- Dart 2.10.5

## Riverpod / StateNotifier / Freezed package を pubspec.yaml に追記する

以下の階層にある pubspec.yaml のテンプレート `pubspec.yaml.tmpl` を開きます。

```
{flutter-sdk-path}/flutter/packages/flutter_tools/templates/app/pubspec.yaml.tmpl
```

次に Riverpod / StateNotifier / Freezed package を `pubspec.yaml.tmpl` に追記します。

```yml:pubspec.yaml
dependencies:
  flutter:
    sdk: flutter
  hooks_riverpod:
  state_notifier:
  freezed_annotation:

dev_dependencies:
  flutter_test:
    sdk: flutter
  build_runner:
  freezed:
  json_serializable:
```

`hooks_riverpod` は `riverpod` と `useProvider` を利用する為の package です。

freezed を利用する為、`dev_dependencies` に `build_runner`と `freezed` を追記します。

## analysis_options.yaml を作成して freezed ファイルの Warning を無視する設定をする

freezed で生成された freezed ファイルのコードは整形されていないので Lint の静的解析で Warning が発生します。

自動生成されたファイルの Warning を無視する為 `analysis_options.yaml` ファイルに設定を追記します。

`analysis_options.yaml` のテンプレートとして以下の階層に `analysis_options.yaml.tmpl` を作成します。

```txt
{flutter-sdk-path}/flutter/packages/flutter_tools/templates/app/analysis_options.yaml.tmpl
```

`analysis_options.yaml.tmpl` に以下を追記します。

```
include: package:pedantic_mono/analysis_options.yaml
analyzer:
 exclude:
   - "**/*.g.dart"
   - "**/*.freezed.dart"
```

`**/*.g.dart` は JsonSerializable で出力されるファイルです。
`**/*.freezed.dart` は freezed で出力されるファイルです。

## build.yaml を作成して JsonSerializable の json 解析設定をする

Freezed と併用して使用する JsonSerializable は json オブジェクトを解析して、json 要素をクラスの property に mapping してくれます。

ただ、そのままの設定だと例えば json 要素に `full_name` のキーがあったとすると、それに対応するクラスの property 名は `fullName` として、`@JsonKey(name: 'full_name')` アノテーションを付ける必要があります。

都度 `@JsonKey` を付けるのは面倒なので、自動でスネークケースの要素を キャメルケースの property に mapping して `@JsonKey` を省略する設定をします。

`build.yaml` のテンプレートとして以下の階層に `build.yaml.tmpl` を作成します。

```txt
{flutter-sdk-path}/flutter/packages/flutter_tools/templates/app/build.yaml.tmpl
```

`build.yaml.tmpl` に以下を追記します。

```yaml
targets:
  $default:
    builders:
      json_serializable:
        options:
          # Options configure how source code is generated for every
          # `@JsonSerializable`-annotated class in the package.
          #
          # The default value for each is listed.
          any_map: false
          checked: true
          create_factory: true
          create_to_json: true
          disallow_unrecognized_keys: false
          explicit_to_json: false
          field_rename: snake # none -> snake
          generic_argument_factories: false
          ignore_unannotated: false
          include_if_null: true
```

`field_rename: snake` 設定をすると自動でスネークケースの要素を キャメルケースの property に mapping してくれます。

## template_manifest.json にプロジェクト作成時にコピーするファイルを追記する

以下の場所に `template_manifest.json` があるので、新規で追加したテンプレートファイルを追記していきます。

```txt
{flutter-sdk-path}/flutter/packages/flutter_tools/templates/template_manifest.json
```

今回 `analysis_options.yaml.tmpl` `build.yaml.tmpl` を新規で作成しているのでファイルパスを追記します。

```
{
    "version": 1.0,
    "_comment": "A listing of all possible template output files.",
    "files": [
        "templates/app/analysis_options.yaml.tmpl",
        "templates/app/build.yaml.tmpl",
```

`template_manifest.json` にテンプレートファイルを追記するとプロジェクト新規作成にファイルをコピーしてくれます。

以上でプロジェクト新規作成時の Flutter テンプレート作成を完了です。

## プロジェクトを新規作成する

それでは Android Studio を開いて、 `Create New Flutter Project` > `Flutter Application` から新規プロジェクトを作成しましょう。

<img src='/images/posts/2021-02-04-3.png' class='img' alt='post image' />

このようにプロジェクトに今回新規で追加したテンプレートの `analysis_options.yaml` `build.yaml` が作成されています。

`pubspec.yaml` には今回追加した package が追記されています。

## 終わりに

他にも有用な設定は Flutter テンプレートをカスタマイズすれば自由に設定の自動化が可能です。

筆者はまだ Flutter 歴が浅いのでもっと有用な設定が他にもあると思います。

もし他にもこんな便利な設定があるよ、という方はぜひ [Twitter](https://twitter.com/zuma_lab) で DM していただくか [Contact](/contact) で連絡お願いします。

最後に今回カスタマイズしたテンプレートは github にあるので参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="kazuma-fujita/flutter-create-new-project-template-with-riverpod: Customization sample of flutter template." src="https://hatenablog-parts.com/embed?url=https://github.com/kazuma-fujita/flutter-create-new-project-template-with-riverpod" frameborder="0" scrolling="no"></iframe>

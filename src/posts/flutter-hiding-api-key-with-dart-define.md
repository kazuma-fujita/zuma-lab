---
title: 'Flutterのdart-defineを使ってAPIキーを隠蔽する'
date: '2021-04-05'
isPublished: true
metaDescription: 'Flutterのdart-defineを使ってAPIキーを隠蔽する方法です。'
tags:
  - 'Flutter'
  - 'Dart'
---

Google の API キーなどを秘匿情報をソースコードにハードコーディングして Github などに上げてしまうと、その API キーが悪用される恐れがあります。

本人が気づかないうちに API キーを悪用され膨大な利用料金が請求される可能性がある訳です。

API キーなどの秘匿情報は環境変数で設定してソースコードから値を取得するようにしましょう。

### 環境

- macOS Big Sur 11.2.3
- Android Studio 4.1.3
- Flutter 2.0.3
- Dart 2.12.2

## コマンドラインで環境変数を定義する

環境変数である dart-define は以下のフォーマットで設定します。

```txt
--dart-define=ENVIRONMENT_NAME=value
```

- 通常の開発時にコマンドラインのデバッグビルドで dart-define を定義する例

```txt
$ flutter run --debug --dart-define=GOOGLE_API_KEY=dummy_key
```

- Circle CI や Github Actions など CI 環境からリリースビルドで dart-define を定義する例

```txt
$ flutter run --release --dart-define=GOOGLE_API_KEY=dummy_key
```

dart-define で定義した環境変数は通常 Dart のソースコードからしか取得できません。

iOS ネイティブである Swift のソースコードや Android ネイティブの設定ファイルである AndroidManifest.xml で dart-define の値を利用するにはネイティブ側に環境変数を渡す必要があります。

以前その方法を記事にしてますので、dart-define の値をネイティブ側で使用したい方はこちらをご覧ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Flutterのdart-defineで設定した環境変数をソースコードやAndroidManifest.xmlで使用する | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/flutter-dart-define-environment" frameborder="0" scrolling="no"></iframe>

## Android Studio に環境変数を設定する

コマンドラインで環境変数を定義する方法の他、IDE で環境変数を設定することもできます。

開発時は IDE から Run や Debug を実行したい方はこれから紹介する方法で環境変数を設定してください。

Android Studio で `--dart-define` で環境変数を設定するには `Configurations` 画面から行います。

画面上部の `main.dart` をクリックするとプルダウンで `Edit Configurations...` が選択できます。

<img src='/images/posts/2021-03-29-1.png' class='img' alt='posted image' />

Configurations 画面を開いて `Additional run args` に `--dart-define` を入力します。

<img src='/images/posts/2021-03-29-2.png' class='img' alt='posted image' />

今回は `GOOGLE_API_KEY` という名前の環境変数を設定しました。

```txt
--dart-define=GOOGLE_API_KEY=dummy_key
```

ちなみに VSCode でも環境変数の設定が可能です。

詳しくは [こちら](https://qiita.com/mr-hisa-child/items/a7efc63044fa52bf3db6) の記事を参照ください。

## Dart のソースコードから環境変数の値を取得する

Dart のソースコードから環境変数の値を取得する場合は `String.fromEnvironment` で取得します。

bool の値は `bool.fromEnvironment` で取得します。

bool 値は以下のように設定できます。

```txt
--dart-define=BOOL_VALUE=true
```

取得フォーマットはこちらです。

```dart
String.fromEnvironment('STRING_VALUE');
bool.fromEnvironment('BOOL_VALUE');
```

環境変数を複数の箇所から利用する場合を想定して以下のように纏めて宣言しておくと使いやすいです。

```dart
class EnvironmentVariables {
  static const googleApiKey = String.fromEnvironment('GOOGLE_API_KEY');
  static const isDebugging = bool.fromEnvironment('IS_DEBUGGING');
}
```

プログラムからはこんな感じで呼び出せます。

```dart
　　 static const baseMapURL = 'https://maps.googleapis.com/maps/api/staticmap';
    final apiKey = 'key=${EnvironmentVariables.googleApiKey}';
                           :
                           :
                           :
    final imageUrl = '$baseMapURL?$mapCenter&$mapZoom&$mapMarkers&$mapSize&$apiKey';
```

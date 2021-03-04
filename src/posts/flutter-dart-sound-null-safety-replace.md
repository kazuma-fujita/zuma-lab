---
title: 'Flutter2のDart Null Safetyを既存のプロジェクトに導入する'
date: '2021-03-04'
isPublished: true
metaDescription: 'Flutter2のDart Null Safetyを既存のプロジェクトに対応させます。筆者は依存 package が Null Safety 対応していない場合を除き、Null Safety 対応は早めにしておくべきだと思っています。対応が遅れる程、移行するソースコードが増えてしまうし、そもそも Null Safety という仕組みの恩恵を得ないまま実装してしまうのは勿体ないです。'
tags:
  - 'Flutter'
  - 'Dart'
---

昨日(日本時間 2021/03/04 未明)に Flutter 2.0.0(以後 Flutter2)、Dart 2.12.0 のメジャーバージョンアップが発表されましたね。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Google Developers Blog: Announcing Flutter 2" src="https://hatenablog-parts.com/embed?url=https://developers.googleblog.com/2021/03/announcing-flutter-2.html" frameborder="0" scrolling="no"></iframe>

Flutter 2 で Flutter On Web、Desktop が Stable になったり、Dart の FFI が Stable になったりしましたが、個人的に一番嬉しかったのが Dart の Null Safety が Stable に昇格したことですね。

本記事は筆者の個人アプリに Dart の Null Safety を試しに導入してみたのでその記録です。

ここでは Null Safety 自体には詳しく触れません。

Dart の Null Safety については [ちゅーやんの記事](https://zenn.dev/chooyan/articles/9e96d8087cb4afc7a321) で詳しく説明されていますので参照ください。

### 環境

- macOS Big Sur 11.2.1
- Android Studio 4.1.2
- Flutter 2.0.0
- Dart 2.12.0

## Flutter2 に upgrade する

まず既存アプリに Dart の Null Safety を導入する為に Flutter2 に upgrade します。

Flutter SDK を install したディレクトリに移動して `flutter channel` コマンドを実行します。

```txt
$ flutter channel
Flutter channels:
  master
  dev
  beta
* stable
```

現在の flutter channel が stable であることを確認してください。

次に `flutter upgrade` コマンドを実行します。

```txt
flutter upgrade
```

Flutter が upgrade 完了までしばらく待ちます。

以下ログを出力されたら upgrade の完了です。

```
Flutter 2.0.0 • channel stable • https://github.com/flutter/flutter.git
Framework • revision 60bd88df91 (8 hours ago) • 2021-03-03 09:13:17 -0800
Engine • revision 40441def69
Tools • Dart 2.12.0

Running flutter doctor...
Doctor summary (to see all details, run flutter doctor -v):
[✓] Flutter (Channel stable, 2.0.0, on macOS 11.2.1 20D74 darwin-x64, locale ja-JP)
[✓] Android toolchain - develop for Android devices (Android SDK version 29.0.2)
[✓] Xcode - develop for iOS and macOS
[✓] Chrome - develop for the web
[✓] Android Studio (version 4.1)
[✓] VS Code (version 1.53.2)
[✓] Connected device (1 available)
```

Flutter が 2.0.0、Dart が 2.12.0 に upgrade されていますね。

## 導入している Package を Null Safety に対応させる

次に pubspec.yaml に追加している package を Null Safety に対応している version に upgrade します。

Flutter 公式に Null Safety 導入手順が解説されているのでそちらを元に進めていきます。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Migrating to null safety | Dart" src="https://hatenablog-parts.com/embed?url=https://dart.dev/null-safety/migration-guide#migration-tool" frameborder="0" scrolling="no"></iframe>

まず、導入 package が Null Safety に対応しているか確認する `dart pub outdated --mode=null-safety` コマンドを実行します。

```txt
dart pub outdated --mode=null-safety
```

実行結果はこちらです。

```
$ dart pub outdated --mode=null-safety
Showing dependencies that are currently not opted in to null-safety.
[✗] indicates versions without null safety support.
[✓] indicates versions opting in to null safety.

Package Name          Current    Upgradable         Resolvable            Latest

direct dependencies:
cached_network_image  ✗2.5.0     ✓3.0.0-nullsafety  ✓3.0.0-nullsafety     ✓3.0.0-nullsafety
cupertino_icons       ✗1.0.0     ✓1.0.2             ✓1.0.2                ✓1.0.2
fluttertoast          ✗7.1.8     ✗7.1.8             ✓8.0.1-nullsafety.0   ✓8.0.1-nullsafety.0
freezed_annotation    ✗0.12.0    ✗0.12.0            ✓0.13.0-nullsafety.0  ✓0.13.0-nullsafety.0
hooks_riverpod        ✗0.12.4    ✗0.12.4            ✓0.13.0-nullsafety.3  ✓0.13.0-nullsafety.3
like_button           ✗1.0.4     ✗1.0.4             ✗1.0.4                ✗1.0.4
page_view_indicators  ✗1.4.1     ✗1.4.1             ✓2.0.0-nullsafety.0   ✓2.0.0-nullsafety.0
state_notifier        ✗0.6.0     ✓0.7.0             ✓0.7.0                ✓0.7.0

dev_dependencies:
build_runner          ✗1.11.1    ✗1.11.5            ✗1.11.5               ✗1.11.5
freezed               ✗0.12.7    ✗0.12.7            ✓0.14.0-nullsafety.0  ✓0.14.0-nullsafety.0
json_serializable     ✗3.5.1     ✗3.5.1             ✗4.0.2                ✗4.0.2
mock_web_server       ✗4.1.1     ✗4.1.1             ✗4.1.1                ✗4.1.1
mockito               ✗4.1.4     ✗4.1.4             ✓5.0.0-nullsafety.7   ✓5.0.0
pedantic_mono         ✗1.10.0+4  ✓1.11.0+2          ✓1.11.0+2             ✓1.11.0+2

5 upgradable dependencies are locked (in pubspec.lock) to older versions.
To update these dependencies, use `dart pub upgrade`.

7  dependencies are constrained to versions that are older than a resolvable version.
To update these dependencies, edit pubspec.yaml, or run `dart pub upgrade --null-safety`.
```

ちょっと分かりづらいですが `Resolvable` の列が Null Safety 対応可能な Version です。

`✓` がついている package は Null Safety に対応しているのですが、 `✗` ついている package は非対応となります。

そうです、`✗` がついている場合、Null Safety に対応してないんです。

個人的に本日(2021/03/04)時点で `build_runner` `json_serializable` が対応していないのが辛いです・・

通常なら P.R.や issues を投げて package が Null Safety 対応されるまで待つか package を folk して Null Safety になるように自分で修正するかどちらかになると思います。

また、 `✓` がついていても、upgrade をして、package に破壊的変更がある場合ソースコードの修正が必要になります。

なのでここは慎重に Null Safety をプロジェクトに導入するか検討した方が良いと思います。

今回の記事はお試し導入なので `✗` がついている package がありますが進めます。

## package を upgrade する

`dart pub upgrade --null-safety` を実行して、null の安全性をサポートする最新バージョンにアップグレードします。

このコマンドは、pubspec.yaml ファイルを変更します。

```txt
dart pub upgrade --null-safety
```

実行してみると、以下のように先程確認した Null Safety に対応していない package がある為、upgrade が実行されませんでした。

```
$ dart pub upgrade --null-safety
null-safety compatible versions do not exist for:
 - like_button
 - mock_web_server
 - json_serializable
 - build_runner

You can choose to upgrade only some dependencies to null-safety using:
  dart pub upgrade --nullsafety state_notifier page_view_indicators hooks_riverpod freezed_annotation cupertino_icons mockito pedantic_mono cached_network_image fluttertoast freezed

Warning: Using null-safety features before upgrading all dependencies is
discouraged. For more details see: https://dart.dev/null-safety/migration-guide
```

一部の Null Safety 対応 package のみ upgrade することも可能なので、以下コマンドを実行します。

```txt
dart pub upgrade --nullsafety state_notifier page_view_indicators hooks_riverpod freezed_annotation cupertino_icons mockito pedantic_mono cached_network_image fluttertoast freezed
```

以下実行ログです。

```
Changed 66 dependencies!
15 packages have newer versions incompatible with dependency constraints.
Try `dart pub outdated` for more information.

Changed 10 constraints in pubspec.yaml:
  hooks_riverpod: any -> ^0.13.0-nullsafety.3
  state_notifier: any -> ^0.7.0
  freezed_annotation: any -> ^0.13.0-nullsafety.0
  fluttertoast: any -> ^8.0.1-nullsafety.0
  cached_network_image: any -> ^3.0.0-nullsafety
  page_view_indicators: any -> ^2.0.0-nullsafety.0
  cupertino_icons: ^1.0.0 -> ^1.0.2
  pedantic_mono: any -> ^1.11.0+2
  freezed: any -> ^0.14.0-nullsafety.0
  mockito: any -> ^5.0.0-nullsafety.7

Following direct 'dependencies' and 'dev_dependencies' are not migrated to
null-safety yet:
 - like_button
 - build_runner
 - json_serializable
 - mock_web_server

You may have to:
 * Upgrade git and path dependencies manually,
 * Upgrade to a newer SDK for newer SDK dependencies,
 * Remove dependency_overrides, and/or,
 * Find other packages to use.
```

pubspec.yaml を見てみましょう。

```yaml
dependencies:
  flutter:
    sdk: flutter
  hooks_riverpod: ^0.13.0-nullsafety.3
  state_notifier: ^0.7.0
  freezed_annotation: ^0.13.0-nullsafety.0
  fluttertoast: ^8.0.1-nullsafety.0
  cached_network_image: ^3.0.0-nullsafety
  page_view_indicators: ^2.0.0-nullsafety.0
  like_button:

  # The following adds the Cupertino Icons font to your application.
  # Use with the CupertinoIcons class for iOS style icons.
  cupertino_icons: ^1.0.2

dev_dependencies:
  flutter_test:
    sdk: flutter
  pedantic_mono: ^1.11.0+2
  build_runner:
  freezed: ^0.14.0-nullsafety.0
  json_serializable:
  mockito: ^5.0.0-nullsafety.7
  mock_web_server:
```

このように `dart pub upgrade --nullsafety` を実行すると upgrade した package の version が pubspec.yaml に記述されました。

## ソースコードを Null Safety に対応させる

ソースコードを Dart の Null Safety に対応するには以下の 2 つの方法があります。

- Flutter から出ている移行ツール(Migration Tool)を使用する
- 手動で Null Safety に対応する

ファイル数が少ないプロジェクトや、初期段階のプロジェクトは手動で Null Safety に対応させた方がいい場面があると思うので、自動と手動に分けて説明します。

また、自動 Migration ツールの欠点として意図しない修正が発生する場合があります。

その場合 Migration ツールと手動修正を併用する必要があります。

## 手動で Null Safety に対応する

まず手動で Null Safety に対応する方法です。

Dart Version を上げた後に Null Safety エラーになったソースコードを変更していきます。

### pubspec.yaml の sdk version を変更する

次に既存プロジェクトの pubspec.yaml に記載されている environment の sdk version を変更します。

筆者の場合、Dart 2.7.0 から 2.12.0 に upgrade したので以下のように修正しました。

- 修正前

```yaml
environment:
  sdk: '>=2.7.0 <3.0.0'
```

- 修正後

```yaml
environment:
  sdk: '>=2.12.0 <3.0.0'
```

また、`cupertino_icons` の version も 1.0.2 に上がっていたので修正しました。

```yaml
cupertino_icons: ^1.0.2
```

pubspec.yaml を修正したら忘れずに pub get を実行します。

```txt
flutter pub get
```

### Null Safety エラーを修正する

Dart の version を上げるとこのようにエラーが発生します。

<img src='/images/posts/2021-03-04-1.png' class='img' alt='posted image' />

自分の場合、クラスのコンストラクタで発生しているエラーが多かったです。

```dart
class ImageSlider extends StatefulWidget {
  const ImageSlider({this.imageCount});
  final int imageCount;
  @override
  _ImageSliderState createState() => _ImageSliderState();
}
```

例えば、上記のクラスのコンストラクタ `ImageSlider({this.imageCount})` で以下のエラーが発生します。

```txt
The parameter 'imageCount' can't have a value of 'null' because of its type, but the implicit default value is 'null'.  Try adding either an explicit non-'null' default value or the 'required' modifier.
```

`imageCount` パラメータは int で宣言している為、null が入る可能性があるコードはエラーとなります。

これが Null Safety です。

アプリ実行前のコンパイル時に null でエラーになる箇所を事前に教えてくれるので、アプリ実行中に null で落ちる可能性が格段に下がります。

このケースの Null Safety エラーを修正するには以下 3 つの方法があります。

### エラー修正方法 1 デフォルト値を設定する

`imageCount` は int 型なので null を許容しません。なので必ず値が入るようにデフォルト値を設定してあげます。

```dart
class ImageSlider extends StatefulWidget {
  const ImageSlider({this.imageCount = 0});
  final int imageCount;
  @override
  _ImageSliderState createState() => _ImageSliderState();
}
```

### エラー修正方法 2 required キーワードを設定する

以下のようにクラスのコンストラクタに `required` キーワードをつけて int 型の値が入ることを強制します。

```dart
class ImageSlider extends StatefulWidget {
  const ImageSlider({required this.imageCount});
  final int imageCount;
  @override
  _ImageSliderState createState() => _ImageSliderState();
}
```

required キーワードが付いているので使用する側で `ImageSlider()` でコンストラクタの値を省略したり、 `ImageSlider(imageCount: null)` で null を設定するとエラーにしてくれます。

### エラー修正方法 3 Optional 型でラップをする

`imageCount` に以下のように `int?` で int 型を Optional 型でラップをしてあげます。

```dart
class ImageSlider extends StatefulWidget {
  const ImageSlider({this.imageCount});
  final int? imageCount;
  @override
  _ImageSliderState createState() => _ImageSliderState();
}
```

この場合コンストラクタで `ImageSlider(imageCount: null)` のように null を渡すことが可能です。

逆に言うと imageCount は null が入る可能性があるので、使用する場合は必ずは Unwrapping や null チェックをします。

## 自動で Null Safety に対応する

次に自動で Null Safety に対応させる方法です。

エラー発生箇所が少ない場合は、今まで上げた修正方法で一つづつ修正すれば良いですが、ファイル数が多いと結構大変です。

そこで Flutter 公式の migration ツールがあるので、一括でエラーを修正してみます。

### dart migrate を実行する

`dart migrate` コマンドを実行してソースコードの移行ツールを起動します。

```txt
 dart migrate
```

実行結果です。

ここで Null Safety に対応していない package があると以下のように `package has unmigrated dependencies.` エラーとなります。

```
$ dart migrate
Migrating /Users/kazuma/Documents/github/flutter/flutter_clinc_card

See https://dart.dev/go/null-safety-migration for a migration guide.

Analyzing project...
[------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------]Bad state: Error: package has unmigrated dependencies.

Before migrating your package, we recommend ensuring that every library it
imports (either directly or indirectly) has been migrated to null safety, so
that you will be able to run your unit tests in sound null checking mode.  You
are currently importing the following non-null-safe libraries:

  package:like_button/like_button.dart
  package:like_button/src/like_button.dart
  package:like_button/src/painter/bubbles_painter.dart
  package:like_button/src/painter/circle_painter.dart
  package:like_button/src/utils/like_button_model.dart
  package:like_button/src/utils/like_button_typedef.dart
  package:like_button/src/utils/like_button_util.dart

Please upgrade the packages containing these libraries to null safe versions
before continuing.  To see what null safe package versions are available, run
the following command: `dart pub outdated --mode=null-safety`.

To skip this check and try to migrate anyway, re-run with the flag
`--skip-import-check`.
```

依存 package の Null Safety 対応状況を調べるには先に述べた `dart pub outdated --mode=null-safety` を実行します。

以下コマンドで強制的に migration ツールを起動することも可能です。

```txt
dart migrate --skip-import-check
```

これはお試しならいいのですが、通常なら P.R.や issues を投げて package が Null Safety 対応されるまで待つか package を folk して Null Safety になるように自分で修正するかどちらかになると思います。

こちらは正常に `dart migrate` が完了した場合の実行ログです。

```
$ dart migrate
Migrating /Users/kazuma/Documents/github/flutter/flutter_clinc_card

See https://dart.dev/go/null-safety-migration for a migration guide.

Analyzing project...
[------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------]Warning: package has unmigrated dependencies.

Continuing due to the presence of `--skip-import-check`.  To see a complete
list of the unmigrated dependencies, re-run without the `--skip-import-check`
flag.

No analysis issues found.

Generating migration suggestions...
[------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------]

Compiling instrumentation information...
[------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------]

View the migration suggestions by visiting:

  http://127.0.0.1:49849/your/project/flutter_project_name?authToken=XXXXXXXXXXXXX

Use this interactive web view to review, improve, or apply the results.
When finished with the preview, hit ctrl-c to terminate this process.

If you make edits outside of the web view (in your IDE), use the 'Rerun from
sources' action.
```

`dart migrate` の実行が完了すると以下 URL にアクセスできるようになります。

```txt
http://127.0.0.1:49849/your/project/flutter_project_name?authToken=XXXXXXXXXXXXX
```

アクセスするとこのように migration のコンソール画面が開きます。

<img src='/images/posts/2021-03-04-2.png' class='img' alt='posted image' />

Null Safety エラーになっているファイル名の横にバッジでエラー数が表示されています。

該当ファイルを開くとハイライトで修正後の内容を表示してくれます。

<img src='/images/posts/2021-03-04-3.png' class='img' alt='posted image' />

このケースの場合、修正内容が `Changed type 'int' to be nullable` となっていて int 型を Optional 型にラッピングする内容になっています。

修正内容に問題がある場合、手動でソースコードを修正して、 `RERUN FROM SOURCES` ボタンを押してソースコードを再読み込みします。

最終的に問題無ければ左ペインの Source Tree を見てエラーを修正するファイル名を選択します。

`APPLY MIGRATION` ボタンを押して migration を実行します。

以下実行結果です。

```
Applying migration suggestions to disk...
Migrated 5 files:
    lib/nested_list_screen.dart
    lib/image_slider.dart
    lib/upsert_clinic_card.dart
    pubspec.yaml
    .dart_tool/package_config.json
Opted 2 files out of null safety with a new Dart language version comment:
    lib/main.dart
    test/widget_test.dart
```

migration 後はコンソールの修正内容の通りコードが修正されています。

```dart
@immutable
class ClinicCardArguments {
  const ClinicCardArguments({this.verticalIndex, this.horizontalIndex});
  final int? verticalIndex;
  final int? horizontalIndex;
}
```

pubspec.yaml は自動で Dart 2.12.0 に version を上げてくれています。

```
environment:
  sdk: '>=2.12.0 <3.0.0'
```

ファイルの修正数が多い場合は migration ツールを使うと簡単に Null Safety への移行ができそうですね。

## おわりに

筆者は Flutter 初学者ですが、Swift/Kotlin で Null Safety についてある程度知っていたので今回移行に挑戦してみました。

筆者は依存 package が Null Safety 対応していない場合を除き、Null Safety 対応は早めにしておくべきだと思っています。

対応が遅れる程、移行するソースコードが増えてしまうし、そもそも Null Safety という仕組みの恩恵を得ないまま実装してしまうのは勿体ないです。

アプリを安全に動かす為にも Null Safety 対応していきましょう！

最後に、今回 Flutter2 で様々にアップデートがありました。

早速 Takeshi Tsukamoto さんがブログでアップデート内容をまとめてくれていますので載せておきます。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Flutter2.0で新しくなったこと" src="https://hatenablog-parts.com/embed?url=https://itome.team/blog/2021/03/flutter-v2/" frameborder="0" scrolling="no"></iframe>

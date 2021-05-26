---
title: 'Flutterのbuild_runnerでGetter not found errorが発生した場合のトラブルシューティング'
date: '2021-05-26'
isPublished: true
metaDescription: 'Flutterのbuild_runnerでGetter not found errorが発生した場合のトラブルシューティング'
tags:
  - 'Flutter'
  - 'Dart'
  - 'BuildRunner'
---

先日 Flutter2.2.0 が公開されましたね。

筆者も早速 flutter upgrade をして Freezed のコード生成をしようとして build_runner を実行しました。

すると build_runner 実行時に Getter not found error が発生したので、解決までのトラブルシューティングを残します。

今回エラーに遭遇した build_runner の version は 2021/05/24 時点での最新 version で 2.0.4 です。

### 環境

Flutter/Dart の version は以下になります。

- macOS Big Sur 11.3.1
- Android Studio 4.2.1
- Flutter 2.2.0
- Dart 2.13.0

## build_runner 実行エラー発生

Freezed のコードは以下になります。

```dart
import 'package:flutter/foundation.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

part 'entity.freezed.dart';
part 'entity.g.dart';

@freezed
class Entity with _$Entity {
  factory Entity({
    required int id,
    required String title,
    String? description,
  }) = _Entity;

  factory Entity.fromJson(Map<String, Object> json) => _$EntityFromJson(json);
}
```

Freezed のコード生成をする為、`flutter pub run build_runner build` を実行した所以下のエラーが発生しました。

```
$ flutter pub run build_runner build
Failed to precompile build_runner:build_runner:
../flutter-sdk/flutter/.pub-cache/hosted/pub.dartlang.org/analyzer-1.6.0/lib/src/error/best_practices_verifier.dart:1600:40: Error: Getter not found: 'topLevelVariable'.
      return kinds.contains(TargetKind.topLevelVariable);
                                       ^^^^^^^^^^^^^^^^
../flutter-sdk/flutter/.pub-cache/hosted/pub.dartlang.org/analyzer-1.6.0/lib/src/error/best_practices_verifier.dart:2024:23: Error: Getter not found: 'topLevelVariable'.
      case TargetKind.topLevelVariable:
                      ^^^^^^^^^^^^^^^^
../flutter-sdk/flutter/.pub-cache/hosted/pub.dartlang.org/analyzer-1.6.0/lib/src/error/best_practices_verifier.dart:2024:23: Error: Type 'dynamic' of the case expression is not a subtype of type 'TargetKind' of this switch expression.
 - 'TargetKind' is from 'package:meta/meta_meta.dart' ('../flutter-sdk/flutter/.pub-cache/hosted/pub.dartlang.org/meta-1.3.0/lib/meta_meta.dart').
      case TargetKind.topLevelVariable:
                      ^
../flutter-sdk/flutter/.pub-cache/hosted/pub.dartlang.org/analyzer-1.6.0/lib/src/error/best_practices_verifier.dart:2001:13: Context: The switch expression is here.
    switch (this) {
            ^
pub finished with exit code 1
```

## 解決方法

原因は Dart2.13.0 で利用される Analyzer の最新 version である 1.6.0 と build_runner2.0.4 を併用すると起きるバグで、以下 issues が上がっていました。

Analyzer 1.6.0 on Dart 2.13.0 fail to precompile: Getter not found: 'topLevelVariable'. Type 'dynamic' of the case expression is not a subtype of type 'TargetKind' of this switch expression.

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Analyzer 1.6.0 on Dart 2.13.0 fail to precompile: Getter not found: 'topLevelVariable'. Type 'dynamic' of the case expression is not a subtype of type 'TargetKind' of this switch expression. · Issue #46142 · dart-lang/sdk" src="https://hatenablog-parts.com/embed?url=https://github.com/dart-lang/sdk/issues/46142" frameborder="0" scrolling="no"></iframe>

analyzer を 1.5.0 に downgrade すると動作するとコメントがあります。

Same, started happening after upgrading to build_runner 2.0.4 and analyzer 1.6.0
Forcing to use analyzer 1.5.0 seems to work.

pubspec.yaml の dev_dependencies に `analyzer: 1.5.0` を追記して `flutter pub get` を実行します。

```yaml
dev_dependencies:
  analyzer: 1.5.0
  build_runner:
  flutter_test:
    sdk: flutter
  freezed:
  json_serializable:
```

再度実行 `flutter pub run build_runner build` を実行します。

```
[INFO] Generating build script...
[INFO] Generating build script completed, took 423ms

[INFO] Initializing inputs
[INFO] Reading cached asset graph...
[INFO] Reading cached asset graph completed, took 50ms

[INFO] Checking for updates since last build...
[INFO] Checking for updates since last build completed, took 452ms

[INFO] Running build...
[INFO] 2.0s elapsed, 0/1 actions completed.
[INFO] Running build completed, took 2.6s

[INFO] Caching finalized dependency graph...
[INFO] Caching finalized dependency graph completed, took 30ms

[INFO] Succeeded after 2.7s with 3 outputs (5 actions)
```

build_runner 実行が成功し、Freezed のコードが生成されました。

analyzer を downgrade しているので、暫定対応ですがひとまずこちらでエラー自体は解消できます。

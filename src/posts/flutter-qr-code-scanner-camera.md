---
title: 'Flutterのqr_code_scannerでQRコード読み込みをする'
date: '2021-03-11'
isPublished: false
metaDescription: 'qr_code_scanner'
tags:
  - 'Flutter'
  - 'Dart'
---

今回は Flutter の qr_code_scanner で QR コード読み込みをしてみたいと思います。

調べると QR コード読み込みをする package は qr_code_scanner か barcode_scan が pub.dev の Like 数が多かったです。

- qr_code_scanner

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="qr_code_scanner | Flutter Package" src="https://hatenablog-parts.com/embed?url=https://pub.dev/packages/qr_code_scanner" frameborder="0" scrolling="no"></iframe>

- barcode_scan

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="barcode_scan | Flutter Package" src="https://hatenablog-parts.com/embed?url=https://pub.dev/packages/barcode_scan" frameborder="0" scrolling="no"></iframe>

barcode_scan の方が日本語記事が多く、qr_code_scanner についての記事が少なかったので今回記事にしました。

また、qr_code_scanner は 2021/03/10 現在、Prerelease version 0.4.0-nullsafety.0 で Flutter2(Dart 2.12.0)の Null Safety に対応しています。

barcode_scan は Published May 8, 2020 で更新が止まっています。

Flutter2 で Null Safety を導入している筆者は qr_code_scanner 一択でした。

というわけで実装をしていきます。

### 環境

- macOS Big Sur 11.2.1
- Android Studio 4.1.2
- Flutter 2.0.0
- Dart 2.12.0

### qr_code_scanner の利用条件を確認する

まず必須条件として、Android SDK 21 以降、iOS8 以降となっています。

```txt
Requires at least SDK 21 (Android 5.0). Requires at least iOS 8.
```

ほとんどの場合問題にならないと思いますが、引っかかる場合は利用の検討が必要です。

## qr_code_scanner を install する

pubspec.yaml に以下追記します。

```yaml
dependencies:
  flutter:
    sdk: flutter
  qr_code_scanner: // added
```

追記後は忘れずに `flutter pub get` を実行しましょう。

## Android build.gradle の minSdkVersion を上げる

プロジェクトの `android/app/` 配下にある build.gradle ファイルの `minSdkVersion` を修正します。

筆者の場合、 `minSdkVersion` が 16 だった為、qr_code_scanner の必須条件である 21 に変更しました。

- `android/app/build.gradle`

```gradle
    defaultConfig {
        // TODO: Specify your own unique Application ID (https://developer.android.com/studio/build/application-id.html).
        applicationId "com.example.flutter_qr_code_scanner"
        minSdkVersion 21 // 16 -> 21
        targetSdkVersion 30
        versionCode flutterVersionCode.toInteger()
        versionName flutterVersionName
    }
```

minSdkVersion が低いまま qr_code_scanner を Android の実機、エミュレーターで実行すると以下のエラーが発生します。

```
Launching lib/main.dart on Android SDK built for x86 in debug mode...
Running Gradle task 'assembleDebug'...
/Users/kazuma/Documents/github/flutter/flutter_qr_code_scanner/android/app/src/debug/AndroidManifest.xml Error:
	uses-sdk:minSdkVersion 16 cannot be smaller than version 20 declared in library [:qr_code_scanner] /Users/kazuma/Documents/github/flutter/flutter_qr_code_scanner/build/qr_code_scanner/intermediates/library_manifest/debug/AndroidManifest.xml as the library might be using APIs not available in 16
	Suggestion: use a compatible library with a minSdk of at most 16,
		or increase this project's minSdk version to at least 20,
		or use tools:overrideLibrary="net.touchcapture.qr.flutterqr" to force usage (may lead to runtime failures)

FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task ':app:processDebugMainManifest'.
> Manifest merger failed : uses-sdk:minSdkVersion 16 cannot be smaller than version 20 declared in library [:qr_code_scanner] /Users/kazuma/Documents/github/flutter/flutter_qr_code_scanner/build/qr_code_scanner/intermediates/library_manifest/debug/AndroidManifest.xml as the library might be using APIs not available in 16
  	Suggestion: use a compatible library with a minSdk of at most 16,
  		or increase this project's minSdk version to at least 20,
  		or use tools:overrideLibrary="net.touchcapture.qr.flutterqr" to force usage (may lead to runtime failures)

* Try:
Run with --stacktrace option to get the stack trace. Run with --info or --debug option to get more log output. Run with --scan to get full insights.

* Get more help at https://help.gradle.org

BUILD FAILED in 8s
Exception: Gradle task assembleDebug failed with exit code 1
```

## iOS Info.plist に Key を追加する

プロジェクトの `ios/Runner/` 配下にある iOS の Info.plist を開いて `<dict>` タグ内に以下を追記します。

- `ios/Runner/Info.plist`

```plist
	<key>io.flutter.embedded_views_preview</key>
  <true/>
  <key>NSCameraUsageDescription</key>
  <string>This app needs camera access to scan QR codes</string>
```

これはカメラのパーミッション設定で、`<string>` タグ内の文言がパーミッション許可ダイアログに表示されます。

## Podfile の platform: ios,'9.0' をコメントインする

プロジェクトの `ios/` 配下にある `Podfile` を開いて、コメントアウトされている `platform: ios,'9.0'` をコメントインします。

- `ios/Podfile`

```Podfile
# Uncomment this line to define a global platform for your project
platform :ios, '9.0' # Comment in.

# CocoaPods analytics sends network stats synchronously affecting flutter build latency.
ENV['COCOAPODS_DISABLE_STATS'] = 'true'
```

## QR コード読み取り機能を実装する

## おわりに

2021/03/04 に Flutter 2.0.0、Dart 2.12.0 のメジャーバージョンアップが発表されましたね。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Google Developers Blog: Announcing Flutter 2" src="https://hatenablog-parts.com/embed?url=https://developers.googleblog.com/2021/03/announcing-flutter-2.html" frameborder="0" scrolling="no"></iframe>

Flutter 2 で Flutter On Web、Desktop が Stable になったり、Dart の FFI が Stable になったりしましたが、個人的に一番嬉しかったのが Dart の Null Safety が Stable に昇格したことですね。

筆者の個人アプリに Flutter2 と Dart の Null Safety を導入してみたので、ぜひこちらの記事を参考にして Flutter2 と Null Safety を導入してみてください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Flutter2のDart Null Safetyを既存のプロジェクトに導入する | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/flutter-dart-sound-null-safety-replace" frameborder="0" scrolling="no"></iframe>

---
title: 'Flutterのdart-defineで設定した環境変数をSwiftのソースコードやAndroidManifest.xmlで使用する'
date: '2021-03-30'
isPublished: true
metaDescription: 'Flutterの--dart-defineで環境変数を設定してSwiftのソースコードや AndroidManifest.xml で環境変数の値を使用する方法です。'
tags:
  - 'Flutter'
  - 'Dart'
---

Flutter の--dart-define で環境変数を設定して iOS ネイティブである Swift のソースコードや Android のネイティブ設定である AndroidManifest.xml で環境変数を使用する方法です。

Google の API キーなどを秘匿情報をソースコードにハードコーディングして Github などに上げてしまうと、その API キーが悪用される恐れがあります。

本人が気づかないうちに API キーを悪用され膨大な利用料金が請求される可能性がある訳です。

API キーなどの秘匿情報は環境変数で設定してソースコードから値を取得するようにしましょう。

前提として、macOS、IDE は Android Studio を利用します。

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

開発時は Android Studio で Run や Debug を実行する方は Android Studio の Configurations に `--dart-define` を設定できます。

Android Studio の環境変数設定方法こちらの記事で紹介してますので参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Flutterのdart-defineを使ってAPIキーを隠蔽する | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/flutter-hiding-api-key-with-dart-define" frameborder="0" scrolling="no"></iframe>

## AndroidManifest.xml から環境変数の値を取得する

次は AndroidManifest.xml から環境変数の値を取得する方法です。

dart のソースコードから環境変数の値を取得するには `flutter run` の引数や、Android Studio の Configurations に `--dart-define` を設定しました。

AndroidManifest.xml は Android ネイティブ固有の設定ファイルなので、`--dart-define` は利用できません。

`--dart-define` はあくまで Dart のソースコードで取得できる環境変数です。

私が知る限りの対応としては 3 つあります。

- `flutter run or build` コマンドに環境変数を渡す
- `launchctl` コマンドで環境変数を設定する
- Android/iOS ビルド時に `--dart-define` の環境変数を渡す

前者 2 つはライトに利用できます。

ただそれぞれ欠点があり、`flutter run or build` コマンドに環境変数を渡す方法は Android Studio の IDE に環境変数が渡せず、 Run や Debug の実行時には利用できませんでした。

VSCode では launch.json で環境変数を IDE に渡す設定できるようです。

`launchctl` の方法は IDE に環境変数を渡すことができますが、 iOS で環境変数が取得する事ができませんでした。

筆者が試した限り、Android Studio 上で Run や Debug を利用したいかつ、iOS でも共通の環境変数を利用する場合は後者の `--dart-define` を Android/iOS のネイティブ側に渡す必要がありそうです。

まずは各方法を見ていきます。

## flutter run/build コマンドに環境変数を渡す

flutter run or build コマンド実行時に環境変数を渡す方法です。

やり方は以下の 2 通りあります。

```txt
export GOOGLE_API_KEY=dummy_key
flutter run
```

```txt
GOOGLE_API_KEY=dummy_key flutter run
```

## launchctl コマンドで環境変数を設定する

launchctl コマンドを利用する方法です。

以下のコマンドで `GOOGLE_API_KEY` 環境変数をセットします。

```txt
launchctl setenv GOOGLE_API_KEY dummy_key
```

`launchctl getenv` で設定した値が表示されれば成功です。

```txt
launchctl getenv GOOGLE_API_KEY
```

## Android のビルド時に `--dart-define` 環境変数を渡す

Android ビルド時に環境変数を渡す方法です。

まず　`android/app/build.gradle` に以下のスクリプトを追記します。

```java
apply plugin: 'com.android.application'
apply plugin: 'kotlin-android'
apply from: "$flutterRoot/packages/flutter_tools/gradle/flutter.gradle"
                    :
                    :
// ----------------------- Add start ------------------------//
// 環境変数を格納する配列
def dartEnvironmentVariables = [
        GOOGLE_API_KEY: ''
]
// --dart-defineの読み込み
dartEnvironmentVariables =
        dartEnvironmentVariables + project.property('dart-defines')
            .split(',')
            .collectEntries { entry ->
                def pair = URLDecoder.decode(entry, 'UTF-8').split('=' as char)
                [(pair.first()): pair.last()]
            }
// ----------------------- Add end ------------------------//
                    :
                    :
android {
    compileSdkVersion 30

    sourceSets {
        main.java.srcDirs += 'src/main/kotlin'
    }
```

これは build.gradle で Android のビルド時に `--dart-define` の環境変数を取得、パースし配列に格納するスクリプトです。

## android/app/build.gradle で環境変数からビルド変数を定義する

次に AndroidManifest.xml から環境変数の値を呼び出せるように build.gradle に環境変数の値を読み込む設定をします。

`android/app/build.gradle` ファイルを開いて、defaultConfig に manifestPlaceholders を追記します。

ここでは以下 3 つの環境変数設定方法のうち、前者 2 つは `System.getenv` を使用して環境変数を取得します。

- `flutter run or build` コマンドに環境変数を渡す
- `launchctl` コマンドで環境変数を設定する
- Android ビルド時に `--dart-define` の環境変数を渡す

最後の Android ビルド時に `--dart-define` の環境変数を渡す方法は先程設定した `dartEnvironmentVariables` 配列から環境変数を取得します。

manifestPlaceholders を利用して、環境変数から取得した値を任意のビルド変数で定義して AndroidManifest.xml から取得できるようにします。

ビルド変数名と環境変数名は同じになっていますが、異なっていても問題ないです。

```kt
manifestPlaceholders = [GOOGLE_API_KEY: System.getenv("GOOGLE_API_KEY")]
```

記述する箇所は以下です。

```java
android {
    compileSdkVersion 30

    sourceSets {
        main.java.srcDirs += 'src/main/kotlin'
    }

    defaultConfig {
        // TODO: Specify your own unique Application ID (https://developer.android.com/studio/build/application-id.html).
        applicationId "com.example.flutter_google_maps"
                              :
                              :
                              :
        // 以下のケースでは System.getenv を使う
        // - `flutter run or build` コマンドに環境変数を渡す
        // - `launchctl` コマンドで環境変数を設定する
        manifestPlaceholders = [GOOGLE_API_KEY: System.getenv("GOOGLE_API_KEY")] // added
        // Android ビルド時に `--dart-define` の環境変数を渡すケースでは dartEnvironmentVariablesを利用する
        manifestPlaceholders = [GOOGLE_API_KEY: dartEnvironmentVariables.GOOGLE_API_KEY] // added
    }

    buildTypes {
        release {
              :
              :
              :
        }
    }
}
```

## AndroidManifest.xml でビルド変数を取得する

最後に AndroidManifest.xml に build.gradle に定義したビルド変数を取得します。

`android/app/src/main/AndroidManifest.xml` を開いてビルド変数を使用する箇所で `"${GOOGLE_API_KEY}"` を追記します。

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.flutter_google_maps">
    <!-- To request foreground location access, declare one of these permissions. -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <application
        android:label="flutter_google_maps"
        android:icon="@mipmap/ic_launcher">
        <meta-data
            android:name="com.google.android.geo.API_KEY"
            android:value="${GOOGLE_API_KEY}"/> <!-- ${ビルド変数名}でビルド変数の値を取得 -->
```

## iOS のソースコードから環境変数の値を取得する

iOS のソースコードから環境変数の値を取得する方法です。

`--dart-define` で設定した環境変数は Dart のソースコードでは使用できますが、そのままでは iOS の Swift で書かれたソースコードで利用できません。

なので iOS のビルド時に `--dart-define` 環境変数を Xcode に設定する必要があります。

## iOS ビルド時に環境設定ファイルを出力する

まず Xcode を開きます。

プロジェクトのルートで以下コマンドを実行してください。

```txt
open ios/Runner.xcworkspace
```

今回 iOS ビルド時に環境設定ファイルを出力するスクリプトを実行します。

<img src='/images/posts/2021-03-29-2.png' class='img' alt='posted image' />

Xcode を開いたら Runner > Edit Scheme... をクリックします。

<img src='/images/posts/2021-03-29-3.png' class='img' alt='posted image' />

Build > Pre-actions をクリックします。

ウィンドウ左下の+ボタンをクリックしてプルダウンの中から New Run Script Action を選択します。

<img src='/images/posts/2021-03-29-4.png' class='img' alt='posted image' />

まず Provide build settings from のプルダウンから Runner を選択します。

次に以下のスクリプトを追記します。

```sh
function urldecode() {
    : "${*//+/ }";
    echo "${_//%/\\x}";
}

IFS=',' read -r -a define_items <<< "$DART_DEFINES"


for index in "${!define_items[@]}"
do
    define_items[$index]=$(urldecode "${define_items[$index]}");
done

printf "%s\n" "${define_items[@]}" > ${SRCROOT}/Flutter/EnvironmentVariables.xcconfig
```

これは iOS の build 時に `--dart-define` 環境変数を取得し、環境設定ファイルである `ios/Flutter/EnvironmentVariables.xcconfig` を自動生成するスクリプトです。

スクリプトを記述したらウィンドウを閉じて Android Studio からビルドしてみましょう。

Android Studio には以下の `--dart-define` を定義しましたね。

```txt
--dart-define=GOOGLE_API_KEY=dummy_key
```

`ios/Flutter` ディレクトリを Finder で開いてみると `EnvironmentVariables.xcconfig` というファイルが生成されています。

中身を確認してみると以下環境変数が記述されています。

```txt
GOOGLE_API_KEY=dummy_key
flutter.inspector.structuredErrors=true
```

## 生成した環境設定ファイルを Xcode で利用できるようにする

`ios/Flutter` ディレクトリにある `Debug.xcconfig` を開きます。

以下 1 行を追記します。

```
#include "EnvironmentVariables.xcconfig"
```

また、同じく `ios/Flutter` ディレクトリにある `Release.xcconfig` を開いて同様 1 行追記します。

追記後のファイルは以下のようになります。

- `ios/Flutter/Debug.xcconfig`

```
#include? "Pods/Target Support Files/Pods-Runner/Pods-Runner.debug.xcconfig"
#include "Generated.xcconfig"
#include "EnvironmentVariables.xcconfig"
```

- `ios/Flutter/Release.xcconfig`

```
#include? "Pods/Target Support Files/Pods-Runner/Pods-Runner.release.xcconfig"
#include "Generated.xcconfig"
#include "EnvironmentVariables.xcconfig"
```

これで `#include` で EnvironmentVariables.xcconfig を読み込んで Xcode から環境変数が利用できるようになりました。

## .gitignore に EnvironmentVariables.xcconfig を追記する

`ios/.gitignore` ファイルを開いて以下の１行を追記します。

```txt
Flutter/EnvironmentVariables.xcconfig
```

EnvironmentVariables.xcconfig を git に上げると人により環境変数が違う場合がある為チーム開発に支障がでます。

また、API Key など秘匿情報が含まれる可能性があるので ignore しておきます。

## Info.plist に環境変数をビルド変数として定義する

まだ iOS のソースコードでは利用できません。

最後に Info.plist に先程、`Debug.xcconfig` `Release.xcconfig` で読み込んだ環境変数をビルド変数として定義する必要があります。

`ios/Runner/Info.plist` を開いて Information Property List の +ボタンをクリックします。

入力項目が表示されますので、 Key に `GOOGLE_API_KEY` Value に `$(GOOGLE_API_KEY)` と入力します。

<img src='/images/posts/2021-03-29-5.png' class='img' alt='posted image' />

## iOS のソースコードから環境変数の値を取得する

環境変数を取得するには `Bundle.main.object` メソッドを利用します。

```swift
Bundle.main.object(forInfoDictionaryKey: "GOOGLE_API_KEY") as! String
```

例えば、iOS で GoogleMap を表示する時は API キーを `ios/Runner/AppDelegate.swift` に設定します。

その場合は以下のように `GMSServices.provideAPIKey` メソッドに取得したビルド変数を設定します。

```swift
import UIKit
import Flutter
import GoogleMaps

@UIApplicationMain
@objc class AppDelegate: FlutterAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    let googleApiKey = Bundle.main.object(forInfoDictionaryKey: "GOOGLE_API_KEY") as! String
    GMSServices.provideAPIKey(googleApiKey)
    GeneratedPluginRegistrant.register(with: self)
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
}
```

これで iOS でも `--dart-define` 環境変数が利用できました。

## おわりに

ここで設定した環境変数は秘匿情報を隠蔽する目的の他、開発環境、ステージング環境、本番環境で環境を分けた場合の環境別に環境変数を利用したい時などにも利用します。

詳しくはこちらの記事を参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="FlutterでiOSの開発/ステージング/本番環境を切り替える | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/flutter-develop-staging-production-ios-environment" frameborder="0" scrolling="no"></iframe>

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="FlutterでAndroidの開発/ステージング/本番環境を切り替える | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/flutter-develop-staging-production-android-environment" frameborder="0" scrolling="no"></iframe>

最後に今回環境変数を設定したサンプルは Github にありますので参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="kazuma-fujita/flutter_google_maps: Practice google maps app with google_maps_flutter and geolocator." src="https://hatenablog-parts.com/embed?url=https://github.com/kazuma-fujita/flutter_google_maps" frameborder="0" scrolling="no"></iframe>

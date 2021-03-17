---
title: 'Flutterで位置情報を取得して現在地をGoogle Mapsに表示する'
date: '2021-03-XX'
isPublished: false
metaDescription: ''
tags:
  - 'Flutter'
  - 'Dart'
---

Flutter で位置情報を取得して現在地を Google Map に表示するアプリを作ります。

Google Map 表示部分は Flutter 公式の google_maps_flutter package を利用します。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="google_maps_flutter | Flutter Package" src="https://hatenablog-parts.com/embed?url=https://pub.dev/packages/google_maps_flutter" frameborder="0" scrolling="no"></iframe>

### 環境

- macOS Big Sur 11.2.1
- Android Studio 4.1.2
- Flutter 2.0.0
- Dart 2.12.0

## Maps SDK for iOS/Android API を有効にする

まず Google Cloud Platform (以後 GCP)の Google Maps Platform にアクセスします。

URL は [https://cloud.google.com/maps-platform/](https://cloud.google.com/maps-platform/) になります。

プロジェクトがない場合は、事前にプロジェクトの作成を行ってください。

<img src='/images/posts/2021-03-18-1.png' class='img' alt='posted image'/>

GCP の左上メニューから API とサービス > ライブラリから API ライブラリ画面を開き、キーワード検索で map を入力します。

Maps SDK for iOS、Maps SDK for Android が検索結果に表示されます。

<img src='/images/posts/2021-03-18-2.png' class='img' alt='posted image'/>

Maps SDK for iOS/Android API をそれぞれ有効にします。

<img src='/images/posts/2021-03-18-3.png' class='img' alt='posted image'/>

有効にした API は GCP の左上メニュー > Google Maps Platform > API 画面から確認できます。

<img src='/images/posts/2021-03-18-4.png' class='img' alt='posted image'/>

## API Key を発行する

次に API キーを発行します。

先程の GCP コンソールの左上メニューの API とサービス > 認証情報から認証情報画面を開きます。

認証情報を作成ボタンのプルダウンから API キーを選択します。

<img src='/images/posts/2021-03-18-5.png' class='img' alt='posted image'/>

API キーを作成したら API キーに分かりやすい名前をつけます。今回は `API key debug` と名前をつけました。

<img src='/images/posts/2021-03-18-6.png' class='img' alt='posted image'/>

通常本番環境で API キーを運用する場合はキー制限をつけますが、今回は検証用なのでこのまま進めます。

## package を install する

pubspec.yaml の dependencies に google_maps_flutter を追記します。

- pubspec.yaml

```yaml
environment:
  sdk: '>=2.12.0 <3.0.0'

dependencies:
  flutter:
    sdk: flutter
  google_maps_flutter:
```

追記したら忘れずに `flutter pub get` を実行しましょう。

## API Key を AndroidManifest.xml に追記する

`android/app/src/main/AndroidManifest.xml` に API KEY を追加します。

application 配下に meta-data を追加します。

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.flutter_google_maps">
   <application
        android:label="flutter_google_maps"
        android:icon="@mipmap/ic_launcher">
       <meta-data
           android:name="com.google.android.geo.API_KEY"
           android:value="YOUR KEY HERE"/>
    <activity
        ...
```

`com.google.android.geo.API_KEY` に先程作成した API Key を設定します。

## API Key を iOS の AppDelegate に追記する

次に iOS の `ios/Runner/AppDelegate.swift` を以下に書き換えます。

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
    GMSServices.provideAPIKey("YOUR KEY HERE")
    GeneratedPluginRegistrant.register(with: self)
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
}
```

`GMSServices.provideAPIKey` に先程作成した API Key を設定します。

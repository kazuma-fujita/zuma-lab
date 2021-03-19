---
title: 'FCMのプッシュ通知設定とプッシュ通知を受信するFlutterアプリを実装する'
date: '2021-03-XX'
isPublished: false
metaDescription: ''
tags:
  - 'Flutter'
  - 'Dart'
---

### 環境

- macOS Big Sur 11.2.1
- Android Studio 4.1.2
- Flutter 2.0.0
- Dart 2.12.0

## Firebase プロジェクトを作成する

まず [Firebase Console](https://console.firebase.google.com/u/0/?hl=ja) を開き Firebase プロジェクトを作成します。

プロジェクトを追加をクリックします。

<img src='/images/posts/2021-03-22-1.png' class='img' alt='posted image'/>

次に任意のプロジェクト名を入力、親リソースを選択します。

<img src='/images/posts/2021-03-22-2.png' class='img' alt='posted image'/>

次に Google アナリティクス(以後 GA)の設定をします。

<img src='/images/posts/2021-03-22-3.png' class='img' alt='posted image'/>

こちらは任意で選択してください。

今回は検証プロジェクトの為、GA は無効にします。

`続行` ボタンを押すしてしばらくするとプロジェクトが作成されます。

<img src='/images/posts/2021-03-22-4.png' class='img' alt='posted image'/>

## Firebase プロジェクトに Android アプリを追加する

プロジェクト作成後、Firebase のプロジェクト Top ページで以下ハイライト部分のボタンをクリックします。

<img src='/images/posts/2021-03-22-5.png' class='img' alt='posted image'/>

今回 Flutter のプロジェクト名は `flutter_fcm_push_notify` とします。

Android パッケージ名を入力しますが今回サンプルなので `com.example.flutter_fcm_push_notify` としました。

Google Play Store では `com.example` のパッケージ名は審査が通らないのでプロダクトで利用する場合は注意しましょう。

<img src='/images/posts/2021-03-22-6.png' class='img' alt='posted image'/>

次にプッシュ通知をする際に必須の設定である `google-services.json` を DL します。

<img src='/images/posts/2021-03-22-7.png' class='img' alt='posted image'/>

DL した `google-services.json` は プロジェクトの `/android/app/` の下に置きます。

<img src='/images/posts/2021-03-22-8.png' class='img' alt='posted image'/>

後は何もせず `次へ` 押してコンソールへ戻ります。

## Firebase プロジェクトに iOS アプリを追加する

プロジェクト Top 画面に戻り、以下のアプリを追加ボタンをクリックして iOS を選択します。

<img src='/images/posts/2021-03-22-10.png' class='img' alt='posted image'/>

AndroidiOS バンドル ID を入力します。今回サンプルなので `com.example.flutter-fcm-push-notify` としました。

Android では `com.example.flutter_fcm_push_notify` ですが、iOS のバンドル ID にはアンダースコアが使用できないので、`flutter_fcm_push_notify` から `flutter-fcm-push-notify` としています。

`アプリを登録` ボタンをクリックします。

<img src='/images/posts/2021-03-22-11.png' class='img' alt='posted image'/>

次にプッシュ通知をする際に必須の設定である `GoogleService-Info.plist` を DL します。

<img src='/images/posts/2021-03-22-12.png' class='img' alt='posted image'/>

DL した `GoogleService-Info.plist` は Xcode プロジェクトの `Runner` の下に置きます。

Xcode プロジェクトを開くには Terminal を開いて `open ios/Runner.xcworkspace/` コマンドを実行します。

Xcode にファイルをコピーする時は `Copy items if needed` にチェックをいれましょう。

Xcode に実ファイルをコピーしてくれます。

<img src='/images/posts/2021-03-22-13.png' class='img' alt='posted image'/>

`Runner` 配下に `GoogleService-Info.plist` をコピーした後はこのような状態になります。

<img src='/images/posts/2021-03-22-14.png' class='img' alt='posted image'/>

後は何もせず `次へ` 押してコンソールへ戻ります。

# Android のプッシュ通知設定

Android のプッシュ通知設定は基本的に Android Studio で完結できます。

それでは設定していきましょう。

## build.gradle に com.google.gms:google-services を追記する

`/android/build.gradle` を開き以下を追記します。

```gradle
buildscript {
    ext.kotlin_version = '1.3.50'
    repositories {
        google()
        jcenter()
    }

    dependencies {
        classpath 'com.android.tools.build:gradle:4.1.0'
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
        classpath 'com.google.gms:google-services:4.3.5' // added
    }
}

allprojects {
    repositories {
        google()
        jcenter()
    }
}
```

`com.google.gms:google-services` の最新 version が分からなくても大丈夫です。

version が古い場合、以下のように黄色くハイライトしてくれます。

ハイライト部分にフォーカスを当てて電球マークをクリックするとヘルパーが出て最新 version への書き換えを行ってくれます。

<img src='/images/posts/2021-03-22-9.png' class='img' alt='posted image'/>

## app/build.gradle に com.google.gms:google-services を追記する

次に `/android/app/build.gradle` に `com.google.gms.google-services` を追記します。

Android には `/android/build.gradle` `/android/app/build.gradle` と build.gradle が 2 種類あります。

`/android/app/build.gradle` の方にも `com.google.gms:google-services` を追記します。

また、バッググラウンド通知を受け取る為に `dependencies` に `implementation "com.google.firebase:firebase-messaging:` を追記します。

ここでも最新 version が分からなくても version が古い場合 IDE がハイライトで教えてくれます。

```gradle
apply plugin: 'com.android.application'
apply plugin: 'kotlin-android'
apply from: "$flutterRoot/packages/flutter_tools/gradle/flutter.gradle"
apply plugin: 'com.google.gms.google-services' // added
                               :
                               :
                               :
dependencies {
    implementation "org.jetbrains.kotlin:kotlin-stdlib-jdk7:$kotlin_version"
    implementation "com.google.firebase:firebase-messaging:21.0.1" // added
}
```

## Application.kt を作成する

バックグラウンドでプッシュ通知を受け取る設定をします。

`/android/app/src/main/kotlin/<projectのpackage名>` 配下に新規に `Application.kt` を作成します。

```kt
package com.example.yourapp

import io.flutter.app.FlutterApplication
import io.flutter.plugin.common.PluginRegistry
import io.flutter.plugin.common.PluginRegistry.PluginRegistrantCallback
import io.flutter.plugins.GeneratedPluginRegistrant
import io.flutter.plugins.firebasemessaging.FlutterFirebaseMessagingService

class Application : FlutterApplication(), PluginRegistrantCallback {
   override fun onCreate() {
       super.onCreate()
       FlutterFirebaseMessagingService.setPluginRegistrant(this);
   }
   override fun registerWith(registry: PluginRegistry?) {
       io.flutter.plugins.firebasemessaging.FirebaseMessagingPlugin.registerWith(registry?.registrarFor("io.flutter.plugins.firebasemessaging.FirebaseMessagingPlugin"));
   }
}
```

package 名はご自身の project の package 名に修正してください。

## AndroidManifest.xml に android:name=".Application" を追記する

先程実装した Application.kt を認識させる為、AndroidManifest.xml に `android:name=".Application"` を追記します。

`/android/app/src/main/AndroidManifest.xml` を開いて Application タグに `android:name=".Application"` を追記してください。

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.flutter_fcm_push_notify">
   <application
        android:name=".Application"
        android:label="flutter_fcm_push_notify"
        android:icon="@mipmap/ic_launcher">
```

## AndroidManifest.xml に FLUTTER_NOTIFICATION_CLICK を追記する

ユーザがシステムトレイへ届いた通知をクリックした時、アプリ内で onResume や onLaunch で通知を受けとる設定をします。

`/android/app/src/main/AndroidManifest.xml` を開いて `FLUTTER_NOTIFICATION_CLICK` を追記します。

場所は `<activity></activity>` の閉じタグの手前です。

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.flutter_fcm_push_notify">
   <application
        android:name=".Application"
        android:label="flutter_fcm_push_notify"
        android:icon="@mipmap/ic_launcher">
                      :
                      :
                      :
            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
            <!-- Add start -->
            <intent-filter>
                <action android:name="FLUTTER_NOTIFICATION_CLICK" />
                <category android:name="android.intent.category.DEFAULT" />
            </intent-filter>
            <!-- Add end -->
        </activity>
```

以上 Android のプッシュ通知設定となります。

# iOS のプッシュ通知設定

iOS はプッシュ通知に必要な証明書を揃える必要があります。

Apple Developer コンソールを使用するには Apple アカウントが必要なので事前に作成しましょう。

それでは設定していきます。

## Apple Developer Console で APNs Key を作成する

Apple Developer Console の [Certificates, Identifiers & Profiles](https://developer.apple.com/account/resources/certificates/list) にアクセスします。

左メニュー Keys から Key 一覧画面を開きます。

`+` ボタンをクリックして Key 作成画面を開きます。

<img src='/images/posts/2021-03-22-15.png' class='img' alt='posted image'/>

Key Name に作成する Key 名を入力します。

また Apple Push Notifications service(APNs) の ENABLE にチェックをします。

Continue ボタンをクリックして次の画面に進みます。

<img src='/images/posts/2021-03-22-16.png' class='img' alt='posted image'/>

Register ボタンをクリックします。

<img src='/images/posts/2021-03-22-17.png' class='img' alt='posted image'/>

Download Your Key 画面で Key を DL します。

<img src='/images/posts/2021-03-22-18.png' class='img' alt='posted image'/>

```txt
After downloading your key, it cannot be re-downloaded as the server copy is removed. If you are not prepared to download your key at this time, click Done and download it at a later time. Be sure to save a backup of your key in a secure place.
```

> キーをダウンロードした後、サーバーコピーが削除されているため、キーを再ダウンロードすることはできません。現時点でキーをダウンロードする準備ができていない場合は、[完了]をクリックして、後でダウンロードしてください。キーのバックアップは必ず安全な場所に保存してください。

こちらの警告が表示されている通り、一度 DL すると再取得できないので Key のバックアップを必ずとりましょう。

DL した Key は `AuthKey_XXXXXXXX.p8` のようなファイル名です。

## アプリの Identifier を作成する

次に左メニュー Identifiers から Identifier 一覧画面を開きます。

`+` ボタンから identifier 新規作成画面に進みます。

App IDs にチェックをして Continue ボタンをクリックします。

<img src='/images/posts/2021-03-22-19.png' class='img' alt='posted image'/>

Select a type は App を選択して Continue ボタンをクリックします。

<img src='/images/posts/2021-03-22-20.png' class='img' alt='posted image'/>

次に Bundle ID を設定します。

Explicit にチェックをつけて Firebase の iOS アプリを追加した時と同じ Bundle ID を入力します。

今回は `com.example.flutter-fcm-push-notify` と入力します。

また Description も必須項目なのでアプリの説明を入力します。

<img src='/images/posts/2021-03-22-21.png' class='img' alt='posted image'/>

Capabilities の一覧で Push Notifications の ENABLED にチェックをつけます。

Continue をクリックして次に進みます。

<img src='/images/posts/2021-03-22-22.png' class='img' alt='posted image'/>

Register ボタンをクリックして登録完了です。

<img src='/images/posts/2021-03-22-23.png' class='img' alt='posted image'/>

## Provisioning Profile を作成する

左メニューの Profiles から profile 一覧画面を開きます。

`+` ボタンから profile 新規登録画面を開きます。

今回検証目的なので Development の profile を作成します。

iOS App Development を選択して Continue ボタンをクリックします。

<img src='/images/posts/2021-03-22-24.png' class='img' alt='posted image'/>

App ID プルダウンで先程作成した Identifier を選択して Continue ボタンをクリックします。

<img src='/images/posts/2021-03-22-25.png' class='img' alt='posted image'/>

Select Certificates ではご自身で登録した PC の certificates を選択して Continue ボタンをクリックします。

<img src='/images/posts/2021-03-22-26.png' class='img' alt='posted image'/>

Select Device では検証に使用する実機を選択して Continue ボタンをクリックします。

<img src='/images/posts/2021-03-22-27.png' class='img' alt='posted image'/>

Provisioning Profile Name に profile 名を入力します。

今回は `Flutter sample project iOS Development` という名前を入力しました。

Generate ボタンをクリックします。

<img src='/images/posts/2021-03-22-28.png' class='img' alt='posted image'/>

作成した profile を Download します。

<img src='/images/posts/2021-03-22-29.png' class='img' alt='posted image'/>

`Flutter_sample_project_iOS_Development.mobileprovision` という名前の profile が DL されたので、ファイルをダブルクリックして Mac に profile を登録します。

## Xcode で Capabilities を設定する

Xcode のプロジェクトナビゲータから Runner を選択し、Signin & Capabilities で、Capabilities をクリックします。

<img src='/images/posts/2021-03-22-30.png' class='img' alt='posted image'/>

PushNotifications を検索して追加します。

<img src='/images/posts/2021-03-22-31.png' class='img' alt='posted image'/>

次に Background Modes を検索して追加します。

<img src='/images/posts/2021-03-22-32.png' class='img' alt='posted image'/>

BackgroundModes の Background fetch と Remote notifications にチェックを入れます。

<img src='/images/posts/2021-03-22-33.png' class='img' alt='posted image'/>

## APNs 認証キーをアップロード

FirebaseConsole > プロジェクトの設定 > CloudMessaging タブをクリックします。

<img src='/images/posts/2021-03-22-34.png' class='img' alt='posted image'/>

iOS アプリの設定で APNs 認証キーのアップロードをクリックします。

<img src='/images/posts/2021-03-22-35.png' class='img' alt='posted image'/>

APNs 認証キーには、先程ダウンロードしておいた p8 のキーファイルをドラッグ&ドロップします。

キー ID は、Apple Developer Console の Keys より Key を選択すると確認できます。

チーム ID は Apple Developer Member Center メンバーシップより確認できます。

入力したらアップロードボタンをクリックします。

<img src='/images/posts/2021-03-22-36.png' class='img' alt='posted image'/>

もしも、「このアプリにチーム ID が保存されていません」というエラーが表示された場合は Key を削除後もう一度設定し直します。

このエラーが表示された後、チーム ID がプロジェクト全体設定に反映される為、再度アップロードダイアログを開くとちゃんとチーム ID が設定されています。

<img src='/images/posts/2021-03-22-37.png' class='img' alt='posted image'/>

以上で iOS のプッシュ通知設定の完了です。

# Flutter でプッシュ通知を受信する実装をする

ようやく Flutter 本体の実装です。

長かったですね。

後もう一息なので頑張って実装していきましょう。

## Flutter に firebase_messaging を install する

pubspec.yaml に `firebase_messaging` を追記します。

- pubspec.yaml

```yaml
environment:
  sdk: '>=2.12.0 <3.0.0'

dependencies:
  flutter:
    sdk: flutter
  firebase_messaging:
```

追記したら忘れずに `flutter pub get` を実行しましょう。

## プッシュ通知受信部分の実装をする

- `lib/notification_handler.dart`

```dart
FirebaseMessaging firebaseMessaging;

Future<void> initNotification() async {
 firebaseMessaging = FirebaseMessaging()
   ..requestNotificationPermissions()
   ..onIosSettingsRegistered.listen((IosNotificationSettings settings) {})
   ..configure(
     onMessage: (Map<String, dynamic> message) async {
       print('onMessage: $message');
     },
     onBackgroundMessage:
         Platform.isAndroid ? myBackgroundMessageHandler : null,
     onLaunch: (Map<String, dynamic> message) async {
       print('onLaunch: $message');
     },
     onResume: (Map<String, dynamic> message) async {
       print('onResume: $message');
     },
   );
}

Future<dynamic> myBackgroundMessageHandler(Map<String, dynamic> message) async {
 if (message.containsKey('data')) {
   // データメッセージをハンドリング
   final dynamic data = message['data'];
 }

 if (message.containsKey('notification')) {
   // 通知メッセージをハンドリング
   final dynamic notification = message['notification'];
 }
 print('onBackground: $message');
}
```

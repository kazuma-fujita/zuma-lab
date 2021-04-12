---
title: 'FlutterでlocalhostのAPIサーバーに接続する'
date: '2021-04-12'
isPublished: true
metaDescription: 'Flutter で実機から localhost に接続する方法と HTTP 通信を許可する iOS/Android ネイティブ設定を紹介します。'
tags:
  - 'Flutter'
  - 'Dart'
---

Flutter で localhost に接続する方法です。

Flutter から localhost で API サーバーに接続するユースケースを想定します。

Flutter で実機から localhost に接続する方法と HTTP 通信を許可する iOS/Android ネイティブ設定を紹介します。

### 環境

- macOS Big Sur 11.2.3
- Android Studio 4.1.3
- Flutter 2.0.3
- Dart 2.12.2

## 前提

前提として Android と iPhone の実機で localhost に接続するので、PC 環境は macOS を想定します。

また localhost に接続する前提として、以下の条件があります。

- 実機と PC を同じ Wi-Fi に接続する
- Wi-Fi の IP アドレスを調べて設定する

まず実機から localhost に接続するにはモジュールを実行する PC と同じ Wi-Fi ネットワークである必要があります。

実機が 4G などにつながっている場合は Wi-Fi に切り替えましょう。

次に Wi-Fi の IP アドレスを調べてその値を設定します。

ターミナルから以下コマンドを実行して `inet` の IP をコピーします。

```txt
$ ifconfig |grep broadcast
inet 192.168.1.9 netmask 0xffffff00 broadcast 192.168.1.255
```

後はプログラムに記述します。

以下は Http パッケージを利用して 8000 番ポートのローカルサーバーに接続する例です。

```dart
http.get('http://192.168.1.9:8000/endpoint'));
```

ちなみに API の向き先はソースコードにハードコーディングせずに環境変数で設定した方がいいです。

API の環境変数の設定方法はこちらの記事を参照ください。

## HTTP 接続を許可する

Http パッケージを利用して iOS/Android の設定をせずに HTTP 通信で localhost に接続しようとすると以下のエラーが発生します。

```txt
[VERBOSE-2:ui_dart_state.cc(186)] Unhandled Exception: Bad state: Insecure HTTP is not allowed by platform: http://192.168.1.9:8000/v7/users/
#0      _HttpClient._openUrl (dart:_http/http_impl.dart:2434:7)
#1      _HttpClient.openUrl (dart:_http/http_impl.dart:2341:7)
#2      IOClient.send (package:http/src/io_client.dart:30:38)
#3      BaseClient._sendUnstreamed (package:http/src/base_client.dart:93:38)
#4      BaseClient.post (package:http/src/base_client.dart:32:7)
#5      post.<anonymous closure> (package:http/http.dart:69:16)
#6      _withClient (package:http/http.dart:164:20)
#7      post (package:http/http.dart:68:5)
#8      ApiClientImpl.post.<anonymous closure> (package:nomoca_flutter/data/api/api_client.dart:49:37)
#9      ApiClientImpl.post.<anonymous closure> (package:nomoca_flutter/data/api/api_client.dart:49:25)
#10     ApiClientImpl._safeApiCall (package:nomoca_flutter/data/api/api_client.dart:31:38)
#11     ApiClientImpl.post (package:nomoca_flutter/data/api/api_client.dart:49:12)
#12<…>
```

ネイティブ側の HTTP 通信を許可していないのに HTTP で通信しようとした場合に出るエラーです。

このエラーを回避方法は以下の 2 パターンです。

- localhost で立てたサーバーを HTTPS にする
- iOS/Android の設定で HTTP 通信を許可する

可能ならば前者の方法で localhost のサーバーを HTTPS 化して SSL で通信するのがベストです。

今回は後者の iOS/Android の設定で HTTP 通信を許可する方法を紹介します。

ネイティブ側の設定は AndroidManifest.xml と Info.plist に設定します。

## AndroidManifest.xml に HTTP 通信の許可設定をする

`android/app/src/main/AndroidManifest.xml` を開いて設定を追記します。

manifest タグ直下に以下追記します。

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

次に application タグに `android:usesCleartextTraffic="true"` を追記します。

追記後の xml は以下のようになります。

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="jp.co.genova.nomoca">
    <uses-permission android:name="android.permission.INTERNET" />
    <application
        android:label="nomoca_flutter"
        android:icon="@mipmap/ic_launcher"
        android:usesCleartextTraffic="true">
```

`usersCleartextTraffic=true` は全ての HTTP 通信を許可します。

ただしこの設定はセキリティとしては脆弱になるので、 `network_security_config.xml` で以下のような設定も可能です。

- ビルドバリアントの開発用ビルドだけ HTTP 通信を許可
- 特定のドメインだけ HTTP 通信を許可

詳しくはこちらを参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="ネットワーク セキュリティ構成  |  Android デベロッパー  |  Android Developers" src="https://hatenablog-parts.com/embed?url=https://developer.android.com/training/articles/security-config?hl=ja" frameborder="0" scrolling="no"></iframe>

## Info.plist に HTTP 通信の許可設定をする

`ios/Runner/Info.plist` を開いて以下の手順で設定を追記します。

1. `Information Property List` の +ボタンをクリックして `App Transport Security Settings` を入力
1. `App Transport Security Settings` の Type を Dictionary に変更
1. `App Transport Security Settings` の `>` ボタンをクリックして `ｖ` に変更
1. `App Transport Security Settings` +ボタンをクリックして `Allow Arbitrary Loads` を入力
1. `Allow Arbitrary Loads` の Type を Boolean に変更して YES を選択

もしくは Info.plist のコードに以下を追記します。

```txt
	<key>NSAppTransportSecurity</key>
	<dict>
		<key>NSAllowsArbitraryLoads</key>
		<true/>
	</dict>
```

Info.plist がこのようになってなっていれば OK です。

<img src='/images/posts/2021-04-12-1.png' alt='posted images' class='img' />

ただしこの設定は Android の `usersCleartextTraffic=true` 同様、全ての HTTP 通信を許可します。

セキリティとしては脆弱なので、Info.plist の `App Transport Security Settings` でドメイン単位で HTTP 許可設定を行うことができます。

以下の記事で詳しく解説されてますので参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="[iOS] ATS対応徹底攻略！対応策とInfo.plistより行うATSの設定値まとめ | DevelopersIO" src="https://hatenablog-parts.com/embed?url=https://dev.classmethod.jp/articles/ios-ats-cheats-info-plist-settings/" frameborder="0" scrolling="no"></iframe>

以上簡単ですが Flutter で localhost の API サーバーに接続する方法でした。

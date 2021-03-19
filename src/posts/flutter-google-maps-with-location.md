---
title: 'Flutterのgoogle_maps_flutterとgeolocatorで位置情報を取得して現在地をGoogle Mapsに表示する'
date: '2021-03-19'
isPublished: true
metaDescription: 'Flutterのgoogle_maps_flutterとgeolocatorで位置情報を取得して現在地をGoogle Mapsに表示します。Google Map 表示部分は Flutter 公式の`google_maps_flutter`package を利用します。'
tags:
  - 'Flutter'
  - 'Dart'
---

Flutter で位置情報を取得して現在地を Google Map に表示するアプリを作ります。

Google Map 表示部分は Flutter 公式の `google_maps_flutter` package を利用します。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="google_maps_flutter | Flutter Package" src="https://hatenablog-parts.com/embed?url=https://pub.dev/packages/google_maps_flutter" frameborder="0" scrolling="no"></iframe>

また、位置情報を取得する為に `geolocator` package を利用します。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="geolocator | Flutter Package" src="https://hatenablog-parts.com/embed?url=https://pub.dev/packages/geolocator" frameborder="0" scrolling="no"></iframe>

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

pubspec.yaml の dependencies に `google_maps_flutter` と `geolocator` を追記します。

- pubspec.yaml

```yaml
environment:
  sdk: '>=2.12.0 <3.0.0'

dependencies:
  flutter:
    sdk: flutter
  google_maps_flutter:
  geolocator:
```

追記したら忘れずに `flutter pub get` を実行しましょう。

## Permission と API Key を AndroidManifest.xml に追記する

`android/app/src/main/AndroidManifest.xml` に Permission と API Key を追加します。

まず、manifest タグ直下に `android.permission.ACCESS_FINE_LOCATION` を追記します。

`ACCESS_FINE_LOCATION` パーミッションは GPS を利用して正確な位置情報を取得する権限です。

次に application タグ直下に `com.google.android.geo.API_KEY` を追加します。

`com.google.android.geo.API_KEY` には先程作成した API Key を設定します。

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.flutter_google_maps">
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
   <application
        android:label="flutter_google_maps"
        android:icon="@mipmap/ic_launcher">
       <meta-data
           android:name="com.google.android.geo.API_KEY"
           android:value="YOUR KEY HERE"/>
    <activity
        ...
```

`android.permission.ACCESS_FINE_LOCATION` パーミッションですが、AndroidOS11 以降位置情報パーミッション許可ダイアログには以下の選択が可能です。

- アプリの使用時のみ
- 今回のみ
- 許可しない

<img src='/images/posts/2021-03-18-8.png' class='img' alt='posted image' />

アプリの使用時のみ、今回のみを選択して位置情報を許可した場合はアプリがフォアグラウンドの時のみ位置情報を取得します。

バックグラウンドでも位置情報を取得したい場合 `android.permission.ACCESS_BACKGROUND_LOCATION` を使用します。

ただし [Google Developers](https://developer.android.com/training/location/permissions?hl=ja#background) にある通り、Play Store ではバックグラウンドで位置情報を取得する場合、アプリの機能がガイドラインに則って実装されている必要があります。

> 注: Google Play ストアには、デバイスの位置情報に関する位置情報ポリシーがあり、バックグラウンドでの位置情報へのアクセスを、コア機能に必要としていて、関連するポリシー要件を満たしているアプリに制限しています。

どうしてもバックグラウンドで位置情報を取得したい理由が無い限り、フォアグラウンドで位置情報を取得する `android.permission.ACCESS_BACKGROUND_LOCATION` パーミッション設定で良いと思います。

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

## Info.plist にパーミッション許可ダイアログのキーを設定する

`ios/Runner/Info.plist` にパーミッション許可ダイアログのキーと表示する文言を追記します。

`<dict>...</dict>` 内に追記します。

```plist
<dict>
    <key>NSLocationWhenInUseUsageDescription</key>
    <string>Your location is required for this app</string>
                        :
                        :
                        :
</dict>
```

Info.plist にパーミッションの Key を追加しないと以下エラーが発生します。

```txt
 Unhandled Exception: Permission definitions not found in the app's Info.plist. Please make sure to add either NSLocationWhenInUseUsageDescription or NSLocationAlwaysUsageDescription to the app's Info.plist file.
```

> 権限の定義がアプリの Info.plist に見つかりません。
> NSLocationWhenInUseUsageDescription または NSLocationAlwaysUsageDescription の
> いずれかをアプリの Info.plist ファイルに必ず追加してください。

`NSLocationWhenInUseUsageDescription` もしくは `NSLocationAlwaysUsageDescription` のキーは必須とのことです。

`NSLocationAlwaysUsageDescription` のみを Info.plist に追記して build してみます。

```plist
<dict>
    <key>NSLocationAlwaysUsageDescription</key>
    <string>Your location is required for this app</string>
                        :
                        :
</dict>
```

すると以下エラーが発生します。

```txt
This app has attempted to access privacy-sensitive data without a usage description. The app's Info.plist must contain both “NSLocationAlwaysAndWhenInUseUsageDescription” and “NSLocationWhenInUseUsageDescription” keys with string values explaining to the user how the app uses this data
```

> このアプリは、使用法の説明なしでプライバシーに配慮したデータにアクセスしようとしました。
> アプリの Info.plist には、「NSLocationAlwaysAndWhenInUseUsageDescription」キーと「NSLocationWhenInUseUsageDescription」キーの両方と、
> アプリがこのデータをどのように使用するかをユーザーに説明する文字列値が含まれている必要があります。

今度は `NSLocationAlwaysAndWhenInUseUsageDescription` と `NSLocationWhenInUseUsageDescription` 両方のキーを追加してとのことです。

`NSLocationAlwaysAndWhenInUseUsageDescription` について Apple Developer に詳細な説明があります。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="NSLocationAlwaysAndWhenInUseUsageDescription | Apple Developer Documentation" src="https://hatenablog-parts.com/embed?url=https://developer.apple.com/documentation/bundleresources/information_property_list/nslocationalwaysandwheninuseusagedescription" frameborder="0" scrolling="no"></iframe>

それぞれのキーを意訳するとこのようになります。

> iOS アプリがバックグラウンドで実行されているときに位置情報にアクセスする場合は、NSLocationAlwaysAndWhenInUseUsageDescription のキーを使用します。
> アプリがフォアグラウンドにあるときに位置情報のみを必要とする場合は、代わりに NSLocationWhenInUseUsageDescription を使用します。
> iOS アプリが iOS11 より前のバージョンにデプロイされる場合は、NSLocationAlwaysUsageDescription を参照してください。

iOS11 以前をターゲットにすることは無いはずなので、`NSLocationAlwaysUsageDescription` キーは使用しません。

また、App Store でバックグラウンドで位置情報を取得するようなアプリに対しては Apple のガイドラインに則った機能実装をしないと Store 申請自体が通らない可能性があります。

筆者は余程の理由が無い限り不用意にバックグラウンドでの位置情報を取得する可能性のある `NSLocationAlwaysAndWhenInUseUsageDescription` キーは使用しないようにしています。

という訳で今回はフォアグラウンドでのみ位置情報を取得する `NSLocationWhenInUseUsageDescription` キーを使用します。

`NSLocationWhenInUseUsageDescription` キーを利用した場合、位置情報パーミッション許可ダイアログの状態はこのようになります。

<img src='/images/posts/2021-03-18-7.png' class='img' style='width: 50%' alt='posted image'/>

以下の選択肢が表示されます。

- 一度だけ許可
- App の使用中は許可
- 許可しない

一度だけ許可、App の使用中は許可を選択した場合はフォアグラウンドでのみ位置情報を取得します。

## Google Map を開く最初の画面を実装する

ようやく本題の実装です。

まずアプリを起動した時に最初に表示される画面を実装します。

- `lib/first_view.dart`

```dart
import 'package:flutter/material.dart';
import 'package:flutter_google_maps/map_view.dart';

class Const {
  static const routeFirstView = '/first';
}

class FirstView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(primaryColor: Colors.white),
      routes: <String, WidgetBuilder>{
        Const.routeFirstView: (BuildContext context) => MapView(),
      },
      home: _FirstView(),
    );
  }
}

class _FirstView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Google Maps App'),
      ),
      body: Center(
        child: ElevatedButton(
          onPressed: () => Navigator.pushNamed(context, Const.routeFirstView),
          child: const Text('Launch the map'),
        ),
      ),
    );
  }
}
```

Google Map 画面への遷移ボタンがあるだけのシンプルな画面です。

- `lib/main.dart`

```
import 'package:flutter/material.dart';
import 'first_view.dart';

void main() => runApp(FirstView());
```

main.dart では FistView を runApp に設定します。

## Google Map 画面を実装する

- `lib/map_view.dart`

```dart
import 'dart:async';

import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:geolocator/geolocator.dart';
import 'package:flutter_hooks/flutter_hooks.dart';

class MapView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Google Maps View'),
      ),
      body: _MapView(),
    );
  }
}

class _MapView extends HookWidget {
  final Completer<GoogleMapController> _mapController = Completer();
  // 初期表示位置を渋谷駅に設定
  final Position _initialPosition = Position(
    latitude: 35.658034,
    longitude: 139.701636,
    timestamp: DateTime.now(),
    altitude: 0,
    accuracy: 0,
    heading: 0,
    floor: null,
    speed: 0,
    speedAccuracy: 0,
  );

  @override
  Widget build(BuildContext context) {
    // 初期表示座標のMarkerを設定
    final initialMarkers = {
      _initialPosition.timestamp.toString(): Marker(
        markerId: MarkerId(_initialPosition.timestamp.toString()),
        position: LatLng(_initialPosition.latitude, _initialPosition.longitude),
      ),
    };
    final position = useState<Position>(_initialPosition);
    final markers = useState<Map<String, Marker>>(initialMarkers);

    _setCurrentLocation(position, markers);
    _animateCamera(position);

    return Scaffold(
      body: GoogleMap(
        mapType: MapType.normal,
        myLocationButtonEnabled: false,
        // 初期表示位置は渋谷駅に設定
        initialCameraPosition: CameraPosition(
          target: LatLng(_initialPosition.latitude, _initialPosition.longitude),
          zoom: 14.4746,
        ),
        onMapCreated: _mapController.complete,
        markers: markers.value.values.toSet(),
      ),
    );
  }

  Future<void> _setCurrentLocation(ValueNotifier<Position> position,
      ValueNotifier<Map<String, Marker>> markers) async {
    final currentPosition = await Geolocator.getCurrentPosition(
      desiredAccuracy: LocationAccuracy.high,
    );

    const decimalPoint = 3;
    // 過去の座標と最新の座標の小数点第三位で切り捨てた値を判定
    if ((position.value.latitude).toStringAsFixed(decimalPoint) !=
            (currentPosition.latitude).toStringAsFixed(decimalPoint) &&
        (position.value.longitude).toStringAsFixed(decimalPoint) !=
            (currentPosition.longitude).toStringAsFixed(decimalPoint)) {
      // 現在地座標にMarkerを立てる
      final marker = Marker(
        markerId: MarkerId(currentPosition.timestamp.toString()),
        position: LatLng(currentPosition.latitude, currentPosition.longitude),
      );
      markers.value.clear();
      markers.value[currentPosition.timestamp.toString()] = marker;
      // 現在地座標のstateを更新する
      position.value = currentPosition;
    }
  }

  Future<void> _animateCamera(ValueNotifier<Position> position) async {
    final mapController = await _mapController.future;
    // 現在地座標が取得できたらカメラを現在地に移動する
    await mapController.animateCamera(
      CameraUpdate.newLatLng(
        LatLng(position.value.latitude, position.value.longitude),
      ),
    );
  }
}
```

今回は flutter hooks の useState を利用する為、HookWidget を継承したクラスを実装します。

また、GoogleMap の controller をプロパティに設定します。

以後この `_mapController` を利用して marker を立てたり現在地にカメラを移動させます。

```dart
class _MapView extends HookWidget {
  final Completer<GoogleMapController> _mapController = Completer();
```

次に初期表示座標をクラスのプロパティに設定しています。

この Position クラスは geolocator package で利用するクラスです。

```dart
  final Position _initialPosition = Position(
    latitude: 35.658034,
    longitude: 139.701636,
    timestamp: DateTime.now(),
    altitude: 0,
    accuracy: 0,
    heading: 0,
    floor: null,
    speed: 0,
    speedAccuracy: 0,
  );
```

`latitude: 35.658034` `longitude: 139.701636` は渋谷駅の座標です。

今回現在地座標が取得できなかったららデフォルトで渋谷駅を表示します。

次に初期表示用の `initialMarkers` を定義します。

```dart
    final initialMarkers = {
      _initialPosition.timestamp.toString(): Marker(
        markerId: MarkerId(_initialPosition.timestamp.toString()),
        position: LatLng(_initialPosition.latitude, _initialPosition.longitude),
      ),
    };
```

こちらは現在地座標が取得できなかったらデフォルトで渋谷駅に marker を立てます。

次に現在地座標と現在地の marker 情報の状態管理をする変数を定義します。

```dart
    final position = useState<Position>(_initialPosition);
    final markers = useState<Map<String, Marker>>(initialMarkers);
```

ここでは flutter hooks の useState を利用します。

flutter hooks の useState は通常 StatefulWidget で行っている状態管理と全く同じ事ができます。

筆者は flutter hooks の方が記述量が少なく直感的に状態管理を記述出来るのでなるべく StatefulWidget を使用する場面は flutter hooks を利用するようにしています。

### 現在地を取得して状態管理をする

次に現在地を取得して状態管理をする `_setCurrentLocation` メソッドを実装します。

```dart
  Future<void> _setCurrentLocation(ValueNotifier<Position> position,
      ValueNotifier<Map<String, Marker>> markers) async {
    final currentPosition = await Geolocator.getCurrentPosition(
      desiredAccuracy: LocationAccuracy.high,
    );

    const decimalPoint = 3;
    // 過去の座標と最新の座標の小数点第三位で切り捨てた値を判定
    if ((position.value.latitude).toStringAsFixed(decimalPoint) !=
            (currentPosition.latitude).toStringAsFixed(decimalPoint) &&
        (position.value.longitude).toStringAsFixed(decimalPoint) !=
            (currentPosition.longitude).toStringAsFixed(decimalPoint)) {
      // 現在地座標にMarkerを立てる
      final marker = Marker(
        markerId: MarkerId(currentPosition.timestamp.toString()),
        position: LatLng(currentPosition.latitude, currentPosition.longitude),
      );
      markers.value.clear();
      markers.value[currentPosition.timestamp.toString()] = marker;
      // 現在地座標のstateを更新する
      position.value = currentPosition;
    }
  }
```

`await Geolocator.getCurrentPosition` はアプリの install 直後など、位置情報パーミッションが選択されていない場合は OS 固有の位置情報パーミッション許可ダイアログを表示してくれます。

位置情報を許可するパーミッションが選択されている場合、戻り値に現在の緯度経度  が格納された Position オブジェクトが返却されます。

`Geolocator.getCurrentPosition` の引数に設定している `desiredAccuracy: LocationAccuracy.high` は高い精度の位置情報を取得できます。

ただし、位置情報の取得回数が増えるので正確な位置情報が必要か否かでこの設定は適宜変更するべきです。

次に、以下過去の座標と最新の座標の小数点第三位で切り捨てた値を判定をして、過去と最新の位置情報が違っていたら最新の位置情報の state を更新する処理を入れます。

Geolocator.getCurrentPosition で取得出来る座標は `Latitude: 35.712630349492095` `Longitude: 139.45050313630364` と小数点以下 14 桁の値が取得できます。

Geolocator は現在地を移動していなくても一定の頻度で値が更新されます。

移動していないくても小数点第三位以下の数字が毎回違う値が入ってきたりするので、小数点以下三位を切り捨てて、本当に現在地座標が変更されたときだけ state を更新するようにします。

```dart
    const decimalPoint = 3;
    if ((position.value.latitude).toStringAsFixed(decimalPoint) !=
            (currentPosition.latitude).toStringAsFixed(decimalPoint) &&
        (position.value.longitude).toStringAsFixed(decimalPoint) !=
            (currentPosition.longitude).toStringAsFixed(decimalPoint)) {
```

上記処理をいれないと実際は現在地が変更されていないのに、state が何回も更新されて Widget の再描写が走ってしまいます。

次に先程 useState で宣言した位置情報を保持する position オブジェクトと markers オブジェクトの state を更新する処理をいれます。

```dart
    // 現在地座標にMarkerを立てる
    final marker = Marker(
      markerId: MarkerId(currentPosition.timestamp.toString()),
      position: LatLng(currentPosition.latitude, currentPosition.longitude),
    );
    markers.value.clear();
    markers.value[currentPosition.timestamp.toString()] = marker;
    // 現在地座標のstateを更新する
    position.value = currentPosition;
```

useState のオブジェクトは `ValueNotifier` なので、`position.value` に値を入れると state が変更されて、変更が Widget に伝搬されます。

やってることは StatefulWidget でいう`setState()` と同じです。

### Google Map のカメラを現在地に移動する

次に現在地が取得できたら Google Map のカメラを現在地座標に移動させる処理を入れいます。

`await mapController.animateCamera` で引数に指定した緯度経度にカメラを移動します。

```dart
  Future<void> _animateCamera(ValueNotifier<Position> position) async {
    final mapController = await _mapController.future;
    await mapController.animateCamera(
      CameraUpdate.newLatLng(
        LatLng(position.value.latitude, position.value.longitude),
      ),
    );
  }
```

CameraUpdate.newLatLng の引数に `position.value.latitude` `position.value.longitude` を指定しています。

先程 Geolocator.getCurrentPosition で最新座標が取得できたら position の state を変更しました。

変更された state が `position.value.latitude` に反映されてカメラを自動で移動できます。

### Google Map Widget を実装する

最後に、Google Map を表示する GoogleMap Widget を実装します。

```dart
    return Scaffold(
      body: GoogleMap(
        mapType: MapType.normal,
        myLocationButtonEnabled: false,
        initialCameraPosition: CameraPosition(
          target: LatLng(_initialPosition.latitude, _initialPosition.longitude),
          zoom: 14.4746,
        ),
        onMapCreated: _mapController.complete,
        markers: markers.value.values.toSet(),
      ),
    );
```

通常の Google Map を表示するには mapType を normal に設定します。

`myLocationButtonEnabled:false` でデフォルトで GoogleMap の右下に表示される現在地へ移動するボタンを非表示にします。

`initialCameraPosition` で初期表示する座標を指定します。

ここでは先程定義した `_initialPosition` で渋谷駅をデフォルト表示位置にしています。

`CameraPosition` クラスの zoom プロパティは Google Map をどの縮尺で表示するか設定します。

onMapCreated は初期処理を入れたい時に独自のメソッドを実装して利用します。

今回は初期処理が不要なので、`_mapController.complete` を指定しています。

最後に markers プロパティには先程定義した状態管理している markers から `markers.value.values.toSet()` で `Set<Marker>` を取得して設定しています。

先程位置情報が変更されたら markers の state を変更する処理をいれているので、変更後の状態が markers.value に反映されて Google Map に表示される marker の位置も連動して変更されるようになります。

## おわりに

google maps flutter と geolocator package で位置情報の取得と GoogleMap の表示ができました。

今回 Google Map を利用する為に GCP の API Key をソースコードにハードコーディングしてますが、プロダクトで利用する際は Github の repository に上がらないようにしましょう。

例えば秘匿情報である API Key は.env の外部ファイルから取得する flutter_dotenv package を利用して、.env ファイルは.gitignore するなどの方法があります。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="flutter_dotenv | Flutter Package" src="https://hatenablog-parts.com/embed?url=https://pub.dev/packages/flutter_dotenv" frameborder="0" scrolling="no"></iframe>

こちらはまた改めて記事にしたいと思います。

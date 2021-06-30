---
title: 'Flutterのqr_code_scannerでQRコードを読み込む'
date: '2021-03-17'
isPublished: true
metaDescription: '今回は Flutter の qr_code_scanner で QR コード読み込みをしてみたいと思います。barcode_scan の方が日本語記事が多く、qr_code_scanner についての記事が少なかったので今回記事にしました。'
tags:
  - 'Flutter'
  - 'Dart'
---

今回は Flutter の `qr_code_scanner` で QR コード読み込みをしてみたいと思います。

調べると QR コード読み込みをする package は `qr_code_scanner` か barcode_scan が pub.dev の Like 数が多かったです。

- `qr_code_scanner`

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="qr_code_scanner | Flutter Package" src="https://hatenablog-parts.com/embed?url=https://pub.dev/packages/`qr_code_scanner`" frameborder="0" scrolling="no"></iframe>

- `barcode_scan`

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="barcode_scan | Flutter Package" src="https://hatenablog-parts.com/embed?url=https://pub.dev/packages/barcode_scan" frameborder="0" scrolling="no"></iframe>

`barcode_scan` の方が日本語記事が多く、`qr_code_scanner` についての記事が少なかったので今回記事にしました。

また、`qr_code_scanner` は 2021/03/17 現在、Prerelease version 0.4.0-nullsafety.0 で Flutter2(Dart 2.12.0)の Null Safety に対応しています。

barcode_scan は Published May 8, 2020 で更新が止まっています。

Flutter2 で Null Safety を導入している筆者は `qr_code_scanner` 一択でした。

という訳で今回は `qr_code_scanner` を利用してこのようなアプリを作ります。

<img src='/images/posts/2021-03-17-1.gif' class='img' alt='posted gif' styled='width: 70%'/>

画面構成は QR コードカメラで QR コードを読み取った際の処理をするメソッドを指定しています。を起動する画面、QR コード読み取り画面、読み込んだ QR コード情報を表示する画面の 3 画面となります。

全てのソースコードは Github にあるので参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="kazuma-fujita/flutter_qr_code_scanner: Practice QR code scanning and camera permission." src="https://hatenablog-parts.com/embed?url=https://github.com/kazuma-fujita/flutter_qr_code_scanner" frameborder="0" scrolling="no"></iframe>

### 環境

- macOS Big Sur 11.2.1
- Android Studio 4.1.2
- Flutter 2.0.0
- Dart 2.12.0

### `qr_code_scanner` の利用条件を確認する

まず必須条件として、Android SDK 21 以降、iOS8 以降となっています。

```txt
Requires at least SDK 21 (Android 5.0). Requires at least iOS 8.
```

ほとんどの場合問題にならないと思いますが、引っかかる場合は利用の検討が必要です。

## `qr_code_scanner` を install する

pubspec.yaml に以下追記します。

```yaml
dependencies:
  flutter:
    sdk: flutter
  qr_code_scanner: // added
  permission_handler: // added
```

今回は `qr_code_scanner` の他、カメラの許可状態を取得する為の permission_handler を利用します。

追記後は忘れずに `flutter pub get` を実行しましょう。

## Android build.gradle の minSdkVersion を上げる

プロジェクトの `android/app/` 配下にある build.gradle ファイルの `minSdkVersion` を修正します。

筆者の場合、 `minSdkVersion` が 16 だった為、`qr_code_scanner` の必須条件である 21 に変更しました。

- `android/app/build.gradle`

```gradle
    defaultConfig {
        // TODO: Specify your own unique Application ID (https://developer.android.com/studio/build/application-id.html).
        applicationId "com.example.flutter_`qr_code_scanner`"
        minSdkVersion 21 // 16 -> 21
        targetSdkVersion 30
        versionCode flutterVersionCode.toInteger()
        versionName flutterVersionName
    }
```

## Xcode で Bundle Identifier をユニークにする

QR コードの動作確認は実機が必要です。

iPhone の実機でアプリを実行するには iOS プロジェクトの `Bundle Identifier` をユニークな名前に修正します。

プロジェクトルートで以下コマンドを実行して Xcode を開きます。

```txt
open ios/Runner.xcworkspace
```

TARGETS > Runner > Signing & Capabilities を開きます。

Bundle Identifier の `com.example.projectName` をユニークな名前に変更します。

<img src='/images/posts/2021-03-10-1.png' class='img' alt='posted image' />

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

```txt
# Uncomment this line to define a global platform for your project
platform :ios, '9.0' # Comment in.

# CocoaPods analytics sends network stats synchronously affecting flutter build latency.
ENV['COCOAPODS_DISABLE_STATS'] = 'true'
```

## カメラ権限判定をして QR コードカメラを起動する画面を実装する

- `lib/first_page_view.dart`

```dart
class Const {
  static const routeFirstPage = '/home';
  static const routeQRCodeScanner = '/qr-code-scanner';
  static const routeConfirm = '/confirm';
}

class FirstPageView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(primaryColor: Colors.white),
      routes: <String, WidgetBuilder>{
        Const.routeFirstPage: (BuildContext context) => FirstPageView(),
        Const.routeQRCodeScanner: (BuildContext context) => QRCodeScannerView(),
        Const.routeConfirm: (BuildContext context) => ConfirmView(),
      },
      home: _FirstPage(),
    );
  }
}

class _FirstPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        title: const Text('QR code scanner'),
      ),
      body: _buildPage(context),
    );
  }

  Widget _buildPage(BuildContext context) {
    return Center(
      child: ElevatedButton(
        onPressed: () async {
          if (await Permission.camera.request().isGranted) {
            Navigator.pushNamed(context, Const.routeQRCodeScanner);
          } else {
            await showRequestPermissionDialog(context);
          }
        },
        child: const Text('Launch QR code scanner'),
      ),
    );
  }

  Future<void> showRequestPermissionDialog(BuildContext context) async {
    await showDialog<void>(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('カメラを許可してください'),
          content: const Text('QRコードを読み取る為にカメラを利用します'),
          actions: <Widget>[
            ElevatedButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('キャンセル'),
            ),
            ElevatedButton(
              onPressed: () async {
                openAppSettings();
              },
              child: const Text('設定'),
            ),
          ],
        );
      },
    );
  }
}
```

アプリ起動直後に表示する画面です。

この画面では、カメラ起動ボタンをタップされたらカメラパーミッションを判定して、QR コードカメラを起動しています。

一連の処理実装は以下です。

```dart
  Widget _buildPage(BuildContext context) {
    return Center(
      child: ElevatedButton(
        onPressed: () async {
          if (await Permission.camera.request().isGranted) {
            Navigator.pushNamed(context, Const.routeQRCodeScanner);
          } else {
            await showRequestPermissionDialog(context);
          }
        },
        child: const Text('Launch QR code scanner'),
      ),
    );
  }
```

カメラ権限判定処理ではまず `Permission.camera.request()` で OS 固有のカメラパーミッション許可ダイアログを表示させます。

<img src='/images/posts/2021-03-17-1.png' class='img' alt='posted image'/>

以下のように、`await Permission.camera.request().isGranted` とすることにより、カメラを許可された時の判定ができます。

`await` キーワードがあるので、許可ダイアログのどれかが選択されるまで処理を待ちます。

```dart
if (await Permission.camera.request().isGranted) {
  Navigator.pushNamed(context, Const.routeQRCodeScanner);
} else {
  await showRequestPermissionDialog(context);
}
```

パーミッションが許可された場合、`isGranted` は true になるので、`Navigator.pushNamed` で QR コード読み取り画面を表示します。

パーミッションが許可されなかった選択された場合、パーミッションの変更を促す為、設定画面のリンクボタン付きのダイアログを表示させます。

```dart
  Future<void> showRequestPermissionDialog(BuildContext context) async {
    await showDialog<void>(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('カメラを許可してください'),
          content: const Text('QRコードを読み取る為にカメラを利用します'),
          actions: <Widget>[
            ElevatedButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('キャンセル'),
            ),
            ElevatedButton(
              onPressed: () async {
                openAppSettings();
              },
              child: const Text('設定'),
            ),
          ],
        );
      },
    );
  }
```

`permission_handler` の `openAppSettings` で設定画面へ遷移させることができます。

## `qr_code_scanner` で QR コード読み取り画面を実装する

- `lib/qr_code_scanner_view.dart`

```dart
@immutable
class ConfirmViewArguments {
  const ConfirmViewArguments({required this.type, required this.data});
  final String type;
  final String data;
}

class QRCodeScannerView extends StatefulWidget {
  @override
  _QRCodeScannerViewState createState() => _QRCodeScannerViewState();
}

class _QRCodeScannerViewState extends State<QRCodeScannerView> {
  QRViewController? _qrController;
  final GlobalKey _qrKey = GlobalKey(debugLabel: 'QR');
  bool _isQRScanned = false;

  // ホットリロードを機能させるには、プラットフォームがAndroidの場合はカメラを一時停止するか、
  // プラットフォームがiOSの場合はカメラを再開する必要がある
  @override
  void reassemble() {
    super.reassemble();
    if (Platform.isAndroid) {
      _qrController?.pauseCamera();
    }
    _qrController?.resumeCamera();
  }

  @override
  void dispose() {
    _qrController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Scan the QR code'),
      ),
      body: Column(
        children: <Widget>[
          Expanded(
            flex: 4,
            // child: _buildPermissionState(context),
            child: _buildQRView(context),
          ),
          Expanded(
            flex: 1,
            child: FittedBox(
              fit: BoxFit.contain,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: <Widget>[
                  const Text('Scan a code'),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: <Widget>[
                      Container(
                        margin: const EdgeInsets.all(8),
                        child: ElevatedButton(
                          onPressed: () async {
                            await _qrController?.toggleFlash();
                            setState(() {});
                          },
                          child: FutureBuilder(
                            future: _qrController?.getFlashStatus(),
                            builder: (context, snapshot) =>
                                Text('Flash: ${snapshot.data}'),
                          ),
                        ),
                      ),
                      Container(
                        margin: const EdgeInsets.all(8),
                        child: ElevatedButton(
                          onPressed: () async {
                            await _qrController?.flipCamera();
                            setState(() {});
                          },
                          child: FutureBuilder(
                            future: _qrController?.getCameraInfo(),
                            builder: (context, snapshot) => snapshot.data !=
                                    null
                                ? Text(
                                    'Camera facing ${describeEnum(snapshot.data!)}')
                                : const Text('loading'),
                          ),
                        ),
                      ),
                    ],
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: <Widget>[
                      Container(
                        margin: const EdgeInsets.all(8),
                        child: ElevatedButton(
                          onPressed: () async {
                            await _qrController?.pauseCamera();
                          },
                          child: const Text(
                            'pause',
                            style: TextStyle(fontSize: 20),
                          ),
                        ),
                      ),
                      Container(
                        margin: const EdgeInsets.all(8),
                        child: ElevatedButton(
                          onPressed: () async {
                            await _qrController?.resumeCamera();
                          },
                          child: const Text(
                            'resume',
                            style: TextStyle(fontSize: 20),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQRView(BuildContext context) {
    return QRView(
      key: _qrKey,
      onQRViewCreated: _onQRViewCreated,
      overlay: QrScannerOverlayShape(
        borderColor: Colors.green,
        borderRadius: 16,
        borderLength: 24,
        borderWidth: 8,
        // cutOutSize: scanArea,
      ),
    );
  }

  void _onQRViewCreated(QRViewController qrController) {
    setState(() {
      _qrController = qrController;
    });
    // QRを読み込みをlistenする
    qrController.scannedDataStream.listen((scanData) {
      // QRのデータが取得出来ない場合SnackBar表示
      if (scanData.code == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('QR code data does not exist'),
          ),
        );
      }
      // 次の画面へ遷移
      _transitionToNextScreen(describeEnum(scanData.format), scanData.code!);
    });
  }

  Future<void> _transitionToNextScreen(String type, String data) async {
    if (!_isQRScanned) {
      // カメラを一時停止
      _qrController?.pauseCamera();
      _isQRScanned = true;
      // 次の画面へ遷移
      await Navigator.pushNamed(
        context,
        Const.routeConfirm,
        arguments: ConfirmViewArguments(type: type, data: data),
      ).then(
        // 遷移先画面から戻った場合カメラを再開
        (value) {
          _qrController?.resumeCamera();
          _isQRScanned = false;
        },
      );
    }
  }
}
```

カメラを使用する為に、クラスのプロパティに `QRViewController _qrController` を持たせます。

次に以下のメソッドで `QRView` Widget を生成します。

QRView の overlay でスキャン画面の読み取りエリア UI を調整します。

今回は読み取りエリアの枠線を緑にして多少太くしています。

```dart
  Widget _buildQRView(BuildContext context) {
    return QRView(
      key: _qrKey,
      onQRViewCreated: _onQRViewCreated,
      overlay: QrScannerOverlayShape(
        borderColor: Colors.green,
        borderRadius: 16,
        borderLength: 24,
        borderWidth: 8,
      ),
    );
  }
```

QRView の `onQRViewCreated: _onQRViewCreated` はカメラで QR コードを読み取った際の処理をするメソッドを指定しています。

```dart
  void _onQRViewCreated(QRViewController qrController) {
    setState(() {
      _qrController = qrController;
    });
    qrController.scannedDataStream.listen((scanData) {
      if (scanData.code == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('QR code data does not exist'),
          ),
        );
      }
      _transitionToNextScreen(describeEnum(scanData.format), scanData.code!);
    });
  }
```

`_onQRViewCreated` メソッドの引数には `QRViewController` のインスタンスが渡ってくるので、setState で `_qrController` プロパティにセットします。

以後カメラを一時停止したい時は `_qrController.pose`、再開したい時は `_qrController.resume` でカメラコントロールをします。

次に `qrController.scannedDataStream.listen` で QR コードを読み込んだ場合の callback 処理を実装します。

`scanData.code` に QR コードのデータが入るので、null だった場合は snackBar を表示します。

データが存在する場合、次の QR コード読み取りデータ確認画面へ遷移します。

```dart
  Future<void> _transitionToNextScreen(String type, String data) async {
    if (!_isQRScanned) {
      // カメラを一時停止
      _qrController?.pauseCamera();
      _isQRScanned = true;
      // 次の画面へ遷移
      await Navigator.pushNamed(
        context,
        Const.routeConfirm,
        arguments: ConfirmViewArguments(type: type, data: data),
      ).then(
        // 遷移先画面から戻った場合カメラを再開
        (value) {
          _qrController?.resumeCamera();
          _isQRScanned = false;
        },
      );
    }
  }
```

ここで重要なのが、`qrController.scannedDataStream.listen` は QR コードを一度に複数読み込んだ場合、読み込んだ分だけ呼ばれます。

ここでは `_isQRScanned` フラグを使用して一度スキャンした後は画面遷移から戻らない限り再度スキャンをしないように制御しています。

この制御を入れないと、QR コードを読み込んだ分だけ `Navigator.pushNamed` が呼ばれ遷移先画面が何回も表示されてしまいます。

複数 QR コードを一度に読み込んでも最初に読み込んだ QR コード情報のみを次の画面に渡すようにしている訳です。

次の遷移先画面である QR コード情報確認画面には以下のオブジェクトを渡しています。

```dart
@immutable
class ConfirmViewArguments {
  const ConfirmViewArguments({required this.type, required this.data});
  final String type;
  final String data;
}
```

最後に State オブジェクトが不要になるときは dispose が呼び出されるので、後片付けとして `dispose` を override して `_qrController?.dispose()` をしましょう。

```dart
  @override
  void dispose() {
    _qrController?.dispose();
    super.dispose();
  }
```

## 読み込んだ QR コード情報を表示する画面を実装する

- `lib/confirm_view.dart`

```dart
class ConfirmView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('To confirm the scan results'),
      ),
      body: _buildConfirmView(context),
    );
  }

  Widget _buildConfirmView(BuildContext context) {
    final arguments =
        ModalRoute.of(context)!.settings.arguments as ConfirmViewArguments?;
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          Text('Type: ${arguments!.type} Data: ${arguments.data}'),
          ElevatedButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Scan again'),
          ),
          ElevatedButton(
            // これまでのstackを削除して最初の画面に戻る
            onPressed: () => Navigator.pushNamedAndRemoveUntil(
                context, Const.routeFirstPage, (route) => false),
            child: const Text('Back to first page'),
          ),
        ],
      ),
    );
  }
}
```

最後に読み込んだ QR コード情報を表示する画面を実装します。

ここでは先程 QR コードを読み取った時に call される `Navigator.pushNamed` の引数に設定した `ConfirmViewArguments` の情報を表示させています。

また再度 QR コードを読み取るボタンと、`Navigator.pushNamedAndRemoveUntil` で最初の画面に戻るボタンを設置しています。

以上で簡単ですが、`qr_code_scanner` を利用した QR コード読み取りアプリの実装でした。

### iOS でカメラパーミッションを途中で変更するとアプリが落ちる問題

これは iOS のカメラパーミッションのテストをしていて遭遇したバグです。

一度登録したパーミッションを iOS の設定画面から許可 -> 不許可もしくは不許可 -> 許可に変更してアプリに戻るとアプリが落ちる問題が発生しました。

パーミッション変更後にアプリに戻った際にログを見ると `Lost connection to device.` となりアプリが落ちて二度と起動しなくなります。

`Lost connection to device.` 状態になるとその後のログも表示されなくなるので、原因が分からない状態です。

ちなみに Android では途中でパーミッション変更してアプリに戻っても落ちることはありませんでした。

### Android で今回のみパーミッションを選択後に二度とパーミッションダイアログが表示されない問題

Android OS のカメラ許可パーミッションは OS の version により `今回のみ` の選択肢が存在する場合があります。

`今回のみ` を選択した場合、アプリのタスクを落として再度アプリを起動した場合にカメラパーミッション許可ダイアログが表示される想定でした。

ですが再度アプリを起動してもパーミッション許可ダイアログは表示されず、カメラを起動すると真っ黒な QR コード読み取り画面が表示されてしまいます。

この場合のトラブルシューティングとしては OS の設定画面からカメラ権限を `使用中のみ許可` にして再度アプリに戻ればカメラが起動します。

ちなみに iOS のカメラパーミッション許可ダイアログは 許可、不許可の二択で `今回のみ` の選択肢が無かった為この問題は発生しませんでした。

今回実装として、permission_handler package の `Permission.camera.request()` でパーミッション許可ダイアログを表示しています。

Permission.camera.request() で強制的に `今回のみ` を表示させないオプションがあれば良かったのですが、リファレンスをみてもそれらしきオプションがありませんでした。

この 2 件は引き続き調査しますが、もし原因がわかる方いらっしゃいましたら [Twitter](https://twitter.com/zuma_lab) で DM 頂くか、[Contact](/contact) まで連絡頂けると助かります。

## おわりに

今回実装した全てのソースコードは Github にあるので参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="kazuma-fujita/flutter_qr_code_scanner: Practice QR code scanning and camera permission." src="https://hatenablog-parts.com/embed?url=https://github.com/kazuma-fujita/flutter_qr_code_scanner" frameborder="0" scrolling="no"></iframe>

2021/03/04 に Flutter 2.0.0、Dart 2.12.0 のメジャーバージョンアップが発表されましたね。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Google Developers Blog: Announcing Flutter 2" src="https://hatenablog-parts.com/embed?url=https://developers.googleblog.com/2021/03/announcing-flutter-2.html" frameborder="0" scrolling="no"></iframe>

Flutter 2 で Flutter On Web、Desktop が Stable になったり、Dart の FFI が Stable になったりしましたが、個人的に一番嬉しかったのが Dart の Null Safety が Stable に昇格したことですね。

筆者の個人アプリに Flutter2 と Dart の Null Safety を導入してみたので、ぜひこちらの記事を参考にして Flutter2 と Null Safety を導入してみてください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Flutter2のDart Null Safetyを既存のプロジェクトに導入する | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/flutter-dart-sound-null-safety-replace" frameborder="0" scrolling="no"></iframe>

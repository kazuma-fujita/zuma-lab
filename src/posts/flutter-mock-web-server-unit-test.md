---
title: 'Flutter Mock Web Serverでネットワーク通信部分のUnit Testを書く'
date: '2021-05-25'
isPublished: true
metaDescription: 'Flutter Mock Web Serverを利用してネットワーク通信部分の Unit Testを書きます。Mock Web Serverでモックサーバーを立てUnit Testを書くことができます。'
tags:
  - 'Flutter'
  - 'Dart'
  - 'UnitTest'
---

Flutter Mock Web Server を利用してネットワーク通信部分の Unit Test を書きます。

Mock Web Server でモックサーバーを立てて API Client から通信する部分の Unit Test を書くことができます。

Mockito を利用して Http 通信をする API Client をモックしても Unit Test は書けます。

ですが、モックサーバーを立てないと通信エラーのテストまでは書くことが出来ません。

今回はその名の通りの mock_web_server package を利用して Unit Test を書いていきます。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="mock_web_server | Dart Package" src="https://hatenablog-parts.com/embed?url=https://pub.dev/packages/mock_web_server" frameborder="0" scrolling="no"></iframe>

### 環境

- macOS Big Sur 11.3.1
- Android Studio 4.2.1
- Flutter 2.2.0
- Dart 2.13.0

## Package install

pubspec.yaml の dependencies に http、dev_dependencies に mock_web_server を追記してください。

```yaml
dependencies:
  flutter:
    sdk: flutter
  http:

dev_dependencies:
  flutter_test:
    sdk: flutter
  mock_web_server: ^5.0.0-nullsafety.1
```

注意点として、`^5.0.0-nullsafety.1` version を指定してください。

2021/05/25 時点の mock_web_server は prerelease version である 5.0.0 から Null safety に対応しています。

Flutter 2.0.0 から Null safety が推奨され、2.2.0 からデフォルトで Null safety が適用されるようになりました。

## API Client を実装する

ネットワーク通信をする API Client を実装します。

以下のファイル名で API Client を作成してください。

- `lib/api_client.dart`

以下が実装です。

```dart
import 'dart:io';
import 'package:http/http.dart' as http;

abstract class ApiClient {
  Future<String> get(String endpoint);
  Future<String> post(String endpoint, String body);
  Future<String> put(String endpoint, {required String body});
  Future<String> delete(String endpoint);
}

class ApiClientImpl implements ApiClient {
  // factory コンストラクタは instanceを生成せず常にキャッシュを返す(singleton)
  factory ApiClientImpl({required String baseUrl}) {
    return _instance ??= ApiClientImpl._internal(baseUrl);
  }
  // クラス生成時に instance を生成する class コンストラクタ
  ApiClientImpl._internal(this.baseUrl);
  // singleton にする為の instance キャッシュ
  static ApiClientImpl? _instance;
  // APIの基底Url
  final String baseUrl;

  static const headers = <String, String>{'content-type': 'application/json'};

  Future<String> _safeApiCall(Function() callback) async {
    try {
      final response = await callback() as http.Response;
      return _parseResponse(response.statusCode, response.body);
    } on SocketException {
      throw Exception('No Internet Connection');
    }
  }

  @override
  Future<String> get(String endpoint) async {
    return _safeApiCall(() async => http.get(Uri.parse('$baseUrl$endpoint')));
  }

  @override
  Future<String> post(String endpoint, String body) async {
    return _safeApiCall(() async =>
        http.put(Uri.parse('$baseUrl$endpoint'), headers: headers, body: body));
  }

  @override
  Future<String> put(String endpoint, {required String body}) async {
    return _safeApiCall(() async =>
        http.put(Uri.parse('$baseUrl$endpoint'), headers: headers, body: body));
  }

  @override
  Future<String> delete(String endpoint) async {
    return _safeApiCall(
        () async => http.delete(Uri.parse('$baseUrl$endpoint')));
  }

  String _parseResponse(int httpStatus, String responseBody) {
    switch (httpStatus) {
      case 200:
      case 201:
      case 204:
        return responseBody;
      case 400:
        throw Exception('400 Bad Request');
      case 401:
        throw Exception('401 Unauthorized');
      case 402:
                          :
                          :
                          :
      case 510:
        throw Exception('510 Not Extended');
      case 511:
        throw Exception('511 Network Authentication Required');
      default:
        throw Exception('Http status $httpStatus unknown error.');
    }
  }
}
```

API Client は Singleton パターンを使用しています。

API Client は様々な画面から呼ばれる可能性があるので、Singleton で 1 インスタンスのみを生成するようにしています。

通信部分は Http パッケージを利用しています。

今回は get/put/post/delete の通信部分と通信エラー処理の Unit Test を書いていきます。

## Mock Web Server で API Client の Unit Test を書く

それでは Mock Web Server で API Client の Unit Test を書いていきます。

以下のファイルを追加してください。

- `test/api_client_test.dart`

以下が Unit Test の実装となります。

```dart
import 'package:your_flutter_package/api_client.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mock_web_server/mock_web_server.dart';

void main() {
  final _server = MockWebServer(port: 8081);
  late ApiClient _apiClient;

  setUp(() {
    _apiClient = ApiClientImpl(baseUrl: 'http://127.0.0.1:8081');
    _server.start();
  });

  tearDown(_server.shutdown);

  group('API client communication testing', () {
    test('Http status code "200 OK" with get method testing', () async {
      _server.enqueue(httpCode: 200, body: '{ "message" : "Testing for get" }');
      final responseBody = await _apiClient.get('/endpoint');
      expect(responseBody, '{ "message" : "Testing for get" }');
      final request = _server.takeRequest();
      expect(request.uri.path, '/endpoint');
    });

    test('Http status code "201 Created" with put method testing', () async {
      _server.enqueue(httpCode: 201, body: '{ "title" : "Testing for put" }');
      final responseBody = await _apiClient.put('/endpoint',
          body: '{ "title" : "Testing for put" }');
      expect(responseBody, '{ "title" : "Testing for put" }');
      final request = _server.takeRequest();
      expect(request.uri.path, '/endpoint');
      expect(request.body, '{ "title" : "Testing for put" }');
    });

    test('Http status code "204 No Content" with post method testing',
        () async {
      _server.enqueue(httpCode: 204);
      final responseBody = await _apiClient.post(
        '/endpoint',
        '{ "title" : "Testing for post" }',
      );
      expect(responseBody, isEmpty);
      final request = _server.takeRequest();
      expect(request.uri.path, '/endpoint');
      expect(request.body, '{ "title" : "Testing for post" }');
    });

    test('Http status code 4XX testing', () async {
      for (var i = 0; i < 19; i++) {
        final statusCode = int.parse('40$i');
        _server.enqueue(httpCode: statusCode);
        expect(() => _apiClient.get('/endpoint'), throwsException);
      }
      final statusCodes = [422, 425, 426, 428, 429, 431, 451];
      for (final statusCode in statusCodes) {
        _server.enqueue(httpCode: statusCode);
        expect(() => _apiClient.get('/endpoint'), throwsException);
      }
    });

    test('Http status code 5XX testing', () async {
      for (var i = 0; i < 9; i++) {
        final statusCode = int.parse('50$i');
        _server.enqueue(httpCode: statusCode);
        expect(() => _apiClient.get('/endpoint'), throwsException);
      }
      final statusCodes = [510, 511];
      for (final statusCode in statusCodes) {
        _server.enqueue(httpCode: statusCode);
        expect(() => _apiClient.get('/endpoint'), throwsException);
      }
    });

    test('Other http status code testing', () async {
      final statusCodes = [300];
      for (final statusCode in statusCodes) {
        _server.enqueue(httpCode: statusCode);
        expect(() => _apiClient.get('/endpoint'), throwsException);
      }
    });
  });

  group('API communication error testing', () {
    test('Network error testing', () {
      _server
        ..shutdown()
        ..enqueue(httpCode: 200);
      expect(() => _apiClient.get('/endpoint'), throwsException);
      expect(_server.takeRequest().uri.path, '/endpoint');
    });
  });
}
```

それぞれポイントを解説していきます。

```dart
void main() {
  final _server = MockWebServer(port: 8081);
  late ApiClient _apiClient;

  setUp(() {
    _apiClient = ApiClientImpl(baseUrl: 'http://127.0.0.1:8081');
    _server.start();
  });

  tearDown(_server.shutdown);
```

まず、MockWebServer のインスタンスを生成する時に port 番号を指定します。

筆者は使用していない 8081port を指定しました。

setUp はテストケース実行毎に call される method です。

ApiClientImpl は Singleton なので、1 インスタンスの副作用がでないようにテストケース毎にインスタンスを生成しています。

また、コンストラクタ引数の baseUrl には `http://127.0.0.1:8081` を指定しています。

`http://127.0.0.1` mock_web_server で立てるモックサーバーの URL です。

また、`8081` port は先程 MockWebServer のコンストラクタ引数で指定した値です。

次に setUp 内の `_server.start()` でモックサーバーを起動しています。

tearDown で全てのテストケースが終了したら `_server.shutdown` でモックサーバーを停止します。

あとは以下のように `_server.enqueue` で httpCode と responseBody を指定してモックサーバーを stab 化します。

```dart
    test('Http status code "200 OK" with get method testing', () async {
      _server.enqueue(httpCode: 200, body: '{ "message" : "Testing for get" }');
      final responseBody = await _apiClient.get('/endpoint');
      expect(responseBody, '{ "message" : "Testing for get" }');
      final request = _server.takeRequest();
      expect(request.uri.path, '/endpoint');
    });
```

`await _apiClient.get` した時にモックサーバーからは enqueue で設定した json の値 `{ "message" : "Testing for get" }` が返却されます。

expect で responseBody が間違いないか検証できます。

また、`_server.takeRequest()` をすると、`_apiClient.get` をした時の URI Path が取得できます。

expect でその endpoint が間違いないか検証できます。

また、以下のように `_server.takeRequest()` から取得した `request.body` で POST や PUT で request した時の body の値を検証できます。

```dart
    test('Http status code "201 Created" with put method testing', () async {
      _server.enqueue(httpCode: 201, body: '{ "title" : "Testing for put" }');
      final responseBody = await _apiClient.put('/endpoint',
          body: '{ "title" : "Testing for put" }');
      expect(responseBody, '{ "title" : "Testing for put" }');
      final request = _server.takeRequest();
      expect(request.uri.path, '/endpoint');
      expect(request.body, '{ "title" : "Testing for put" }');
    });
```

通信エラーのテストは以下のように `_server.shutdown()` してからネットワーク通信することにより検証できます。

```dart
    test('Network error testing', () {
      _server
        ..shutdown()
        ..enqueue(httpCode: 200);
      expect(() => _apiClient.get('/endpoint'), throwsException);
      expect(_server.takeRequest().uri.path, '/endpoint');
    });
```

これで ApiClientImpl の `_safeApiCall` method の SocketException ロジックが有効か検証できます。

```dart
  Future<String> _safeApiCall(Function() callback) async {
    try {
      final response = await callback() as http.Response;
      return _parseResponse(response.statusCode, response.body);
    } on SocketException {
      throw Exception('No Internet Connection');
    }
  }
```

このように mock_web_server package を使用してリアルなサーバーの動きを再現することができます。

## おわりに

今回は mock_web_server でモックサーバーを立てて API Client から通信する部分の Unit Test を書きました。

Unit Test に関しては、前回 Class の Mocking package である Mockito の紹介記事を書いたので興味があれば御覧ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="FlutterのNull safetyに対応したMockitoの基本的な使い方 | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/flutter-mockito-null-safety-unit-test" frameborder="0" scrolling="no"></iframe>

また、今回使用したソースは Github に公開してますので参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="kazuma-fujita/flutter_mockito_di_unit_test: Testing using mockito for DI'd modules." src="https://hatenablog-parts.com/embed?url=https://github.com/kazuma-fujita/flutter_mockito_di_unit_test" frameborder="0" scrolling="no"></iframe>

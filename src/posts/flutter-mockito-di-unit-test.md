---
title: 'Flutter RiverpodでDIしたクラスをMockitoでモック化してUnitTestを書く'
date: '2021-05-28'
isPublished: true
metaDescription: 'Flutter Riverpod で DI した クラス を Mockito でモック化して UnitTest を書きます。Repository Class に DI した ApiClient Class を Mockito の Mock 対象とします。'
tags:
  - 'Flutter'
  - 'Dart'
  - 'Mockito'
  - 'UnitTest'
---

Flutter Riverpod で DI したクラスを Mockito でモック化して UnitTest を書きます。

アーキテクチャとして MVVM を想定し、Data 層である ApiClient Class と Repository Class を Reverpod で DI します。

Repository Class に DI した ApiClient Class を Mockito の Mock 対象とします。

Mockito を使用して Repository Class の Unit Test を書いていきます。

### 環境

- macOS Big Sur 11.3.1
- Android Studio 4.2.1
- Flutter 2.2.0
- Dart 2.13.0

## Package install

pubspec.yaml に以下を追記して `flutter pub get` を実行します。

```yaml
dependencies:
  flutter:
    sdk: flutter
  freezed_annotation: ^0.14.2
  hooks_riverpod: ^0.14.0+4
  http: ^0.13.3
  state_notifier: ^0.7.0

dev_dependencies:
  build_runner: 2.0.4
  flutter_test:
    sdk: flutter
  freezed: ^0.14.2
  json_serializable: ^4.1.3
  mockito: ^5.0.9
  mock_web_server: ^5.0.0-nullsafety.1
```

## ApiClient Class を実装する

今回 Mock 対象となるネットワーク通信をする API Client を実装します。

以下のファイル名で API Client を作成します。

- `lib/api_client.dart`

```dart
import 'dart:io';
import 'package:http/http.dart' as http;

abstract class ApiClient {
  Future<String> get(String endpoint);
  Future<String> post(String endpoint, {required String body});
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
  Future<String> post(String endpoint, {required String body}) async {
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

Mock Web Server を利用して ApiClient Class 自体の Unit Test は以前に記事を書いたのでこちらを参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Flutter Mock Web Serverでネットワーク通信部分のUnit Testを書く | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/flutter-mock-web-server-unit-test" frameborder="0" scrolling="no"></iframe>

## Entity Class を実装する

次に API レスポンスデータを格納する Entity Class を実装します。

- `lib/entity.dart`

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

  factory Entity.fromJson(Map<String, dynamic> json) => _$EntityFromJson(json);
}
```

Entity は id と title と description をプロパティに持ったシンプルな Class です。

コード中では freezed と json_serializable を利用しているので、Entity を実装したら以下コマンドを実行して `entity.freezed.dart` と `entity.g.dart` のコード生成をします。

```txt
flutter pub run build_runner build
```

## Repository Class を実装する

UnitTest 対象である Repository Class を実装します。

- `lib/repository.dart`

```dart
import 'dart:convert';
import 'api_client.dart';
import 'entity.dart';

abstract class Repository {
  Future<List<Entity>> fitchList();
  Future<void> createTodo({required String title, String? description});
  Future<void> updateTodo(
      {required int id, required String title, String? description});
  Future<void> deleteTodo({required int id});
}

class RepositoryImpl implements Repository {
  RepositoryImpl({required this.apiClient});

  final ApiClient apiClient;

  static const endPoint = '/todos';

  @override
  Future<List<Entity>> fitchList() async {
    final responseBody = await apiClient.get(endPoint);
    try {
      final decodedJson = json.decode(responseBody) as List<dynamic>;
      return decodedJson
          .map((dynamic itemJson) =>
              Entity.fromJson(itemJson as Map<String, dynamic>))
          .toList();
    } on Exception catch (error) {
      throw Exception('Json decode error: $error');
    }
  }

  @override
  Future<void> createTodo({required String title, String? description}) async {
    final body = {
      'title': title,
      if (description != null) 'description': description,
    };

    await apiClient.post(endPoint, body: json.encode(body));
  }

  @override
  Future<void> updateTodo(
      {required int id, required String title, String? description}) async {
    final body = {
      'title': title,
      if (description != null) 'description': description,
    };
    await apiClient.put('$endPoint/$id', body: json.encode(body));
  }

  @override
  Future<void> deleteTodo({required int id}) async {
    await apiClient.delete('$endPoint/$id');
  }
}
```

ポイントとしては、Class のコンストラクタで外から ApiClient Class を注入しています。

```dart
class RepositoryImpl implements Repository {
  RepositoryImpl({required this.apiClient});

  final ApiClient apiClient;
```

また、fetchList method で、API の GET で取得した json データを decode しています。

decode したデータを Entity の fromJson method を使用して Entity のプロパティにマッピングしています。

```dart
  @override
  Future<List<Entity>> fitchList() async {
    final responseBody = await apiClient.get(endPoint);
    try {
      final decodedJson = json.decode(responseBody) as List<dynamic>;
      return decodedJson
          .map((dynamic itemJson) =>
              Entity.fromJson(itemJson as Map<String, dynamic>))
          .toList();
    } on Exception catch (error) {
      throw Exception('Json decode error: $error');
    }
  }
```

## Riverpod で ApiClient Class と Repository Class を DI する

main.dart を開いて、先程作成した ApiClient Class と Repository Class を DI します。

- `lib/main.dart`

```dart
import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'api_client.dart';
import 'repository.dart';

final apiClientProvider = Provider.autoDispose(
  (_) => ApiClientImpl(baseUrl: 'http://127.0.0.1:8080'),
);

final repositoryProvider = Provider.autoDispose(
  (ref) => RepositoryImpl(apiClient: ref.read(apiClientProvider)),
);

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      title: 'Mockito Unit Test Demo',
    );
  }
}
```

Riverpod の `Provider.autoDispose` method で先程作成した Class を保持した Provider オブジェクトを生成します。

以下が Repository Class に ApiClient Class を DI している箇所です。

```dart
final repositoryProvider = Provider.autoDispose(
  (ref) => RepositoryImpl(apiClient: ref.read(apiClientProvider)),
);
```

## Repository Class の Unit Test を書く

本題の Repository Class の Unit Test を書いていきます。

以下が Unit Test 実装です。

- `test/repository_test.dart`

```dart
import 'package:flutter_mockito_di_unit_test/entity.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_mockito_di_unit_test/api_client.dart';
import 'package:flutter_mockito_di_unit_test/repository.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';
import 'fixture.dart';
import 'repository_test.mocks.dart';

@GenerateMocks([ApiClient])
void main() {
  late MockApiClient _apiClient;
  late Repository _repository;

  setUp(() {
    _apiClient = MockApiClient();
    _repository = RepositoryImpl(apiClient: _apiClient);
  });

  group('Todo repository testing', () {
    test('Test of fetch list with empty response.', () async {
      when(_apiClient.get(any)).thenAnswer((_) async => '[]');
      final todoList = await _repository.fitchList();
      verify(_apiClient.get(any)).called(1);
      expect(
          todoList,
          isA<List<Entity>>()
              .having((list) => list, 'isNotNull', isNotNull)
              .having((list) => list.length, 'length', 0));
    });

    test('Test of fetch list.', () async {
      final mockResponse = fixture('get_response.json');
      when(_apiClient.get(any)).thenAnswer((_) async => mockResponse);
      final todoList = await _repository.fitchList();
      verify(_apiClient.get(any)).called(1);
      expect(
        todoList,
        isA<List<Entity>>()
            .having((list) => list, 'isNotNull', isNotNull)
            .having((list) => list.length, 'length', 3)
            .having((list) => list[0].id, 'id', 1)
            .having((list) => list[0].title, 'title', 'First task')
            .having((list) => list[1].id, 'id', 2)
            .having((list) => list[1].title, 'title', 'Second task')
            .having((list) => list[2].id, 'id', 3)
            .having((list) => list[2].title, 'title', 'Third task')
            .having((list) => list[2].description, 'description',
                'Description of tasks for testing.'),
      );
    });

    test('Test of create todo.', () async {
      when(_apiClient.post(any, body: anyNamed('body')))
          .thenAnswer((_) async => '{"id": 1, "title": "First task"}');
      await _repository.createTodo(title: 'dummy');
      verify(_apiClient.post(any, body: anyNamed('body'))).called(1);
    });

    test('Test of update todo.', () async {
      when(_apiClient.put(any, body: anyNamed('body')))
          .thenAnswer((_) async => '{"id": 2, "title": "Rename task"}');
      await _repository.updateTodo(id: 1, title: 'dummy');
      verify(_apiClient.put(any, body: anyNamed('body'))).called(1);
    });

    test('Test of delete todo.', () async {
      when(_apiClient.delete(any)).thenAnswer((_) async => '');
      await _repository.deleteTodo(id: 1);
      verify(_apiClient.delete(any)).called(1);
    });
  });

  group('Todo repository error testing', () {
    test('Test of fetch list with format error json.', () async {
      final mockResponse = fixture('format_error_response.json');
      when(_apiClient.get(any)).thenAnswer((_) async => mockResponse);
      expect(() => _repository.fitchList(), throwsException);
    });
  });
}
```

ポイントとして、まず冒頭で `@GenerateMocks` アノテーションでモック対象である ApiClient を指定します。

```dart
@GenerateMocks([ApiClient])
void main() {
```

次に Mockito のモックコードを生成する為に以下 build_runner コマンドを実行します。

```txt
flutter pub run build_runner build
```

実行後 `test/repository_test.mocks.dart` というファイルが生成されます。

これがモック化された ApiClient Class の実体となり、MockApiClient という Class が生成されています。

これで Mockito を使用したテストを書く準備は完了です。

Mockito の基本的な使用方法は以前の記事でも紹介しているので、より詳しく知りたい方はご覧ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="FlutterのNull safetyに対応したMockitoの基本的な使い方 | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/flutter-mockito-null-safety-unit-test" frameborder="0" scrolling="no"></iframe>

次に `setUp` コールバック内で Repository Class に MockApiClient インスタンスを DI します。

```dart
@GenerateMocks([ApiClient])
void main() {
  late MockApiClient _apiClient;
  late Repository _repository;

  setUp(() {
    _apiClient = MockApiClient();
    _repository = RepositoryImpl(apiClient: _apiClient);
  });
```

次に具体的に `repository.fitchList` の Unit Test で Mockito の使用方法を見てみます。

```dart
    test('Test of fetch list.', () async {
      final mockResponse = fixture('get_response.json');
      when(_apiClient.get(any)).thenAnswer((_) async => mockResponse);
      final todoList = await _repository.fitchList();
      verify(_apiClient.get(any)).called(1);
      expect(
        todoList,
        isA<List<Entity>>()
            .having((list) => list, 'isNotNull', isNotNull)
            .having((list) => list.length, 'length', 3)
            .having((list) => list[0].id, 'id', 1)
            .having((list) => list[0].title, 'title', 'First task')
            .having((list) => list[1].id, 'id', 2)
            .having((list) => list[1].title, 'title', 'Second task')
            .having((list) => list[2].id, 'id', 3)
            .having((list) => list[2].title, 'title', 'Third task')
            .having((list) => list[2].description, 'description',
                'Description of tasks for testing.'),
      );
    });
```

Test Case 中に fixture という function 出てきます。

こちらは外部ファイル化した API テストデータを文字列データにして取得する自作関数です。

```dart
final mockResponse = fixture('get_response.json');
```

API レスポンスのテストデータを外部ファイル化して取得する方法は以前の記事を参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="[Flutter] テストデータを外部ファイル化してUnit Testを書く | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/flutter-using-fixtures-in-testing" frameborder="0" scrolling="no"></iframe>

mockResponse はテストデータが String となって格納されます。

実際のテストデータはこちらになります。

- `test/fixtures/get_response.json`

```json
[
  {
    "id": 1,
    "title": "First task"
  },
  {
    "id": 2,
    "title": "Second task"
  },
  {
    "id": 3,
    "title": "Third task",
    "description": "Description of tasks for testing."
  }
]
```

次に Mockito の when method を利用して、モック化した ApiClient の get method に mockResponse を設定します。

```dart
      when(_apiClient.get(any)).thenAnswer((_) async => mockResponse);
      final todoList = await _repository.fitchList();
      verify(_apiClient.get(any)).called(1);
```

このテストケースでは `apiClient.get` method をスタブ化いています。

apiClient.get は `Future<String>` を return する Future method です。

Future method をスタブ化するには thenAnswer を利用します。

thenReturn を使って `Future` や `Stream` でスタブ化すると `ArgumentError` が発生します。

when method の引数にはスタブ化する method を指定します。

`apiClient.get` の引数に設定している any は Argument matchers の一つでどんな文字列でもマッチします。

以下の例だと、どんな文字列が引数で渡されても false を return します。

```dart
    // You can use any argument to match any.
    when(cat.eatFood(any)).thenReturn(false);
    expect(cat.eatFood('many mice'), isFalse);
    verify(cat.eatFood('many mice'));
```

API のモックなどは戻り値が重要で、引数はあまり重要ではない場面があります。

そういう時に any を利用すると任意の文字列を引数に出来るので便利です。

ただし int や double 型の引数には any は利用できないので注意が必要です。

Repository の fitchList method を実行すると内部的にモック化された `apiClient.get` が call されます。

`_repository.fitchList()` で先程設定した mockResponse の内容が entity に変換され、 todoList として return されます。

```dart
      when(_apiClient.get(any)).thenAnswer((_) async => mockResponse);
      final todoList = await _repository.fitchList();
      verify(_apiClient.get(any)).called(1);
```

verify method はモック化した method が呼び出されたかを検証します。

今回のケースでは `_apiClient.get` が一回呼び出されたことを検証しています。

あとは expect で get_response.json の内容が entity として変換されたか検証をします。

```dart
      expect(
        todoList,
        isA<List<Entity>>()
            .having((list) => list, 'isNotNull', isNotNull)
            .having((list) => list.length, 'length', 3)
            .having((list) => list[0].id, 'id', 1)
            .having((list) => list[0].title, 'title', 'First task')
            .having((list) => list[1].id, 'id', 2)
            .having((list) => list[1].title, 'title', 'Second task')
            .having((list) => list[2].id, 'id', 3)
            .having((list) => list[2].title, 'title', 'Third task')
            .having((list) => list[2].description, 'description',
                'Description of tasks for testing.'),
      );
```

## おわりに

今回紹介した Mockito の使用方法はほんの一例で、Flutter の Mockito には様々な method が用意されています。

Mockito の基本的な使用方法を知りたい方は以前書いた記事をご覧ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="FlutterのNull safetyに対応したMockitoの基本的な使い方 | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/flutter-mockito-null-safety-unit-test" frameborder="0" scrolling="no"></iframe>

最後に今回掲載した全てのソースコードは Github にありますので参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="kazuma-fujita/flutter_mockito_di_unit_test: Testing using mockito for DI'd modules." src="https://hatenablog-parts.com/embed?url=https://github.com/kazuma-fujita/flutter_mockito_di_unit_test" frameborder="0" scrolling="no"></iframe>

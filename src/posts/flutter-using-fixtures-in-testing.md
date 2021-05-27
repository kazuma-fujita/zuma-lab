---
title: '[Flutter] テストデータを外部ファイル化してUnit Testを書く'
date: '2021-05-27'
isPublished: true
metaDescription: 'FlutterのUnit Testで利用するAPIレスポンスのjsonスタブデータを外部ファイルから取得します。'
tags:
  - 'Flutter'
  - 'Dart'
  - 'UnitTest'
---

Flutter で API から返却される API レスポンスのスタブデータを外部ファイル化して、Unit Test を書いてみます。

アーキテクチャとしては MVVM で Data 層である Repository のテストを書く事を想定します。

### 環境

- macOS Big Sur 11.3.1
- Android Studio 4.2.1
- Flutter 2.2.0
- Dart 2.13.0

## テスト対象コード

以下がテスト対象のコードです。

この Repository Class は fitchList method で取得した API レスポンスである json データを decode して entity に mapping しています。

ApiClient は Http 通信をして API からデータを取得する Class です。

```dart
abstract class Repository {
  Future<List<Entity>> fitchList();
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
}
```

今回はこの API レスポンスの json データをスタブ化して Unit Test を書いてみます。

## スタブデータを外部ファイル化する

API レスポンスをスタブデータ化して Unit Test を書くにあたり、まずスタブデータを外部ファイル化する必要があります。

まずスタブデータを置くディレクトリを作成します。

test 配下に fixtures ディレクトリを作成してください。

(コマンドラインで作成していますが、もちろん IDE 上で作成して問題ありません。)

```txt
mkdir {your_project}/test/fixtures
```

次に fixtures 配下に `get_response.json` ファイルを作成します。

```txt
touch {your_project}/test/fixtures/get_response.json
```

この `get_response.json` ファイルがスタブデータです。

スタブデータの内容は以下の通りです。

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

## スタブデータを取得する fixture.dart を実装する

作成したスタブデータを取得する function を作成します。

`test/fixture.dart` ファイルを作成して以下の内容を追記します。

```dart
import 'dart:io';

String fixture(String name) {
  var dir = Directory.current.path;
  if (dir.endsWith('/test')) {
    dir = dir.replaceAll('/test', '');
  }
  return File('$dir/test/fixtures/$name').readAsStringSync();
}
```

`test/fixtures` 配下にあるファイルを読み込んで String にして return しています。

## スタブデータを利用して Unit Test を書く

Unit Test のソースコードで先程作成した fixture function を呼び出してスタブデータを取得します。

`test/repository_test.dart` ファイルを作成します。

以下が Unit Test のコードです。

```dart
@GenerateMocks([ApiClient])
void main() {
  late MockApiClient _apiClient;
  late Repository _repository;

  setUp(() {
    _apiClient = MockApiClient();
    _repository = RepositoryImpl(apiClient: _apiClient);
  });

  group('Repository testing.', () {
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
  });
}
```

fixture function で使用するスタブデータのファイル名を指定します。

```dart
final mockResponse = fixture('get_response.json');
```

mockResponse はスタブデータが String となって格納されます。

Mockito を利用してモック化した ApiClient の get method に mockResponse を設定します。

Mockito に関しては以前基本的な使用方法を書いたのでこちらを参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="FlutterのNull safetyに対応したMockitoの基本的な使い方 | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/flutter-mockito-null-safety-unit-test" frameborder="0" scrolling="no"></iframe>

Repository の fitchList method を実行すると内部的にモック化された `apiClient.get` が call されます。

`_repository.fitchList()` は先程設定した mockResponse の内容が entity に変換され、 todoList として return されます。

```dart
when(_apiClient.get(any)).thenAnswer((_) async => mockResponse);
final todoList = await _repository.fitchList();
```

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

Entity は以下です。

id と title、description のプロパティしかないシンプルな Entity です。

```dart
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

今回はプロパティが少ないのであまりスタブデータの恩恵を感じられませんが、大量のフィールドのレスポンスを返却するような API に対してはスタブデータは有効です。

Unit Test のテストコードに直接大量のスタブデータを記述すると可読性が低くなる上、メンテナンスも面倒になってきます。

ぜひスタブデータは外部ファイル化することをオススメします。

## おわりに

最後に、今回掲載している全てのソースコードは Github にあるので参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="kazuma-fujita/flutter_mockito_di_unit_test: Testing using mockito for DI'd modules." src="https://hatenablog-parts.com/embed?url=https://github.com/kazuma-fujita/flutter_mockito_di_unit_test" frameborder="0" scrolling="no"></iframe>

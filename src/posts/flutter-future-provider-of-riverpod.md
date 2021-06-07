---
title: 'Flutter RiverpodのFutureProviderでAPI通信処理を楽に実装する'
date: '2021-06-07'
isPublished: true
metaDescription: 'Flutter の Riverpod の FutureProvider を利用すれば API 通信処理をとても楽に実装できます。また、FutureProvider は AsyncValue のオブジェクトを生成してくれます。'
tags:
  - 'Flutter'
  - 'Dart'
  - 'Riverpod'
---

Flutter の Riverpod の FutureProvider を利用すれば API 通信処理をとても楽に実装できます。

前提として、今回は使用するアーキテクチャを MVVM パターンとします。

ViewModel の代わりとして Riverpod の FutureProvider を利用できます。

また、FutureProvider は AsyncValue のオブジェクトを生成してくれます。

AsyncValue は非同期通信の通信中、通信終了、異常終了処理をハンドリングしてくれる Riverpod の便利な機能です。

View 側ではこの AsyncValue を利用して通信状態により ListView や、CircularProgressIndicator Widget の出し分け処理を記述することが可能です。

AsyncValue の詳細については以前の記事をご覧ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Flutter Riverpod の AsyncValue で非同期通信時のローディングとエラー処理を楽に実装する | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/flutter-search-github-repositories-with-async-value" frameborder="0" scrolling="no"></iframe>

それでは具体的に FutureProvider を利用した実装をみていきましょう。

### 環境

- macOS Big Sur 11.4
- Android Studio 4.2.1
- Flutter 2.2.0
- Dart 2.13.0

## Package install

pubspec.yaml を開いて以下追記します。

```yaml
dependencies:o
  flutter:
    sdk: flutter
  freezed_annotation: ^0.14.2
  hooks_riverpod: ^0.14.0+4

dev_dependencies:
  build_runner: ^2.0.4
  flutter_test:
    sdk: flutter
  freezed: ^0.14.2
  json_serializable: ^4.1.3
```

追記したら `flutter pub get` を実行しましょう。

今回 Entity を作成するのに Freezed を利用するので、その関連パッケージも install します。

## Entity Class を実装する

画面に表示データを格納する Entity Class を実装します。

- `lib/entity.dart`

```dart
import 'package:flutter/foundation.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

part 'entity.freezed.dart';

@freezed
abstract class Entity with _$Entity {
  const factory Entity({
    required int id,
    required String title,
  }) = _Entity;
}
```

Entity は id と title をプロパティに持ったシンプルな Class です。

コード中では Freezed を利用しているので、Entity を実装したら以下コマンドを実行して `entity.freezed.dart` のコード生成をします。

```txt
flutter pub run build_runner build
```

## Repository Class を実装する

API からネットワーク通信をしてデータを取得する Repository Class を実装します。

今回は FutureProvider の解説記事の為、Repository のネットワーク通信部分は割愛します。

- `lib/repository.dart`

```dart
class Repository {
  Future<List<Entity>> fetchList() async {
    return [];
  }
}
```

Repository のネットワーク通信処理を詳しく知りたい方は以前の記事を参考にしてください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Flutter RiverpodでDIしたクラスをMockitoでモック化してUnitTestを書く | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/flutter-mockito-di-unit-test" frameborder="0" scrolling="no"></iframe>

## FutureProvider で Repository からのデータ取得処理を実装する

次に main.dart を開いて本題の FutureProvider の実装をします。

- `lib/main.dart`

```dart
final repositoryProvider = Provider((ref) => Repository());

final listProvider = FutureProvider<List<Entity>>((ref) async {
  final repository = ref.read(repositoryProvider);
  return repository.fetchList();
});

void main() {
  runApp(
    ProviderScope(
      child: MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Future Provider Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: View(),
    );
  }
}
```

FutureProvider の実装箇所では、まず Provider の callback で Repository を保持した repositoryProvider インスタンス生成処理を実装します。

次に FutureProvider の callback で ref.read を使って Repository インスタンス を取得、 repository.fetchList method の実行結果を返却する処理を実装をします。

```dart
final repositoryProvider = Provider((ref) => Repository());

final listProvider = FutureProvider<List<Entity>>((ref) async {
  final repository = ref.read(repositoryProvider);
  return repository.fetchList();
});
```

FutureProvider の便利なのが、この記述だけで AsyncValue のオブジェクトを生成してくれることです。

今回のケースでは listProvider を実行した際に `AsyncValue<List<Entity>>` 型のオブジェクトが返却されます。

冒頭でも説明しましたが、AsyncValue は非同期通信の通信中、通信終了、異常終了処理をハンドリングしてくれる Riverpod の便利な機能です。

View 側ではこの AsyncValue を利用して通信状態により ListView や、CircularProgressIndicator Widget の出し分け処理を記述することが可能です。

## View を実装する

FutureProvider を利用して Repository から取得したデータを画面に表示する View Class を実装します。

```dart
class View extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final asyncValue = context.read(listProvider);
    return Scaffold(
      appBar: AppBar(
        title: const Text('FutureProvider Test'),
      ),
      body: Center(
        child: asyncValue.when(
          data: (list) => list.isNotEmpty
              ? ListView(
                  children: list
                      .map(
                        (Entity entity) => Text(entity.title),
                      )
                      .toList(),
                )
              : const Text('List is empty.'),
          loading: () => const CircularProgressIndicator(),
          error: (error, _) => Text(error.toString()),
        ),
      ),
    );
  }
}
```

先程 main.dart で作成した listProvider で保持している AsyncValue を context.read で取得します。

```dart
class View extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final asyncValue = context.read(listProvider);
```

注意点としては、flutter_riverpod を import しておかないと context.read が利用できないので、必ず flutter_riverpod を import しましょう。

```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
```

次に AsyncValue の when method で非同期通信中の処理、通信が終了した処理、エラーが発生した処理を実装します。

```dart
        asyncValue.when(
          data: (list) => list.isNotEmpty
              ? ListView(
                  children: list
                      .map(
                        (Entity entity) => Text(entity.title),
                      )
                      .toList(),
                )
              : const Text('List is empty.'),
          loading: () => const CircularProgressIndicator(),
          error: (error, _) => Text(error.toString()),
        ),
```

これだけ View 側のネットワーク通信部分が完成しました。

## FutureProvider で取得できるデータをスタブデータに差し替える

Riverpod の FutureProvider に限らず Provider で便利なのが、overrideWithValue で FutureProvider で保持する AsyncValue の値を上書きできることです。

例えば以下のように main.dart で ProviderScope の overrides で FutureProvider の AsyncValue の値を上書きするとします。

```dart
void main() {
  runApp(
    ProviderScope(
      overrides: [
        listProvider.overrideWithValue(
          const AsyncValue.data([
            Entity(id: 1, title: 'First title'),
            Entity(id: 2, title: 'Second title'),
            Entity(id: 3, title: 'Third title'),
          ]),
        )
      ],
      child: MyApp(),
    ),
  );
}
```

View で listProvider を実行した際に、AsyncValue.data に Entity 要素が 3 つある配列が返却されます。

```dart
    final asyncValue = context.read(listProvider);
```

UI の画面表示確認を行いたい時に自由にスタブデータで値を操作出来ると作業がかなり捗ります。

同様に loading や error 処理の値も上書きが可能です。

```dart
    ProviderScope(
      overrides: [
        listProvider.overrideWithValue(const AsyncValue.loading())
      ],
      child: MyApp(),
    ),
```

```dart
    ProviderScope(
      overrides: [
        .overrideWithValue(AsyncValue.error(Exception('Error message'))
      ],
      child: MyApp(),
    ),
```

## おわりに

Riverpod の FutureProvider を利用することにより View の非同期処理を楽に実装することができました。

FutureProvider を利用した View の Unit Test と Widget Test を書く方法も紹介しています。

FutureProvider のテストはとても簡単に書けるので、ぜひ TDD に取り入れてください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Flutter RiverpodのFutureProviderを利用したViewのUnit TestとWidget Testを書く | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/flutter-future-provider-of-riverpod-test" frameborder="0" scrolling="no"></iframe>

最後に、今回使用したソースは Github に置きましたので参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="kazuma-fujita/flutter_future_provider_test: Testing future provider of flutter riverpod." src="https://hatenablog-parts.com/embed?url=https://github.com/kazuma-fujita/flutter_future_provider_test" frameborder="0" scrolling="no"></iframe>

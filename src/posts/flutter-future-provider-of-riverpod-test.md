---
title: 'Flutter RiverpodのFutureProviderを利用したUnit TestとViewのWidget Testを書く'
date: '2021-06-07'
isPublished: true
metaDescription: '今回は FutureProvider の Unit Test と、画面表示の責務を担う View の Widget Test を書いていきます。'
tags:
  - 'Flutter'
  - 'Dart'
  - 'Riverpod'
  - 'UnitTest'
  - 'WidgetTest'
---

Flutter の Riverpod の FutureProvider を利用すれば API 通信処理をとても楽に実装できます。

前回の記事で FutureProvider の使い方を解説しました。

前提として、前回の記事で実装した内容のテストを書くのでまずこちらの記事をご覧ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Flutter RiverpodのFutureProviderでAPI通信処理を楽に実装する | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/flutter-future-provider-of-riverpod" frameborder="0" scrolling="no"></iframe>

こちらの記事では MVVM のアーキテクチャを採用しています。

今回は FutureProvider の Unit Test と、画面表示の責務を担う View の Widget Test を書いていきます。

### 環境

- macOS Big Sur 11.4
- Android Studio 4.2.1
- Flutter 2.2.0
- Dart 2.13.0

## Package install

pubspec.yaml を開いて以下追記します。

```yaml
dependencies:
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

## FutureProvider から取得するデータをスタブ化する

今回、FutureProvider の UnitTest を書くにあたって Provider から取得するデータをスタブ化する必要があります。

Repository を implements した FakeRepository を実装します。

- `test/fake_repository.dart`

```dart
class FakeRepository implements Repository {
  @override
  Future<List<Entity>> fetchList() async {
    return [
      const Entity(id: 1, title: 'First title'),
    ];
  }
}
```

Repository は前回記事に登場した非同期で Entity 配列を取得する class です。

取得データをスタブ化する方法は色々あるのですが、筆者は Fake class を実装するか、Mockito を利用して class をモック化します。

以前 Mockito の使い方を解説した記事を書いたので、ぜひこちらも参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="FlutterのNull safetyに対応したMockitoの基本的な使い方 | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/flutter-mockito-null-safety-unit-test" frameborder="0" scrolling="no"></iframe>

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Flutter RiverpodでDIしたクラスをMockitoでモック化してUnitTestを書く | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/flutter-mockito-di-unit-test" frameborder="0" scrolling="no"></iframe>

## FutureProvider の UnitTest を書く

実際に FutureProvider の UnitTest を書いてきます。

テストの全文はこちらです。

- `test/provider_test.dart`

```dart
  test('Override repository provider.', () async {
    // Override the behavior of repositoryProvider to return
    // FakeRepository instead of Repository.
    final container = ProviderContainer(
      overrides: [
        repositoryProvider.overrideWithProvider(
          Provider((ref) => FakeRepository()),
        ),
      ],
    );

    // The first read if the loading state
    expect(
      container.read(listProvider),
      const AsyncValue<List<Entity>>.loading(),
    );

    // Wait for the request to finish
    await Future<void>.value();

    // Exposes the data fetched
    expect(container.read(listProvider).data!.value, [
      isA<Entity>()
          .having((entity) => entity.id, 'id', 1)
          .having((entity) => entity.title, 'title', 'First title'),
    ]);
  });
```

まず、ProviderContainer で repositoryProvider で保持する Repository class を先程作成した FakeRepository class に差し替えます。

この ProviderContainer は ProviderScope のようなものですが、Flutter Widget に依存しないので、Dart コードのみで Provider の Unit Test を書くことができます。

```dart
    final container = ProviderContainer(
      overrides: [
        repositoryProvider.overrideWithProvider(
          Provider((ref) => FakeRepository()),
        ),
      ],
    );
```

次に FutureProvider の特徴である、非同期処理のテストを書きます。

FutureProvider は AsyncValue が取得できるので、非同期処理のテストを簡単に書くことができます。

まず、Repository から値を取得前のローディング中の状態を検証します。

先程の container.read を利用してテスト対象の listProvider(FutureProvider のインスタンス) の状態を取得します。

expect で AsyncValue の loading の状態であること検証します。

```dart
      expect(
        container.read(listProvider),
        const AsyncValue<List<Entity>>.loading(),
      );
```

次に、`container.read(listProvider)` で実行した非同期処理が終わるのを待つための処理を書きます。

```dart
    await Future<void>.value();
```

非同期処理が完了したら最後に FutureProvider から取得した値の検証します。

```dart
    expect(container.read(listProvider).data!.value, [
      isA<Entity>()
          .having((entity) => entity.id, 'id', 1)
          .having((entity) => entity.title, 'title', 'First title'),
    ]);
```

これでアプリでよくある API から値を取得する前後の状態を時系列でテストすることができました。

ちなみに Fake class や Mockito で Repository から取得できるデータをスタブ化しなくても、FutureProvider の値を直接上書きすることができます。

```dart
      final container = ProviderContainer(
        overrides: [
          listProvider.overrideWithValue(
            const AsyncValue.data([
              Entity(id: 1, title: 'First title'),
              Entity(id: 2, title: 'Second title'),
              Entity(id: 3, title: 'Third title'),
            ]),
          )
        ],
      );

      // Exposes the data fetched
      expect(container.read(listProvider).data!.value, [
        isA<Entity>()
            .having((entity) => entity.id, 'id', 1)
            .having((entity) => entity.title, 'title', 'First title'),
        isA<Entity>()
            .having((entity) => entity.id, 'id', 2)
            .having((entity) => entity.title, 'title', 'Second title'),
        isA<Entity>()
            .having((entity) => entity.id, 'id', 3)
            .having((entity) => entity.title, 'title', 'Third title'),
      ]);
    });
```

ただし、この場合 container.read で取得できる AsyncValue の状態はデータ取得後の値のみで、ローディング中の検証をすることができません。

FutureProvider の UnitTest を書く際は状態変化をまとめて検証したいので Fake class を用意するか Mockito を使用した方が無難でしょう。

## View の Widget Test を書く

次に FutureProvider を利用した View の Widget Test を書いてみましょう。

以下がテストの全文です。

- `test/view_test.dart`

```dart
void main() {
  testWidgets('Testing loading view.', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          listProvider.overrideWithValue(
            const AsyncValue.loading(),
          ),
        ],
        child: MaterialApp(home: View()),
      ),
    );
    // The first frame is a loading state.
    expect(find.byType(CircularProgressIndicator), findsOneWidget);
  });

  testWidgets('Testing empty list view.', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          listProvider.overrideWithValue(
            const AsyncValue.data([]),
          ),
        ],
        child: MaterialApp(home: View()),
      ),
    );

    expect(find.byType(CircularProgressIndicator), findsNothing);
    expect(find.text('List is empty.'), findsOneWidget);
  });

  testWidgets('Testing list view.', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          listProvider.overrideWithValue(
            const AsyncValue.data([
              Entity(id: 1, title: 'First title'),
            ]),
          ),
        ],
        child: MaterialApp(home: View()),
      ),
    );

    expect(find.byType(CircularProgressIndicator), findsNothing);
    expect(find.text('First title'), findsOneWidget);
  });

  testWidgets('Testing error view.', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          listProvider.overrideWithValue(
            AsyncValue.error(Exception('Error message')),
          ),
        ],
        child: MaterialApp(home: View()),
      ),
    );

    expect(find.byType(CircularProgressIndicator), findsNothing);
    expect(find.text('Exception: Error message'), findsOneWidget);
  });
}
```

筆者は WidgetTest で FutureProvider の UnitTest のように時系列でローディング中、データ取得の検証が出来ませんでした。

もしいい方法があるよ、という方は Twitter で DM 頂くか、問い合わせフォームから連絡頂けれると大変うれしいです。

今回は FutureProvider の overrideWithValue を利用して状態を一つづつ検証するやり方をしています。

まず、ローディング中の状態を検証してみましょう。

まず、Widget Test では tester.pumpWidget にテスト対象の View Widget を指定する必要があります。

注意点として、必ずテスト対象の View Widget は MaterialApp でラップしてください。

```dart
  testWidgets('Testing loading view.', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          listProvider.overrideWithValue(
            const AsyncValue.loading(),
          ),
        ],
        child: MaterialApp(home: View()),
      ),
    );
    // The first frame is a loading state.
    expect(find.byType(CircularProgressIndicator), findsOneWidget);
  });
```

次に、ProviderScope の overrides に FutureProvider の値を上書く処理を書いていきます。

今回はローディング中の状態を検証をするので、AsyncValue の loading メソッドで上書きます。

最後に expect でローディング Widget である CircularProgressIndicator が View に表示されているかを検証します。

```dart
    expect(find.byType(CircularProgressIndicator), findsOneWidget);
```

後は同じ要領で、値取得結果が 0 件の状態、値取得結果が 1 件だった時の状態、エラーが発生した時の状態を検証していきます。

## おわりに

Riverpod の FutureProvider を利用することにより View の非同期処理を楽に実装することができ、状態遷移のテストを書くことができました。

今回使用したソースは Github にあります。

Unit Test、Widget Test のテスト対象であるソースもこちらにあるので、参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="kazuma-fujita/flutter_future_provider_test: Testing future provider of flutter riverpod." src="https://hatenablog-parts.com/embed?url=https://github.com/kazuma-fujita/flutter_future_provider_test" frameborder="0" scrolling="no"></iframe>

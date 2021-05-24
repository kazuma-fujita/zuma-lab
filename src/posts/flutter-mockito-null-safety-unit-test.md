---
title: 'FlutterのNull safetyに対応したMockitoの基本的な使い方'
date: '2021-05-24'
isPublished: true
metaDescription: 'Mocking packageであるMockitoがnull safetyに対応しました。Mockitoの最新VersionでUnit Testを書いていきます。'
tags:
  - 'Flutter'
  - 'Dart'
---

Flutter の Mocking package である Mockito が Null safety に対応しました。

Mockito の最新 Version で Unit Test を書いていきます。

2021/05/24 現時点での Mockito 最新 Version は 5.0.8 です。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="mockito | Dart Package" src="https://hatenablog-parts.com/embed?url=https://pub.dev/packages/mockito" frameborder="0" scrolling="no"></iframe>

Null safety に対応した Mockito は Mock コードを生成する必要があるので、build_runner の install が必要になります。

こちらも併せて解説していきます。

### 環境

- macOS Big Sur 11.2.3
- Android Studio 4.1.3
- Flutter 2.0.4
- Dart 2.12.2

## Package install

pubspec.yaml の dev_dependencies に以下追記します。

- pubspec.yaml

```yaml
dev_dependencies:
  flutter_test:
    sdk: flutter
  mockito:
  build_runner:
```

追記したら忘れず `fluter pub get` を実行しましょう。

## テスト対象のクラスを作成する

テスト対象となるリアルクラスを作成します。

cat.dart を作成して以下コードを追記します。

- `lib/cat.dart`

```dart
// Real class
class Cat {
  String sound() => 'Meow';
  bool eatFood(String food, {bool? hungry}) => true;
  Future<void> chew() async => print('Chewing...');
  Future<String> yawn() async => 'Yawning...';
  int walk(List<String> places) => 7;
  void sleep() {}
  void hunt(String place, String prey) {}
  int lives = 9;
}

```

## Mock クラスを生成する

次に test ディレクトリ配下に cat_test.dart を作成して以下を記述します。

- `test/cat_test.dart`

```dart
import 'package:{your project name}/cat.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';

@GenerateMocks([Cat])
void main() {
  // Create mock object.
  var cat = MockCat();
}
```

`@GenerateMocks([Cat])` アノテーションで Cat クラスを指定しています。

こちらの公式の解説にある通り、Null safety に対応した Mockito は基本的には Mock クラスを生成して利用します。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="mockito/NULL_SAFETY_README.md at master · dart-lang/mockito" src="https://hatenablog-parts.com/embed?url=https://github.com/dart-lang/mockito/blob/master/NULL_SAFETY_README.md" frameborder="0" scrolling="no"></iframe>

実際には build_runner を利用して、GenerateMocks アノテーションに指定したクラスの Mock クラスを生成します。

それでは flutter コマンドを実行して Mock クラスを生成しましょう。

```txt
flutter pub pub run build_runner build
```

以下ログが流れれば実行完了です。

```txt
[INFO] Running build...
[INFO] Generating SDK summary...
[INFO] 3.4s elapsed, 0/3 actions completed.
[INFO] Generating SDK summary completed, took 3.4s

[INFO] 4.4s elapsed, 0/3 actions completed.
[INFO] 5.4s elapsed, 1/3 actions completed.
[INFO] 12.0s elapsed, 2/3 actions completed.
[INFO] Running build completed, took 12.0s

[INFO] Caching finalized dependency graph...
[INFO] Caching finalized dependency graph completed, took 41ms

[INFO] Succeeded after 12.1s with 1 outputs (3 actions)
```

test ディレクトリを確認してみると `cat_test.mocks.dart` ファイルが生成されています。

GenerateMocks アノテーションを記述したファイルの名前に `.mocks` ポストフィックスが付与されたファイルが新たに生成されます。

これで `MockCat` クラスが生成され、クラスのモックが可能になりました。

注意点としては Cat クラスにメソッドを追加する度に build runner を実行して MockCat クラスを再生成する必要があります。

## Method をモックする

Cat クラスの cat.sound メソッドを Mock してみます。

先程の `cat_test.dart` にテストコードを記述していきます。

```dart
@GenerateMocks([Cat])
void main() {
  final cat = MockCat();

  test('Testing cat sound method.', () {
    when(cat.sound()).thenReturn('Meow');
    verifyNever(cat.sound());
    expect(cat.sound(), 'Meow');
    verify(cat.sound());
    expect(cat.sound(), 'Meow');
  });
}
```

Mockito の when メソッドの thenReturn メソッドで戻り値を指定します。

verifyNever でまだテスト対象のメソッドが呼ばれていないことを検証します。

次に except で実際にモックを実行して戻り値が thenReturn で設定した値となっているか確認します。

verify メソッドでモックメソッドが呼ばれたことを検証します。

これが基本的な Mockito の使い方です。

ちなみに、一度 thenReturn で設定したモックメソッドは何回呼び出しても同じ値を返します。

次に thenReturn の戻り値を変えてみます。

```dart
    when(cat.sound()).thenReturn('Purr');
    expect(cat.sound(), 'Purr');
```

猫の鳴き声を Meow から Purr に設定しました。

expect で変更した鳴き声が正しいことが確認できます。

次に thenAnswer メソッドを利用してみます。

```dart
    // We can calculate a response at call time.
    final responses = ['Mew', 'Purr', 'Meow'];
    when(cat.sound()).thenAnswer((_) => responses.removeAt(0));
    expect(cat.sound(), 'Mew');
    expect(cat.sound(), 'Purr');
    expect(cat.sound(), 'Meow');
```

thenAnswer は callback で戻り値を動的に変更できます。

responses に鳴き声の配列を定義し、thenAnswer の callback でモックメソッドが呼ばれる度に responses の要素を削除して鳴き声を動的に変更しています。

うまく使えば thenReturn で冗長になる書き方を thenAnswer でリファクタリングできそうですね。

## Getter をモックする

次に Cat クラスの lives の getter メソッドをモックしてみます。

```dart
  test('Testing cat lives getters.', () {
    when(cat.lives).thenReturn(9);
    expect(cat.lives, 9);
    verify(cat.lives);
    when(cat.lives).thenReturn(12);
    expect(cat.lives, 12);
  });
```

先程の `cat.sound()` メソッドをモックした時と同じですね。

thenReturn でメソッドも戻り値を設定してあげて except で正しいことを確認しています。

## Throw/Exception をモックする

次に Throw/Exception をモックしてみます。

```dart
  test('Testing exceptions.', () {
    when(cat.lives).thenThrow(RangeError('It\'s beyond a cat\'s live span.'));
    expect(() => cat.lives, throwsRangeError);
    verify(cat.lives);
    when(cat.sound()).thenThrow(Exception('This method has been deprecated.'));
    expect(cat.sound, throwsException);
    verify(cat.sound());
  });
```

Exception エラーをモックするには thenThrow を利用します。

expect の第一引数は `() => テスト対象メソッド` として関数を指定してください。

except で Throw された Exception が正しいことを確認します。

verify でモックメソッドが呼ばれたことを検証できます。

## Future Method をモックする

次に Future Method をモックしてしてみます。

モックする対象のメソッドは Future を return します。

```dart
class Cat {
  Future<String> yawn() async => 'Yawning...';
}
```

Future method は以下のようにモック出来ます。

```dart
  test('Testing future method.', () async {
    when(cat.yawn()).thenAnswer((_) async => 'Yawning...');
    expect(await cat.yawn(), 'Yawning...');
    verify(cat.yawn());
  });
```

Future method をモックするには thenAnswer を利用します。

thenReturn を使って `Future` や `Stream` でスタブ化すると `ArgumentError` が発生します。

モックの return は `thenAnswer((_) async => 'Yawning...')` のように async を利用して Future を return します。

検証する時は `expect(await cat.yawn(), 'Yawning...')` のように await を利用して Future から値を取り出します。

await を利用するので、test メソッドには async を追加しましょう。

## Argument matchers を利用する

Argument matchers は名前付き引数がどのように渡されるかを追跡します。

モック対象メソッドは第一引数(必須)に文字列、第二引数(非必須)に bool 値を受け取り、bool 値を return します。

```dart
class Cat {
  bool eatFood(String food, {bool? hungry}) => true;
}
```

それでは代表的な Argument matchers を使ってみます。

## startsWith

Argument matchers の一つ startsWith を利用してモックしてみます。

```dart
  test('Testing argument matchers.', () {
    when(cat.eatFood(argThat(startsWith('dry')))).thenReturn(true);
    expect(cat.eatFood('dry food'), isTrue);
    verify(cat.eatFood('dry food'));
  });
```

この例だと、dry で始まる文字列を eatFood method の引数とします。

関数呼び出し時に dry で始まる文字列が引数で渡されれば true を return します。

expect で `dry food` 文字列を渡して true が return されることを検証できます。

verify で `dry food` 文字列が引数で渡された状態で method が call されたことを検証できます。

verify で `dry food` を `dry fish` としてテストを実行した場合エラーとなります。

expect で呼び出した method の引数とは異なる為です。

## endsWidth

Argument matchers の endsWith では以下のように fish で終わる文字列の引数を検証できます。

```dart
    when(cat.eatFood(argThat(endsWith('fish')))).thenReturn(true);
    expect(cat.eatFood('big fish'), isTrue);
    verify(cat.eatFood('big fish'));
```

## contains

複数の引数がある method でも Argument matchers は利用できます。

以下の例だと meat で終わる文字列と、hungry: true が引数で渡されれば true を return します。

```dart
    // Or mix arguments with matchers
    when(cat.eatFood(argThat(endsWith('meat')), hungry: true)).thenReturn(true);
    expect(cat.eatFood('big meat', hungry: true), isTrue);
    // You can also verify using an argument matcher.
    verify(cat.eatFood(argThat(contains('big')), hungry: true));
```

そして、verify でも Argument matchers を利用できます。

verify で Argument matchers の一つである `contains` を利用しています。

上記の例だと big が含まれている文字列が引数で渡された状態で method が call されたことを検証しています。

## any

Argument matchers の一つである any はどんな文字列でもマッチします。

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

## Named arguments に any を利用する

Named arguments(名前付き引数)で any を利用する場合は、Argument matchers である anyNamed/argThat/captureAnyNamed/captureThat のどれかを利用します。

以下は eatFood method の名前付き引数である hungry に対して any を指定する場合の例です。

```dart
  test('Testing named arguments.', () {
    // GOOD: argument matchers include their names.
    // anyNamed pattern
    when(cat.eatFood(any, hungry: anyNamed('hungry'))).thenReturn(true);
    expect(cat.eatFood('minnie mouse', hungry: true), isTrue);
    verify(cat.eatFood('minnie mouse', hungry: true));
    // argThat pattern
    when(cat.eatFood(any, hungry: argThat(isNotNull, named: 'hungry')))
        .thenReturn(false);
    expect(cat.eatFood('mickey mouse', hungry: false), isFalse);
    verify(cat.eatFood('mickey mouse', hungry: false));
    // captureAnyNamed pattern
    when(cat.eatFood(any, hungry: captureAnyNamed('hungry'))).thenReturn(true);
    expect(cat.eatFood('donald duck', hungry: true), isTrue);
    verify(cat.eatFood('donald duck', hungry: true));
    // captureThat pattern
    when(cat.eatFood(any, hungry: captureThat(isNotNull, named: 'hungry')))
        .thenReturn(false);
    expect(cat.eatFood('donald duck', hungry: false), isFalse);
    verify(cat.eatFood('donald duck', hungry: false));
  });
```

見て分かる通り、どの Argument matchers を利用する場合も hungry という引数名を記述しています。

どうやら Dart の言語仕様上このように面倒な記述になるようです。

個人的には一番記述量の少ない `anyNamed` を利用するのがいいかなと思います。

## verify の様々な method 呼び出しカウント方法

verify は method が call された回数を検証します。

verify は明示的に called method で call された回数を指定できます。

(called method を指定しなかった場合 1 回 call されたことを検証します)

以下の例では、sound method が 2 回呼ばれたことを明示的に指定しています。

```dart
  test('Testing verify and verifyNever.', () {
    // The cat sound method will be called twice.
    when(cat.sound()).thenReturn('Mew');
    cat.sound();
    cat.sound();
    // Exact number of invocations
    verify(cat.sound()).called(2);
  });
```

更に以下の例では、called method に Argument matchers である greaterThen を使用して `1回以上呼ばれた` ことを検証しています。

Argument matchers を利用すれば柔軟な検証が可能です。

```dart
    // The cat hunt method will be called twice.
    when(cat.hunt(any, any));
    cat.hunt('backyard', 'many mice');
    cat.hunt('backyard', 'many mice');
    // Or using matcher
    verify(cat.hunt(argThat(contains('yard')), argThat(endsWith('mice'))))
        .called(greaterThan(1));

    // Or never called
    verifyNever(cat.eatFood(any));
```

また、verifyNever で 1 度も method が呼ばれていないことを検証することが可能です。

## verifyInOrder で method の呼び出し順を検証する

verifyInOrder を利用して method が呼び出された順番を検証できます。

以下の例では eatFood -> sound -> eatFood の順番で method が呼び出されたことが確認できます。

```dart
  test('Testing verification in order.', () {
    when(cat.eatFood(any)).thenReturn(true);
    when(cat.sound()).thenReturn('Mew');
    cat.eatFood('milk');
    cat.sound();
    cat.eatFood('fish');
    verifyInOrder([cat.eatFood('milk'), cat.sound(), cat.eatFood('fish')]);
  });
```

verifyInOrder には検証する method の配列を指定して利用します。

## captureAny, captureThat で引数をキャプチャする

Argument matchers である captureAny, captureThat で mock method の引数をキャプチャして検証できます。

以下は一番簡単な例で captureAny で eatFood method の引数をキャプチャして expect で検証しています。

```dart
  test('Capturing arguments for further assertions.', () {
    when(cat.eatFood(any)).thenReturn(true);
    cat.eatFood('fish');
    expect(verify(cat.eatFood(captureAny)).captured.single, 'fish');
  });
```

複数回呼び出された method は以下のように検証します。

```dart
    cat.eatFood('milk');
    cat.eatFood('fish');
    expect(verify(cat.eatFood(captureAny)).captured, ['milk', 'fish']);
```

また、captureThat を使用してこれまで登場した Argument matchers である startsWith, endsWidth, contains が利用できます。

```dart
    cat.eatFood('donald duck');
    cat.eatFood('mickey mouse');
    cat.eatFood('minnie mouse');
    expect(
        verify(cat.eatFood(captureThat(startsWith('donald')))).captured.single,
        'donald duck');
    expect(verify(cat.eatFood(captureThat(endsWith('mouse')))).captured,
        ['mickey mouse', 'minnie mouse']);
```

## untilCalled で Future の呼び出しを待つ

以下のような Future を返却する method があるとします。

```dart
class Cat {
  Future<void> chew() async => print('Chewing...');
}
```

untilCalled を利用して Future の呼び出しが完了するまで待ち合わせることが可能です。

以下の例だと cat.chew method が確実に call されてから verify で method 呼び出しを検証しています。

```dart
  test('Waiting for an interaction.', () async {
    cat.chew();
    await untilCalled(cat.chew());
    verify(cat.chew());
  });
```

## clearInteractions で method 呼び出しをクリアする

clearInteractions method を利用して method が呼ばれたことを無かったことに出来ます。

以下の例では cat.eatFood method が本来 2 回呼ばれています。

clearInteractions を使用すると method 呼び出しがクリアされます。

method 呼び出しがクリアされたことを verify で検証できます。

```dart
  test('Clearing collected interactions.', () {
    when(cat.eatFood('fish')).thenReturn(true);
    cat.eatFood('fish');
    // Clearing collected interactions:
    clearInteractions(cat);
    cat.eatFood('fish');
    verify(cat.eatFood('fish')).called(1);
  });
```

## reset で mock の method 呼が出しと stab 化をクリアする

reset method を利用して method が呼ばれたことと stab 化を無かったことに出来ます。

以下の例では最初に cat.eatFood method を stab 化して fish が引数に渡されたら true を return しています。

reset を使用すると method の呼び出し回数及び stab 化の情報がクリアされます。

クリアされた mock を今度は false を return するように stab 化します。

expect でどの文字列が引数にきても false が return されることを検証できます。

更に method 呼び出しがクリアされたことを verify で検証できます。

```dart
  test('Resetting mocks.', () {
    // Resetting stubs and collected interactions:
    when(cat.eatFood('fish')).thenReturn(true);
    cat.eatFood('fish');
    reset(cat);
    when(cat.eatFood(any)).thenReturn(false);
    expect(cat.eatFood('fish'), false);
    verify(cat.eatFood('fish')).called(1);
  });
```

reset method は テストケース単位で mock の情報を毎回クリアしたい時に setUp に記述すると便利です。

## setter を verify する

最後に、setter も以下のように verify で検証することができます。

```dart
    // You can verify setters.
    cat.lives = 9;
    verify(cat.lives = 9);
```

## おわりに

簡単ですが Null safety に対応した Mockito の使用方法でした。

今回 Mockito の pub.dev のシンプルなサンプル実装を引用しています。

プロダクトではもっと複雑なクラスをモックすることになると思います。

MVVM などのアーキテクチャを採用している場合、更に複雑さが増します。

そこで DI などのテクニックが登場します。

過去に DI でテスタビリティを向上させる記事を書いています。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Flutter RiverpodでDIをしてテスタビリティを向上させる | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/flutter-search-github-riverpod-di" frameborder="0" scrolling="no"></iframe>

次回は DI したクラスをどうやってモックしていくか見ていきたいと思います。

最後に今回記事中に使用したソースはこちらにあるので参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="kazuma-fujita/flutter_mockito_mocking_test: Testing of flutter with mockito package." src="https://hatenablog-parts.com/embed?url=https://github.com/kazuma-fujita/flutter_mockito_mocking_test" frameborder="0" scrolling="no"></iframe>

---
title: 'Flutter FreezedのLiveTemplates(コードスニペット)を登録して開発速度を上げる'
date: '2021-02-24'
isPublished: true
metaDescription: 'Freezedのボイラープレートコードは Android Studio の Live Templates(コードスニペット)に登録しましょう。最終的に　`freezed` とタイピングするとコードテンプレートを呼び出せるようにします。'
tags:
  - 'Flutter'
  - 'Dart'
  - 'Android Studio'
---

Freezed はオブジェクトを immutable(不変)にしてくれるとても便利な package です。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="freezed | Dart Package" src="https://hatenablog-parts.com/embed?url=https://pub.dev/packages/freezed" frameborder="0" scrolling="no"></iframe>

`@freezed` アノテーションをつけたクラスは Freezed のコードを生成する為に、build runner のコマンド実行する必要があります。

```
flutter bub pub run build_runner build --delete-conflicting-outputs
```

コード生成を実行する為、Freezed のクラスは少しクセのあるコードを書く必要があります。

```
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:flutter/foundation.dart';

part 'person.freezed.dart';

@freezed
abstract class Person with _$Person {
  factory Person({ String name, int age }) = _Person;
}
```

このコードパターンお決まりで、ボイラープレートコードです。

ボイラープレートコードは Android Studio の Live Templates(コードスニペット)に登録しましょう。

最終的に　`freezed` とタイピングするとコードテンプレートを呼び出せるようにします。

### 環境

- macOS Big Sur 11.1
- Android Studio 4.1.2
- Flutter 1.22.6
- Dart 2.10.5

## 設定方法

**Android Studio** > **Preferences** (ショートカット `command` + `,`) で設定画面を開きます。

**Editor** > **Live Templates** から Live Templates 画面を開きます。

LiveTemplates 一覧から `Flutter` を選択して左上にある `+` ボタンをクリックします。

<img src='/images/posts/2021-02-24-1.png' class='img' alt='posts image' />

画面下側が LiveTemplates の登録画面なので Freezed の設定を入力します。

<img src='/images/posts/2021-02-24-2.png' class='img' alt='posts image' />

- Abbreviation
  - 入力補完する時の文字列。自分で分かりやすい名前を命名
- Description
  - テンプレートの説明。自分で分かりやすい説明を入力
- Template Text
  - 以下のテンプレートを入力

```dart
import 'package:flutter/foundation.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

part '$FILE_NAME$.freezed.dart';
part '$FILE_NAME$.g.dart';

@freezed
abstract class $CLASS_NAME$ with _$$$CLASS_NAME$ {
  const factory $CLASS_NAME$({}) = _$CLASS_NAME$;

 factory $CLASS_NAME$.fromJson(Map<String, dynamic> json) => _$$$CLASS_NAME$FromJson(json);
}
```

次に `$CLASS_NAME`、`$FILE_NAME` の変数の値を設定します。

<img src='/images/posts/2021-02-24-3.png' class='img' alt='posts image' />

- FILE_NAME
  - Expression
    - fileNameWithoutExtension()
  - Default value
    - fileNameWithExtension()
  - Skip if defined
    - checked
- CLASS_NAME
  - Expression
    - underscoresToCamelCase(String)
  - Default value
    - capitalize(underscoresToCamelCase(fileNameWithoutExtension()))
  - Skip if defined
    - checked

最後に `Applicable` の `Change` から `Dart` > `top-level` を選択します。

<img src='/images/posts/2021-02-24-4.png' class='img' alt='posts image' />

## 使ってみる

今回作成した Live Templates はファイル名が自動的にクラス名に設定されます。

まず dart ファイルを作成します。

今回は例として `new_freezed_entity.dart` クラスを作成しました。

次に作成したファイルを開いて `freezed` と入力します。

入力途中で Live Templates の候補が出てきますので、先程作成した `freezed` を選択します。

<img src='/images/posts/2021-02-24-5.png' class='img' alt='posts image' />

このようにファイル名から `$FILE_NAME` `$CLASS_NAME` が補完されてボイラープレートコードが作成されました。

赤くエラーになっている部分は build runner コマンドを実行すれば解消されます。

```
flutter bub pub run build_runner build --delete-conflicting-outputs
```

## おわりに

Freezed はとても便利な package で、過去に Freezed 関連の記事も書いています。

前回、Flutter JsonSerializable でスネークケースの json フィールドを自動で変換する方法を紹介しました。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Flutter JsonSerializableでスネークケースのjsonフィールドを自動で変換する | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/flutter-search-github-json-serializable-build-yaml" frameborder="0" scrolling="no"></iframe>

また、Flutter テンプレートで Freezed の build.yaml を自動で作成するやり方も紹介しているので、ぜひ参考にしてください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Android StudioのFlutterテンプレートをカスタマイズして Riverpod / StateNotifier / Freezed をデフォルトで使用できるプロジェクトを作成する | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/flutter-create-new-project-template-with-riverpod-state-notifire-freezed" frameborder="0" scrolling="no"></iframe>

皆様も Freezed の LiveTemplates を導入して開発速度を向上させましょう！

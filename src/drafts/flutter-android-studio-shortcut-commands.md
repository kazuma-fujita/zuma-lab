---
title: 'Flutter 開発で利用しているAndroid Studioショートカット集'
date: '2021-02-xx'
isPublished: true
metaDescription: 'Flutter 開発で利用しているAndroid Studioショートカット集'
tags:
  - 'Flutter'
  - 'Android Studio'
---

Flutter 開発時の生産性を上げてくれる Android Studio のショートカット集です。

筆者は Android Studio の plugin である IdeaVim を利用しています。

vim と競合しない keymap かつ、筆者の利用頻度の高いショートカットを集めてみました。

オススメの keymap 設定も紹介します。

前提として OS は macOS ですので Windows ユーザーの方ごめんなさい。

### 環境

- macOS Big Sur 11.1
- Android Studio 4.1.2
- Flutter 1.22.6
- Dart 2.10.5

# Window 操作系

## Tab 切り替え

`command` + `shift` + `[` or `]`

## Window 切り替え

### Message window

`command` + `0`

### Project window

`command` + `1`

### Run window

`command` + `4`

### Terminal window

`option` + `F12`

オススメ Keymap

`control` + `

VSCode も利用している ユーザーなら VSCode と同じ Keymap にすると直感的に利用できます。

# 検索系

## Search Everywhere（クラス、ファイルなどを全体から検索）

クラス、ファイルなどを全体から検索できます。

`shift` 2 回押し

## Find in Path（パスの中から検索）

検索キーワードを全てのファイルの中身から検索できます。

`command` + `shift` + `F`

## Call Hierarchy(呼び出し階層を開く)

あるメソッドがどこから呼ばれているか、さらにその呼び出し元がどこから呼ばれているか、さらにそれは……と呼び出し元を階層的に一覧できます。

`control` + `option` + `H`

- オススメ Keymap

`option` を省くことでスムーズに操作できます。

`command` + `H`

## Find Usages（使用箇所を探す）

変数の参照箇所を探したり、あるクラスを extends している箇所を探したりと、変数、クラス、メソッドが使用されている箇所を探せます。

変数は、その変数を read している場所と write している場所とを分けて表示してくれます。

`option` + `F7`

- オススメ Keymap

command と `Usages` の頭文字 U を組み合わせます。

`command` + `U`

## File Structure（ファイルの構造を表示）

開いているファイルの変数やメソッドの一覧が見えます。

その一覧を検索して、変数やメソッドを定義してある場所へ飛ぶことが出来ます。

`command` + `F12`

- オススメ Keymap

command と `Method` `Member` の頭文字 M を組み合わせます。

`command` + `M`

# 入力補完系

## Assist・Quick Fix

`option` + `Enter`

## StatefulWidget のテンプレートを作成

`stf` と入力

以下テンプレートが作成されます。

```dart
class MyComponent extends StatefulWidget {
  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  @override
  Widget build(BuildContext context) {
    return Container();
  }
}
```

## StatelessWidget のテンプレートを作成

`stl` と入力

以下テンプレートが作成されます。

```dart
class MyComponent extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container();
  }
}
```

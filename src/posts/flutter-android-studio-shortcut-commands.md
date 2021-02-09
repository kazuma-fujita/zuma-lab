---
title: 'Flutter/Android 開発で個人的に良く使うAndroid Studioショートカットキー集'
date: '2021-02-10'
isPublished: true
metaDescription: 'Flutter/Android 開発で個人的に良く使うAndroid Studioショートカットキー集です。'
tags:
  - 'Flutter'
  - 'Android'
  - 'Android Studio'
---

Flutter/Android 開発の生産性を上げてくれる Android Studio のショートカットキー集です。

筆者は Android Studio の plugin である IdeaVim を利用しています。

Vim のキーバインドと競合しないキーマップかつ、筆者の利用頻度の高いショートカットを集めてみました。

全てのショートカットはこちらを参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="キーボード ショートカット  |  Android デベロッパー  |  Android Developers" src="https://hatenablog-parts.com/embed?url=https://developer.android.com/studio/intro/keyboard-shortcuts?hl=ja" frameborder="0" scrolling="no"></iframe>

またオススメの ショートカットキーマップ設定も紹介します。

キーマップ設定方法は以下の記事で詳しく書いたので参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Android Studioのショートカットキーマップ設定方法とオススメのキーマップ設定 | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/flutter-android-studio-keymap-settings" frameborder="0" scrolling="no"></iframe>

※ 前提として OS は macOS ですので Windows ユーザーの方ごめんなさい。

### 環境

- macOS Big Sur 11.1
- Android Studio 4.1.2

# Window 操作系

### Editor Tab 切り替え

`command` + `shift` + `[` or `]`

### Message window を開く

`command` + `0`

### Project window を開く

`command` + `1`

### Find window を開く

`command` + `3`

### Run window を開く

`command` + `4`

### Logcat window を開く

`command` + `6`

### Git window を開く

`command` + `9`

### Preferences(設定) window を開く

`command` + `,`

### Terminal window を開く

- デフォルト

`option` + `F12`

- オススメキーマップ

`control` + `

VSCode も利用している ユーザーなら VSCode と同じ Keymap にすると直感的に利用できます。

# 検索系

## Search Everywhere（クラス、ファイルなどを全体から検索）

クラス、ファイルなどを全体から検索できます。

`shift` 2 回押し

## Find in Path（パスの中から検索）

全てのファイルの中身から検索できます。

`command` + `shift` + `F`

## 宣言に移動/呼び出し元に移動

クラスやメソッド、変数にカーソルを当てショートカットを実行すると宣言元の移動することができます。

また宣言元でショートカットを実行すると、呼び出し元に移動します。

呼び出し元が複数ある場合、一覧が表示されて呼び出し元を選択できます。

`command` + `B`

## Call Hierarchy(呼び出し階層を開く)

あるメソッドがどこから呼ばれているか、さらにその呼び出し元がどこから呼ばれているか呼び出し元を階層的に一覧できます。

- デフォルト

`control` + `option` + `H`

- オススメキーマップ

`option` を省くことでスムーズに操作できます。

`command` + `H`

## Find Usages（使用箇所を探す）

変数の参照箇所を探したり、あるクラスを extends している箇所を探したりと、変数、クラス、メソッドが使用されている箇所を探せます。

変数は、その変数を read している場所と write している場所とを分けて表示してくれます。

- デフォルト

`option` + `F7`

- オススメキーマップ

command と `Usages` の頭文字 U を組み合わせます。

`command` + `U`

## File Structure（ファイルの構造を表示）

開いているファイルの変数やメソッドの一覧が見えます。

その一覧を検索して、変数やメソッドを定義してある場所へ飛ぶことが出来ます。

- デフォルト

`command` + `F12`

- オススメキーマップ

command と `Method` `Member` の頭文字 M を組み合わせます。

`command` + `M`

# 入力補完系

## Assist・Quick Fix

エラーや警告が発生している箇所にカーソルを当て、ショートカットを実行するとエラーを解消する為のアシスタントが表示されます。

使用頻度が高いショートカットになります。

`option` + `Enter`

## StatefulWidget のテンプレートを作成

`stf` と入力

自動で以下テンプレートが作成されます。

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

自動で以下テンプレートが作成されます。

```dart
class MyComponent extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container();
  }
}
```

# 入力支援・リファクタ系

## Delete Line（行を削除）

行単位で削除できます。

`command` + `Backspace`

## Extend Selection, Shrink Selection（選択範囲を拡大、選択範囲を縮小）

実行するごとにカーソル位置を起点とした選択範囲が拡大/縮小します。

- 選択範囲を拡大

`option` + `↑`

- 選択範囲を縮小

`option` + `↓`

## Extract Variable（変数として抽出）

カーソルの周辺のものを変数として抽出します。

`=` の右辺だけを書いて実行するとの左辺の値を自動的に補完してくれます。

`command` + `option` + `V`

## Rename（リネーム）

変数、クラス名、ファイル名、メソッド名を一括リネームできます。

対象の文字列にカーソルを当てコマンドを実行すると `Rename Field` window が立ち上がるので、変更したい文字列を入力して `Refactor` ボタンを押して一括リネームを実行します。

`shift` + `F6`

## Next Highlited Error, Previous Highlited Error（次のエラー、前のエラー）

発生している次のエラーや前のエラーにジャンプできます。

- 次のエラー

`F2`

- 前のエラー

`shift` + `F2`

## おわりに

Android Studio のショートカットを使いこなすと生産性が上がります。

筆者はまだ Flutter/Android 開発初学者なので、もし他にもこんな便利なショートカットがあるよ、という方はぜひ [Twitter](https://twitter.com/____ZUMA____) で DM していただくか [Contact](/contact) で連絡お願いします。

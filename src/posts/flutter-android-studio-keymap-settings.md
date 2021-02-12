---
title: 'Android Studioのショートカットキーマップ設定方法とオススメのキーマップ設定'
date: '2021-02-09'
isPublished: true
metaDescription: 'Flutter/Android開発時の Android Studio ショートカットキーマップ設定方法とオススメのキーマップ設定です'
tags:
  - 'Flutter'
  - 'Android'
  - 'Android Studio'
---

Flutter/Android 開発時の生産性を上げてくれる Android Studio のショートカットのキーマップ設定方法です。

オススメの キーマップ設定も紹介します。

※ 前提として OS は macOS ですので Windows ユーザーの方ごめんなさい。

### 環境

- macOS Big Sur 11.1
- Android Studio 4.1.2

## Android キーマップ設定方法

`command` + `,` で Preferences を開きます。

Preferences window の `Keymap` から 変更したいキーマップ名を開きます。

<img src='/images/posts/2021-02-09-1.png' class='img' />

キーマップの種類が多いので、検索ボックスから対象のショートカット名を入力して探すのが早いです。

<img src='/images/posts/2021-02-09-2.png' class='img' />

ショートカット名をダブルクリックして Edit Shortcut window を開いて `Add Keyboard Shortcut` をクリックしてください。

<img src='/images/posts/2021-02-09-4.png' class='img' />

Keyboard Shortcut window からショートカットコマンドを入力して `OK` ボタンをクリックします。

<img src='/images/posts/2021-02-09-3.png' class='img' />

一つのショートカットコマンドに複数のキーマップを登録することもできます。

その場合、このように登録した複数のキーマップが表示されます。

<img src='/images/posts/2021-02-09-5.png' class='img' />

キーマップを追加して、デフォルトのキーマップを削除する場合は先程の Edit Shortcut window から `Remove {キーマップ名}` をクリックします。

# オススメキーマップ

オススメのキーマップ設定です。

キーマップを追加すると既存のキーマップと競合する場合がありますが、筆者の場合よく使うショートカットのキーマップで上書きしています。

既存のキーマップで割り当てられていて覚えてないショートカットは実質使っていないので、自分のよく使うショートカットに割り当てた方が有用かなと思っています。

## Terminal window の切り替え

Android Studio 内の Terminal window を開きます。

- デフォルト

`option` + `F12`

- オススメキーマップ

`control` + `

VSCode も利用している ユーザーなら VSCode と同じ Keymap にすると直感的に利用できます。

## Call Hierarchy(呼び出し階層を開く)

あるメソッドがどこから呼ばれているか、さらにその呼び出し元がどこから呼ばれているか呼び出し元を階層的に一覧できます。

- デフォルト

`control` + `option` + `H`

- オススメキーマップ

`option` を省くことでスムーズに操作できます。

`command` + `H`

## Find Usages（使用箇所を探す）

変数の参照箇所を探したり、あるクラスを extends している箇所を探したり、変数、クラス、メソッドが使用されている箇所を探せます。

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

## Rename（リネーム）

変数、クラス名、ファイル名、メソッド名を一括リネームできます。

対象の文字列にカーソルを当てコマンドを実行すると `Rename Field` window が立ち上がるので、変更したい文字列を入力して `Refactor` ボタンを押して一括リネームを実行します。

- デフォルト

`shift` + `F6`

- オススメキーマップ

command と `Rename` の頭文字 R を組み合わせます。

`command` + `R`

## おわりに

Android Studio のショートカットを使いこなすと生産性が上がります。

筆者はまだ Flutter/Android 開発初学者なので、もし他にもこんな便利な設定があるよ、という方はぜひ [Twitter](https://twitter.com/____ZUMA____) で DM していただくか [Contact](/contact) で連絡お願いします

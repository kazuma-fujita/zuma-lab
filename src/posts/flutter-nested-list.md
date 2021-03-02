---
title: 'FlutterのListViewの中にPageViewで画像のカルーセルを作る(縦横入れ子のNested Listの作り方)'
date: '2021-03-02'
isPublished: true
metaDescription: 'FlutterのListViewの中にPageViewで画像のカルーセルを作るやり方です。(縦横入れ子のNested Listの作り方です)。iOS や Android のネイティブで入れ子のリストを実装しようとすると結構大変なのですが、Flutter だと割と簡単に実装できました。'
tags:
  - 'Flutter'
  - 'Dart'
---

Flutter の ListView のリストの中に PageView で画像のカルーセルを作ります。

縦の ListView の中に横の PageView を表示する縦横入れ子の Nested List です。

完成後はこのような動きになります。

<img src='/images/posts/2021-03-02.gif' class='img' style='width: 70%' />

iOS や Android のネイティブで入れ子のリストを実装しようとすると結構大変なのですが、Flutter だと割と簡単に実装できました。

それでは見ていきましょう。

### 環境

- macOS Big Sur 11.1
- Android Studio 4.1.2
- Flutter 1.22.6
- Dart 2.10.5

### package を追加する

`pubspec.yaml` に `english_words` package を追加します。

```yaml
dependencies:
  flutter:
    sdk: flutter
  english_words: # added
```

`english_words` はランダムに英単語を出力してくれる package です。

追加後は忘れずに `flutter pub get` を実行しましょう。

### ListView と PageView を実装する

以下ファイルを作成してください。

- `lib/nested_list_screen.dart`

実装内容は以下となります。

```dart
import 'package:flutter/material.dart';
import 'package:english_words/english_words.dart';

class NestedListScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(primaryColor: Colors.white),
      home: NestedList(),
    );
  }
}

class NestedList extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Nested List'),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.symmetric(vertical: 16),
        itemBuilder: _buildVerticalItem,
      ),
    );
  }

  Widget _buildVerticalItem(BuildContext context, int verticalIndex) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      child: SizedBox(
        height: 320,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              WordPair.random().asPascalCase,
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            Text(
              WordPair.random().asPascalCase,
              style: const TextStyle(fontSize: 16, color: Colors.grey),
            ),
            _buildHorizontalItem(context, verticalIndex),
          ],
        ),
      ),
    );
  }

  Widget _buildHorizontalItem(BuildContext context, int verticalIndex) {
    return SizedBox(
      height: 240,
      child: PageView.builder(
        controller: PageController(viewportFraction: 0.8),
        itemBuilder: (context, horizontalIndex) =>
            _buildHorizontalView(context, verticalIndex, horizontalIndex),
      ),
    );
  }

  Widget _buildHorizontalView(
      BuildContext context, int verticalIndex, int horizontalIndex) {
    final imageUrl =
        'https://source.unsplash.com/random/275x240?sig=$verticalIndex$horizontalIndex';
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8),
      child: Card(
        child: Image.network(imageUrl),
      ),
    );
  }
}
```

まず、`ListView.builder` を実装します。

```dart
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Nested List'),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.symmetric(vertical: 16),
        itemBuilder: _buildVerticalItem,
      ),
    );
  }
```

次に `itemBuilder` に指定している縦リストの要素である `_buildVerticalItem` メソッドを実装します。

```dart
  Widget _buildVerticalItem(BuildContext context, int verticalIndex) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      child: SizedBox(
        height: 320,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              WordPair.random().asPascalCase,
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            Text(
              WordPair.random().asPascalCase,
              style: const TextStyle(fontSize: 16, color: Colors.grey),
            ),
            _buildHorizontalItem(context, verticalIndex),
          ],
        ),
      ),
    );
  }
```

ListView の縦リストのレイアウトを実装しています。

`Padding` で縦要素全体の padding、 `SizedBox` で縦要素全体の高さを決定します。

`Column` で表示する要素を縦に並べて、 `MainAxisAlignment.spaceEvenly` で要素を均等に並べます。

表示ラベルには `WordPair.random().asPascalCase` でランダムな英単語を生成して表示しています。

次に横リストである `_buildHorizontalItem` メソッドを実装します。

```dart
  Widget _buildHorizontalItem(BuildContext context, int verticalIndex) {
    return SizedBox(
      height: 240,
      child: PageView.builder(
        controller: PageController(viewportFraction: 0.8),
        itemBuilder: (context, horizontalIndex) =>
            _buildHorizontalView(context, verticalIndex, horizontalIndex),
      ),
    );
  }
```

ここでは横リスト要素全体の高さを `SizeBox` で決定します。

次に横リスト本体である、画像カルーセル部分の PageView の controller に `PageController` を指定します。

コンストラクタで指定している `viewportFraction: 0.8` は、隣同士の画像の端をどれくらい画面に表示するかの割合です。

<img src='/images/posts/2021-03-02-1.png' class='img' alt='posted image' />

赤枠の部分です。

この数字が大きければ、表示中画像の隣の画像がより広く表示されます。

この調整が iOS や Android ネイティブだと難しくて、Flutter は一発で出来るので感動しました。

最後に PageView に表示する横リストの要素である `_buildHorizontalView` メソッドを実装します。

```dart
  Widget _buildHorizontalView(
      BuildContext context, int verticalIndex, int horizontalIndex) {
    final imageUrl =
        'https://source.unsplash.com/random/275x240?sig=$verticalIndex$horizontalIndex';
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8),
      child: Card(
        child: Image.network(imageUrl),
      ),
    );
  }
```

カルーセルの画像表示部分です。

`Padding` で隣同士の画像の padding を指定します。

画像カルーセルをキレイに表示する為、この padding 値と、`viewportFraction` の値を同時に微調整しました。

ランダム画像は `https://source.unsplash.com/random/` から取得しています。

表示する画像サイズを変える場合は画像表示領域に合わせて padding と viewportFraction を調整しましょう。

後は main.dart の runApp に 実装した NestedListScreen を指定します。

```dart
import 'package:flutter/material.dart';

import 'nested_list_screen.dart';

void main() {
  runApp(NestedListScreen());
}
```

## おわりに

今回 ListView で縦リスト、PageView で横リスト(画像カルーセル)の Nested List ができました。

実装していてプロダクトに導入する時はパフォーマンスを考慮した設計が必要と感じました。

入れ子の Nested List は build する Widget が多くなるので、画面スクロール時の build パフォーマンスを考えて実装しないと UX が悪くなると思います。

次回以降パフォーマンスについては調査していきます。

最後に今回作成したアプリのソースコードは Github にもあるので参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="kazuma-fujita/flutter_nested_list: Create a carousel of an image with PageView in the list of ListView of Flutter (How to create a Nested List with vertical and horizontal nesting)" src="https://hatenablog-parts.com/embed?url=https://github.com/kazuma-fujita/flutter_nested_list" frameborder="0" scrolling="no"></iframe>

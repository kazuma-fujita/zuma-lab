---
title: 'Flutterで非同期通信に対応したListViewの無限スクロールを実装する'
date: '2021-03-16'
isPublished: true
metaDescription: '今回は Flutter で非同期通信に対応した ListView の無限スクロール処理を実装します。NotificationListener の ScrollNotification を利用して非同期通信に対応した無限スクロールを実装することが出来ました。'
tags:
  - 'Flutter'
  - 'Dart'
---

今回は Flutter で非同期通信に対応した ListView の無限スクロール処理を実装します。

良くあるページング可能な外部 API を利用した ListView を実装するユースケースですね。

今回は実際には API は実行せず、`Future.delayed` で 数秒処理を遅らせて非同期通信を再現しています。

状態管理は Riverpod で行っています。

今回は非同期部分と無限スクロール部分のみ掲載しますので、全てのソースコードは Github を参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="kazuma-fujita/flutter_endress_scroll: Infinite scroll implementation using listview." src="https://hatenablog-parts.com/embed?url=https://github.com/kazuma-fujita/flutter_endress_scroll" frameborder="0" scrolling="no"></iframe>

### 環境

- macOS Big Sur 11.2.1
- Android Studio 4.1.2
- Flutter 2.0.0
- Dart 2.12.0

## package を install する

pubspec.yaml に Riverpod package を追記します。

今回は Riverpod に `hooks_riverpod` 、その他 `state_notifier` `freezed` package を利用します。

`freezed` を利用する為に、`build_runner` も install します。

- pubspec.yaml

```yaml
dependencies:
  flutter:
    sdk: flutter
  hooks_riverpod:
  state_notifier:
  freezed_annotation:

dev_dependencies:
  flutter_test:
    sdk: flutter
  build_runner:
  freezed:
```

追記したら忘れずに `flutter pub get` を実行しましょう。

## 画面状態を保持する Item クラスを実装する

- `lib/item.dart`

```dart
@freezed
abstract class Item with _$Item {
  const factory Item({
    required final int id,
    required final String title,
  }) = _Item;
}

@freezed
abstract class Items with _$Items {
  const factory Items({
    required final List<Item> items,
    @Default(false) bool isLoading,
    final String? error,
  }) = _Items;
}
```

まず一覧の画面状態を保持する Item クラスを実装します。

Items クラスの isLoading プロパティで非同期通信中の状態、error プロパティで通信エラー状態を保持します。

`@freezed` アノテーションを付与しているので、以下 build_runner を実行して freezed のクラスを生成します。

```txt
flutter pub pub run build_runner build --delete-conflicting-outputs
```

## 画面の状態管理をする ViewModel クラスを実装する

- `lib/scroll_list_view_model.dart`

```dart
class ScrollListViewModel extends StateNotifier<Items> {
  ScrollListViewModel() : super(const Items(items: [])) {
    fetchList();
  }

  static const _addCount = 20;

  Future<void> fetchList() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final newList = await fetchNextListByDummyRepository();
      state = state.copyWith(items: newList, isLoading: false, error: null);
    } on Exception catch (error) {
      state = state.copyWith(error: error.toString(), isLoading: false);
    }
  }

  Future<List<Item>> fetchNextListByDummyRepository() async =>
      Future.delayed(const Duration(seconds: 2), () {
        final items = <Item>[];
        for (var i = 0; i < _addCount; i++) {
          final id = state.items.length + i + 1;
          items.add(Item(id: id, title: 'Item no. $id'));
        }
        return [...state.items, ...items];
      });
}
```

`fetchList` メソッドで一覧に表示するオブジェクトを取得しています。

`fetchNextListByDummyRepository` メソッドで擬似的に非同期通信を再現させています。

## 状態変更を通知する StateNotifierProvider を実装する

先程作成した ViewModel で画面状態を保持する仕組みを作りました。

次に画面状態が変更された場合に View に通知する為の `StateNotifierProvider` を実装します。

StateNotifierProvider は StateNotifier で保持する state が変更されたら状態変更を View の子 Widget に通知・伝搬してくれます。

`main.dart` に以下を追記します。

- `lib/main.dart`

```dart
final scrollListViewModelProvider = StateNotifierProvider(
  (ref) => ScrollListViewModel(),
);

void main() {
  runApp(
    ProviderScope(
      child: ScrollListView(),
    ),
  );
}
```

最後に `main()` メソッドの runApp には StateNotifierProvider を有効にする為 `ProviderScope` で StateNotifierProvider を使用する画面を囲みます。

## 無限スクロールを表示する View クラスを実装する

- `lib/scroll_list_view.dart`

```dart
class ScrollListView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: const Text('Scroll List'),
        ),
        body: _ScrollListView(),
      ),
    );
  }
}

class _ScrollListView extends HookWidget {
  static const _threshold = 0.7;

  @override
  Widget build(BuildContext context) {
    final state = useProvider(scrollListViewModelProvider.state);

    if (state.error != null) {
      _showErrorSnackBar(state.error!);
    }

    return NotificationListener<ScrollNotification>(
      onNotification: (ScrollNotification scrollInfo) {
        final scrollProportion =
            scrollInfo.metrics.pixels / scrollInfo.metrics.maxScrollExtent;
        if (!state.isLoading && scrollProportion > _threshold) {
          context.read(scrollListViewModelProvider).fetchList();
        }
        return false;
      },
      child: state.items.isNotEmpty
          ? ListView.builder(
              itemCount: state.items.length,
              itemBuilder: (BuildContext _context, int index) {
                return _buildRow(state.items[index]);
              },
            )
          : _emptyListView(),
    );
  }

  Widget _buildRow(Item item) {
    return SizedBox(
      height: 80,
      child: Card(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
          child: Text(
            item.title,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ),
    );
  }

  Widget _emptyListView() {
    return const Center(
      child: Text(
        'Item not found.',
        style: TextStyle(
          color: Colors.black54,
          fontSize: 16,
        ),
      ),
    );
  }

  void _showErrorSnackBar(String errorMessage) {
    final context = useContext();
    final snackBar = SnackBar(
      content: Text(errorMessage),
      duration: const Duration(days: 365),
      action: SnackBarAction(
        label: '再試行',
        onPressed: () {
          // 一覧取得
          context.read(scrollListViewModelProvider).fetchList();
          // snackBar非表示
          ScaffoldMessenger.of(context).removeCurrentSnackBar();
        },
      ),
    );
    // 全Widgetのbuild後にsnackBarを表示させる
    WidgetsBinding.instance!.addPostFrameCallback((_) {
      ScaffoldMessenger.of(context).showSnackBar(snackBar);
    });
  }
}
```

まず先程 main.dart で作成した ViewModel を保持した StateNotifierProvider である scrollListViewModelProvider を取得します。

StateNotifierProvider オブジェクトを取得する手法は色々あるのですが、今回は `useProvider` を通して取得します。

`useProvider` を通して取得したオブジェクトは状態監視されて変更が起きたら Widget をリビルドします。

```dart
  @override
  Widget build(BuildContext context) {
    final state = useProvider(scrollListViewModelProvider.state);
```

本題の無限スクロールの実装部分です。

スクロールを検知する為、`NotificationListener` の `ScrollNotification` を利用します。

```dart
class _ScrollListView extends HookWidget {
  static const _threshold = 0.7;

  @override
  Widget build(BuildContext context) {
         :
         :
         :
    return NotificationListener<ScrollNotification>(
      onNotification: (ScrollNotification scrollInfo) {
        final scrollProportion =
            scrollInfo.metrics.pixels / scrollInfo.metrics.maxScrollExtent;
        if (!state.isLoading && scrollProportion > _threshold) {
          context.read(scrollListViewModelProvider).fetchList();
        }
        return false;
      },
      child: state.items.isNotEmpty
          ? ListView.builder(
              itemCount: state.items.length,
              itemBuilder: (BuildContext _context, int index) {
                return _buildRow(state.items[index]);
              },
            )
          : _emptyListView(),
    );
```

ScrollNotification の `scrollInfo.metrics.pixels` はスクロール量です。

`scrollInfo.metrics.maxScrollExtent` は現在表示している画面の最大までスクロール出来る値です。

今回のケースでは pixels はスクロール位置、maxScrollExtent は画面の最下部の位置だと思って大丈夫です。

それを割った値をしきい値として利用します。

どれくらいのしきい値を超えたら次のリストを取得するかは、 `_threshold = 0.7` のプロパティの値を使用します。

```dart
if (!state.isLoading && scrollProportion > _threshold) {
  context.read(scrollListViewModelProvider).fetchList();
}
```

今回は画面全体を 1 として、0.7 までスクロールしたらページング処理が走るようにしました。

この数値は、ListView の行の高さ、取得するデータの個数などで微調整する必要があります。

もう一点大事なのが、 `!state.isLoading` で非同期通信中のローディング中は次のページングを実行しない処理を入れることです。

この処理を入れないと非同期通信中にも関わらず、何回もページングが実行されるのでその回数分 API が実行され、リストの重複が発生します。

必ず非同期通信中はローディング判定処理をいれましょう。

また、非同期通信で大事なのが通信エラーが発生した場合の再読み込み処理です。

今回エラーが発生した場合、SnackBar を表示しています。

```dart
if (state.error != null) {
  _showErrorSnackBar(state.error!);
}
```

SnackBar に再試行ボタンを設置して再度リスト取得ができるようにしています。

```dart
  void _showErrorSnackBar(String errorMessage) {
    final context = useContext();
    final snackBar = SnackBar(
      content: Text(errorMessage),
      duration: const Duration(days: 365),
      action: SnackBarAction(
        label: '再試行',
        onPressed: () {
          context.read(scrollListViewModelProvider).fetchList();
          ScaffoldMessenger.of(context).removeCurrentSnackBar();
        },
      ),
    );
    WidgetsBinding.instance!.addPostFrameCallback((_) {
      ScaffoldMessenger.of(context).showSnackBar(snackBar);
    });
  }
```

非同期通信時は、ローディング処理とエラー処理を忘れずにいれましょう。

以上で非同期通信に対応して無限スクロールが実装できました。

## おわりに

今回は初学者の筆者でも `NotificationListener` の `ScrollNotification` を利用して非同期通信に対応した無限スクロールを実装することが出来ました。

全てのソースコードは Github にありますので参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="kazuma-fujita/flutter_endress_scroll: Infinite scroll implementation using listview." src="https://hatenablog-parts.com/embed?url=https://github.com/kazuma-fujita/flutter_endress_scroll" frameborder="0" scrolling="no"></iframe>

一点、Google 検索でよく出てくる ScrollController を使用した無限スクロールの実装で非同期通信に対応させることが出来ませんでした。

### 非同期通信に対応出来なかったパターン

具体的にはこのような実装です。

```dart
class ScrollDetector extends StatefulWidget {
  const ScrollDetector({
    required this.builder,
    required this.loadNext,
    required this.threshold,
    required this.scrollController,
  });

  final Widget Function(BuildContext) builder;
  final VoidCallback loadNext;
  final double threshold;
  final ScrollController scrollController;

  @override
  _ScrollDetectorState createState() => _ScrollDetectorState();
}

class _ScrollDetectorState extends State<ScrollDetector> {
  @override
  void initState() {
    super.initState();
    widget.scrollController.addListener(() {
      final scrollValue = widget.scrollController.offset /
          widget.scrollController.position.maxScrollExtent;
      if (scrollValue > widget.threshold) {
        widget.loadNext();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return widget.builder(context);
  }

  @override
  void dispose() {
    widget.scrollController.dispose();
    super.dispose();
  }
}
```

`ScrollController` の `addListener` で scroll 検出時の callback を設定します。

callback 内では scroll 量を計算して `widget.loadNext()` で追加のリスト取得する実装をしていました。

この addListener が非同期通信で動作させた時に、何回も `widget.loadNext()` が call されリストの重複が発生しました。

外から `isLoading` で非同期通信中は `widget.loadNext()` を call しない判定を入れれば解決するはずでした。

しかし addListener の callback 内がキャプチャされているのか外から isLoading フラグを渡しても意図した判定が出来ませんでした。

もし ScrollController でも非同期通信対応できるよ！という方 [Twitter](https://twitter.com/zuma_lab) で DM 頂くか、[Contact](/contact) まで連絡頂けると助かります。

---
title: 'Flutter RiverpodでBottom Navigation Barと画面間の状態管理をする'
date: '2021-03-15'
isPublished: true
metaDescription: 'Riverpod を使えば直感的に BottomNavigationBar や画面間の状態管理をすることができます。Flutter には他にも状態管理は BLOC パターンや Redux パターンなどがありますが、一番ライトに導入できて理解しやすいのが Riverpod を使用した Provider パターンかなと思っています。今回は Bottom Navigation Bar 上に単語一覧画面、単語一覧からお気に入り単語を登録して一覧表示するお気に入り画面の 2 画面構成のアプリを作ってみます。'
tags:
  - 'Flutter'
  - 'Dart'
---

Flutter Riverpod で Bottom Navigation Bar と画面間の状態管理をしたいと思います。

今回は Bottom Navigation Bar 上に単語一覧画面、単語一覧からお気に入り単語を登録して一覧表示するお気に入り画面の 2 画面構成のアプリを作ってみます。

<img src='/images/posts/2021-03-15-1.gif' alt='post image' class='img' style='width: 70%'/>

まず、Bottom Navigation Bar 上にある単語一覧と単語のお気に入り一覧画面間のお気に入り状態管理をします。

次に Riverpod で Bottom Navigation Bar で表示している tab の状態管理をします。

今回は状態管理部分のみを掲載しますので、全てのソースコードは Github を参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="kazuma-fujita/flutter_bottom_navigation_bar: Practice bottom navigation bar with riverpod." src="https://hatenablog-parts.com/embed?url=https://github.com/kazuma-fujita/flutter_bottom_navigation_bar" frameborder="0" scrolling="no"></iframe>

### 環境

- macOS Big Sur 11.2.1
- Android Studio 4.1.2
- Flutter 2.0.0
- Dart 2.12.0

## package を install する

pubspec.yaml に Riverpod package を追記します。

今回は Riverpod に `hooks_riverpod` 、その他 `state_notifier` `freezed` `english_words` package を利用します。

`freezed` を利用する為に、`build_runner` も install します。

- pubspec.yaml

```yaml
dependencies:
  flutter:
    sdk: flutter
  hooks_riverpod:
  state_notifier:
  freezed_annotation:
  english_words:

dev_dependencies:
  flutter_test:
    sdk: flutter
  build_runner:
  freezed:
```

追記したら忘れずに `flutter pub get` を実行しましょう。

## 単語一覧・お気に入り画面状態を保持する Word クラスを実装する

まず単語一覧とお気に入り一覧で共通で使用する状態保持オブジェクトのクラスを実装します。

- `lib/word.dart`

```dart
@freezed
abstract class Word with _$Word {
  const factory Word({
    required final int id,
    required final String wordPair,
    required final bool isFavorite,
  }) = _Word;
}

@freezed
abstract class Words with _$Words {
  const factory Words({
    required final List<Word> words,
  }) = _Words;
}
```

Word クラスの wordPair は `english_words` package でランダム生成する英単語を保持するプロパティです。

isFavorite は一覧のお気に入り状態を表すフラグです。

Words クラスは word を List で保持します。

この Word と Words クラスで画面状態を表現します。

`@freezed` アノテーションを付与しているので、以下 build_runner を実行して freezed のクラスを生成します。

```txt
flutter pub pub run build_runner build --delete-conflicting-outputs
```

## 単語一覧の画面状態を管理する ViewModel を実装する

次に単語一覧画面状態管理用の ViewModel を実装します。

- `lib/word_pair_list_view_model.dart`

```dart
class WordPairListViewModel extends StateNotifier<Words> {
  WordPairListViewModel() : super(const Words(words: [])) {
    fetchList();
  }

  void fetchList() {
    var index = 0;
    final words = generateWordPairs()
        .take(15)
        .map((wordPair) => Word(
            id: state.words.length + index++,
            wordPair: wordPair.asPascalCase,
            isFavorite: false))
        .toList();
    final newList = [...state.words, ...words];
    state = state.copyWith(words: newList);
  }

  void updateFavorite({required int id, required bool hasFavorite}) {
    final newList = state.words
        .map((word) =>
            word.id == id ? word.copyWith(isFavorite: !hasFavorite) : word)
        .toList();
    state = state.copyWith(words: newList);
  }
}
```

状態を保持する state を取得する為、StateNotifier に先程作成した Words クラスを generics に指定して extends した ViewModel を作成します。

`fetchList` メソッドで一覧をランダムな英単語の一覧を生成して StateNotifier の state に設定しています。

`updateFavorite` メソッドは単語一覧のお気に入りボタンをタップした時にお気に入りの表示状態をトグルさせています。

StateNotifier の sate に状態を設定すると、後述する StateNotifierProvider、useProvider と組み合わせて一覧画面を常に最新の状態で表示してくれます。

## お気に入り一覧画面状態を管理する ViewModel を実装する

次にお気に入り一覧画面状態管理用の ViewModel を実装します。

- `lib/favorite_list_view_model.dart`

```dart
class FavoriteListViewModel extends StateNotifier<Words> {
  FavoriteListViewModel() : super(const Words(words: []));

  void insertOrDeleteFavorite(
      {required int id, required String wordPair, required bool hasFavorite}) {
    if (!hasFavorite) {
      final newList = [
        ...state.words,
        Word(id: id, wordPair: wordPair, isFavorite: true)
      ];
      state = state.copyWith(words: newList);
    } else {
      final newList = state.words.where((word) => word.id != id).toList();
      state = state.copyWith(words: newList);
    }
  }
}
```

`insertOrDeleteFavorite` メソッドでお気に入り登録した単語を配列に追加、もしくはお気に入り解除した単語を配列から削除しています。

このメソッドはお気に入り一覧のお気に入りボタンをタップした時以外にも、単語一覧のお気に入りボタンをタップした時に呼ばれます。

今回の単語一覧とお気に入り一覧の状態連動のキモとなるメソッドです。

## 状態変更を通知する StateNotifierProvider を実装する

先程作成した単語一覧とお気に入り一覧の ViewModel で画面状態を保持する仕組みを作りました。

次に画面状態が変更された場合に View に通知する為の `StateNotifierProvider` を実装します。

StateNotifierProvider は StateNotifier で保持する state が変更されたら状態変更を View の子 Widget に通知・伝搬してくれます。

`main.dart` に以下を追記します。

- `lib/main.dart`

```dart
final wordPairListViewModelProvider = StateNotifierProvider(
  (ref) => WordPairListViewModel(),
);

final favoriteListViewModelProvider = StateNotifierProvider(
  (ref) => FavoriteListViewModel(),
);

void main() {
  runApp(
    ProviderScope(
      child: BottomNavigationBarView(),
    ),
  );
}
```

最後に `main()` メソッドの runApp には StateNotifierProvider を有効にする為 `ProviderScope` で StateNotifierProvider を使用する画面を囲みます。

蛇足ですが、StateNotifierProvider の他、使用しなくなった Provider を破棄してくれる `AutoDisposeStateNotifierProvider` という Provider も存在します。

自分は初学者の為この auto dispose 機能をまだ把握出来てないのですが、その Provider を使用している画面を離れた時など自動的に Provider オブジェクトを破棄してくれるのでメモリ管理的に良さそうな機能だと思っています。

ただこの auto dispose 機能を BottomNavigationBar の tab で表示される画面で利用すると、tab 切り替え時に Provider で保持する ViewModel の state 状態も auto dispose されてしまい画面に何も表示されないバグを生んでしまいます。

筆者は `AutoDisposeStateNotifierProvider` を脳死で利用してバグの原因が分からずハマってしまったのここに残しておきます・・・

## 単語一覧 View を実装する

次に単語一覧の View を実装します。

- `lib/word_pair_list_view.dart`

```dart
class WordPairListView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Word Pair List'),
      ),
      body: _BuildList(),
    );
  }
}

class _BuildList extends HookWidget {
  @override
  Widget build(BuildContext context) {
    final words = useProvider(wordPairListViewModelProvider.state).words;
    return ListView.builder(
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 8),
      itemBuilder: (BuildContext _context, int index) {
        if (index >= words.length) {
          // build中にstateを操作をするとErrorになる為Futureで非同期化
          Future<void>(
            () => context.read(wordPairListViewModelProvider).fetchList(),
          );
        }
        return _buildRow(context, words[index]);
      },
    );
  }

  Widget _buildRow(BuildContext context, Word word) {
    return SizedBox(
      height: 80,
      child: Card(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                word.wordPair,
                style: const TextStyle(fontSize: 16),
              ),
              IconButton(
                icon: Icon(
                    word.isFavorite ? Icons.favorite : Icons.favorite_border),
                color: word.isFavorite ? Colors.pink : null,
                onPressed: () {
                  context.read(wordPairListViewModelProvider).updateFavorite(
                      id: word.id, hasFavorite: word.isFavorite);
                  context
                      .read(favoriteListViewModelProvider)
                      .insertOrDeleteFavorite(
                          id: word.id,
                          wordPair: word.wordPair,
                          hasFavorite: word.isFavorite);
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

StateNotifierProvider オブジェクトを取得する手法は色々あるのですが、今回は `useProvider` を通して取得します。

`useProvider` を通して取得したオブジェクトは状態監視されて変更が起きたら Widget をリビルドします。

`useProvider(wordPairListViewModelProvider.state).words` の箇所で先程作成した StateNotifierProvider のオブジェクト wordPairListViewModelProvider から一覧画面状態オブジェクトである words を取得しています。

words オブジェクトは ListView に設定され、 `_buildRow` メソッドで Word オブジェクトの isFavorite をみてお気に入りボタン状態を設定しています。

お気に入りボタンの `onPressed` で `wordPairListViewModel` の `updateFavorite` メソッドを実行してお気に入りボタンの状態変更をしています。

また、同時に `favoriteListViewModel` の `insertOrDeleteFavorite` メソッドを実行してお気に入り一覧にお気に入り単語の追加、もしくは削除をしています。

## お気に入り一覧 View を実装する

次にお気に入り一覧の View を実装します。

- `lib/favorite_list_view.dart`

```dart
class FavoriteListView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Favorite List'),
      ),
      body: _BuildList(),
    );
  }
}

class _BuildList extends HookWidget {
  @override
  Widget build(BuildContext context) {
    final favorites = useProvider(favoriteListViewModelProvider.state).words;
    return favorites.isNotEmpty
        ? ListView.builder(
            itemCount: favorites.length,
            itemBuilder: (BuildContext _context, int index) =>
                _buildRow(context, favorites[index]))
        : _emptyView();
  }

  Widget _emptyView() {
    return const Center(
      child: Text('お気に入りの単語はありません'),
    );
  }

  Widget _buildRow(BuildContext context, Word word) {
    return SizedBox(
      height: 80,
      child: Card(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                word.wordPair,
                style: const TextStyle(fontSize: 16),
              ),
              IconButton(
                icon: Icon(
                    word.isFavorite ? Icons.favorite : Icons.favorite_border),
                color: word.isFavorite ? Colors.pink : null,
                onPressed: () {
                  context
                      .read(favoriteListViewModelProvider)
                      .insertOrDeleteFavorite(
                          id: word.id,
                          wordPair: word.wordPair,
                          hasFavorite: word.isFavorite);

                  context.read(wordPairListViewModelProvider).updateFavorite(
                      id: word.id, hasFavorite: word.isFavorite);
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

ここでも`useProvider` を使用して `favoriteListViewModelProvider` の words オブジェクトを取得しています。

`_buildRow` メソッドでお気に入り一覧の単語行を実装しています。

ここでもお気に入りボタンの状態をみてトグル処理を実装しています。

お気に入りボタンの `onPressed` で `favoriteListViewModel` の `insertOrDeleteFavorite` メソッドを実行してお気に入り一覧のお気に入り単語の削除をしています。

また同時に `onPressed` で `wordPairListViewModel` の `updateFavorite` メソッドを実行して単語一覧のお気に入りボタンの状態変更をしています。

単語一覧とお気に入り一覧は ViewModel を通してお互いのお気に入り状態を変更しています。

## Bottom Navigation Bar で表示している tab の状態管理をする

BottomNavigationBar で表示している tab の状態を管理する為に、BottomNavigationBar 部分を実装します。

まず、main.dart に Tab の表示状態を保持、通知する `StateProvider` を実装します。

- `lib/main.dart`

```dart
final tabTypeProvider = StateProvider<TabType>((ref) => TabType.wordPair);

enum TabType {
  wordPair,
  favorite,
}
```

お気に入り一覧と単語一覧では StateNotifier を継承した ViewModel を実装して、StateNotifierProvider を実装しました。

BottomNavigationBar では表示中の画面状態のみ保持できていればいいので、ライトに enum で TabType という画面タイプクラスを定義して StateProvider で直接 TabType を保持するようにしています。

`TabType.wordPair` が単語一覧画面で、`TabType.favorite` がお気に入り一覧画面です。

次に BottomNavigationBar の実装をします。

- `lib/bottom_navigation_bar_view.dart`

```dart
class BottomNavigationBarView extends HookWidget {
  final _views = [WordPairListView(), FavoriteListView()];

  @override
  Widget build(BuildContext context) {
    final tabType = useProvider(tabTypeProvider);
    return MaterialApp(
      theme: ThemeData(primaryColor: Colors.white),
      home: Scaffold(
        bottomNavigationBar: BottomNavigationBar(
          type: BottomNavigationBarType.shifting,
          selectedItemColor: Colors.black,
          unselectedItemColor: Colors.grey,
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.chat),
              label: 'Word pair',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.favorite),
              label: 'Favorite',
            ),
          ],
          onTap: (int selectIndex) {
            tabType.state = TabType.values[selectIndex];
          },
          currentIndex: tabType.state.index,
        ),
        body: _views[tabType.state.index],
        // body: ProviderScope(
        //   child: _views[_selectIndex],
        // ),
      ),
    );
  }
}
```

BottomNavigationBar の type の `BottomNavigationBarType.shifting` で tab を選択する時に Icon を拡大するアニメーションを付けます。

items に BottomNavigationBarItem 配列を指定して tab に表示する icon と label を設定します。

そして Tab の状態管理部分ですが、まず `useProvider(tabTypeProvider)` で先程 main.dart て定義した tabTypeProvider から TabType の state オブジェクトを取得しています。

currentIndex は 表示中 tab の index 指定します。

ここでは tabType の state から enum の index を設定しています。

StateProvider は main.dart で以下のように `TabType.wordPair` で初期化しているので、初回画面表示は単語一覧になります。

```dart
final tabTypeProvider = StateProvider<TabType>((ref) => TabType.wordPair);

enum TabType {
  wordPair,
  favorite,
}
```

これから説明する onTap と currentIndex の値を連動させて画面の切り替えを行います。

tab をタップして画面切り替え操作を行った時は `onTap` が call されます。

onTap の callback では選択された tab の index が渡ってきます。

それを利用し `TabType.values` で enum 添字アクセス、 enum の値を取得して tabType.state の状態を変更しています。

```dart
onTap: (int selectIndex) {
  tabType.state = TabType.values[selectIndex];
},
```

お気に入り一覧画面と単語一覧画面で StateNotifier を継承した ViewModel で行っていた state の変更を BottomNavigationBar の場合は View で行っています。

currentIndex には `tabType.state.index` を指定しているので、ここで変更された state の情報が currentIndex に設定されて画面切り替えを行っています。

これで BottomNavigationBar は onTab で変更された tab 状態を `StateProvider` で保持、通知し、`useProvider` で状態監視、currentIndex の変更して Widget のリビルドを行う一連の状態管理が完成しました。

## おわりに

初学者の筆者でも Riverpod を使えば直感的に BottomNavigationBar や画面間の状態管理をすることができました。

Flutter には他にも状態管理は BLOC パターンや Redux パターンなどがありますが、一番ライトに導入できて理解しやすいのが Riverpod を使用した Provider パターンかなと思っています。

Riverpod も今回実装で利用した useProvider のような React 経験者には嬉しい Flutter hooks が用意されており機能が充実している印象です。

今後も Riverpod は進化していくはずなのでキャッチアップしていこうと思います。

最後にここまでのソースコードは Github にありますので参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="kazuma-fujita/flutter_bottom_navigation_bar: Practice bottom navigation bar with riverpod." src="https://hatenablog-parts.com/embed?url=https://github.com/kazuma-fujita/flutter_bottom_navigation_bar" frameborder="0" scrolling="no"></iframe>

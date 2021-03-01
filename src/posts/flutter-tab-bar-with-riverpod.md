---
title: 'FlutterのTabBarとTabBarViewの要素を動的に追加する'
date: '2021-03-01'
isPublished: true
metaDescription: 'Flutter の Widget である TabBar と TabBarView の要素を動的に追加してみようと思います。TabBar 追加画面から TabBar 名を新規登録して、TabBar ではランダム画像が表示される簡易的なアプリを実装します。'
tags:
  - 'Flutter'
  - 'Dart'
---

Flutter の Widget である TabBar と TabBarView の要素を動的に追加してみようと思います。

TabBar 追加画面から TabBar 名を新規登録して、TabBar ではランダム画像が表示される簡易的なアプリを実装します。

完成後はこのような動きになります。

<img src='/images/posts/2021-03-01.gif' class='img' style='width: 70%' />

構成としては簡易的な MVVM です。

今回は DB や API など外部データ取得やビジネスロジックが無いので、View と VM のみ実装しています。

今回、動的に TabBar の要素を追加する部分のみ掲載するので、全てのソースコードを見たい方は Github にあるので参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="kazuma-fujita/flutter_tab_bar_with_riverpod: Practice Flutter riverpod with tab bar screen." src="https://hatenablog-parts.com/embed?url=https://github.com/kazuma-fujita/flutter_tab_bar_with_riverpod" frameborder="0" scrolling="no"></iframe>

### 環境

- macOS Big Sur 11.1
- Android Studio 4.1.2
- Flutter 1.22.6
- Dart 2.10.5

### TabBar 新規作成する View を実装する

- `lib/create_landscape_view.dart`

```dart
class CreateLandscapeView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Landscape作成'),
      ),
      body: LandScapeForm(),
    );
  }
}

class LandScapeForm extends HookWidget {
  @override
  Widget build(BuildContext context) {
    final viewModel = useProvider(landscapeViewModelProvider);
    return Container(
      padding: const EdgeInsets.all(48),
      child: TextField(
        maxLength: 16,
        maxLengthEnforced: true,
        decoration: const InputDecoration(
          hintText: '風景の名前を入力してください',
          labelText: '風景の名前',
        ),
        onSubmitted: (String name) {
          viewModel.createLandscape(name);
          Navigator.pop(context);
        },
      ),
    );
  }
}
```

TextField が一つあるシンプルな画面です。

## TabBar を表示する View を実装する

- `lib/landscape_tab_bar_view.dart`

```dart
class Const {
  static const routeNameCreateLandscape = '/create-landscape';
}

class LandscapeTabBarView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(primaryColor: Colors.white),
      routes: <String, WidgetBuilder>{
        Const.routeNameCreateLandscape: (BuildContext context) =>
            CreateLandscapeView()
      },
      home: BuildDefaultTabController(),
    );
  }
}

class BuildDefaultTabController extends HookWidget {
  @override
  Widget build(BuildContext context) {
    final _landscapes =
        useProvider(landscapeViewModelProvider.state).landscapes;
    return DefaultTabController(
        length: _landscapes.length,
        child: Scaffold(
          appBar: AppBar(
            elevation: 0,
            title: const Text('Landscapes'),
            actions: [
              IconButton(
                icon: const Icon(Icons.add),
                onPressed: () => Navigator.pushNamed(
                    context, Const.routeNameCreateLandscape),
              ),
            ],
            bottom: TabBar(
              tabs: _landscapes
                  .map((Landscape landscape) => Tab(text: landscape.name))
                  .toList(),
              indicatorColor: Colors.black,
            ),
          ),
          body: TabBarView(
            children: _landscapes
                .map((Landscape landscape) =>
                    TabPage(imageUrl: landscape.imageUrl))
                .toList(),
          ),
        ));
  }
}

class TabPage extends StatelessWidget {
  const TabPage({Key key, this.imageUrl}) : super(key: key);
  final String imageUrl;

  @override
  Widget build(BuildContext context) {
    print(imageUrl);
    return Center(
      child: CachedNetworkImage(
        imageUrl: imageUrl,
        progressIndicatorBuilder: (context, url, downloadProgress) =>
            CircularProgressIndicator(value: downloadProgress.progress),
        errorWidget: (context, url, dynamic error) => const Icon(Icons.error),
      ),
    );
  }
}
```

まず、`DefaultTabController` を実装します。

`DefaultTabController` には、ヘッダー部分である AppBar と AppBar の下に配置される TabBar 、そして TabBar 内の要素である TabBarView を実装します。

```dart
    return DefaultTabController(
        length: _landscapes.length,
        child: Scaffold(
          appBar: AppBar(
            elevation: 0,
            title: const Text('Landscapes'),
            actions: [
              IconButton(
                icon: const Icon(Icons.add),
                onPressed: () => Navigator.pushNamed(
                    context, Const.routeNameCreateLandscape),
              ),
            ],
            bottom: TabBar(
              isScrollable: true,
              tabs: _landscapes
                  .map((Landscape landscape) => Tab(text: landscape.name))
                  .toList(),
              indicatorColor: Colors.black,
            ),
          ),
          body: TabBarView(
            children: _landscapes
                .map((Landscape landscape) =>
                    TabPage(imageUrl: landscape.imageUrl))
                .toList(),
          ),
        ));
```

上から順番に設定をみていきます。

まず、TabBar と TabBarView の数を決定する `DefaultTabController` の `length` を設定します。

```dart
    return DefaultTabController(
        length: _landscapes.length,
```

ここでは配列の length を設定しています。

ListView.builder なんかと同じ設定ですね。

次に TaBar を設定します。

今回は TabBar を動的に追加するので、 `isScrollable` を true にして要素が多い場合に TabBar を横スクロールできるようにします。

```dart
            bottom: TabBar(
              isScrollable: true,
              tabs: _landscapes
                  .map((Landscape landscape) => Tab(text: landscape.name))
                  .toList(),
              indicatorColor: Colors.black,
            ),
```

`tabs` に `Tab` widget の配列を指定します。

ここでは `_landscapes` を map で回して新たに Tab Widget 配列を生成しています。

次に、TabBarView を設定します。

```dart
          body: TabBarView(
            children: _landscapes
                .map((Landscape landscape) =>
                    TabPage(imageUrl: landscape.imageUrl))
                .toList(),
          ),
```

ここでは `children` に自作した `TabPage` widget の配列を指定しています。

TabPage widget は以下のようになっています。

```dart
class TabPage extends StatelessWidget {
  const TabPage({Key key, this.imageUrl}) : super(key: key);
  final String imageUrl;

  @override
  Widget build(BuildContext context) {
    print(imageUrl);
    return Center(
      child: CachedNetworkImage(
        imageUrl: imageUrl,
        progressIndicatorBuilder: (context, url, downloadProgress) =>
            CircularProgressIndicator(value: downloadProgress.progress),
        errorWidget: (context, url, dynamic error) => const Icon(Icons.error),
      ),
    );
  }
}
```

画面中央に画像を表示するだけのシンプルな Widget です。

蛇足ですが、筆者は画像表示には `CachedNetworkImage` を利用しています。

`Image.network` は画像 cache が効かないので、表示の度に都度画像取得が走ります。

CachedNetworkImage は読み込んだ画像を cache してくれる package です。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="cached_network_image | Flutter Package" src="https://hatenablog-parts.com/embed?url=https://pub.dev/packages/cached_network_image" frameborder="0" scrolling="no"></iframe>

画像 cache だけでは無く、`progressIndicatorBuilder` や `errorWidget` でローディング中や画像が取得できなかった時の Widget を表示出来るようになっています。

以上 TabBar と TabBarView の動的に要素を追加する方法でした。

最後に小ネタですが、デフォルト TabBar の下に shadow がつきます。

これを消すには AppBar の `elevation` を 0 にします。

```dart
        child: Scaffold(
          appBar: AppBar(
            elevation: 0,
```

筆者はフラットな UI が好きなので、いつも `elevation` には 0、もしくは少ない値を設定しています。

ここはお好みで設定してください。

## おわりに

今回、動的に TabBar と TabBarView の要素を追加する部分のみ掲載してますので、アプリの全てのソースコードを見たい方は Github にあるので参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="kazuma-fujita/flutter_tab_bar_with_riverpod: Practice Flutter riverpod with tab bar screen." src="https://hatenablog-parts.com/embed?url=https://github.com/kazuma-fujita/flutter_tab_bar_with_riverpod" frameborder="0" scrolling="no"></iframe>

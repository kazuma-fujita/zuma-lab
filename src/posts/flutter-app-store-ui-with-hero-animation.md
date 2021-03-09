---
title: 'FlutterのHero AnimationsでAppStore風UIを作る'
date: '2021-03-09'
isPublished: true
metaDescription: 'Flutter の Hero Animation で AppStore 風 UI を作ってみました。画面遷移する時に Hero animations でカード UI が拡大するアニメーションを実装してAppStore風UIを実装します。'
tags:
  - 'Flutter'
  - 'Dart'
---

Flutter の Hero Animation で AppStore 風 UI を作ってみました。

最終的にこんなアプリを作ります。

<img src='/images/posts/2021-03-09-1.gif' class='img' alt='app store ui' style='width: 70%' />

アニメーションは以下の手順で実装していきました。

1. カード UI に `AnimatedPadding` でタップ中カードが押し込まれるアニメーションを実装する
1. カード UI に `GestureDetector` でタップされた時のアクションを設定する
1. 一覧画面から詳細画面に遷移する時に `FadeTransition` でクロスフェードするアニメーションを実装する
1. 一覧画面から詳細画面に遷移する時に `Hero animations` でカード UI が拡大するアニメーションを実装する

今回はアニメーションに関係する箇所のみを掲載するので、全てのソースを参照したい方は こちらの Github をご覧ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="kazuma-fujita/flutter_app_store_ui_with_hero: Practice AppStore UI with Hero animation." src="https://hatenablog-parts.com/embed?url=https://github.com/kazuma-fujita/flutter_app_store_ui_with_hero" frameborder="0" scrolling="no"></iframe>

### 環境

- macOS Big Sur 11.2.1
- Android Studio 4.1.2
- Flutter 2.0.0
- Dart 2.12.0

## カード UI を表示する一覧画面を実装する

まずカード UI を表示する為の一覧画面を実装します。

以下がソースとなります。

- `lib/app_store_list_view.dart`

```dart
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';

import 'detail_view.dart';

class Const {
  static const routeDetail = '/detail';
}

class AppStoreListView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(primaryColor: Colors.white),
      onGenerateRoute: (settings) {
        final arguments = settings.arguments;
        if (arguments is DetailViewArguments) {
          switch (settings.name) {
            case Const.routeDetail:
              return PageRouteBuilder<DetailView>(
                  pageBuilder: (context, animation, secondaryAnimation) =>
                      DetailView(arguments: arguments),
                  transitionsBuilder:
                      (context, animation, secondaryAnimation, child) {
                    return FadeTransition(
                      opacity: animation,
                      child: child,
                    );
                  });
            default:
              return MaterialPageRoute<DetailView>(
                builder: (context) => DetailView(arguments: arguments),
              );
          }
        }
        return null;
      },
      home: AppStoreList(),
    );
  }
}

class AppStoreList extends StatelessWidget {
  final items = [
    'assets/images/image1.webp',
    'assets/images/image2.webp',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        title: const Text('App Store'),
      ),
      body: _buildList(),
    );
  }

  Widget _buildList() {
    return ListView.builder(
      itemCount: items.length,
      itemBuilder: (BuildContext context, int index) =>
          ListCardItem(items[index], index),
    );
  }
}

@immutable
class DetailViewArguments {
  const DetailViewArguments({required this.imagePath, required this.heroId});
  final String imagePath;
  final int heroId;
}

class ListCardItem extends HookWidget {
  const ListCardItem(this.imagePath, this.heroId);
  final String imagePath;
  final int heroId;

  @override
  Widget build(BuildContext context) {
    final isPushed = useState<bool>(false);
    return Padding(
      padding: const EdgeInsets.all(16),
      child: AnimatedPadding(
        duration: const Duration(milliseconds: 24),
        padding: EdgeInsets.all(isPushed.value ? 24 : 0),
        child: GestureDetector(
          onTapDown: (TapDownDetails downDetails) {
            isPushed.value = true;
          },
          onTap: () {
            isPushed.value = false;
            Navigator.pushNamed(context, Const.routeDetail,
                arguments:
                    DetailViewArguments(imagePath: imagePath, heroId: heroId));
          },
          onTapCancel: () {
            isPushed.value = false;
          },
          child: Hero(
            tag: 'card-$heroId',
            child: Card(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(32),
              ),
              clipBehavior: Clip.antiAliasWithSaveLayer,
              elevation: 16,
              child: SizedBox(
                height: 360,
                child: Image.asset(
                  imagePath,
                  fit: BoxFit.cover,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
```

アニメーションに関わるところで、Flutter Hooks の `useState` でカード UI が押されたかどうかの条件判定用フラグを作成しています。

```dart
  @override
  Widget build(BuildContext context) {
    final isPushed = useState<bool>(false);
```

Flutter Hooks はここでは詳しく説明しませんが、 `useState` は `StatefulWidget` で Widget の状態管理をしているようなものです。

詳しくは [Flutter Hooks](https://pub.dev/packages/flutter_hooks) のドキュメントを参照ください。

次にアニメーション部分をみていきましょう。

## AnimatedPadding でタップ中カードが押し込まれるアニメーションを実装する

`AnimatedPadding` の duration プロパティ  でタップ中にカード UI が押し込まれる(カード UI が縮小される)スピードを設定します。

milliseconds の他、seconds、microseconds など色々な単位で設定することができます。

次に padding プロパティにカード UI が押し込まれた時にどれくらいカードを縮小させるか設定します。

筆者は押し込まれた時に カード UI が 24px 分縮小するように設定しましたが、ここは UX に直結するところなので、カード UI の大きさに合わせて duration と padding 値を決めてください。

```dart
      child: AnimatedPadding(
        duration: const Duration(milliseconds: 24),
        padding: EdgeInsets.all(isPushed.value ? 24 : 0),
```

## GestureDetector でカードがタップされた時のアクションを実装する

`GestureDetector` でカード UI がタップされた時のアクションを設定します。

onTapDown でその名の通りタップ中に isPushed を true にしてカード UI を押し込むアニメーションが実行されます。

`onTapCancel` タップが途中で離された場合は isPushed を false にしてカード UI を元に戻しています。

`onTap` でタップし終わった時に isPushed を false にして詳細画面へ遷移します。

```dart
        child: GestureDetector(
          onTapDown: (TapDownDetails downDetails) {
            isPushed.value = true;
          },
          onTap: () {
            isPushed.value = false;
            Navigator.pushNamed(context, Const.routeDetail,
                arguments:
                    DetailViewArguments(imagePath: imagePath, heroId: heroId));
          },
          onTapCancel: () {
            isPushed.value = false;
          },
```

## FadeTransition で遷移時にクロスフェードするアニメーションを実装する

次に一覧画面から詳細画面に遷移する時に `FadeTransition` でクロスフェードするアニメーションを実装します。

この後、Hero Animations でも画面遷移時のアニメーションを実装するのですが、Hero Animations だけだと iOS と Android の OS ごとに異なるデフォルト画面遷移アニメーションと被ってしまい自然なアニメーションの動きになりません。

Hero Animations の下処理として、iOS と Android で共通のクロスフェードアニメーションを実装します。

今回画面遷移に `Navigator.pushNamed` を利用しているので、MaterialApp の `onGenerateRoute` で画面遷移時のアニメーションを実装します。

`onGenerateRoute` で取れる RouteSettings は遷移する画面名や引数など画面情報を保持しています。

`settings.name` には画面名が入るので、遷移先の画面名判定をして対象の画面に遷移アニメーションを設定します。

`PageRouteBuilder` の `pageBuilder` には遷移先画面オブジェクト、 `transitionsBuilder` には遷移アニメーションを設定します。

今回は `transitionsBuilder` に `FadeTransition` を設定してクロスフェードアニメーションを実現しています。

```dart
    return MaterialApp(
      theme: ThemeData(primaryColor: Colors.white),
      onGenerateRoute: (settings) {
        final arguments = settings.arguments;
        if (arguments is DetailViewArguments) {
          switch (settings.name) {
            case Const.routeDetail:
              return PageRouteBuilder<DetailView>(
                  pageBuilder: (context, animation, secondaryAnimation) =>
                      DetailView(arguments: arguments),
                  transitionsBuilder:
                      (context, animation, secondaryAnimation, child) {
                    return FadeTransition(
                      opacity: animation,
                      child: child,
                    );
                  });
            default:
              return MaterialPageRoute<DetailView>(
                builder: (context) => DetailView(arguments: arguments),
              );
          }
        }
        return null;
      },
      home: AppStoreList(),
    );
```

一点、注意点ですが、onGenerateRoute で画面遷移を実装して、`Navigator.pushNamed` の arguments で遷移先画面に値を渡す場合、遷移先の画面オブジェクトのコンストラクタに値を渡す必要がありました。

今回のケースでは、遷移先の DetailView に `DetailViewArguments` というオブジェクトを渡しています。

```dart
@immutable
class DetailViewArguments {
  const DetailViewArguments({required this.imagePath, required this.heroId});
  final String imagePath;
  final int heroId;
}
```

通常、onGenerateRoute ではなく、routes でルーティングして遷移時に `Navigator.pushNamed` の arguments に値を設定し、遷移後に `ModalRoute.of(context).settings.arguments` で値を取得できます。

```dart
    return MaterialApp(
      theme: ThemeData(primaryColor: Colors.white),
      routes: <String, WidgetBuilder>{
        Const.routeDetail: (BuildContext context) => DetailView(),
      },
      home: AppStoreList(),
    );
```

onGenerateRoute を利用した場合、遷移先画面で ModalRoute で値が取れなかったので、遷移先画面のコンストラクタで値を受け取るということをしています。

もっといいやり方がある場合、ぜひ [Twitter](https://twitter.com/____ZUMA____) で DM していただくか [Contact](/contact) で教えて頂けると助かります。

## Hero animations で遷移時にカード UI が拡大するアニメーションを実装する

最後に、一覧画面から詳細画面に遷移する時に `Hero animations` でカード UI が拡大するアニメーションを実装します。

まずカード UI を Hero Widget で囲みます。

```dart
          child: Hero(
            tag: 'card-$heroId',
            child: Card(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(32),
              ),
```

Hero Widget の `tag` にはユニークな値を設定してください。

今回は ListView の index をユニークな `heroId` として設定しています。

次に遷移先画面でも同様、Hero Widget でアニメーション対象の Widget を囲みます。

今回、一覧画面のカード UI が画面一杯に広がって遷移先の詳細画面を表示するアニメーションにする為、詳細画面の親 Widget である Scaffold に Hero を設定しました。

- `lib/detail_view.dart`

```dart
  @override
  Widget build(BuildContext context) {
    return Hero(
      tag: 'card-${arguments.heroId}',
      child: Scaffold(
        body: CustomScrollView(
          physics: const BouncingScrollPhysics(),
          slivers: <Widget>[
            SliverAppBar(
              elevation: 0,
              stretch: true,
              flexibleSpace: _flexibleSpaceBar(),
              expandedHeight: 360,
              backgroundColor: Colors.white,
            ),
            SliverList(
              delegate: _sliverChildListDelegate(),
            )
          ],
        ),
      ),
    );
  }
```

ここでも先程同様、Hero Widget の tag にユニークな値を設定します。

今回は一覧画面からの ListView の index の値を詳細画面に `arguments.heroId` として渡して tag 設定をしています。

以上で App Store 風 UI を実装することができます。

<img src='/images/posts/2021-03-09-1.gif' class='img' alt='app store ui' style='width: 70%' />

## おわりに

今回、App Store 風 UI アニメーション部分のみを掲載しましたが、詳細画面でも CustomScrollView と SliverAppBar を利用して画面スクロール時にアニメーションをつけています。

全体のソースコードは Github にあるので参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="kazuma-fujita/flutter_app_store_ui_with_hero: Practice AppStore UI with Hero animation." src="https://hatenablog-parts.com/embed?url=https://github.com/kazuma-fujita/flutter_app_store_ui_with_hero" frameborder="0" scrolling="no"></iframe>

また、最近(2021/03/04) に Flutter 2.0.0(以後 Flutter2)、Dart 2.12.0 のメジャーバージョンアップが発表されましたね。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Google Developers Blog: Announcing Flutter 2" src="https://hatenablog-parts.com/embed?url=https://developers.googleblog.com/2021/03/announcing-flutter-2.html" frameborder="0" scrolling="no"></iframe>

Flutter 2 で Flutter On Web、Desktop が Stable になったり、Dart の FFI が Stable になったりしましたが、個人的に一番嬉しかったのが Dart の Null Safety が Stable に昇格したことですね。

筆者の個人アプリに Flutter2 と Dart の Null Safety を導入してみたので、ぜひこちらの記事を参考にして Flutter2 と Null Safety を導入してみてください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Flutter2のDart Null Safetyを既存のプロジェクトに導入する | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/flutter-dart-sound-null-safety-replace" frameborder="0" scrolling="no"></iframe>

---
title: 'Flutter2のScaffoldMessengerで画面戻りにSnackBarを表示できるようになった'
date: '2021-03-09'
isPublished: true
metaDescription: 'Flutter2のScaffoldMessengerで遷移先画面戻りでSnackBarを表示できるようになりました。ScaffoldMessenger になってから、独自スコープを保持することにより、常に現在の Scaffold が表示されるようになり SnackBar を処理してくれるようになったとのことです。'
tags:
  - 'Flutter'
  - 'Dart'
---

2021/03/04 に Flutter 2.0.0(以後 Flutter2)、Dart 2.12.0 のメジャーバージョンアップが発表されましたね。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Google Developers Blog: Announcing Flutter 2" src="https://hatenablog-parts.com/embed?url=https://developers.googleblog.com/2021/03/announcing-flutter-2.html" frameborder="0" scrolling="no"></iframe>

Flutter2 では SnackBar を表示するには Scaffold ではなく、`ScaffoldMessenger` を使用するようになりました。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="SnackBars managed by the ScaffoldMessenger - Flutter" src="https://hatenablog-parts.com/embed?url=https://flutter.dev/docs/release/breaking-changes/scaffold-messenger" frameborder="0" scrolling="no"></iframe>

Scaffold を使用している箇所はこのように deprecated の警告がでます。

<img src='/images/posts/2021-03-09-1.png' class='img' />

移行は簡単で Scaffold から ScaffoldMessenger にするだけです。

```dart
ScaffoldMessenger.of(context).showSnackBar(
  SnackBar(
    content: Text(message),
    duration: const Duration(seconds: 3),
  ),
);
```

### ScaffoldMessenger の何がうれしいのか?

今までの Scaffold の SnackBar 表示は非同期通信などで画面の状態により Scaffold が破棄され、BuildContext が無効になった場合はエラーとなっていました。

例えば、遷移先画面戻りで `showSnackBar` を実行した場合です。

```dart
void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter SnackBar Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: MyHomePage(),
    );
  }
}

class MyHomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('SnackBar Demo'),
      ),
      body: Center(
        child: ElevatedButton(
          onPressed: () async {
            final returnMessage = await Navigator.of(context).push(
              MaterialPageRoute<String>(
                builder: (context) => NextPage(),
              ),
            );
            if (returnMessage != null) {
              Scaffold.of(context).showSnackBar(
                SnackBar(
                  content: Text(returnMessage),
                  duration: const Duration(seconds: 3),
                ),
              );
            }
          },
          child: const Text('Next screen'),
        ),
      ),
    );
  }
}

class NextPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Second Page'),
      ),
      body: Center(
        child: ElevatedButton(
          onPressed: () {
            Navigator.pop(context, 'Returned to the first page.');
          },
          child: const Text('Close to show snack bar'),
        ),
      ),
    );
  }
}
```

このように 画面遷移をして、画面戻りで `Scaffold.of(context).showSnackBar` を実行すると以下のエラーが出ます。

```txt
E/flutter ( 8264): [ERROR:flutter/lib/ui/ui_dart_state.cc(186)] Unhandled Exception: Scaffold.of() called with a context that does not contain a Scaffold.
E/flutter ( 8264): No Scaffold ancestor could be found starting from the context that was passed to Scaffold.of(). This usually happens when the context provided is from the same StatefulWidget as that whose build function actually creates the Scaffold widget being sought.
E/flutter ( 8264): There are several ways to avoid this problem. The simplest is to use a Builder to get a context that is "under" the Scaffold. For an example of this, please see the documentation for Scaffold.of():
E/flutter ( 8264):   https://api.flutter.dev/flutter/material/Scaffold/of.html
E/flutter ( 8264): A more efficient solution is to split your build function into several widgets. This introduces a new context from which you can obtain the Scaffold. In this solution, you would have an outer widget that creates the Scaffold populated by instances of your new inner widgets, and then in these inner widgets you would use Scaffold.of().
E/flutter ( 8264): A less elegant but more expedient solution is assign a GlobalKey to the Scaffold, then use the key.currentState property to obtain the ScaffoldState rather than using the Scaffold.of() function.
E/flutter ( 8264): The context used was:
E/flutter ( 8264):   MyHomePage
E/flutter ( 8264): #0      Scaffold.of (package:flutter/src/material/scaffold.dart:1949:5)
E/flutter ( 8264): #1      MyHomePage.build.<anonymous closure> (package:flutter_scaffold_manager/main.dart:40:24)
E/flutter ( 8264): <asynchronous suspension>
E/flutter ( 8264):
```

Scaffold が破棄された状態で context が無効になっているのでエラーが発生していました。

このエラーを回避する為に、 `Fluttertoast` パッケージを導入する手段があります。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="fluttertoast | Flutter Package" src="https://hatenablog-parts.com/embed?url=https://pub.dev/packages/fluttertoast" frameborder="0" scrolling="no"></iframe>

これは context の状態に依存せず SnackBar と同じような Toast メッセージを表示できるパッケージです。

筆者はエラーを回避する為にこの便利パッケージを利用していました。

ですが Flutter2 からは Scaffold から ScaffoldMessenger に変更するだけで SnackBar が表示されます。

```
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      content: Text(returnMessage),
      duration: const Duration(seconds: 3),
    ),
  );
```

ScaffoldMessenger について公式に以下のように記載があります。

```txt
The ScaffoldMessenger now handles SnackBars in order to persist across routes and always be displayed on the current Scaffold. By default, a root ScaffoldMessenger is included in the MaterialApp, but you can create your own controlled scope for the ScaffoldMessenger to further control which Scaffolds receive your SnackBars.
```

今までは Scaffold に依存していた context が破棄された状態で showSnackBar を実行するとエラーが発生していました。

ScaffoldMessenger になってから、独自スコープを保持することにより、常に現在の Scaffold が表示されるようになり SnackBar を処理してくれるようになったとのことです。

筆者が作っているアプリは現在 Flutter2 で実装しており、ScaffoldMessenger に移行し Fluttertoast パッケージは使用しなくなりました。

今後も Flutter は進化していくので、キャッチアップして外部パッケージの依存を減らしていきたいと思います。

## おわりに

Flutter 2 で Flutter On Web、Desktop が Stable になったり、Dart の FFI が Stable になったりしましたが、個人的に一番嬉しかったのが Dart の Null Safety が Stable に昇格したことですね。

筆者の個人アプリに Flutter2 と Dart の Null Safety を導入してみたので、ぜひこちらの記事を参考にして Flutter2 と Null Safety を導入してみてください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Flutter2のDart Null Safetyを既存のプロジェクトに導入する | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/flutter-dart-sound-null-safety-replace" frameborder="0" scrolling="no"></iframe>

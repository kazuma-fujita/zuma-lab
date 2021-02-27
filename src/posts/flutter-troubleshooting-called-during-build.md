---
title: '[Flutter]setState() or markNeedsBuild() called during build エラートラブルシューティング'
date: '2021-02-27'
isPublished: true
metaDescription: 'Flutter 初学者の筆者が setState() or markNeedsBuild() called during build エラーに遭遇し???の状態からエラー解消を解消できたので記録として残します。setState() or markNeedsBuild() called during build.エラーはビルド中に画面状態を変更しようとすると発生するエラーでした。'
tags:
  - 'Flutter'
  - 'Dart'
---

Flutter 初学者の筆者が setState() or markNeedsBuild() called during build エラーに遭遇し???の状態からエラー解消を解消できたので記録として残します。

## setState() or markNeedsBuild() called during build エラー発生箇所

Todo アプリで Todo 一覧から Todo 作成画面に遷移して、Todo 作成後に一覧画面へ遷移する実装をしていました。

Todo 作成画面から一覧画面へ戻る遷移するのに、 `Navigator.pop` を使用しています。

使用箇所は、`useProvider` から `AsyncValue` を取得し、 `when` スコープ内で `Navigation.pop` している箇所で setState() or markNeedsBuild() called during build エラーが発生しました。

```dart
class _UpsertTodoView extends HookWidget {
  @override
  Widget build(BuildContext context) {
    final isNew =
        ModalRoute.of(context).settings.arguments as TodoEntity == null;
    useProvider(upsertTodoViewModelProvider.state).when(
      data: (todo) {
        if (todo != null) {
          EasyLoading.dismiss();
          Navigator.pop(context, '${todo.title}を${isNew ? '作成' : '更新'}しました'); // <- Error occurred!!!
        }
      },
      loading: () async {
        await EasyLoading.show();
      },
      error: (error, _) {
        EasyLoading.dismiss();
        _errorView(error.toString());
      },
    );
    return _TodoForm();
  }
}
```

- error log

```txt
======== Exception caught by animation library =====================================================
The following assertion was thrown while notifying status listeners for AnimationController:
setState() or markNeedsBuild() called during build.

This Overlay widget cannot be marked as needing to build because the framework is already in the process of building widgets.  A widget can be marked as needing to be built during the build phase only if one of its ancestors is currently building. This exception is allowed because the framework builds parent widgets before children, which means a dirty descendant will always be built. Otherwise, the framework might not visit this widget during this build phase.
The widget on which setState() or markNeedsBuild() was called was: Overlay-[LabeledGlobalKey<OverlayState>#8e684]
  dependencies: [_EffectiveTickerMode]
  state: OverlayState#84b7b(entries: [OverlayEntry#07a4d(opaque: true; maintainState: false), OverlayEntry#82e92(opaque: false; maintainState: true), OverlayEntry#257e9(opaque: false; maintainState: false), OverlayEntry#9c6b1(opaque: false; maintainState: true)])
```

## setState() or markNeedsBuild() called during build.エラーの原因

エラーログを Google 翻訳する限り、Widget のビルド中に状態を変更しちゃ駄目ですよ、と強引に意訳。

```
setState() or markNeedsBuild() called during build.

This Overlay widget cannot be marked as needing to build because the framework is already in the process of building widgets.
------------------------------------------------------------------------------------
ビルド中に呼び出されるsetState（）またはmarkNeedsBuild（）。

フレームワークはすでにウィジェットを構築中であるため、このオーバーレイウィジェットを構築する必要があるとしてマークすることはできません。
```

ビルド中といっても、`Navigator.pop` する時点では Todo 作成画面の Widget のビルドは終わってるはず・・・と思ったのですが、その手前で `EasyLoading.dismiss();` を呼んでいました。

```dart
    EasyLoading.dismiss();
    Navigator.pop(context, '${todo.title}を${isNew ? '作成' : '更新'}しました'); // <- Error occurred!!!
```

この EasyLoading というのは非同期処理中にローディングを表示する用途の package です。

ローディング中はこのように `show()` メソッドを call してローディングを表示します。

```dart
  loading: () async {
    await EasyLoading.show();
  },
```

そしてローディングが終わったタイミングで `dismiss()` を call しています。

```
  data: (todo) {
    if (todo != null) {
      EasyLoading.dismiss();
      Navigator.pop(context, '${todo.title}を${isNew ? '作成' : '更新'}しました'); // <- Error occurred!!!
    }
  },
```

この EasyLoading.dismiss のソースを覗いてみたら、戻り値は Future になっていました。

```dart
  /// dismiss loading
  static Future<void> dismiss({
    bool animation = true,
  }) {
    // cancel timer
    _getInstance()._cancelTimer();
    return _getInstance()._dismiss(animation);
  }
```

原因は EasyLoading 自体が非同期で動いており、`dismiss()` のローディング終了中(Widget リビルド中)に `Navigator.pop` で前の画面遷移をしようとして、 setState() or markNeedsBuild() called during build.エラーが発生していたのです。

## setState() or markNeedsBuild() called during build.エラーの解決方法

- 解決方法 1

`await` キーワードで非同期処理が終わるのを待ち合わせてから、Navigation.pop する方法です。

```dart
      data: (todo) async {
        if (todo != null) {
          await EasyLoading.dismiss();
          Navigator.pop(context, '${todo.title}を${isNew ? '作成' : '更新'}しました');
        }
      },
```

ちゃんと `dismiss()` の終了アニメーションが終わるのを待ってから(Widget のリビルド完了してから)Navigation.pop して画面遷移(画面状態変更)すればエラーは発生しません。

- 解決方法 2

Navigator.pop を `WidgetsBinding.instance.addPostFrameCallback` で囲む方法です。

```
      data: (todo) {
        if (todo != null) {
          EasyLoading.dismiss();
          WidgetsBinding.instance.addPostFrameCallback((_) {
            Navigator.pop(context, '${todo.title}を${isNew ? '作成' : '更新'}しました');
          });
        }
```

`WidgetsBinding.instance.addPostFrameCallback` は全ての Widget のビルドが終わったタイミングで呼ばれる callback です。

addPostFrameCallback が call されるタイミングはビルドが終わっていることが保証されます。

こちらは Flutter 1.8.4 で追加された機能で筆者は存在を知りませんでした。

こちらはどの Widget のビルドが終わるのを待てばいいか分からない場合でも、状態変更する対象を囲めばいいのでどのユースケースでも対応できそうです。

## おわりに

setState() or markNeedsBuild() called during build.エラーはビルド中に画面状態を変更しようとすると発生するエラーでした。

このエラーのおかげで、`WidgetsBinding.instance.addPostFrameCallback` の存在を知ったので収穫がありました。

非同期処理が複数走るユースケースなどで特に発生しそうなエラーなので、同じエラーに遭遇された方の参考になれば幸いです。

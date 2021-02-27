---
title: '[Flutter]The method 'showSnackBar' was called on nullエラートラブルシューティング'
date: '2021-02-28'
isPublished: true
metaDescription: 'Flutter 初学者の筆者が The method 'showSnackBar' was called on null エラーに遭遇し???の状態からエラー解消を解消できたので記録として残します。The method 'showSnackBar' was called on null エラーはビルド中に SnackBar を表示(画面状態を変更)しようとすると発生するエラーでした。'
tags:
  - 'Flutter'
  - 'Dart'
---

Flutter 初学者の筆者が The method 'showSnackBar' was called on null エラーに遭遇し???の状態からエラー解消を解消できたので記録として残します。

## The method 'showSnackBar' was called on null エラー発生箇所

Todo アプリで Todo 一覧画面を実装していました。

画面表示時に API 通信をして、Todo 一覧を取得して画面表示させるよくある実装です。

API 通信に失敗した場合のエラーハンドリングを実装していてエラーが発生しました。

まず画面表示時に API 通信を行います。

ネットワークエラーやサーバエラー時は Todo 一覧が取得できないので、SnackBar に通信の再試行ボタンを設置して再度通信を促す実装をしていました。

SnackBar を表示させる為に、 `GlobalKey<ScaffoldState>()` で `_scaffoldKey` を生成して、`_scaffoldKey.currentState.showSnackBar()` で snackBar 表示時にエラーが発生しました。

以下がエラー発生箇所です。

```dart
class TodoList extends HookWidget {
  final _scaffoldKey = GlobalKey<ScaffoldState>();
  @override
  Widget build(BuildContext context) {
    final todoState = useProvider(todoListViewModelProvider.state);
    return Scaffold(
      key: _scaffoldKey,
      appBar: AppBar(
        title: const Text('Todo'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            disabledColor: Colors.black,
            // List取得成功時以外は+ボタンdisabled
            onPressed: () => todoState is AsyncData
                ? _transitionToNextScreen(context)
                : null,
          ),
        ],
      ),
      body: _buildList(),
    );
  }

  Widget _buildList() {
    final todoState = useProvider(todoListViewModelProvider.state);
    return todoState.when(
      data: (todoList) => todoList.isNotEmpty
          ? ListView.builder(
              key: UniqueKey(),
              padding: const EdgeInsets.all(16),
              itemCount: todoList.length,
              itemBuilder: (BuildContext context, int index) {
                return _dismissible(todoList[index], context);
              },
            )
          : _emptyListView(),
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (error, _) => _errorView(error.toString()),
    );
  }

  Widget _errorView(String errorMessage) {
    final context = useContext();
    final snackBar = SnackBar(
      content: Text(errorMessage),
      duration: const Duration(days: 365),
      action: SnackBarAction(
        label: '再試行',
        onPressed: () {
          // 一覧取得
          context.read(todoListViewModelProvider).fetchList();
          // snackBar非表示
          _scaffoldKey.currentState.removeCurrentSnackBar();
        },
      ),
    );
    _scaffoldKey.currentState.showSnackBar(snackBar); // Error occurred!!!
    return Container();
  }
}
```

- error log

```
======== Exception caught by widgets library =======================================================
The following NoSuchMethodError was thrown building TodoList(dirty, dependencies: [UncontrolledProviderScope], AsyncValue<List<TodoEntity>>.error(error: Exception: No Internet Connection, stackTrace: null), AsyncValue<List<TodoEntity>>.error(error: Exception: No Internet Connection, stackTrace: null)):
The method 'showSnackBar' was called on null.
Receiver: null
Tried calling: showSnackBar(Instance of 'SnackBar')
...
...
====================================================================================================
```

## 原因

原因は非同期処理で画面表示が終わる前に SnackBar を表示させようとしてエラーが発生していました。

今回 非同期処理の API 通信エラーが発生する条件は画面初期表示時です。

画面の WidgetBuild 中にエラー表示用 SnackBar を表示させようとしていました。

```dart
  Widget _buildList() {
    return useProvider(todoListViewModelProvider.state).when(
      data: (todoList) => todoList.isNotEmpty
          ? ListView.builder(
              key: UniqueKey(),
              padding: const EdgeInsets.all(16),
              itemCount: todoList.length,
              itemBuilder: (BuildContext context, int index) {
                return _dismissible(todoList[index], context);
              },
            )
          : _emptyListView(),
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (error, _) => _errorView(error.toString()), // Error occurred!!!
    );
  }
```

API 通信中のエラーハンドリング箇所は、`useProvider` から `AsyncValue` を取得し、 `when` スコープ内で `_errorView` を表示させている箇所です。

```dart
  Widget _errorView(String errorMessage) {
    final context = useContext();
    final snackBar = SnackBar(
      content: Text(errorMessage),
      duration: const Duration(days: 365),
      action: SnackBarAction(
        label: '再試行',
        onPressed: () {
          // 一覧取得
          context.read(todoListViewModelProvider).fetchList();
          // snackBar非表示
          _scaffoldKey.currentState.removeCurrentSnackBar();
        },
      ),
    );
    _scaffoldKey.currentState.showSnackBar(snackBar); // Error occurred!!!
    return Container();
  }
```

この `when` の error が call されるタイミングは Widget の build 中でも呼ばれる可能性があります。

その為、画面構築 build 中に `_errorView` 内で `_scaffoldKey.currentState.showSnackBar()` を呼んで\_scaffoldKey の currentState が null 状態なのでエラーとなっていました。

## 解決方法

showSnackBar を `WidgetsBinding.instance.addPostFrameCallback` で囲む方法です。

```
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _scaffoldKey.currentState.showSnackBar(snackBar);
    });
```

`WidgetsBinding.instance.addPostFrameCallback` は全ての Widget のビルドが終わったタイミングで呼ばれる callback です。

addPostFrameCallback が call されるタイミングはビルドが終わっていることが保証されます。

こちらは Flutter 1.8.4 で追加された機能です。

こちらはどの Widget のビルドが終わるのを待てばいいか分からない場合でも、状態変更する対象を囲めばいいのでどのユースケースでも対応できそうです。

## おわりに

The method 'showSnackBar' was called on null エラーはビルド中に SnackBar を表示(画面状態を変更)しようとすると発生するエラーでした。

同じ原因で setState() or markNeedsBuild() called during build エラーが発生する場合があります。

setState() or markNeedsBuild() called during build エラーも Widget のビルド中に画面状態を変更しようとして起こるエラーです。

こちらも `WidgetsBinding.instance.addPostFrameCallback` で画面状態変更しようとしている処理を囲めばエラーが解消される場合があります。

非同期処理が複数走るユースケースなどで特に発生しそうなエラーなので、同じエラーに遭遇された方の参考になれば幸いです。

---
title: 'FlutterのTodoアプリで Riverpod useProvider ChangeNotifier の基本的な使い方を覚える'
date: '2021-02-12'
isPublished: true
metaDescription: 'FlutterのTodoアプリで Riverpod / useProvider / ChangeNotifier の基本的な使い方を覚えます'
tags:
  - 'Flutter'
  - 'Dart'
---

Flutter の Riverpod / useProvider / ChangeNotifier の基本的な使い方を覚えます。

筆者は Flutter 初学者の為、 題材として簡単な Todo アプリを選びました。

アーキテクチャは簡易版の MVVM で、今回外からデータ取得などしないので Model は作成せず、View と View からロジックを引き剥がす為、 ViewModel のみ実装します。

最終的にこんなアプリを作ります。

<img src='/images/posts/2021-02-12-01.gif' class='img' style='width: 70%' />

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="FlutterのTodoアプリで Riverpod / useProvider / StateNotifier / Freezed の基本的な使い方を覚える | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/flutter-todo-list-riverpod-use-provider-state-notifier-freezed" frameborder="0" scrolling="no"></iframe>

Flutter のまだ正しい実装方法が分からないので実装が誤っていたら [Twitter](https://twitter.com/____ZUMA____) で DM 頂くか、[Contact](/contact) まで連絡お願いします！

**2021/02/15 追記**

Flutter の Todo アプリで Riverpod / useProvider / StateNotifier / Freezed の使い方を覚える記事を書きました。

筆者の感想としては ChangeNotifier よりも StateNotifier + Freezed の組み合わせの方が便利と感じたので、ぜひこちらの記事もご覧ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="FlutterのTodoアプリで Riverpod / useProvider / StateNotifier / Freezed の基本的な使い方を覚える | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/flutter-todo-list-riverpod-use-provider-state-notifier-freezed" frameborder="0" scrolling="no"></iframe>

### 環境

- macOS Big Sur 11.1
- Android Studio 4.1.2
- Flutter 1.22.6
- Dart 2.10.5

## package の install

まず riverpod などの package を install します。

pubspec.yaml に以下 package を追記します。

- pubspec.yaml

```
dependencies:
  flutter:
    sdk: flutter
  hooks_riverpod:
  fluttertoast:
```

`hooks_riverpod` は `riverpod` と `useProvider` を利用する為に install します。

`fluttertoast` は Todo の追加・更新・削除時にトーストメッセージを表示する package です。

`flutter pub get` を実行して package を install してください。

## main.dart に Provider を実装する

main.dart を開いて、以下コードを実装します。

- lib/main.dart

```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/all.dart';
import 'package:flutter_todo_list/todo_list_view.dart';
import 'package:flutter_todo_list/todo_view_model.dart';

final todoProvider = ChangeNotifierProvider(
  (ref) => TodoViewModel(),
);

void main() {
  runApp(
    ProviderScope(
      child: TodoListView(),
    ),
  );
}
```

ここで登場する `ChangeNotifierProvider` が riverpod の provider です。

後ほど実装する ViewModel は `ChangeNotifier` を継承します。

その為、ViewModel の `ChangeNotifier` に対応する `ChangeNotifierProvider` を利用します。

provider とはクラスインスタンスを保持する為のもので(今回でいう ViewModel)、riverpod で提供される関数を通してはじめてアクセスできます(今回でいう useProvider)。

provider 引数には provider で保持する ViewModel を指定します。

ちなみに provider は immutable(不変)で provider をグローバルに定義して問題ないので、`main` メソッドの外側で宣言しています。

また、ChangeNotifierProvider の ref オブジェクトを利用すると他の provider にアクセス出来るようです。

複数 provider が出てくるパターンはまた次回以降検証していきます。

最後に provider を使用する Widget を ProviderScope でくくります。

```dart
void main() {
  runApp(
    ProviderScope(
      child: TodoListView(),
    ),
  );
}
```

この仕組により、provider を使用する Widget を限定出来るようです。

複数の provider が登場してきた時に scope を限定出来るのは便利かもしれません。

## UI の状態を保持するクラスの作成

UI の状態を保持するクラスを作成します。

- lib/todo.dart

```
class Todo {
  Todo(this.id, this.title);
  final int id;
  String title;
}
```

title は値が代入されるので `final` 修飾子は付与していないです。

ただし本来、状態を保持するオブジェクトは意図しない状態の変更を避けるため、immutable(不変)に操作されるべきです。

`Provide` と同じ作者が、状態を持つオブジェクトを immutable に管理できる便利な `freezed` というパッケージを出しているので次回以降、こちらも検証していきます。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="freezed | Dart Package" src="https://hatenablog-parts.com/embed?url=https://pub.dev/packages/freezed" frameborder="0" scrolling="no"></iframe>

## ViewModel を作成する

画面状態を保持する todoList 配列を操作、管理する為の ViewModel を実装します。

`lib/todo_view_model.dart` を作成して以下コードを実装します。

- `lib/todo_view_model.dart`

```dart:todo_view_model.dart
import 'dart:collection';

import 'package:flutter/cupertino.dart';
import 'package:flutter_todo_list/todo.dart';

class TodoViewModel extends ChangeNotifier {

  List<Todo> _todoList = [];
  UnmodifiableListView<Todo> get todoList => UnmodifiableListView(_todoList);

  void createTodo(String title) {
    final id = _todoList.length + 1;
    _todoList = [...todoList, Todo(id, title)];
    notifyListeners();
  }

  void updateTodo(int id, String title) {
    todoList.asMap().forEach((int index, Todo todo) {
      if (todo.id == id) {
        _todoList[index].title = title;
      }
    });
    notifyListeners();
  }

  void deleteTodo(int id) {
    _todoList = todoList.where((todo) => todo.id != id).toList();
    notifyListeners();
  }
}
```

Todo タスクを保持する配列である todoList は `_todoList` と宣言して private にします。

外から呼ぶ public な `todoList` は `UnmodifiableListView<Todo> get todoList => UnmodifiableListView(_todoList);` で `todoList` を外から直接プロパティ操作させない為、UnmodifiableListView でラップしています。

次に、class 宣言の `class TodoViewModel` で `extends ChangeNotifier` しているのが View 側に `_todoList` の状態を変更通知する為に利用する `ChangeNotifier` です。

`_todoList` を操作した後に、 `notifyListeners()` を呼ぶと View 側に todoList の状態変更が通知されます。

ただ毎回 todoList の操作箇所で `notifyListeners()` を呼ぶのは面倒なので、そこら辺をうまく吸収してくれる便利な `StateNotifier` パッケージが出ているので、次回以降そちらも検証していきます。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="flutter_state_notifier | Flutter Package" src="https://hatenablog-parts.com/embed?url=https://pub.dev/packages/flutter_state_notifier" frameborder="0" scrolling="no"></iframe>

ここでは基本的な `ChangeNotifier` で実装します。

次に、todoList 要素にアクセスする際は、以下のように private な `_todoList` を操作しています。

```dart
  void deleteTodo(int id) {
    _todoList = todoList.where((todo) => todo.id != id).toList();
    notifyListeners();
  }
```

ここでは配列の要素の削除操作をしていますが、やっていることは `_todoList.removeAt(index)` などで配列を直接操作しているのと変わりません。

配列要素削除操作を `todoList.where` を使って回りくどく書いているのは、将来 `_todoList` を immutable(不変)に操作するようにしたいので、意識付けとしてあえて書いています。

基本的に画面の状態をもっているオブジェクト(今回でいう`_todoList`)を mutable(可変)に直接操作するのはバグが生まれやすく、アンチパターンだと思っています。

こちらも freezed を使えは解決しそうですが、freezed はコードジェネレーターでデータクラスを作成するらしいので、導入コストを考えて今回はライトに `_todoList` を mutable に操作します。

## Todo 一覧 View を作成する

次に `lib/todo_list_view.dart` を作成して以下コードを実装します。

- `lib/todo_list_view.dart`

```
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_todo_list/main.dart';
import 'package:flutter_todo_list/todo.dart';
import 'package:flutter_todo_list/upsert_todo_view.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:hooks_riverpod/all.dart';

class Const {
  static const routeNameUpsertTodo = 'upsert-todo';
}

class TodoListView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(primaryColor: Colors.white),
      routes: <String, WidgetBuilder>{
        Const.routeNameUpsertTodo: (BuildContext context) => UpsertTodoView(),
      },
      home: TodoList(),
    );
  }
}

class TodoList extends HookWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Todo'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => _transitionToNextScreen(context),
          ),
        ],
      ),
      body: _buildList(),
    );
  }

  Widget _buildList() {
    final viewModel = useProvider(todoProvider);
    // viewModelからtodoList取得/監視
    final List<Todo> _todoList = viewModel.todoList;
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _todoList.length,
      itemBuilder: (BuildContext context, int index) {
        return _dismissible(_todoList[index], context);
      },
    );
  }

  Widget _dismissible(Todo todo, BuildContext context) {
    // ListViewのswipeができるwidget
    return Dismissible(
      // ユニークな値を設定
      key: UniqueKey(),
      confirmDismiss: (direction) async {
        final confirmResult =
            await _showDeleteConfirmDialog(todo.title, context);
        // Future<bool> で確認結果を返す。False の場合削除されない
        return confirmResult;
      },
      onDismissed: (DismissDirection direction) {
        // viewModelのtodoList要素を削除
        context.read(todoProvider).deleteTodo(todo.id);
        // ToastMessageを表示
        Fluttertoast.showToast(
          msg: '${todo.title}を削除しました',
          backgroundColor: Colors.grey,
        );
      },
      // swipe中ListTileのbackground
      background: Container(
        alignment: Alignment.centerLeft,
        // backgroundが赤/ゴミ箱Icon表示
        color: Colors.red,
        child: const Padding(
          padding: const EdgeInsets.fromLTRB(20, 0, 0, 0),
          child: const Icon(
            Icons.delete,
            color: Colors.white,
          ),
        ),
      ),
      child: _todoItem(todo, context),
    );
  }

  Widget _todoItem(Todo todo, BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        border: const Border(bottom: BorderSide(width: 1, color: Colors.grey)),
      ),
      child: ListTile(
        title: Text(
          todo.title,
          style: const TextStyle(
            color: Colors.black,
            fontSize: 16,
          ),
        ),
        onTap: () {
          _transitionToNextScreen(context, todo: todo);
        },
      ),
    );
  }

  Future<void> _transitionToNextScreen(BuildContext context,
      {Todo todo = null}) async {
    final result = await Navigator.pushNamed(context, Const.routeNameUpsertTodo,
        arguments: todo);

    if (result != null) {
      // ToastMessageを表示
      Fluttertoast.showToast(
        msg: result.toString(),
        backgroundColor: Colors.grey,
      );
    }
  }

  Future<bool> _showDeleteConfirmDialog(
      String title, BuildContext context) async {
    final result = await showDialog<bool>(
        context: context,
        barrierDismissible: false,
        builder: (BuildContext context) {
          return AlertDialog(
            title: const Text('削除'),
            content: Text('$titleを削除しますか？'),
            actions: [
              FlatButton(
                onPressed: () => Navigator.of(context).pop(false),
                child: const Text('cancel'),
              ),
              FlatButton(
                onPressed: () => Navigator.of(context).pop(true),
                child: const Text('OK'),
              ),
            ],
          );
        });
    return result;
  }
}
```

ポイントは `final viewModel = useProvider(todoProvider);` で先程 main.dart で作成した todoProvider と `useProvider` を利用して viewModel を取得しています。

```dart
  Widget _buildList() {
    final viewModel = useProvider(todoProvider);
    final List<Todo> _todoList = viewModel.todoList;
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _todoList.length,
      itemBuilder: (BuildContext context, int index) {
        return _dismissible(_todoList[index], context);
      },
    );
  }
```

次に `final List<Todo> _todoList = viewModel.todoList;`　で viewModel から todoList を取得しています。

取得した todoList は `ListView.builder` の itemCount と itemBuilder に指定します。

`useProvider` を通して取得したオブジェクトは状態監視されて変更が起きたら Widget をリビルドします。

Flutter の宣言的 UI の仕組みと `ChangeNotifier` の通知の仕組み、 flutter hooks の`useProvider`、 riverpod の `ChangeNotifierProvider` の状態監視のおかげで、 ViewModel で起きた todoList の変更を監視し、変更があれば自動で UI に反映されるようになります。

`useProvider` は flutter hooks と呼ばれるもので、利用するには、 `HookWidget` を継承する必要があります。

```dart
class TodoList extends HookWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Todo'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => _transitionToNextScreen(context),
          ),
        ],
      ),
      body: _buildList(),
    );
  }
```

今回は親 Widget の `class TodoList` に `extends HookWidget` をして flutter hooks を利用出来るようにしています。

その他、 `Navigator.pushNamed` の箇所で、Todo 作成・更新画面に選択した Todo のオブジェクトを渡しています。

```dart
  Future<void> _transitionToNextScreen(BuildContext context,
      {Todo todo = null}) async {
    final result = await Navigator.pushNamed(context, Const.routeNameUpsertTodo,
        arguments: todo);

    if (result != null) {
      Fluttertoast.showToast(
        msg: result.toString(),
        backgroundColor: Colors.grey,
      );
    }
  }
```

Todo 新規作成の場合 null が渡されるので、次に実装する Todo 作成・更新画面で Todo が null の場合の条件分岐で表示出し分けをしています。

また、 `Navigator.pushNamed` の戻り値の result には Todo 作成 or 更新メッセージが返ってきます。

Todo 作成 or 更新メッセージを `Fluttertoast` で表示するようにしています。

## Todo 作成・更新をする View を作成する

次に `lib/upsert_todo_view.dart` を作成して以下コードを実装します。

- `lib/upsert_todo_view.dart`

```dart
import 'package:flutter/material.dart';
import 'package:flutter_todo_list/main.dart';
import 'package:flutter_todo_list/todo.dart';
import 'package:hooks_riverpod/all.dart';

class UpsertTodoView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final todo = ModalRoute.of(context).settings.arguments as Todo;
    return Scaffold(
      appBar: AppBar(
        title: Text('Todo${todo == null ? '作成' : '更新'}'),
      ),
      body: TodoForm(),
    );
  }
}

class TodoForm extends StatefulWidget {
  @override
  _TodoFormState createState() => _TodoFormState();
}

class _TodoFormState extends State<TodoForm> {
  final _formKey = GlobalKey<FormState>();
  String _title = '';

  @override
  Widget build(BuildContext context) {
    final todo = ModalRoute.of(context).settings.arguments as Todo;
    return Form(
      key: _formKey,
      child: Container(
        padding: const EdgeInsets.all(64),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            TextFormField(
              initialValue: todo != null ? todo.title : '',
              maxLength: 20,
              maxLengthEnforced: true,
              decoration: const InputDecoration(
                hintText: 'Todoタイトルを入力してください',
                labelText: 'Todoタイトル',
              ),
              validator: (String title) {
                return title.isEmpty ? 'Todoタイトルを入力してください' : null;
              },
              onSaved: (String title) {
                _title = title;
              },
            ),
            RaisedButton(
              onPressed: () => _submission(context, todo),
              child: Text('Todoを${todo == null ? '作成' : '更新'}する'),
            ),
          ],
        ),
      ),
    );
  }

  void _submission(BuildContext context, Todo todo) {
    if (_formKey.currentState.validate()) {
      _formKey.currentState.save();
      if (todo != null) {
        // viewModelのtodoListを更新
        context.read(todoProvider).updateTodo(todo.id, _title);
      } else {
        // viewModelのtodoListを作成
        context.read(todoProvider).createTodo(_title);
      }
      // 前の画面に戻る
      Navigator.pop(context, '$_titleを${todo == null ? '作成' : '更新'}しました');
    }
  }
}
```

ポイントは `context.read(todoProvider)` の処理で、先程作成した ViewModel の `updateTodo` と `createTodo` メソッドを呼び出しています。

```dart
  void _submission(BuildContext context, Todo todo) {
    if (_formKey.currentState.validate()) {
      _formKey.currentState.save();
      if (todo != null) {
        // viewModelのtodoListを更新
        context.read(todoProvider).updateTodo(todo.id, _title);
      } else {
        // viewModelのtodoListを作成
        context.read(todoProvider).createTodo(_title);
      }
      Navigator.pop(context, '$_titleを${todo == null ? '作成' : '更新'}しました');
    }
  }
}
```

`context.read` は、状態の検知・監視を伴わない場合の Provider 取得の仕組みで、主に Provider で保持しているオブジェクト(今回でいう ViewModel)の関数呼び出しの時などに利用します。

Todo 一覧では状態の検知・監視をする `useProvider` を通して Provider で保持している ViewModel の todoList を取得、ListView.builder にセットしています。

`context.read` で Provider で保持している ViewModel の関数呼び出し、ViewModel で UI の状態を保持した todoList の変更、`ChangeNotifier`で変更を通知、`useProvider` と Provider で状態変更を検知して ListView.builder をリビルドをします。

この一連の流れで状態変更による自動 UI 反映が実現できるという訳です。

そのほか、`ModalRoute.of(context).settings.arguments as Todo` で Todo 一覧画面から Todo オブジェクトを取得しています。

```
class UpsertTodoView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final todo = ModalRoute.of(context).settings.arguments as Todo;
    return Scaffold(
      appBar: AppBar(
        title: Text('Todo${todo == null ? '作成' : '更新'}'),
      ),
      body: TodoForm(),
    );
  }
}
```

Todo オブジェクトがあれば更新、無ければ新規作成の表示出し分けをいれています。

## おわりに

Flutter の宣言的 UI と ChangeNotifier による通知の仕組み、riverpod + useProvider による状態監視の組み合わせで直感的かつコード量を抑えて Todo アプリを実装することができました。

次のステップとして、同じ Todo アプリに Freezed を導入して状態を持つオブジェクトを immutable に管理しつつ、StateNotifier、StateProvider で直感的かつ、更にコードを減らす実装をしてみたいと思います。

筆者は Flutter 初学者の為、まだ正しい実装方法が分からないので実装が誤っていたら [Twitter](https://twitter.com/____ZUMA____) で DM 頂くか、[Contact](/contact) まで連絡お願いします！

最後に今回実装した Todo アプリは Github にあるので参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="kazuma-fujita/flutter_todo_list_with_riverpod: Practice Flutter riverpod with todo list." src="https://hatenablog-parts.com/embed?url=https://github.com/kazuma-fujita/flutter_todo_list_with_riverpod" frameborder="0" scrolling="no"></iframe>

**2021/02/15 追記**

Flutter の Todo アプリで Riverpod / useProvider / StateNotifier / Freezed の使い方を覚える記事を書きました。

筆者の感想としては ChangeNotifier よりも StateNotifier + Freezed の組み合わせの方が便利と感じたので、ぜひこちらの記事もご覧ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="FlutterのTodoアプリで Riverpod / useProvider / StateNotifier / Freezed の基本的な使い方を覚える | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/flutter-todo-list-riverpod-use-provider-state-notifier-freezed" frameborder="0" scrolling="no"></iframe>

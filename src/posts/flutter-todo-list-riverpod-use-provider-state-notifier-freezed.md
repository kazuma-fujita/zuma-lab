---
title: 'FlutterのTodoアプリで Riverpod useProvider StateNotifier Freezed の基本的な使い方を覚える'
date: '2021-02-15'
isPublished: true
metaDescription: 'FlutterのTodoアプリで Riverpod / useProvider / StateNotifier / Freezed の基本的な使い方を覚えます'
tags:
  - 'Flutter'
  - 'Dart'
---

Flutter の Riverpod / useProvider / StateNotifier / Freezed の基本的な使い方を覚えます。

筆者は Flutter 初学者の為、 題材として簡単な Todo アプリを選びました。

前回の記事で Todo アプリを題材に Riverpod / useProvider / ChangeNotifier の基本的な使い方を書いているので、今回はこちらの記事をアップデートする形で実装していきます。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="FlutterのTodoアプリで Riverpod / useProvider / ChangeNotifier の基本的な使い方を覚える | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/flutter-todo-list-riverpod-use-provider-change-notifier" frameborder="0" scrolling="no"></iframe>

アーキテクチャは簡易版の MVVM で、今回外からデータ取得などしないので Model は作成せず、View と View からロジックを引き剥がす為、 ViewModel のみ実装します。

最終的にこんなアプリを作ります。

<img src='/images/posts/2021-02-12-01.gif' class='img' style='width: 70%' />

Flutter のまだ正しい実装方法が分からないので実装が誤っていたら [Twitter](https://twitter.com/____ZUMA____) で DM 頂くか、[Contact](/contact) まで連絡お願いします！

### 環境

- macOS Big Sur 11.1
- Android Studio 4.1.2
- Flutter 1.22.6
- Dart 2.10.5

## package の install

まず riverpod などの package を install します。

pubspec.yaml の dependencies に以下 package を追記します。

- pubspec.yaml

```yaml
dependencies:
  flutter:
    sdk: flutter
  hooks_riverpod:
  state_notifier:
  freezed_annotation:
  fluttertoast:
```

`hooks_riverpod` は `riverpod` と `useProvider` を利用する為の package です。

`fluttertoast` は Todo の追加・更新・削除時にトーストメッセージを表示する package です。

```yaml
dev_dependencies:
  flutter_test:
    sdk: flutter
  build_runner:
  freezed:
```

次に、freezed を利用する為、`dev_dependencies` に `build_runner`と `freezed` を追記します。

最後に `flutter pub get` を実行して package を install してください。

## main.dart に Provider を実装する

main.dart を開いて、以下コードを実装します。

- lib/main.dart

```dart
import 'package:flutter/material.dart';
import 'package:flutter_todo_list/todo_list_view.dart';
import 'package:flutter_todo_list/todo_view_model.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

final todoViewModelProvider = StateNotifierProvider(
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

ここで登場する `StateNotifierProvider` は riverpod の provider です。

後ほど実装する ViewModel は `StateNotifier` を継承します。

その為、ViewModel の `StateNotifier` に対応する `StateNotifierProvider` を利用します。

riverpod の provider とはクラスインスタンスを保持する為のもので(今回でいう ViewModel)、riverpod で提供される関数を通してはじめてアクセスできます(今回でいう useProvider)。

provider 引数には provider で保持する ViewModel を指定します。

ちなみに provider は immutable(不変)で provider をグローバルに定義して問題ないので、`main` メソッドの外側で宣言しています。

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

蛇足ですが、StateNotifierProvider の ref オブジェクトを利用すると他の provider にアクセス出来ます。

複数の provider を ref で参照するパターンを記事にしたので、興味がある方はご覧ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Flutter RiverpodでDIをしてテスタビリティを向上させる | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/flutter-search-github-riverpod-di" frameborder="0" scrolling="no"></iframe>

## UI の状態を表現するクラスの作成

次に UI の状態を表現するクラスを作成します。

状態を表現するオブジェクトは意図しない状態の変更を避ける為、初期化後に変更できない immutable(不変)な状態が望ましいです。

immutable にするには `@immutable` アノテーションを付与します。

`@immutable` アノテーションを付ける場合、メンバ変数は `final`、コンストラクタは `const` 修飾子を付けます。

- lib/todo.dart

```
import 'package:flutter/material.dart';

@immutable
class Todo {
  const Todo(this.id, this.title);
  final int id;
  final String title;
}
```

## UI の状態を保持する State クラスを作成して freezed で immutable にする

次に先程作成した UI を表現する `Todo` オブジェクト配列を保持する State クラス `lib/todo_state.dart` を作成します。

TodoState クラスでは Todo リストの状態を保持している為、Todo 作成、更新、削除操作により、リストの状態が変更される可能性があります。

ここでは安全に状態を変更できるように freezed を使用してオブジェクトを immutable にします。

freezed を使用すると、オブジェクトが immutable になるだけでは無く、自動で自身のオブジェクトをコピーする `copyWith` メソッドが生えます。

今後 `copyWith` を使用して Todo リストの状態管理を行います。

本題の State クラスに freezed を適用するコードは以下です。

- `lib/todo_state.dart`

```
import 'package:flutter_todo_list/todo.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:flutter/foundation.dart';

part 'todo_state.freezed.dart';

@freezed
abstract class TodoState with _$TodoState {
  const factory TodoState({
    @Default(<Todo>[]) List<Todo> todoList,
  }) = _TodoState;
}
```

便利な freezed ですが、デメリットとして新しい State クラスを作成する度に、コマンドラインで freezed のコードが記述された dart ファイルを生成する必要があります。

生成するファイル名を `part` の後に記述します。

今回は `todo_state.freezed.dart` というファイル名を指定しました。

次に `@freezed` アノテーションを付与します。

次に State クラスに freezed で生成されるクラスを `with` で mixin します。

あとは factory コンストラクタに状態を保持するリストと、そのデフォルト値を記述します。

`@Default` は freezed のアノテーション記法で、（）内に初期値を記述します。

この時点でエラーが出ていますが、この後実行するコマンドラインで解消します。

## freezed のコード生成を実行する

以下のコマンドラインをプロジェクトルートで実行します。

```
flutter pub run build_runner build --delete-conflicting-outputs
```

`--delete-conflicting-outputs` は既に生成しているファイルとコンフリクトしないようにするオプションです。

競合する既存ファイルを削除してからファイル生成をします。

正常終了すると、`lib/todo_state.freezed.dart` が作成されます。

## freezed ファイルの Warning を 無視する analysis_options.yaml を作成する

生成された freezed ファイルのコードは整形されていないので Warning が発生する場合があります。

生成されたファイルの Warning を無視するにはプロジェクトルートに `analysis_options.yaml` ファイルを作成して以下を追記します。

- `analysis_options.yaml`

```
analyzer:
 exclude:
   - "**/*.freezed.dart"
```

## ViewModel を作成する

次に State クラスを管理する為の ViewModel を実装します。

`lib/todo_view_model.dart` を作成して以下コードを実装します。

- `lib/todo_view_model.dart`

```dart:todo_view_model.dart
import 'package:flutter_todo_list/todo.dart';
import 'package:flutter_todo_list/todo_state.dart';
import 'package:state_notifier/state_notifier.dart';

class TodoViewModel extends StateNotifier<TodoState> {
  TodoViewModel() : super(const TodoState());

  void createTodo(String title) {
    final id = state.todoList.length + 1;
    final newList = [...state.todoList, Todo(id, title)];
    state = state.copyWith(todoList: newList);
  }

  void updateTodo(int id, String title) {
    final newList = state.todoList
        .map((todo) => todo.id == id ? Todo(id, title) : todo)
        .toList();
    state = state.copyWith(todoList: newList);
  }

  void deleteTodo(int id) {
    final newList = state.todoList.where((todo) => todo.id != id).toList();
    state = state.copyWith(todoList: newList);
  }
}
```

StateNotifier を利用する為、TodoViewModel の class 宣言 で StateNotifier を継承します。

StateNotifier では、ViewModel が扱う状態クラスを指定します。

今回は先程作成した `TodoState` を指定します。

次に、todoList の状態を変更する為、CRUD 操作のメソッドを実装していきます。

```dart
  void deleteTodo(int id) {
    final newList = state.todoList.where((todo) => todo.id != id).toList();
    state = state.copyWith(todoList: newList);
  }
```

ここでは todoList の要素の削除操作をしています。

StateNotifier を継承すると `state` オブジェクトを使用できるようになります。

`state.todoList` で先程作成した State クラスである `TodoState` のリストを取得できます。

state の状態を変更するには、まず既存の state か変更後の状態の配列を生成します。

次に freezed で自動生成された `copyWith` メソッドで変更後のリストをコピーした state を新しい state とします。

変更後の状態を UI に反映するには `ChangeNotifier` の場合、 `notifyListeners` を call して変更後の状態を View に通知します。

`StateNotifier` の場合は state を変更するだけで、View 側が state の変更を検知して変更後の状態が UI に反映されます。

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
    final todoState = useProvider(todoViewModelProvider.state);
    // viewModelからtodoList取得/監視
    final _todoList = todoState.todoList;
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
        context.read(todoViewModelProvider).deleteTodo(todo.id);
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
          padding: EdgeInsets.fromLTRB(20, 0, 0, 0),
          child: Icon(
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
        border: Border(bottom: BorderSide(width: 1, color: Colors.grey)),
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
      {Todo todo}) async {
    final result = await Navigator.pushNamed(context, Const.routeNameUpsertTodo,
        arguments: todo);

    if (result != null) {
      // ToastMessageを表示
      await Fluttertoast.showToast(
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

ポイントは `useProvider(todoViewModelProvider.state)` で先程 main.dart で作成した todoViewModelProvider と `useProvider` を利用して viewModel から State クラスを取得しています。

```dart
  Widget _buildList() {
    final todoState = useProvider(todoViewModelProvider.state);
    final _todoList = todoState.todoList;
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _todoList.length,
      itemBuilder: (BuildContext context, int index) {
        return _dismissible(_todoList[index], context);
      },
    );
  }
```

次に `final _todoList = todoState.todoList`　で State クラス から todoList を取得しています。

取得した todoList は `ListView.builder` の itemCount と itemBuilder に指定します。

`useProvider` を通して取得したオブジェクトは状態監視されて変更が起きたら Widget をリビルドします。

`useProvider`、 riverpod の `StateNotifierProvider` の状態監視のおかげで、StateNotifier の state が変更されたら View 側で検知して自動的に UI に反映されるようになります。

また、 `useProvider` は flutter hooks と呼ばれるもので、利用するには、 `HookWidget` を継承する必要があります。

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
              // maxLength以上入力不可
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
        context.read(todoViewModelProvider).updateTodo(todo.id, _title);
      } else {
        // viewModelのtodoListを作成
        context.read(todoViewModelProvider).createTodo(_title);
      }
      // 前の画面に戻る
      Navigator.pop(context, '$_titleを${todo == null ? '作成' : '更新'}しました');
    }
  }
}
```

ポイントは `context.read(todoViewModelProvider)` の処理で、先程作成した ViewModel の `updateTodo` と `createTodo` メソッドを呼び出しています。

```dart
  void _submission(BuildContext context, Todo todo) {
    if (_formKey.currentState.validate()) {
      _formKey.currentState.save();
      if (todo != null) {
        // viewModelのtodoListを更新
        context.read(todoViewModelProvider).updateTodo(todo.id, _title);
      } else {
        // viewModelのtodoListを作成
        context.read(todoViewModelProvider).createTodo(_title);
      }
      Navigator.pop(context, '$_titleを${todo == null ? '作成' : '更新'}しました');
    }
  }
}
```

`context.read` は、状態の検知・監視を伴わない場合の Provider 取得の仕組みで、主に Provider で保持しているオブジェクト(今回でいう ViewModel)の関数呼び出しの時などに利用します。

Todo 一覧では状態の検知・監視をする `useProvider` を通して Provider で保持している ViewModel の todoList を取得、ListView.builder にセットしています。

`context.read` で Provider で保持している ViewModel の関数呼び出し、ViewModel で UI の状態を保持した todoList の変更、`StateNotifier` で変更を通知、`useProvider` と `StateNotifierProvider` で状態変更を検知して ListView.builder をリビルドをします。

この一連の流れで状態変更による自動 UI 反映が実現できるという訳です。

## おわりに

Flutter の宣言的 UI と StateNotifier による通知の仕組み、riverpod の StateNotifierProvider、Flutter hooks の useProvider による状態監視の組み合わせで直感的かつコード量を抑えて Todo アプリを実装することができました。

筆者は Flutter 初学者の為、まだ正しい実装方法が分からないので実装が誤っていたら [Twitter](https://twitter.com/____ZUMA____) で DM 頂くか、[Contact](/contact) まで連絡お願いします！

最後に今回実装した Todo アプリは Github にあるので参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="kazuma-fujita/flutter_todo_list_with_state_notifier_freezed: Practice Flutter riverpod and useProvider and StateNotifier and freezed with todo list." src="https://hatenablog-parts.com/embed?url=https://github.com/kazuma-fujita/flutter_todo_list_with_state_notifier_freezed" frameborder="0" scrolling="no"></iframe>

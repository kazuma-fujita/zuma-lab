---
title: 'Flutter Httpでネットワーク通信部分を実装する'
date: '2021-02-26'
isPublished: true
metaDescription: 'Flutter の Http client package である　 Http を利用して GET/POST/PUT/DELETE メソッドを実装します。構成としては簡易的な MVVM です。Model 層は API response を処理する Repository と Http 通信を行う ApiClient で構成します。'
tags:
  - 'Flutter'
  - 'Dart'
---

Flutter の Http client package である　 Http を利用して GET/POST/PUT/DELETE メソッドを実装します。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="http | Dart Package" src="https://hatenablog-parts.com/embed?url=https://pub.dev/packages/http" frameborder="0" scrolling="no"></iframe>

今回は題材として Todo アプリのネットワーク通信部分を実装します。

構成としては簡易的な MVVM です。

Model 層は API response を処理する Repository と Http 通信を行う ApiClient で構成します。

ApiClient > Repository > ViewModel の順で呼び出します。

今回は Model/ViewModel 層のみ掲載します。

全てのソースコードは Github にあるので参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="kazuma-fujita/flutter_todo_list_with_http: Practice Flutter with http package." src="https://hatenablog-parts.com/embed?url=https://github.com/kazuma-fujita/flutter_todo_list_with_http" frameborder="0" scrolling="no"></iframe>

また、API のモックは JsonServer を利用します。

### 環境

- macOS Big Sur 11.1
- Android Studio 4.1.2
- Flutter 1.22.6
- Dart 2.10.5
- yarn 1.22.4

今回 JsonServer を install するには `yarn` コマンドを使用します。

## JsonServer で API のモックサーバーを立てる

API モックについては今回の本質では無いので最低限の設定だけします。

今回 API のモッキングする JsonServer の詳しい利用方法はオフィシャルを参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="typicode/json-server: Get a full fake REST API with zero coding in less than 30 seconds (seriously)" src="https://hatenablog-parts.com/embed?url=https://github.com/typicode/json-server" frameborder="0" scrolling="no"></iframe>

### JsonServer を install する

作業ディレクトリを作成して `json-server` を install します。

```txt
mkdir json-server && cd json-server && yarn add -D json-server
```

### データを保存する db.json を作成する

JsonServer を install したディレクトリで `db.json` を作成します。

```txt
vi db.json
```

この json に CRUD 処理したデータが保存されます。

初期値のデータモデルとして以下の json を記述します。

```json
{
  "todos": [
    {
      "id": 1,
      "title": "InitialTask"
    }
  ]
}
```

トップレベルの `todos` がそのまま API のエンドポイントになります。

todo 配列は `id` と `title` のフィールドを持ちます。

### JsonServer を起動する

以下のコマンドで JsonServer を起動します。

```txt
yarn json-server --watch --port 3030 db.json
```

`--watch` オプションでモックサーバへのアクセスがリアルタイムに閲覧できます。

JsonServer のデフォルトポートは 3000 番です。

筆者は 3000 番が他で利用しているポートと衝突するので、`--port` オプションで 3030 番にポート変更しています。

ここは適宜ご自身の環境に合わせて設定してください。

### GET/POST/PUT/DELETE を実行してみる

動作確認の為、CRUD 処理する各メソッドを実行してみます。

- GET

todo 配列を GET します。

```json
$ curl -X GET localhost:3030/todos
[
  {
    "id": 1,
    "title": "Initial task"
  }
]
```

特定の id を指定して GET します。

```json
$ curl -X GET localhost:3030/todos/1
{
  "id": 1,
  "title": "InitialTask"
}
```

- POST

`id` は未指定だとインクリメントされた値が自動で割り振られます。

```json
$ curl -X POST localhost:3030/todos -d 'title=SecondTask'
  {
    "id": 2,
    "title": "SecondTask"
  }
```

- PUT

```json
$ curl -X PUT localhost:3030/todos/2 -d 'id=2&title=ChangeTask'
{
  "id": 2,
  "title": "ChangeTask"
}
```

- DELETE

```json
$ curl -X DELETE localhost:3030/todos/2
{}

$ curl -X GET localhost:3030/todos
[
  {
    "id": 1,
    "title": "InitialTask"
  }
]
```

## ApiClient を実装する

それでは本題の Http を利用した ApiClient の通信部分を実装します。

- `lib/todo_api_client.dart`

```dart
abstract class TodoApiClient {
  Future<String> get(String endpoint);
  Future<String> post(String endpoint, {@required String body});
  Future<String> put(String endpoint, {@required String body});
  Future<String> delete(String endpoint);
}

class TodoApiClientImpl implements TodoApiClient {
  // factory コンストラクタは instanceを生成せず常にキャッシュを返す(singleton)
  factory TodoApiClientImpl({String baseUrl = 'http://10.0.2.2:3030'}) {
    return _instance ??= TodoApiClientImpl._internal(baseUrl);
  }
  // クラス生成時に instance を生成する class コンストラクタ
  TodoApiClientImpl._internal(this.baseUrl);
  // singleton にする為の instance キャッシュ
  static TodoApiClientImpl _instance;
  // APIの基底Url
  final String baseUrl;

  static const headers = <String, String>{'content-type': 'application/json'};

  Future<String> _safeApiCall(Function callback) async {
    try {
      final response = await callback() as http.Response;
      return _parseResponse(response.statusCode, response.body);
    } on SocketException {
      throw Exception('No Internet Connection');
    }
  }

  @override
  Future<String> get(String endpoint) async {
    return _safeApiCall(() async => http.get('$baseUrl$endpoint'));
  }

  @override
  Future<String> post(String endpoint, {String body}) async {
    return _safeApiCall(() async =>
        http.post('$baseUrl$endpoint', headers: headers, body: body));
  }

  @override
  Future<String> put(String endpoint, {String body}) async {
    return _safeApiCall(() async =>
        http.put('$baseUrl$endpoint', headers: headers, body: body));
  }

  @override
  Future<String> delete(String endpoint) async {
    return _safeApiCall(() async => http.delete('$baseUrl$endpoint'));
  }

  String _parseResponse(int httpStatus, String responseBody) {
    switch (httpStatus) {
      case 200:
      case 201:
        return responseBody;
        break;
      case 400:
        throw Exception('400 Bad Request');
        break;
      case 401:
        throw Exception('401 Unauthorized');
        break;
      case 403:
        throw Exception('403 Forbidden');
        break;
      case 404:
        throw Exception('404 Not Found');
        break;
      case 405:
        throw Exception('405 Method Not Allowed');
        break;
      case 500:
        throw Exception('500 Internal Server Error');
        break;
      default:
        throw Exception('Http status $httpStatus unknown error.');
        break;
    }
  }
}
```

ApiClient は Repository から呼ばれます。

ApiClient はテスタビリティを考慮して DI を前提として interface を実装し、implements させています。

また、ApiClient は様々な Repository から呼ばれることを想定して singleton パターンを採用しています。

実際の通信部分は共通で必要なエラー処理する `_safeApiCall` メソッドを実装しています。

```dart
  Future<String> _safeApiCall(Function callback) async {
    try {
      final response = await callback() as http.Response;
      return _parseResponse(response.statusCode, response.body);
    } on SocketException {
      throw Exception('No Internet Connection');
    }
  }
```

`_parseResponse` メソッドで、response.statusCode, response.body からエラー処理、また値の取得を行っています。

Http の各メソッド実行時に通信エラーが発生した場合、 `SocketException` が throw されます。

あとは以下のように `_safeApiCall` の callback に Http を実行する get/post/put/delete メソッドを実装します。

```dart
  @override
  Future<String> get(String endpoint) async {
    return _safeApiCall(() async => http.get('$baseUrl$endpoint'));
  }
```

## ApiClient を利用する Repository を実装する

次に ApiClient を call する Repository を実装します。

- `lib/todo_repository.dart`

```dart
abstract class TodoRepository {
  Future<List<TodoEntity>> fitchList();
  Future<void> createTodo({@required String title});
  Future<void> updateTodo({@required int id, @required String title});
  Future<void> deleteTodo({@required int id});
}

class TodoRepositoryImpl implements TodoRepository {
  TodoRepositoryImpl({@required this.apiClient});

  final TodoApiClient apiClient;

  static const endPoint = '/todos';

  @override
  Future<List<TodoEntity>> fitchList() async {
    final responseBody = await apiClient.get(endPoint);
    try {
      final decodedJson = json.decode(responseBody) as List<dynamic>;
      return decodedJson
          .map((dynamic itemJson) =>
              TodoEntity.fromJson(itemJson as Map<String, dynamic>))
          .toList();
    } on Exception catch (error) {
      throw Exception('Json decode error: $error');
    }
  }

  @override
  Future<void> createTodo({String title}) async {
    final body = {'title': title};
    await apiClient.post(endPoint, body: json.encode(body));
  }

  @override
  Future<void> updateTodo({int id, String title}) async {
    final body = {'title': title};
    await apiClient.put('$endPoint/$id', body: json.encode(body));
  }

  @override
  Future<void> deleteTodo({int id}) async {
    await apiClient.delete('$endPoint/$id');
  }
}
```

こちらもテスタビリティを考慮して DI を前提として interface を実装し、implements させています。

### Repository と ViewModel の GET 処理

```dart
  @override
  Future<List<TodoEntity>> fitchList() async {
    final responseBody = await apiClient.get(endPoint);
    try {
      final decodedJson = json.decode(responseBody) as List<dynamic>;
      return decodedJson
          .map((dynamic itemJson) =>
              TodoEntity.fromJson(itemJson as Map<String, dynamic>))
          .toList();
    } on Exception catch (error) {
      throw Exception('Json decode error: $error');
    }
  }
```

Http の get を実行する `fetchList` メソッドは get で取得した responseBody から json を取得し、`TodoEntity` オブジェクトの property に mapping させています。

返却される responseBody の json は以下となります。

```json
[
  {
    "id": 1,
    "title": "Initial task"
  }
]
```

`TodoEntity` は `freezed` を利用して immutable 化して、お馴染みの `json-serializable`  の fromJson メソッドを生やして json から property に mapping 出来るようにしています。

```dart
@freezed
abstract class TodoEntity with _$TodoEntity {
  const factory TodoEntity({
    @required final int id,
    @required final String title,
  }) = _TodoEntity;

  factory TodoEntity.fromJson(Map<String, dynamic> json) =>
      _$TodoEntityFromJson(json);
}
```

以下 viewModel で Repository の `fetchList` メソッドを呼び出しています。

- `lib/todo_list_view_model.dart`

```dart
class TodoListViewModel extends StateNotifier<AsyncValue<List<TodoEntity>>> {
  TodoListViewModel({@required this.todoRepository})
      : super(const AsyncValue.loading()) {
    fetchList();
  }

  final TodoRepository todoRepository;

  Future<void> fetchList() async {
    await _tryCatch(() async {
      final newList = await todoRepository.fitchList();
      state = AsyncValue.data(newList);
    });
  }

  Future<void> _tryCatch(Function callback) async {
    state = const AsyncValue.loading();
    try {
      await callback();
    } on Exception catch (error) {
      state = AsyncValue.error(error);
    }
  }
}
```

await キーワードで `todoRepository.fitchList()` の処理を待ち合わせて、正常に終了したら StateNotifier の state を `AsyncValue.data(newList)` に変更しています。

もし `fitchList` メソッドで実行時にエラーが発生した場合は `_tryCatch` メソッド内で catch して StateNotifier の state を `AsyncValue.error(error)` に変更しています。

### Repository と ViewModel の CREATE/UPDATE/DELETE 処理

Repository の `createTodo` `updateTodo` `deleteTodo` はこのように ApiClient を呼び出すだけにしています。

- `lib/todo_repository.dart`

```dart
  @override
  Future<void> createTodo({String title}) async {
    final body = {'title': title};
    await apiClient.post(endPoint, body: json.encode(body));
  }
```

Repository の `createTodo` を利用する ViewModel 側では、以下のように await キーワードを付けて `await todoRepository.createTodo(...)` のように call しています。

- `lib/upsert_todo_view_model.dart`

```dart
class UpsertTodoViewModel extends StateNotifier<AsyncValue<TodoEntity>> {
  UpsertTodoViewModel(
      {@required this.todoListViewModel, @required this.todoRepository})
      : super(const AsyncValue.data(null));

  final TodoListViewModel todoListViewModel;
  final TodoRepository todoRepository;

  Future<void> createTodo(String title) async {
    await _tryCatch(() async {
      await todoRepository.createTodo(title: title);
      final currentList = todoListViewModel.state.data.value;
      final id = currentList.length + 1;
      final newTodo = TodoEntity(id: id, title: title);
      final newList = [...currentList, newTodo];
      todoListViewModel.state = AsyncValue.data(newList);
      state = AsyncValue.data(newTodo);
    });
  }

  Future<void> updateTodo(int id, String title) async {
                        :
                        :
                        :
  }

  Future<void> _tryCatch(Function callback) async {
    if (todoListViewModel.state is AsyncError) {
      state = AsyncValue.error('There is an error in the list.');
      return;
    }
    state = const AsyncValue.loading();
    try {
      await callback();
    } on Exception catch (error) {
      state = AsyncValue.error(error);
    }
  }
}
```

こちらも `fetchList` と同じく await キーワードで `todoRepository.createTodo(...)` の処理を待ち合わせて、正常に終了したら StateNotifier の state を `AsyncValue.data(newTodo)` に変更しています。

もし `createTodo` メソッドで実行時にエラーが発生した場合は `_tryCatch` メソッド内で catch して StateNotifier の state を `AsyncValue.error(error)` に変更しています。

state に入れている AsyncValue は Riverpod の機能で、非同期通信時のローディングとエラー処理を楽に実装できます。

View 側では以下のように `useProvider` で取得した AsyncValue から生えている when を利用して、ローディング、エラー処理をしています。

- `lib/upsert_todo_view.dart`

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
          WidgetsBinding.instance.addPostFrameCallback((_) {
            Navigator.pop(context, '${todo.title}を${isNew ? '作成' : '更新'}しました');
          });
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

  void _errorView(String errorMessage) {
    Fluttertoast.showToast(
      msg: errorMessage,
      backgroundColor: Colors.grey,
    );
  }
}
```

以上で簡単ですが、Http を利用した通信部分の ApiClient から Repository、ViewModel までの流れとなります。

## おわりに

Http は Flutter も推奨している package なので今回使用してみました。

他に有名な HTTP client package としては dio や Chopper などがあるので、次回は Http 以外の package で通信部分の実装をしてみたいと思います。

また、Http 通信でついてまわるローディングとエラー処理は AsyncValue で楽に実装できるのでオススメです。

AsyncValue については以前記事で書いていますので、気になる方はご覧ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Flutter Riverpod の AsyncValue で非同期通信時のローディングとエラー処理を楽に実装する | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/flutter-search-github-repositories-with-async-value" frameborder="0" scrolling="no"></iframe>

また、Repository クラス では Http の response を JsonSerializable で オブジェクトの property に mapping して Freezed で immutable にしています。

前回、Flutter JsonSerializable でスネークケースの json フィールドを自動で変換する方法を紹介しましたので気になる方はご覧ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Flutter JsonSerializableでスネークケースのjsonフィールドを自動で変換する | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/flutter-search-github-json-serializable-build-yaml" frameborder="0" scrolling="no"></iframe>

最後に、今回部分的に紹介した Todo アプリの全てのソースコードは Github にあるので参照くださいませ！

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="kazuma-fujita/flutter_todo_list_with_http: Practice Flutter with http package." src="https://hatenablog-parts.com/embed?url=https://github.com/kazuma-fujita/flutter_todo_list_with_http" frameborder="0" scrolling="no"></iframe>

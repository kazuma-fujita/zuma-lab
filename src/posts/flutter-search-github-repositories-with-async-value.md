---
title: 'Flutter Riverpod の AsyncValue で非同期通信時のローディングとエラー処理を楽に実装する'
date: '2021-02-18'
isPublished: true
metaDescription: 'Flutter Riverpod の AsyncValue を使えば、非同期通信時のローディングとエラー処理を楽に実装できます。筆者は個人的に非同期通信時に必ず実装するローディングとエラー処理のロジックを自前で実装するのは面倒だと思っていました。Riverpod の AsyncValue はその仕組みをラッピングして提供してくれているので、迷うこと無く直感的に処理を書くことができました。'
tags:
  - 'Flutter'
  - 'Dart'
---

Flutter Riverpod の AsyncValue を使えば、非同期通信時のローディングとエラー処理を楽に実装できます。

筆者は個人的に非同期通信時に必ず実装するローディングとエラー処理のロジックを自前で実装するのは面倒だと思っていました。

Riverpod の AsyncValue はその仕組みをラッピングして提供してくれているので、迷うこと無く直感的に処理を書くことができました。

Riverpod 自体の使い方に関しては前回の記事で Todo リストアプリを題材に基本的な使い方を書いていますで参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="FlutterのTodoアプリで Riverpod / useProvider / ChangeNotifier の基本的な使い方を覚える | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/flutter-todo-list-riverpod-use-provider-change-notifier" frameborder="0" scrolling="no"></iframe>

今回は題材として簡単な Github の repository 検索アプリを選びました。

<img src='/images/posts/2021-02-17-01.gif' class='img' style='width: 70%' />

検索キーワードで Github の repository 検索をするシンプルなアプリです。

アーキテクチャは簡易的な MVVM を利用しています。

Model 層は API response を処理する Repository と Http 通信を行う ApiClient で構成します。

repository 検索アプリで使用している package はこちらです。

- 状態管理
  - Reiverpod(hooks_riverpod)
    - Provider
    - StateNotifierProvider
    - AsyncValue
    - useProvider
    - ProviderScope
- 状態変更通知
  - StateNotifier
- Freezed アノテーション
  - FreezedAnnotation
- immutable オブジェクトコード生成
  - Freezed
- Json 解析コード生成
  - JsonSerializable
- Http 通信
  - Http
- ToastMessage 表示
  - FlutterToast
- Testing with mock
  - Mockito
  - MockWebServer

検索した時に発生する Http 通信中のローディング処理、またエラー発生時のエラー処理を Riverpod の AsyncValue で実装します。

今回は AsyncValue の関連する箇所のみ掲載しますので、ソースコード全体は Github を参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="kazuma-fujita/flutter_search_github_repos: Find the all github repository." src="https://hatenablog-parts.com/embed?url=https://github.com/kazuma-fujita/flutter_search_github_repos" frameborder="0" scrolling="no"></iframe>

筆者はまだ Flutter 初学者の為、正しい実装方法が分からないので、説明や実装が誤っていたらぜひ [Twitter](https://twitter.com/____ZUMA____) で DM 頂くか、[Contact](/contact) まで連絡お願いします！

### 環境

- macOS Big Sur 11.1
- Android Studio 4.1.2
- Flutter 1.22.6
- Dart 2.10.5

## Riverpod package の install

pubspec.yaml に Riverpod package を追記します。

今回の題材の Github repository 検索アプリで使用しているその他の package は [Github](https://github.com/kazuma-fujita/flutter_search_github_repos/blob/master/pubspec.yaml) を参照ください。

- pubspec.yaml

```yaml
dependencies:
  hooks_riverpod:
```

`hooks_riverpod` に `Riverpod` 本体と `AsyncValue` が含まれています。

Riverpod の package は他にも `riverpod` や `flutter_riverpod` があるのですが、今回は `useProvider` という Flutter Hooks を利用する為、 `hooks_riverpod` package を使用します。

最後に `flutter pub get` を実行して package を install してください。

## GithubAPI の search/repositories のレスポンスを確認する

まず GET で取得出来る GithubAPI の search/repositories のレスポンスを確認します。

エンドポイントは以下です。

```
https://api.github.com/search/repositories?q={検索キーワード}&sort=stars&order=desc
```

取得できる json データはこちらです。

```json
{
  "total_count": 1,
  "incomplete_results": false,
  "items": [
    {
      "id": 330997542,
      "node_id": "MDEwOlJlcG9zaXRvcnkzMzA5OTc1NDI=",
      "name": "sympli.search.api",
      "full_name": "Jasyyie/sympli.search.api",
      "private": false,
      "owner": {
        "login": "Jasyyie",
        "id": 49047008,
        "node_id": "MDQ6VXNlcjQ5MDQ3MDA4",
        "avatar_url": "https://avatars.githubusercontent.com/u/49047008?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/Jasyyie",
        "html_url": "https://github.com/Jasyyie",
        "followers_url": "https://api.github.com/users/Jasyyie/followers",
        "following_url": "https://api.github.com/users/Jasyyie/following{/other_user}",
        "gists_url": "https://api.github.com/users/Jasyyie/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/Jasyyie/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/Jasyyie/subscriptions",
        "organizations_url": "https://api.github.com/users/Jasyyie/orgs",
        "repos_url": "https://api.github.com/users/Jasyyie/repos",
        "events_url": "https://api.github.com/users/Jasyyie/events{/privacy}",
        "received_events_url": "https://api.github.com/users/Jasyyie/received_events",
        "type": "User",
        "site_admin": false
      },
      "html_url": "https://github.com/Jasyyie/sympli.search.api",
      "description": " Find out the Search position in Google Search by providing SearchKeyword and SearchUrl ",
      "fork": false,
      "url": "https://api.github.com/repos/Jasyyie/sympli.search.api",
      "forks_url": "https://api.github.com/repos/Jasyyie/sympli.search.api/forks",
      "keys_url": "https://api.github.com/repos/Jasyyie/sympli.search.api/keys{/key_id}",
      "collaborators_url": "https://api.github.com/repos/Jasyyie/sympli.search.api/collaborators{/collaborator}",
      "teams_url": "https://api.github.com/repos/Jasyyie/sympli.search.api/teams",
      "hooks_url": "https://api.github.com/repos/Jasyyie/sympli.search.api/hooks",
      "issue_events_url": "https://api.github.com/repos/Jasyyie/sympli.search.api/issues/events{/number}",
      "events_url": "https://api.github.com/repos/Jasyyie/sympli.search.api/events",
      "assignees_url": "https://api.github.com/repos/Jasyyie/sympli.search.api/assignees{/user}",
      "branches_url": "https://api.github.com/repos/Jasyyie/sympli.search.api/branches{/branch}",
      "tags_url": "https://api.github.com/repos/Jasyyie/sympli.search.api/tags",
      "blobs_url": "https://api.github.com/repos/Jasyyie/sympli.search.api/git/blobs{/sha}",
      "git_tags_url": "https://api.github.com/repos/Jasyyie/sympli.search.api/git/tags{/sha}",
      "git_refs_url": "https://api.github.com/repos/Jasyyie/sympli.search.api/git/refs{/sha}",
      "trees_url": "https://api.github.com/repos/Jasyyie/sympli.search.api/git/trees{/sha}",
      "statuses_url": "https://api.github.com/repos/Jasyyie/sympli.search.api/statuses/{sha}",
      "languages_url": "https://api.github.com/repos/Jasyyie/sympli.search.api/languages",
      "stargazers_url": "https://api.github.com/repos/Jasyyie/sympli.search.api/stargazers",
      "contributors_url": "https://api.github.com/repos/Jasyyie/sympli.search.api/contributors",
      "subscribers_url": "https://api.github.com/repos/Jasyyie/sympli.search.api/subscribers",
      "subscription_url": "https://api.github.com/repos/Jasyyie/sympli.search.api/subscription",
      "commits_url": "https://api.github.com/repos/Jasyyie/sympli.search.api/commits{/sha}",
      "git_commits_url": "https://api.github.com/repos/Jasyyie/sympli.search.api/git/commits{/sha}",
      "comments_url": "https://api.github.com/repos/Jasyyie/sympli.search.api/comments{/number}",
      "issue_comment_url": "https://api.github.com/repos/Jasyyie/sympli.search.api/issues/comments{/number}",
      "contents_url": "https://api.github.com/repos/Jasyyie/sympli.search.api/contents/{+path}",
      "compare_url": "https://api.github.com/repos/Jasyyie/sympli.search.api/compare/{base}...{head}",
      "merges_url": "https://api.github.com/repos/Jasyyie/sympli.search.api/merges",
      "archive_url": "https://api.github.com/repos/Jasyyie/sympli.search.api/{archive_format}{/ref}",
      "downloads_url": "https://api.github.com/repos/Jasyyie/sympli.search.api/downloads",
      "issues_url": "https://api.github.com/repos/Jasyyie/sympli.search.api/issues{/number}",
      "pulls_url": "https://api.github.com/repos/Jasyyie/sympli.search.api/pulls{/number}",
      "milestones_url": "https://api.github.com/repos/Jasyyie/sympli.search.api/milestones{/number}",
      "notifications_url": "https://api.github.com/repos/Jasyyie/sympli.search.api/notifications{?since,all,participating}",
      "labels_url": "https://api.github.com/repos/Jasyyie/sympli.search.api/labels{/name}",
      "releases_url": "https://api.github.com/repos/Jasyyie/sympli.search.api/releases{/id}",
      "deployments_url": "https://api.github.com/repos/Jasyyie/sympli.search.api/deployments",
      "created_at": "2021-01-19T13:57:39Z",
      "updated_at": "2021-01-20T13:56:49Z",
      "pushed_at": "2021-01-20T13:56:47Z",
      "git_url": "git://github.com/Jasyyie/sympli.search.api.git",
      "ssh_url": "git@github.com:Jasyyie/sympli.search.api.git",
      "clone_url": "https://github.com/Jasyyie/sympli.search.api.git",
      "svn_url": "https://github.com/Jasyyie/sympli.search.api",
      "homepage": null,
      "size": 241,
      "stargazers_count": 0,
      "watchers_count": 0,
      "language": "C#",
      "has_issues": true,
      "has_projects": true,
      "has_downloads": true,
      "has_wiki": true,
      "has_pages": false,
      "forks_count": 0,
      "mirror_url": null,
      "archived": false,
      "disabled": false,
      "open_issues_count": 0,
      "license": null,
      "forks": 0,
      "open_issues": 0,
      "watchers": 0,
      "default_branch": "master",
      "score": 1.0
    }
  ]
}
```

GET クエリの `q={検索キーワード}` が空文字の場合は Http ステータス 422 でこちらの json が返却されます。

```json
{
  "message": "Validation Failed",
  "errors": [
    {
      "resource": "Search",
      "field": "q",
      "code": "missing"
    }
  ],
  "documentation_url": "https://docs.github.com/v3/search"
}
```

`https://api.github.com/hoge` など存在しないエンドポイントを叩いた時は Http ステータス 400 でこちらの json が返却されます。

```json
{
  "message": "Not Found",
  "documentation_url": "https://docs.github.com/rest"
}
```

こちらを元に ApiClient と GithubRepository クラスを実装します。

## API からの response 情報を格納する RepositoryEntity クラスを実装する

まず API response の情報を格納する入れ物である Entity クラスを実装します。

- `lib/repository_entity.dart`

```
@freezed
abstract class RepositoryEntity with _$RepositoryEntity {
  const factory RepositoryEntity({
    @required final int id,
    @required final String fullName,
    final String description,
    final String language,
    @required final String htmlUrl,
    @required final int stargazersCount,
    @required final int watchersCount,
    @required final int forksCount,
    @required final RepositoryOwnerEntity owner,
  }) = _RepositoryEntity;

  factory RepositoryEntity.fromJson(Map<String, dynamic> json) =>
      _$RepositoryEntityFromJson(json);
}

@freezed
abstract class RepositoryOwnerEntity with _$RepositoryOwnerEntity {
  const factory RepositoryOwnerEntity({
    @required final String avatarUrl,
  }) = _RepositoryOwnerEntity;

  factory RepositoryOwnerEntity.fromJson(Map<String, dynamic> json) =>
      _$RepositoryOwnerEntityFromJson(json);
}
```

Freezed を利用してオブジェクトを immutable(不変)にしています。

また、 `factory RepositoryEntity.fromJson` で API からの json response を解析し、json 要素を entity の property に mapping しています。

Freezed の説明は今回本質では無いので割愛いたします。

Freezed はとても便利な package なので別の記事で紹介したいと思います。

## Http 通信をする ApiClient クラスを実装する

実際に Http 通信を行う ApiClient クラスを実装します。

- `lib/github_api_client.dart`

```dart
class GithubApiClient {
  // factory コンストラクタは instanceを生成せず常にキャッシュを返す(singleton)
  factory GithubApiClient() => _instance;
  // クラス生成時に instance を生成する class コンストラクタ
  GithubApiClient._internal();
  // singleton にする為の instance キャッシュ
  static final GithubApiClient _instance = GithubApiClient._internal();
  // GithubAPIの基底Url
  static const baseUrl = 'https://api.github.com';

  Future<String> get(String endpoint) async {
    final url = '$baseUrl$endpoint';
    try {
      final response = await http.get(url);
      return _parseResponse(response.statusCode, response.body);
    } on SocketException {
      throw Exception('No Internet connection');
    }
  }

  String _parseResponse(int httpStatus, String responseBody) {
    switch (httpStatus) {
      case 200:
        return responseBody;
        break;
      default:
        final decodedJson = json.decode(responseBody) as Map<String, dynamic>;
        throw Exception('$httpStatus: ${decodedJson['message']}');
        break;
    }
  }
}
```

SocketException の通信エラーハンドリングや、Http ステータスの分岐処理を行うヘルパークラスです。

今回 GET しか実装していませんが、本来は POST/PUT/DELETE メソッドも実装します。

また、今回は次に実装する GithubRepository クラスからしかアクセスしませんが、様々な箇所で呼ばれることを想定して singleton パターンで実装しています。

## Http 通信結果を処理する Repository クラスを実装する

次に Http 通信結果を処理する Repository クラスを実装します。

- `lib/github_repository.dart`

```dart
class GithubRepository {
  GithubRepository(this._apiClient);

  final GithubApiClient _apiClient;

  Future<List<RepositoryEntity>> searchRepositories(
      String searchKeyword) async {
    final responseBody = await _apiClient
        .get('/search/repositories?q=$searchKeyword&sort=stars&order=desc');

    final decodedJson = json.decode(responseBody) as Map<String, dynamic>;
    final repositoryList = <RepositoryEntity>[];
    if (decodedJson['total_count'] as int == 0) {
      return repositoryList;
    }
    for (final itemJson in decodedJson['items']) {
      repositoryList
          .add(RepositoryEntity.fromJson(itemJson as Map<String, dynamic>));
    }
    return repositoryList;
  }
}
```

ここでは `api.github.com` の searchAPI を GET して repository 情報の json response を取得、内容を entity 配列に変換し返却しています。

`throw Exception` の引数に指定しているエラーメッセージは後述する AsyncValue を経由して画面に表示させます。

## 画面の状態を扱う ViewModel クラスを実装する

次に ViewModel を実装します。

ViewModel は View の状態を扱うクラスで、先程作成した repository の searchRepositories を実行しています。

その結果を受け取り、View の画面状態を変更します。

- `lib/repository_list_view_model.dart`

```dart
class RepositoryListViewModel
    extends StateNotifier<AsyncValue<List<RepositoryEntity>>> {
  RepositoryListViewModel(this._githubRepository)
      : super(const AsyncValue.loading()) {
    searchRepositories('flutter');
  }

  final GithubRepository _githubRepository;

  Future<void> searchRepositories(String searchKeyword) async {
    if (searchKeyword.isEmpty) {
      return;
    }

    state = const AsyncValue.loading();
    try {
      final repositoryList =
          await _githubRepository.searchRepositories(searchKeyword);
      state = AsyncValue.data(repositoryList);
    } on Exception catch (error) {
      state = AsyncValue.error(error);
    }
  }
}
```

先程作成した githubRepository を ViewModel のコンストラクタで受け取っていますが、これは外から GithubRepository のインスタンスを DI をしています。

実際に DI している箇所は [こちら](https://github.com/kazuma-fujita/flutter_search_github_repos/blob/master/lib/main.dart#L14) を参照ください。

DI に関してはこちらの記事で詳しく解説しているので参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Flutter Riverpod の Provider と StateNotifierProvider で DI をしてテスタビリティを向上させる | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/flutter-search-github-riverpod-di" frameborder="0" scrolling="no"></iframe>

本題の AsyncValue ですが、まず ViewModel で継承している `StateNotifier` の箇所で登場しています。

```dart
class RepositoryListViewModel
    extends StateNotifier<AsyncValue<List<RepositoryEntity>>>
```

恐らく、AsyncValue を利用せず、自前で loading / error の状態管理をする場合、freezed を併用して State クラスを実装する場合が多い？と思っています。

その自作 State クラスを StateNotifier に指定すると思います。

(筆者は Flutter 歴が浅い為、ここら辺のセオリーには自信がないですが・・)

AsyncValue を利用すると、AsyncValue が loading / error 状態を管理してくれるので State クラスを自前実装する手間が減ります。

ちなみに、StateNotifier を継承したクラスは `state` という 状態を保持したオブジェクトが利用できます。

この `state` オブジェクトに後述する `AsyncValue` のプロパティをセットして状態変更を通知します。

次にコンストラクタで AsyncValue が登場しています。

```dart
  RepositoryListViewModel(this.githubRepository)
      : super(const AsyncValue.loading()) {
    searchRepositories('flutter');
  }
```

ViewModel が生成されるのは、最初に画面を表示する前です。

super で 親の StateNotifier コンストラクタに `AsyncValue.loading()` を指定してローディング中の状態にしています。

次に `searchRepositories('flutter')` を call して `flutter` の検索キーワードで repository 検索を実行しています。

実際に検索を実行しているメソッドはこちらです。

```dart
  Future<void> searchRepositories(String searchKeyword) async {
    if (searchKeyword.isEmpty) {
      return;
    }

    state = const AsyncValue.loading();
    try {
      final repositoryList =
          await githubRepository.searchRepositories(searchKeyword);
      state = AsyncValue.data(repositoryList);
    } on Exception catch (error) {
      state = AsyncValue.error(error);
    }
  }
```

この `searchRepositories` メソッドは View 側からも呼ばれます。

検索を実行する前に、 `state = const AsyncValue.loading()` で画面をローディング中状態にします。

次に検索が終わって正常終了していれば、 `state = AsyncValue.data(repositoryList)` で画面に検索結果のリストを表示させます。

Http 非同期通信処理で Exception エラーが発生した場合、`state = AsyncValue.error(error)` で画面にエラーを表示させます。

AsyncValue で便利なのが、`AsyncValue.data` や `AsyncValue.error` が呼ばれれば loading の終了処理を自前で書かなくて良い所です。

自前で実装すると loading 終了の処理を書き忘れて、いつまでもインジケーターが表示されるなんてことありますよね(あり・・ますよね？)。

個人的にはここらへんの loading フラグのトグル処理を自動化してくれているだけで導入するメリットはあるかなと思っています。

## 画面に repository 一覧を表示する View クラスを実装する

Http 通信で取得した repository 一覧を表示する `lib/repository_list_view.dart` クラスを実装します。

コードが長いので AsyncValue 箇所のみを掲載します。

コード全体は [こちら](https://github.com/kazuma-fujita/flutter_search_github_repos/blob/master/lib/repository_list_view.dart) になります。

AsyncValue で loading / error の表示出し分けをしている箇所は以下です。

```dart
  Widget _buildList() {
    final repositoryListState =
        useProvider(repositoryListViewModelProvider.state);

    return repositoryListState.when(
      data: (repositoryList) => repositoryList.isNotEmpty
          ? ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: repositoryList.length,
              itemBuilder: (BuildContext context, int index) {
                return _repositoryTile(repositoryList[index]);
              },
            )
          : _emptyListView(),
      loading: _loadingView,
      error: (error, _) => _errorView(error.toString()),
    );
  }
```

まず、Flutter Hooks の `useProvider` で状態変更を検知したい監視対象を指定します。

```dart
final repositoryListState = useProvider(repositoryListViewModelProvider.state);
```

今回は `main.dart` で StateNotifierProvider を利用して監視対象の ViewModel オブジェクトを保持した `repositoryListViewModelProvider` を生成しています。

- main.dart

```dart
final apiClientProvider = Provider.autoDispose(
  (_) => GithubApiClient(),
);

final githubRepositoryProvider = Provider.autoDispose(
  (ref) => GithubRepository(ref.read(apiClientProvider)),
);

final repositoryListViewModelProvider = StateNotifierProvider.autoDispose(
  (ref) => RepositoryListViewModel(ref.read(githubRepositoryProvider)),
);

void main() {
  debugPaintSizeEnabled = false;
  runApp(
    ProviderScope(
      child: RepositoryListView(),
    ),
  );
}
```

`StateNotifierProvider` で ViewModel で継承している `StateNotifier` の 状態変更通知を 子孫 Widget に通知することができます。

話を戻して、 `useProvider` で取得した監視対象は `StateNotifier` を継承した ViewModel の state で `AsyncValue<List<RepositoryEntity>>` のオブジェクトです。

AsyncValue のオブジェクトには `when` が生えていて `data` / `loading` / `error` の条件分岐が出来ます。

```dart
    return repositoryListState.when(
      data: (repositoryList) => repositoryList.isNotEmpty
          ? ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: repositoryList.length,
              itemBuilder: (BuildContext context, int index) {
                return _repositoryTile(repositoryList[index]);
              },
            )
          : _emptyListView(),
      loading: _loadingView,
      error: (error, _) => _errorView(error.toString()),
    );
```

このように直感的に Http 通信中の処理の画面出し分けができます！

便利ですね。

それぞれ各状態を画面表示する Widget は以下のように実装しています。

```dart
  Widget _loadingView() {
    return const Center(
      child: CircularProgressIndicator(),
    );
  }

  Widget _errorView(String errorMessage) {
    Fluttertoast.showToast(
      msg: errorMessage,
      backgroundColor: Colors.grey,
    );
    return Container();
  }

  Widget _emptyListView() {
    return const Center(
      child: Text(
        'Repositoryが見つかりませんでした',
        style: TextStyle(
          color: Colors.black54,
          fontSize: 16,
        ),
      ),
    );
  }
```

## おわりに

簡単ですが、Flutter Riverpod AsyncValue の使い方でした。

個人的に便利な AsyncValue について、検索してもあまり情報がなかったので記事にしました。

今後は AsyncValue のテストの方法を調べてみたいと思います。

筆者はまだ　 Flutter 初学者の為、正しい実装方法が分からないので、実装や説明が誤っていたらぜひ [Twitter](https://twitter.com/____ZUMA____) で DM 頂くか、[Contact](/contact) まで連絡お願いします！

最後に、今回実装したアプリの全てのソースコードは Github にあるので参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="kazuma-fujita/flutter_search_github_repos: Find the all github repository." src="https://hatenablog-parts.com/embed?url=https://github.com/kazuma-fujita/flutter_search_github_repos" frameborder="0" scrolling="no"></iframe>

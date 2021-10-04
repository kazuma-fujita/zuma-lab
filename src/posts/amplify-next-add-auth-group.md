---
title: 'AmplifyでCognitoグループを追加してGraphQLへのAPIアクセスを制御する'
date: '2021-10-05'
isPublished: true
metaDescription: 'AmplifyでCognitoグループを追加してGraphQLへのAPIアクセスを制御する方法です。'
tags:
  - 'AWS'
  - 'Amplify'
  - 'Next.js'
---

筆者は最近 Next.js と AWS Amplify をかじっている Web アプリ開発初心者です。

本ブログでは今後数回に渡って Next.js と Amplify で Web アプリを高速に作れないか検証していきます。

前回、前々回は Next.js アプリに認証機能を追加し、Amplify の認証 UI コンポーネントのスタイル変更、入力項目変更と日本語対応をしました。

今回は Amplify CLI で認証グループを追加して、GraphQL への API アクセスを制御したいと思います。

API アクセス制御を行うには AppSync の schema.graphql で@auth ディレクティブを設定します。

@auth ディレクティブとは、API の認可をトップレベルで行うことができるディレクティブです。

具体的にはルールを定義することで、API のアクションに対する制限が可能になります。

## 環境

- macOS Big Sur 11.15.2
- Amplify 6.0.1
- Next.js 11.1.2
- Typescript 4.4.3

## Amplify add auth で認証機能を追加する

前回の記事を参考に、認証 UI コンポーネントの表示まで行ってください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="AmplifyでNext.jsアプリに認証機能を追加してログイン画面を実装する | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/amplify-next-add-auth" frameborder="0" scrolling="no"></iframe>

手順としては以下となります。

1. Next.js のプロジェクトを作成
1. Amplify CLI のインストール
1. Amplify IAM ユーザの作成
1. Amplify 環境の作成
1. amplify に認証機能を追加する
1. 認証機能をフロントエンドに実装する

Amplify の認証 UI コンポーネントのスタイル変更、入力項目変更を行いたい場合は以下の記事を参考にしてください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Amplify 認証UIコンポーネントのスタイル・入力項目のカスタマイズと日本語対応方法 | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/amplify-customize-ui-components" frameborder="0" scrolling="no"></iframe>

## Cognito user pool groups を追加する

Amplify CLI で Cognito user pool groups を追加します。

まずは以下のコマンドを実行します。

```txt
amplify update auth
```

Create or update Cognito user pool groups を選択します。

```txt
 What do you want to do?
  Apply default configuration without Social Provider (Federation)
  Apply default configuration with Social Provider (Federation)
  Walkthrough all the auth configurations
❯ Create or update Cognito user pool groups
  Create or update Admin queries API
```

ユーザープールグループの名前を入力します。

今回は Admins と Operators という 2 グループを作成します。

```txt
? Provide a name for your user pool group: Admins
? Do you want to add another User Pool Group Yes
? Provide a name for your user pool group: Operators
? Do you want to add another User Pool Group No
```

最後にユーザープールグループを優先順に並べ替えます。

デフォルトで良い場合はそのまま Enter を押します。

```txt
? Sort the user pool groups in order of preference …  (Use <shift>+<right/left> to change the order)
  Admins
  Operators
```

この状態で amplify status コマンドを実行すると、新たに userPoolGroups が追加されていることが分かります。

```txt
$ amplify status

    Current Environment: dev

┌──────────┬────────────────────┬───────────┬───────────────────┐
│ Category │ Resource name      │ Operation │ Provider plugin   │
├──────────┼────────────────────┼───────────┼───────────────────┤
│ Auth     │ userPoolGroups     │ Create    │ awscloudformation │
├──────────┼────────────────────┼───────────┼───────────────────┤
│ Auth     │ authsamplecf91498b │ No Change │ awscloudformation │
└──────────┴────────────────────┴───────────┴───────────────────┘
```

`amplify push -y` を実行してクラウドに反映します。

Cognito ユーザープールを確認するとグループが作成されています。

<img src='/images/posts/2021-10-01-1.png' class='img' alt='post image'/>

ロールも自動で生成されています。

<img src='/images/posts/2021-10-01-2.png' class='img' alt='post image'/>

Amplify AdminUI から確認してみましょう。

グループが作成されています。

<img src='/images/posts/2021-10-01-3.png' class='img' alt='post image'/>

AdminUI からユーザーに対して Operators グループ追加します。

<img src='/images/posts/2021-10-01-4.png' class='img' alt='post image'/>

フロントからは以下のコードでグループが取得できます。

```ts
const user = await Auth.currentAuthenticatedUser();
const groups = user.signInUserSession.accessToken.payload['cognito:groups'];
```

groups にはユーザーの所属するグループ配列が格納されています。

配列の中身は `['Operators']` となっています。

## GraphQL API を追加する

Amplify CLI コマンドを実行して GraphQL API を作成します。

以下のコマンドを実行してください。

```txt
amplify add api
```

設問には以下回答を入力します。

`? Please select from one of the below mentioned services:` には GraphQL を選択してください。

`Choose the default authorization type for the API` は Amazon Cognito User Pool を選択してください。

```txt
? Please select from one of the below mentioned services: GraphQL
? Provide API name: authsample
? Choose the default authorization type for the API Amazon Cognito User Pool
Use a Cognito user pool configured as a part of this project.
? Do you want to configure advanced settings for the GraphQL API No, I am done.
? Do you have an annotated GraphQL schema? No
? Choose a schema template: Objects with fine-grained access control (e.g., a project management app with owner-based authorization)
```

最後の設問の `Choose a schema template` は Objects with fine-grained access control を選択します。

`Successfully added resource authsample locally` のログが流れれば API の追加完了です。

`amplify/backend/api/{resource name}/schema.graphql` に GraphQL の schema 定義ファイルが作成されています。

schema.graphql を確認します。

```ts
type Task
  @model
  @auth(
    rules: [
      { allow: groups, groups: ["Managers"], queries: null, mutations: [create, update, delete] }
      { allow: groups, groups: ["Employees"], queries: [get, list], mutations: null }
    ]
  ) {
  id: ID!
  title: String!
  description: String
  status: String
}
type PrivateNote @model @auth(rules: [{ allow: owner }]) {
  id: ID!
  content: String!
}
```

次に以下コマンドを実行して作成したローカルのバックエンドリソースをクラウドにプロビジョニングします。

```txt
amplify push
```

初回の `amplify push` は GraphQL API のコードを生成するか聞かれるので Yes を入力します。

ここでは GraphQL の Query/Mutation/Subscription を行うための codegen コマンドの設定を行なっています。

```txt
? Do you want to generate code for your newly created GraphQL API Yes
```

コード生成言語ターゲットを選択します。 typescript を利用するので typescript を選択します。

```txt
? Choose the code generation language target
  javascript
❯ typescript
  flow
```

graphql クエリ、ミューテーション、サブスクリプションのファイル名パターンを入力します。そのまま Enter を入力します。

```txt
? Enter the file name pattern of graphql queries, mutations and subscriptions src/graphql/**/*.js
```

可能なすべての GraphQL 操作（クエリ、ミューテーション、サブスクリプション）を生成/更新します。 Yes を入力します。

```txt
? Do you want to generate/update all possible GraphQL operations - queries, mutations and subscriptions Yes
```

ステートメントの最大の深さを入力します。

スキーマが深くネストされている場合はデフォルトから増やしてください、とのことなのでここは 3 を入力します。

maximum statement depth では、schema.graphql の type のネスト構造をどこまで読み取るかを設定します。

depth 設定を変えたい場合は$ `amplify update codegen` コマンドにより同様の設定を行うことが可能です。

```txt
? Enter maximum statement depth [increase from default if your schema is deeply nested] 3
```

生成されるコードのファイル名を入力します。そのまま Enter を入力します。

```txt
? Enter the file name for the generated code (src/API.ts)
```

しばらく待つとクラウドにプロビジョニングされて処理が完了します。

`amplify status` コマンドを実行すると Category に Api が追加されていることが分かります。

```txt
$ amplify status

    Current Environment: dev

┌──────────┬────────────────────┬───────────┬───────────────────┐
│ Category │ Resource name      │ Operation │ Provider plugin   │
├──────────┼────────────────────┼───────────┼───────────────────┤
│ Auth     │ authsampleXXXXXXXX │ No Change │ awscloudformation │
├──────────┼────────────────────┼───────────┼───────────────────┤
│ Auth     │ userPoolGroups     │ No Change │ awscloudformation │
├──────────┼────────────────────┼───────────┼───────────────────┤
│ Api      │ authsample         │ No Change │ awscloudformation │
└──────────┴────────────────────┴───────────┴───────────────────┘

GraphQL endpoint: https://yyj2ytgeivfzbdw4dd3euvqouu.appsync-api.ap-northeast-1.amazonaws.com/graphql
```

## @auth ルールの動作確認

@auth ディレクティブの動作確認を行います。

動作を確認する為、 AppSync コンソールで作成した API に対して Mutation/Query 操作をします。

API の認証方法は Cognito user pool を選択したので、Cognito コンソールで事前にユーザーを作成しておきます。

AppSync コンソールのクエリ画面を開きます。

`ユーザープールでログイン` ボタンからユーザーログインダイアログを開きます。

<img src='/images/posts/2021-10-04-1.png' class='img' alt='post image'/>

まず ClientId を選択します。

client と clientWeb ２つの ID があります。

筆者はこの ID の違いが分からないのですが、どちらを選んでも操作できました。

Cognito で作成したユーザー名とパスワードを入力してログインします。

今回は user1 で作成したオブジェクトに対して update/delete 操作を行うと@domain.com ユーザーを作成しました。

<img src='/images/posts/2021-10-04-2.png' class='img' alt='post image'/>

次に PrivateNote の Mutation 操作をして@auth の動作を確認します。

PrivateNote の@auth ルールは Cognito 認証ユーザーならばオブジェクト作成が可能で、作成したユーザーのみがデータ取得、更新、削除操作ができます。

```ts
type PrivateNote @model @auth(rules: [{ allow: owner }]) {
  id: ID!
  content: String!
}
```

PrivateNote に対して user1 で create 操作を実行します。

<img src='/images/posts/2021-10-04-3.png' class='img' alt='post image'/>

PrivateNote に対して list オブジェクト取得操作を実行します。

作成したオブジェクトが取得できました。

<img src='/images/posts/2021-10-04-4.png' class='img' alt='post image'/>

次は update 操作を実行します。

<img src='/images/posts/2021-10-04-5.png' class='img' alt='post image'/>

delete 操作を実行して、ID からオブジェクト取得を実行します。

オブジェクトが削除されるかつ、オブジェクトが取得は null が返却されることが確認できました。

<img src='/images/posts/2021-10-04-6.png' class='img' alt='post image'/>

再度 user1 で create 操作をしてオブジェクトを作成します。

<img src='/images/posts/2021-10-04-7.png' class='img' alt='post image'/>

次に Cognito で user2 を作成します。

AppSync クエリコンソールを user2 でログインし直します。

user2 で PrivateNote オブジェクトを list 取得しても user1 で作成したオブジェクトが取得できないことが分かります。

<img src='/images/posts/2021-10-04-8.png' class='img' alt='post image'/>

また、ID 指定で getPrivateNote をすると Unauthorized が発生するので、user2 は user1 で作成したオブジェクトにアクセスできないことが分かりました。

<img src='/images/posts/2021-10-04-9.png' class='img' alt='post image'/>

user2 で user1 で作成したオブジェクトに対して update/delete 操作を行うと `DynamoDB:ConditionalCheckFailedException` が発生します。

<img src='/images/posts/2021-10-04-10.png' class='img' alt='post image'/>

次に Task の@auth ルールを検証します。

以下ルールの場合、 Cognito 認証ユーザーの中でも Admins、Operators グループに所属しているユーザーのみがオブジェクトの操作ができます。

Admins グループに所属しているユーザーは Task の作成、更新、削除ができます。

Operators グループに所属しているユーザーは Task の取得のみできます。

```ts
type Task
  @model
  @auth(
    rules: [
      { allow: groups, groups: ["Admins"], queries: null, mutations: [create, update, delete] }
      { allow: groups, groups: ["Operators"], queries: [get, list], mutations: null }
    ]
  ) {
  id: ID!
  title: String!
  description: String
  status: String
}
```

事前に Cognito コンソールでそれぞれグループに所属している admin-user と operator-user を作成します。

Admins グループに対して queries を設定していないため、admin-user で Task オブジェクト作成後、list 取得してもオブジェクトは取得できません。

<img src='/images/posts/2021-10-04-10.png' class='img' alt='post image'/>

Operators グループに対しては queries を設定しているため、operator-user でログインしなおして Task を list 取得すると先程 admin-user で作成したオブジェクトが取得できます。

getTask も同様オブジェクトが取得できます。

<img src='/images/posts/2021-10-04-11.png' class='img' alt='post image'/>

逆に Operators グループには mutations 権限が無いため、operator-user で create 操作をしても Unauthorized エラーが発生します。

updateTask や deleteTask 操作も同様 Unauthorized エラーが発生します。

<img src='/images/posts/2021-10-04-12.png' class='img' alt='post image'/>

グループに所属していない user1 や user2 は全ての権限が無いので、queries を実行しても Task オブジェクトは取得できず、mutations を実行しても Unauthorized エラーが発生します。

次に Admins グループも query 操作ができるように read 権限を追加します。

operations の read は queries の get, list 両方の操作権限を持ちます。

```ts
type Task
  @model
  @auth(
    rules: [
      { allow: groups, groups: ["Admins"], operations: [create, update, delete, read] }
      { allow: groups, groups: ["Operators"], queries: [get, list], mutations: null }
    ]
  ) {
  id: ID!
  title: String!
  description: String
  status: String
}
```

`amplify push -y` コマンドでスキーマの変更をクラウドに反映します。

また、Cognito コンソールで Admins グループに所属する admin-user2 を作成します。

admin-user2 でログインして Task オブジェクト create 操作を実行します。

その後、admin-user2 で Task 一覧取得 query を実行します。

Admins グループに所属する admin-user と admin-user2 で作成したオブジェクトが取得できました。

<img src='/images/posts/2021-10-04-13.png' class='img' alt='post image'/>

admin-user2 で admin-user が作成したオブジェクトを update 操作を実行してみます。

以下のように同じグループに所属するユーザーならば他人が作成したオブジェクトも操作できました。

<img src='/images/posts/2021-10-04-14.png' class='img' alt='post image'/>

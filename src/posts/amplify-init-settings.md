---
title: 'AWS Amplify 初心者入門 amplify initでamplifyバックエンド環境を初期化する'
date: '2021-01-19'
isPublished: true
metaDescription: 'AWS Amplify 初心者入門 amplify initでamplifyバックエンド環境を構築します。プロジェクトディレクトリで `amplify init` コマンドを実行することにより、そのプロジェクトを Amplify プロジェクトとして初期化します。'
tags:
  - 'Amplify'
---

AWS Amplify 初心者入門です。

今回は `amplify init` コマンドを使用して amplify バックエンド環境の初期化をします。

実際の動くアプリケーションは次回の記事で書きますので、ここでは初期化手順のみを解説します。

初期化すると今後 API カテゴリや認証カテゴリを追加する為の `amplify add api` や `amplify add auth` コマンドを実行することができます。

各カテゴリのリソース追加、コード自動生成を amplify cli から行うことが出来るわけです。

また、 `amplify init` で初期化が完了すると Amplify のバックエンド環境が CloudFormation により AWS 上の作成されます。

プロジェクトルートディレクトリに amplify という名前のディレクトリが生成され、その配下で CloudFormation のテンプレートが作成されるのが分かります。

早速試してみましょう。

## 環境

- Amplify 4.41.2
- Node 14.9.0

## amplify IAM ユーザーを作成する

`amplify configure` コマンドで amplify cli を実行する IAM ユーザーを作成します。

[AWS Amplify 初心者入門 amplify configure で IAM ユーザーを作成する](https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/amplify-configure-settings) に詳しい手順を書いたので参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="AWS Amplify 初心者入門 amplify configureでIAMユーザーを作成する | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/amplify-configure-settings" frameborder="0" scrolling="no"></iframe>

## amplify init コマンドを実行する

それでは手順です。

プロジェクトディレクトリを作成して、作成したディレクトリへ移動します。

```
mkdir amplify-sample && cd amplify-sample
```

以下コマンドを実行します。

```
amplify init
```

```
$ amplify init
Note: It is recommended to run this command from the root of your app directory
? Enter a name for the project (amplifysample)
```

任意のプロジェクト名を入力してください。

プロジェクト名は 3〜20 文字の範囲で半角英数字で入力します。

記号は使用できないので注意してください。

```
? Enter a name for the environment (dev)
```

環境名を入力します。

環境の用途として、amplify で本番 deploy、開発 preview deploy でそれぞれ別々の環境を利用したり、複数人で開発する際に開発者ごとに個別に環境を作成したりします。

筆者の場合、deploy の時に本番環境は production、開発環境は develop という環境名で deploy するので、今回は `develop` という名前で環境を作成します。

```
? Choose your default editor: (Use arrow keys)
❯ Visual Studio Code
  Atom Editor
  Sublime Text
  IntelliJ IDEA
  Vim (via Terminal, Mac OS only)
  Emacs (via Terminal, Mac OS only)
  None
```

普段使用しているエディタを選択します。

ここで選択したエディタは、今後 amplify cli 実行時にファイル編集を求められた時に CUI 上から立ち上がるデフォルトエディタとなります。

```
? Choose the type of app that you're building (Use arrow keys)
  android
  flutter
  ios
❯ javascript
```

ビルドするプラットフォームを選択します。

amplify init を実行しているプロジェクトで利用しているプラットフォームを選択してください。

以前は無かったのですが、新しく flutter が追加されています。

筆者は javascript を選択しました。

```
Please tell us about your project
? What javascript framework are you using
  angular
  ember
  ionic
❯ react
  react-native
  vue
  none
```

プロジェクトで使用しているフレームワークを選択してください。

筆者は react を選択しました。

```
? Source Directory Path:  src
? Distribution Directory Path: build
? Build Command:  npm run-script build
? Start Command: npm run-script start
```

Amplify で build する時の設定を入力します。

こちらはローカル build では無く、Amplify で deploy 時の build 設定です。

設定は後から Amplify コンソール上で編集出来ます。

筆者全てデフォルト値で設定しました。

```
? Do you want to use an AWS profile? (Yes/No)
```

こちらが最後の設問です。

個別に AWS profile を使用する場合は Yes を入力してください。

default プロファイルを利用する場合は No を入力してください。

筆者の場合は Yes を入力しました。

```
? Please choose the profile you want to use
  default
❯ amplify-cli-zuma-user
```

Yes を入力した場合、使用する profile を選択します。

ここまで入力が完了すると自動で Amplify のバックエンド環境が構築されます。

```
Adding backend environment develop to AWS Amplify Console app: d2p4lms5917u7w
⠇ Initializing project in the cloud...

CREATE_IN_PROGRESS UnauthRole                           AWS::IAM::Role             Tue Jan 19 2021 10:18:07 GMT+0900 (日本標準時)
CREATE_IN_PROGRESS DeploymentBucket                     AWS::S3::Bucket            Tue Jan 19 2021 10:18:07 GMT+0900 (日本標準時)
CREATE_IN_PROGRESS AuthRole                             AWS::IAM::Role             Tue Jan 19 2021 10:18:07 GMT+0900 (日本標準時)
CREATE_IN_PROGRESS amplify-amplifysample-develop-101800 AWS::CloudFormation::Stack Tue Jan 19 2021 10:18:02 GMT+0900 (日本標準時) User Initiated
⠇ Initializing project in the cloud...
```

```
Initialized your environment successfully.

Your project has been successfully initialized and connected to the cloud!
```

こちらのメッセージが表示されれば amplify init での初期化作業が完了です。

amplify init で初期化作業をした直後のディレクトリ構成です。

```
$ tree
.
├── amplify
│   ├── #current-cloud-backend
│   │   ├── amplify-meta.json
│   │   └── tags.json
│   ├── README.md
│   ├── backend
│   │   ├── amplify-meta.json
│   │   ├── backend-config.json
│   │   └── tags.json
│   ├── cli.json
│   └── team-provider-info.json
└── src
    └── aws-exports.js

4 directories, 9 files
```

また、 `amplify console` コマンドで Amplify コンソールを CUI から開くことが出来ます。

```
$ amplify console
? Which site do you want to open? …
❯ Amplify admin UI
  Amplify console
```

最近新たに `Amplify admin UI` が追加されました。

こちらは Amplify のチームメンバーが AWS の IAM ユーザーを作成しなくても、 Amplify で作成した cognito のユーザー情報の作成・編集や DB テーブルのモデリング、コンテンツ、管理者、管理者グループを操作できる管理画面となります。

Amplify に新しく追加された機能ですので、ぜひ一度お試し下さい。

```
Some next steps:
"amplify status" will show you what you've added already and if it's locally configured or deployed
"amplify add <category>" will allow you to add features like user login or a backend API
"amplify push" will build all your local backend resources and provision it in the cloud
"amplify console" to open the Amplify Console and view your project status
"amplify publish" will build all your local backend and frontend resources (if you have hosting category added) and provision it in the cloud

Pro tip:
Try "amplify add api" to create a backend API and then "amplify publish" to deploy everything
```

amplify init の実行ログには次のアクションとして `amplify add {category}` で amplify カテゴリを追加してくださいと表示されるので、次回の記事でカテゴリ追加を行っていきます。

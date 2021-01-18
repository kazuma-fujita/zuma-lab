---
title: 'AWS Amplify 初心者入門 amplify configureでIAMユーザーを作成する'
date: '2021-01-18'
isPublished: true
metaDescription: 'AWS Amplify 初心者入門 amplify configureでIAMユーザーを作成する手順です。'
tags:
  - 'Amplify'
---

AWS Amplify 初心者入門です。

今回は `amplify configure` の手順です。

`amplify configure` コマンドで Amplify の AWS IAM ユーザーを作成します。

今後 amplify cli を利用するユーザーを GUI と CUI で手軽に作成できます。

早速試してみましょう。

## 環境

- Amplify 4.41.2
- Node 14.9.0

## amplify configure コマンドを実行する

それでは手順です。

以下コマンドを実行してください。

```
amplify configure
```

コマンドを実行する場所は任意の場所でかまいません。

```
$ amplify configure
Initializing new Amplify CLI version...
Done initializing new version.
Scanning for plugins...
Plugin scan successful
Follow these steps to set up access to your AWS account:

Sign in to your AWS administrator account:
https://console.aws.amazon.com/
Press Enter to continue
```

コマンドを実行すると AWS コンソールが立ち上がりますので、amplify を利用する AWS アカウントでログインしてください。

ログインすると AWS マネジメントコンソール Top 画面に遷移します。

この状態でターミナルに戻り、 Enter をクリックしてください。

```
Specify the AWS Region
? region:
  eu-west-1
  eu-west-2
  eu-central-1
❯ ap-northeast-1
  ap-northeast-2
  ap-southeast-1
  ap-southeast-2
(Move up and down to reveal more choices)
```

amplify を使用するリージョンを選択してください。

ここではアジアパシフィック(東京)である ap-northeast-1 を選択します。

```
Specify the username of the new IAM user:
? user name:  (amplify-a89Fk)
```

次に amplify を使用する IAM ユーザー名を入力します。

ここでは任意のユーザー名を入力してください。

```
Complete the user creation using the AWS console
https://console.aws.amazon.com/iam/home?region=ap-northeast-1#/users$new?step=final&accessKey&userNames=amplify-cli-zuma-user&permissionType=policies&policies=arn:aws:iam::aws:policy%2FAdministratorAccess
Press Enter to continue
```

再び AWS コンソールが立ち上がり、IAM ユーザーの追加画面が表示されます。

<img src='/images/posts/2021-01-18-5.png' class='img' alt='post image' />

ユーザー名は既に入力されています。

今回は amplify cli を実行する IAM ユーザーを作成するので`アクセスの種類` は `プログラムによるアクセス` を選択してください。

`次のステップ` ボタンをクリックします。

<img src='/images/posts/2021-01-18-6.png' class='img' alt='post image' />

`AdministratorAccess` がチェックされているので、 `次のステップ` ボタンをクリックしてください。

※ Administrator 権限は様々な権限が当たってしまっています。amplify の使用に限定した権限設定はまた別途調査します。

<img src='/images/posts/2021-01-18-7.png' class='img' alt='post image' />

`タグの追加 (オプション)` 画面は特にタグ設定が必要無ければ `次のステップ` ボタンをクリックしてください。

<img src='/images/posts/2021-01-18-8.png' class='img' alt='post image' />

`確認` 画面で入力内容を確認して `ユーザーの作成` ボタンをクリックしてください。

<img src='/images/posts/2021-01-18-9.png' class='img' alt='post image' />

後ほど利用するので、ここで表示されるシークレットキー ID と、シークレットアクセスキーを控えてください。

次に、ターミナルに戻って Enter してください。

```
Enter the access key of the newly created user:
? accessKeyId:  ********************
? secretAccessKey:  ****************************************
```

先程控えておいた、シークレットキー ID と、シークレットアクセスキーを入力してください。

```
This would update/create the AWS Profile in your local machine
? Profile Name:  (default)
```

ローカル環境で既存の profile が存在しなければ default で問題無いのでそのまま Enter してください。

ローカル環境に既存の profile が存在する場合、追加する 任意の profile 名を入力してください。

最後に `Successfully set up the new user.` が表示されれば `amplify configure` の作業は完了です。

ちなみに、`This would update/create the AWS Profile in your local machine` の設問で profile 名を入力した場合、ローカル環境の config/credentials ファイルには以下のように profile が追加されます。

- ~/.aws/config

```
$ cat ~/.aws/config
[default]
region=ap-northeast-1

[profile amplify-cli-zuma-user]
region=ap-northeast-1
```

- ~/.aws/credentials

```
$ cat ~/.aws/credentials
[default]
aws_access_key_id=XXXXXXXXXXXXXXXX
aws_secret_access_key=XXXXXXXXXXXXXXXX

[amplify-cli-zuma-user]
aws_access_key_id=XXXXXXXXXXXXXXXX
aws_secret_access_key=XXXXXXXXXXXXXXXX
```

次回は `amplify init` を実行して、amplify のアプリケーションを作成します。

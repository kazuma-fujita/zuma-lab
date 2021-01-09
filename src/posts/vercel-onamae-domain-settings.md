---
title: 'Vercelにお名前.comで取得したドメインをカスタムドメインとして設定する'
date: '2021-01-09'
isPublished: true
metaDescription: 'Vercel でホスティングしたサイトに、お名前.com で取得したドメインをカスタムドメインとして設定します。'
---

Vercel でホスティングしたサイトに、お名前.com で取得したドメインをカスタムドメインとして設定します。

このサイトは Next.js で構築し、Vercel でホスティングし、これからの手順でカスタムドメインを設定しました。

それでは見ていきましょう。

※ Vercel のホスティング、お名前.com のドメイン取得方法は割愛致します。

## Vercel に Domain を追加する

Vercel のコンソールにログインし、カスタムドメイン設定したい Project を開きます。

`Settings` > `Domains` から Domains 追加画面を開きます。

<img src='/images/posts/2021-01-09-1.png' width='100%' />

入力ボックスにお名前.com で取得したドメインを入力して `Add` ボタンを押して下さい。

私は取得してから長年放置していた `zuma-lab.com` というドメインを設定しました。

<img src='/images/posts/2021-01-09-2.png' width='100%' />

まだこのように `Invalid Configuration` と表示されます。

お名前.com のコンソールで使うので、A Record(Recommended) `Value` を控えておいてください。

## お名前.com の A レコードを設定する

<img src='/images/posts/2021-01-09-3.png' width='100%' />

お名前.com のコンソールを開き、`DNS設定/転送設定` > `DNSレコードを設定する` の設定するボタンからレコード追加画面を開いてください。

<img src='/images/posts/2021-01-09-4.png' width='100%' />

今回 A レコードを設定するので、`TYPE` は `A` を選択、TTL はデフォルト、`VALUE`は先程 Vercel のコンソールで控えた `Value` を入力してください。

<img src='/images/posts/2021-01-09-5.png' width='100%' />

確認画面へ進み、 設定するボタンを押して設定を完了してください。

## Vercel でドメインが設定されることを確認する

<img src='/images/posts/2021-01-09-6.png' width='100%' />

先程の Vercel のコンソールへ戻り、`Valid Configuration` になっていることを確認します。

同時に SSL 証明書が発行されるのでしばし待ちます。

この https 対応も自動で行ってくれます。

私の場合、完全に `Valid Configuration` するまで 15 分程かかりました。

<img src='/images/posts/2021-01-09-7.png' width='100%' />

追加したドメインの `Edit` > `View DNS Records & More for XXXXX.XXX →` から設定の詳細が見れます。

<img src='/images/posts/2021-01-09-8.png' width='100%' />

あとは設定したドメインにアクセスしてこのようにサイトが表示されれば完了です！

## おわりに

Vercel はコンソールの UI が直感的でとてもわかりやすく、https 対応まで自動で行ってくれるので、素晴らしいサービスだと思います。

また小規模な個人サイトでしたら Vercel の無料枠で十分運用出来ると思うので、かなりオススメです。

また Vercel を利用すると Next.js の画像の Lazy load(遅延読み込み)も対応出来るらしいので、こちらはまた別の記事にしたいと思います。

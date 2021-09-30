# Profile

## 自己紹介

普段 Web や Mobile アプリ開発をしている ZUMA です。

この blog は 2021 年に入り Next を勉強しようと思い作りました。

Vercel でホスティングしています。

デザインは Material-UI で組んでいます。

当面は個人開発で得た技術的知見を発信する場にしようと思っています。

比較的最新の技術が好きで個人開発では率先して新しいことにチャレンジしています。

最近はサーバレス構成を秒速で構築出来る Amplify を勉強しています。Lambda 最高です。

モバイル開発は Flutter を勉強中です。Hot reload 最高です。

思いついた時に [Twitter](https://twitter.com/zuma_lab) で技術発信をしているので、お気軽にフォローお願いします。

## 趣味

趣味は音楽と野外フェスが好きで、FUJI ROCK、Summer Sonic、朝霧 JAM、GREENROOM FESTIVAL、ARABAKI ROCK FEST. など全国数え切れないくらい行ってます。

FUJI ROCK は 10 年以上通ってるフジロッカーです。

ロードバイクも好きで、東京から FUJI ROCK 会場のある新潟県の苗場まで自転車で往復 400km 走破しました。

バンドもやっていて、ギター、ベース、バンジョー、マンドリンが弾けます。

休日はバンド練習やライブをしていて、 新木場 STUDIO COAST や 渋谷 O-WEST/Asia など大きめの会場でライブをした経験もあります。

## 目標

昨今のコロナ渦でライブが出来なくて大変な思いをしているミュージシャンをいっぱい知っています。

個人開発の目標として、音楽の表現の場を失ったミュージシャンをオンラインで繋げ、新しい音楽を創出できるようなサービスを作ります！(宣言)

# Work Experience

## GENOVA.Inc, June 2012 - Present

### Flutter 診察券電子化&医療ポータルアプリ開発 February 2021 - August 2021

- Role
  - Lead Engineer

iOS/Android で開発したネイティブアプリを Flutter でリプレイスを実施。

リプレイスプロジェクトで技術選定・設計・開発・運用保守を担当。

Flutter を選定した理由として、以下を挙げる。

- iOS/Android で得たネイティブアプリ開発の知見を活かせる
- Dart は Javascript に近い記法で学習コストが低い
- Flutter の Widget の仕組みに React/Next で得た Component 指向、 Atomic Design の考えを導入できる

技術 Stack

- Language
  - Dart
- Framework
  - Flutter
- Architecture
  - MVVM
- State Management
  - Riverpod
- UI
  - Material-UI
- Http
  - Http
- Database
  - Hive
- DI
  - Riverpod
- Immutable Object Generator
  - Freezed
- Image Cache
  - CachedNetworkImage
- Push Notifier
  - FirebaseMessaging
- Unit Test
  - flutter_test
- Widget Test
  - flutter_test
- Mock
  - Mockito / MockWebServer

### Google クチコミレビューマーケティングツール開発 January 2021 - February 2021

- Role
  - Lead Engineer

全国の病院の 全ての Google のクチコミレビューを抽出し、キーワードでフィルタリングをかけるマーケティングツールの設計・開発を担当。

3 週間の短納期を実現させる為実装コストの低い Node.js を採用した。

- Language
  - Node.js
- Web Scraping Library
  - Puppeteer
- Unit Test
  - Jest
- Tools
  - Github/Slack

### オンライン診療システム フロントエンド開発技術検証 July 2020 - December 2020

- Role
  - Lead Engineer

オンライン診療システム開発要望に伴い、フロントエンド技術検証を担当。

Amplify で利用出来る React フレームワークを試験導入した。

- Language
  - JavaScript/TypeScript
- Framework
  - React
- State Management
  - React Hooks
- UI
  - Material-UI
- Http
  - Axios
- Date Library
  - date-fns
- Unit Test
  - Jest/ReactTestingLibrary
- E2E Test
  - Cypress
- Linter
  - ESLint
- Formatter
  - Prettier
- Tools
  - Github/Slack

### オンライン診療システム バックエンド開発技術検証 July 2020 - December 2020

- Role
  - Lead Engineer

オンライン診療システム開発要望に伴い、バックエンド技術検証を担当。

インフラ運用コストを抑えるため、Amplify を試験導入した。

- Language
  - Node.js
- Framework
  - Amplify
- Authentication
  - Cognito
- Serverless
  - Lambda
- Data Store
  - DynamoDB
- Storage
  - S3
- Tools
  - Github/Slack

### Android 診察券電子化&医療ポータルアプリ開発 July 2019 - November 2019

- Role
  - Lead Engineer

Android アプリ開発プロジェクトで技術選定・設計・開発・運用保守を担当。

iOS 同様、Android のモバイルアプリ開発経験者不在だった為、Kotlin 言語の習得、Android フレームワークの習得の学習コストが掛けながらの開発となった。

その中でも実装コストを減らす為、Jetpack Library を優先して導入。

DataBinding x ViewModel x Coroutine x LiveData x Room を利用し、DB(SQLite)をトリガーとしたモダンな状態管理、非同期処理、データバインディングを取り入れ、開発期間 5 ヶ月でのリリースを実現した。

- Language
  - Kotlin
- Architecture
  - MVVM
- Android Jetpack
  - ViewModel
  - Coroutine
  - LiveData
  - Room
  - Paging
- UI
  - Material Component
- Http
  - Retrofit2/Okhttp3
- DI
  - Dagger2
- Image Library
  - Glide
- Log
  - Timber
- Unit Test
  - JUnit5/Speck2/Truth
- UI Test
  - JUnit4/Robolectric
- Mock
  - Mockito/Mockwebserver
- Tools
  - Github/Slack/ZenHub

### iOS 診察券電子化&医療ポータルアプリ開発 April 2019 - August 2019

- Role
  - Lead Engineer

iOS アプリ開発プロジェクトで技術選定・設計・開発・運用保守を担当。

iOS のモバイルアプリ開発経験者不在だった為、Swift 言語の習得、iOS フレームワークの習得の学習コストが掛けながらの開発となった。

Architecture は MVVM + Clean Architecture を導入しテスタビリティ・メンテナンス性を意識した設計にした。

当時人気のあった RxSwift と ReSwift を利用した非同期処理、状態管理、データバインディングを導入し、開発期間 5 ヶ月でのリリースを実現した。

- Language
  - Swift
- Architecture
  - MVVM + Clean Architecture
- FRP Framework
  - RxSwift
- State Management
  - ReSwift
- UI
  - Material Component
- Http
  - Alamofire/Moya
- Data Store
  - Realm
- DI
  - Swinject
- Image Library
  - AlamofireImage
- Transition
  - Hero
- Unit Test
  - RxTest/RxBlocking/Quick/Nimble
- Mock
  - Cuckoo/OHHTTPStubs
- Tools
  - Github/Slack/ZenHub

### 診察券電子化&医療ポータルアプリ バリバックエンド開発 July 2017 - August 2019

- Role
  - Lead Engineer

基盤インフラを AWS にリプレイスする為、バックエンドアプリケーションの技術選定・再設計・開発・運用保守を担当。

AWS の設計・開発を同時に行っていた為、クラウド要件に沿ったアプリケーション開発を経験した。

- Language
  - Python
- Framework
  - Django
- Web Server
  - WSGI/Nginx
- Data Base
  - MySQL
- Container
  - Docker
- Tools
  - Github/Slack/ZenHub

### 診察券電子化&医療ポータルアプリ インフラ開発 July 2017 - Present

- Role
  - Lead Engineer

開発当初抑えられていた運用コストが要件と共に肥大化し、100 万/月を超える状態が続いた為、基盤インフラの再設計プロジェクトを発足。

AWS にリプレイスする為、AWS 要件に合ったアプリケーションの技術選定・再設計・開発を実施。

基盤インフラの以下アーキテクチャを選定・再設計・開発を担当し、Reserved Instance 導入の結果、実績として 3 万/月まで大幅コストカットを実現した。

- Instance
  - EC2/ALB
- Data Store
  - RDS/ElasticSearch
- Storage
  - S3
- CDN
  - CloudFront
- Container Registry
  - ECR
- Container Orchestration
  - ElasticBeanstalk/ECS
- Batch
  - Lambda
- Domain
  - Route53
- SSL/TLS
  - ACM
- Log
  - CloudWatch

### ブログ記事 SNS 一括投稿システム開発 March 2015 - July 2017

Linux/PHP/FuelPHP/Nginx/MySQL

### Web サイト構築 CMS 開発 June 2012 - September 2016

Linux/Perl/PSGI/Apache/MySQL

## 株式会社 FST April 2009 - March 2012

### PHP 受託案件 January 2011 - March 2012

- 大手清涼飲料水 twitter 連動クローズドキャンペーン WEB サイト構築
- スマートフォン新機種発売オープンキャンペーン WEB サイト構築
- 大手清涼飲料水 スケジュール調整 WEB サイト構築
- 大手家電店 ショッピングモール WEB サイト構築
- CS 放送番組情報返却 API 開発
- 民放テレビ番組表 WEB サイト構築
- テレビ番組表 携帯版 WEB サイト改修

Linux/PHP/Apache/MySQL/Smarty

### JAVA 受託案件 April 2009 - December 2010

- 大手缶コーヒー WEB サイト内ゲーム用 API 開発
- 大手清涼飲料水 会員制 WEB サイト構築
- 大手清涼飲料水 クローズドキャンペーン WEB サイト構築
- 民放テレビ番組表 管理機能構築

Linux/JAVA/Tomcat/Oracle

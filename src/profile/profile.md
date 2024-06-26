# Profile

## 自己紹介

普段 Web や Mobile アプリ開発をしている ZUMA です。

この blog は Next.js を勉強しようと思い作りました。

Vercel でホスティングしています。

比較的新しい技術が好きで率先して新しいことにチャレンジしています。

[X](https://twitter.com/zuma_lab) をやってるのでお気軽にフォローお願いします。

# Work Experience

**医療系上場企業, June 2012 - The present**

## ChatGPT を利用した医療機関向け AI Chatbot システム開発 May 2023 -

ChatGPT を利用した医療機関向けの AI Chatbot システム開発プロジェクトの技術検証・技術選定・設計・開発・テスト・インフラ構築・運用保守を担当。

ChatGPT, Claude, Gemini, Copilot それぞれの特性を活かし、プロンプトを使い分け生産性・開発効率が大幅に向上。

また、AI Editor Cursor をプロダクト導入し更に生産性が向上。

結果、1.5人のリソースで開発着手から 2 ヶ月でβ版リリースを実現した。

アーキテクチャとして、RAG を用いて医療機関のドメイン知識を回答。

RAG の ベクターストアには Pinecone を利用。

更にChatbotで自然言語でクリニックの仮予約を取る機能を追加。

また、OpenAIのWhisper、TTS APIを利用して音声会話機能を追加。

現在ChatbotにAI Avatarと会話ができる機能を実装中。

### Role

- Tech Lead

### Frontend

- Language
  - Typescript
- Framework
  - Next.js
- Hosting
  - Amplify
- GraphQL Client
  - Apollo Client
- UI Component Library
  - MUI
- CSS In JS Library
  - Tailwind CSS
- Date Library
  - date-fns
- Snapshot Test
  - Jest
  - Storybook
- Unit Test
  - Jest
  - React Testing Library
- E2E Test
  - Cypress
- Linter
  - ESLint & Biome
- Formatter
  - Biome
- CI/CD
  - Github Actions
- Tools
  - Github
  - Slack

### Backend

- Language
  - Python
- Framework
  - FastAPI
- ASGI
  - Uvicorn
- GraphQL Library
  - Strawberry
- Validation Library
  - Pydantic2
- ORM
  - SQLAlchemy2
- Database
  - MySQL
- Unit Test
  - Pytest
- Type Check
  - Pyright (Pylance)
- Formatter
  - Ruff
- Linter
  - Ruff
- CI/CD
  - Github Actions
- Tools
  - Docker
  - Github
  - Slack

### Infrastructure

- Container Orchestration
  - Amazon ECS
- Instance
  - Amazon EC2/ALB
- Data Store
  - Amazon RDS
- Vector Store
  - Pinecone
- Storage
  - Amazon S3
- CDN
  - Amazon CloudFront
- Container Registry
  - Amazon ECR
- Batch
  - AWS Lambda/SQS
- Domain
  - Amazon Route53
- SSL/TLS
  - AWS ACM
- Log
  - Amazon CloudWatch
- Email Platform
  - Amazon SES
- Security
  - AWS WAF

## React x Amplify 画像解析 LINE (LIFF) アプリ開発 April 2022 - April 2023

病院の診察券を撮影、画像解析し診察券番号を QR コード化する LINE (LIFF) アプリ 開発プロジェクトの技術選定・設計・開発・運用保守を担当。

フロントエンドは React、バックエンドは Amplify、画像解析には Amazon Textract を使用して開発。

**Role**

- Lead Engineer

**Frontend**

- Language
  - TypeScript
- Js Library
  - React
- Hosting
  - Amplify
- Query Language
  - GraphQL (Using AppSync)
- Local State Management
  - useSWR
- UI Component Library
  - Chakra-UI
- Linter
  - ESLint
- Formatter
  - Prettier
- Tools
  - Github
  - Slack

**Backend**

- Language
  - Node.js
- ML Library
  - Amazon Textract
- Serverless
  - Lambda (Using Amplify)
- GraphQL API
  - AppSync (Using Amplify)
- Authentication
  - Cognito (Using Amplify)
- Data Store
  - DynamoDB (Using Amplify)
- Tools
  - Github
  - Slack

## Next.js x Amplify 医療機関向け備品発注 SaaS 開発 September 2021 - March 2022

医療機関向けの備品発注 SaaS 開発プロジェクトの技術選定・設計・開発・運用保守を担当。

フロントエンドは Next.js、バックエンドは Amplify で開発。

**role**

- lead engineer

**frontend**

- language
  - typescript
- framework
  - next.js
- hosting
  - amplify
- query language
  - graphql (using appsync)
- local state management
  - useswr
- ui component library
  - material-ui
- css in js library
  - emotion
- date library
  - date-fns
- linter
  - eslint
- formatter
  - prettier
- snapshot test
  - jest
  - storybook
- unit test
  - jest
  - reacttestinglibrary
- e2e test
  - cypress
- tools
  - storybook
  - figma
  - github
  - slack

**backend**

- language
  - node.js
- graphql api
  - appsync (using amplify)
- authentication
  - cognito (using amplify)
- serverless
  - lambda (using amplify)
- data store
  - dynamodb (using amplify)
- storage
  - s3 (using amplify)
- tools
  - github
  - slack

## Flutter 診察券電子化&医療ポータルアプリ開発 February 2021 - August 2021

iOS/Android で開発したネイティブアプリを Flutter でリプレイスを実施。

リプレイスプロジェクトで技術選定・設計・開発・運用保守を担当。

Flutter を選定した理由として、以下を挙げる。

1. iOS/Android で得たネイティブアプリ開発の知見を活かせる
1. Dart は Javascript に近い記法で学習コストが低い
1. Flutter の Widget の仕組みに React/Next で得た Component 指向、 Atomic Design の考えを導入できる

**Role**

- Lead Engineer

**Tech Stacks**

- Language
  - Dart
- Framework
  - Flutter
- Architecture
  - MVVM
- Local State Management
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
  - Mockito
  - MockWebServer

## Google クチコミレビューマーケティングツール開発 January 2021 - February 2021

全国の病院の 全ての Google のクチコミレビューを抽出し、キーワードでフィルタリングをかけるマーケティングツールの設計・開発を担当。

3 週間の短納期を実現させる為実装コストの低い Node.js を採用した。

**Role**

- Lead Engineer

**Tech Stacks**

- Language
  - Node.js
- Web Scraping Library
  - Puppeteer
- Unit Test
  - Jest
- Tools
  - Github/Slack

## オンライン診療システム フロントエンド開発技術検証 July 2020 - December 2020

オンライン診療システム開発要望に伴い、フロントエンド技術検証を担当。

Amplify で利用出来る React フレームワークを試験導入した。

**Role**

- Tech Lead

**Tech Stacks**

- Language
  - TypeScript
- Framework
  - React
- Local State Management
  - React Hooks
- UI Component Library
  - Material-UI
- CSS in JS Library
  - styled-components
- Http
  - Axios
- Date Library
  - date-fns
- Unit Test
  - Jest
  - ReactTestingLibrary
- E2E Test
  - Cypress
- Linter
  - ESLint
- Formatter
  - Prettier
- Tools
  - Github
  - Slack

## オンライン診療システム バックエンド開発技術検証 July 2020 - December 2020

オンライン診療システム開発要望に伴い、バックエンド技術検証を担当。

インフラ運用コストを抑えるため、Amplify を試験導入した。

**Role**

- Tech Lead

**Tech Stacks**

- Language
  - Node.js
- Authentication
  - Cognito (Using Amplify)
- Serverless
  - Lambda (Using Amplify)
- Data Store
  - DynamoDB (Using Amplify)
- Storage
  - S3 (Using Amplify)
- Tools
  - Github
  - Slack

## Android 診察券電子化&医療ポータルアプリ開発 July 2019 - November 2019

Android アプリ開発プロジェクトで技術選定・設計・開発・運用保守を担当。

iOS 同様、Android のモバイルアプリ開発経験者不在だった為、Kotlin 言語の習得、Android フレームワークの習得の学習コストが掛けながらの開発となった。

その中でも実装コストを減らす為、Jetpack Library を優先して導入。

DataBinding x ViewModel x Coroutine x LiveData x Room を利用し、DB(SQLite)をトリガーとしたモダンな状態管理、非同期処理、データバインディングを取り入れ、開発期間 5 ヶ月でのリリースを実現した。

**Role**

- Lead Engineer

**Tech Stacks**

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

## iOS 診察券電子化&医療ポータルアプリ開発 April 2019 - August 2019

iOS アプリ開発プロジェクトで技術選定・設計・開発・運用保守を担当。

iOS のモバイルアプリ開発経験者不在だった為、Swift 言語の習得、iOS フレームワークの習得の学習コストが掛けながらの開発となった。

Architecture は MVVM + Clean Architecture を導入しテスタビリティ・メンテナンス性を意識した設計にした。

当時人気のあった RxSwift と ReSwift を利用した非同期処理、状態管理、データバインディングを導入し、開発期間 5 ヶ月でのリリースを実現した。

**Role**

- Lead Engineer

**Tech Stacks**

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

## 診察券電子化&医療ポータルアプリ バリバックエンド開発 July 2017 - August 2019

基盤インフラを AWS にリプレイスする為、バックエンドアプリケーションの技術選定・再設計・開発・運用保守を担当。

AWS の設計・開発を同時に行っていた為、クラウド要件に沿ったアプリケーション開発を経験した。

**Role**

- Lead Engineer

**Tech Stacks**

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

## 診察券電子化&医療ポータルアプリ インフラ開発 July 2017 - Present

開発当初抑えられていた運用コストが要件と共に肥大化し、100 万/月を超える状態が続いた為、基盤インフラの再設計プロジェクトを発足。

AWS にリプレイスする為、AWS 要件に合ったアプリケーションの技術選定・再設計・開発を実施。

基盤インフラの以下アーキテクチャを選定・再設計・開発を担当し、Reserved Instance 導入の結果、実績として 3 万/月まで大幅コストカットを実現した。

**Role**

- Lead Engineer

**Tech Stacks**

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

## ブログ記事 SNS 一括投稿システム開発 March 2015 - July 2017

Linux/PHP/FuelPHP/Nginx/MySQL

## Web サイト構築 CMS 開発 June 2012 - September 2016

Linux/Perl/PSGI/Apache/MySQL

## **受託開発会社勤務 April 2009 - March 2012**

## PHP 受託案件 January 2011 - March 2012

- 大手清涼飲料水 twitter 連動クローズドキャンペーン WEB サイト構築
- スマートフォン新機種発売オープンキャンペーン WEB サイト構築
- 大手清涼飲料水 スケジュール調整 WEB サイト構築
- 大手家電店 ショッピングモール WEB サイト構築
- CS 放送番組情報返却 API 開発
- 民放テレビ番組表 WEB サイト構築
- テレビ番組表 携帯版 WEB サイト改修

Linux/PHP/Apache/MySQL/Smarty

## JAVA 受託案件 April 2009 - December 2010

- 大手缶コーヒー WEB サイト内ゲーム用 API 開発
- 大手清涼飲料水 会員制 WEB サイト構築
- 大手清涼飲料水 クローズドキャンペーン WEB サイト構築
- 民放テレビ番組表 管理機能構築

Linux/JAVA/Tomcat/Oracle

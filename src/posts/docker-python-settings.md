---
title: 'DockerとDocker ComposeでPythonの実行環境を作成する'
date: '2021-01-20'
isPublished: true
metaDescription: 'Docker と Docker Compose で Python 実行環境を作ります。今回は docker コンテナ を build して python で簡単な Web スクレイピングをしてみたいと思います。'
tags:
  - 'Docker'
  - 'Docker Compose'
  - 'Python'
---

Docker と Docker Compose で Python 実行環境を作ります。

今回は docker コンテナ を build して python で簡単な Web スクレイピングをしてみたいと思います。

それでは作業手順です。

### 環境

- macOS Catalina 10.15.5(19F101)
- docker 20.10.0
- docker-compose 1.27.4

## 構成

最終的なディレクトリ構成は以下です。

```
$ tree
.
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── src
    └── sample.py
```

## 作業ディレクトリを作成する

`Dockerfile` や `docker-compose.yml` を作成する作業ディレクトリを作成します。

```
mkdir python-docker && cd python-docker
```

また、作業ディレクトリで以下コマンドを実行して python のソースコードを配置する `src` ディレクトリを作成します。

```
mkdir src
```

## requirements.txt を作成する

docker build 時に install される python package を記述する requirements.txt を作成します。

今回は試しに python の Web スクレイピングで使用する requests, beautifulsoup4 を install してみます。

記述内容は以下です。

- requirements.txt

```
requests
beautifulsoup4
```

## `Dockerfile` を作成する

docker コンテナ を build する `Dockerfile` を作成します。

設定内容は以下です。

- Dockerfile

```Dockerfile
FROM python:3
USER root

RUN apt-get update
RUN apt-get -y install locales && \
    localedef -f UTF-8 -i ja_JP ja_JP.UTF-8
RUN apt-get install -y vim less

ENV LANG ja_JP.UTF-8
ENV LANGUAGE ja_JP:ja
ENV LC_ALL ja_JP.UTF-8
ENV TZ JST-9
ENV TERM xterm

RUN mkdir -p /root/src
COPY requirements.txt /root/src
WORKDIR /root/src

RUN pip install --upgrade pip
RUN pip install --upgrade setuptools
RUN pip install -r requirements.txt
```

docker image は docker hub 公式の python3 の image を利用します。

マイナーバージョン以下を指定をしないと、コンテナ image を build した時点での最新の python stable version が install されます。

※ 執筆時点(2021/01/19)での version は 3.9.1 です。

また、python のコードを置く作業場として コンテナ 上に `/root/src` ディレクトリを作成し、 `WORKDIR` を指定します。

以後の `RUN` は `WORKDIR` で実行されます。

また、先程作成したローカルの `requirements.txt` を `/root/src` にコピーしています。

`RUN pip install -r requirements.txt` で requirements.txt の package を install します。

## 環境変数ファイルを作成する

python のソースコードを配置するパスの環境変数を設定する `.env` ファイルを作成します。

- .env

```
SRC_PATH=./src
```

`.env` ファイルは特殊なファイルで、設定した環境変数は Dockerfile や、後ほど作成する docker-compose.yml から参照できます。

通常ソースコードは Dockerfile があるディレクトリとは違う階層に配置します。

ソースコードのパスを環境変数で外出しにすることによって汎用性を持たせています。

今回はサンプルなので、先程作成した `src` ディレクトリを指定しました。

## docker-compose.yml を作成する

docker-compose コマンドを使った時の設定ファイルである `docker-compose.yml` を作成します。

`docker-compose.yml` の設定で複数の コンテナ を link で接続したり、同時に build や delete ができるので、今後の拡張性を考えて用意しておきます。

よく Apache/Nginx や MySQL の コンテナ と組み合わせて使ったりします。

今回は Python の実行環境のみを構築するので設定は以下になります。

- docker-compose.yml

```yml:docker-compose.yml
version: '3'
services:
  python3:
    restart: always
    build: .
    container_name: 'python3'
    working_dir: '/root/src'
    tty: true
    volumes:
      - ${SRC_PATH}:/root/src
```

- build
  - `build` にカレントディレクトリを指定しています。
  - `docker-compose build` 時にカレントディレクトリにある Dockerfile が参照されます。
- container_name
  - `container_name` には任意のコンテナ名を指定してください。
  - 後ほど使用するコンテナ実行コマンド `docker -exec -it {コンテナ名}` の コンテナ名となります。
- working_dir
  - `working_dir` は Dockerfile の `WORKDIR` と同じ階層をしてしています。
  - 後述する `docker exec -it python3 {コマンドライン}` で コンテナ内のコマンドを実行した時のデフォルト階層になります。
- volumes
  - `volumes` にはローカルの `src` ディレクトリを `/root/src` にマウントする記述をしています。
  - マウントするとローカルの `src` 配下のファイルが コンテナ から参照されるようになります。
  - 先程作成した `.env` ファイルの環境変数は `${SRC_PATH}` の記述で取得できます。

## コンテナを build する

以下コマンドでコンテナを build します。

```
docker-compose build
```

初回はコンテナの image cache が無いので build が終わるまで時間がかかります。

```
docker-compose build --no-cache
```

なお、明示的に image cache を利用しない場合は `--no-cache` オプションをつけます。

```
Successfully built 1435747abc3b
Successfully tagged python-docker_python3:latest
```

こちらのログが出力されれば build 完了です。

作成されたコンテナ image を確認します。

```
$ docker images |grep python3
python-docker_python3                                      latest              1435747abc3b   9 minutes ago   973MB
```

無事コンテナ image が作成されました。

## コンテナを起動する

以下コマンドでコンテナを起動します。

```
docker-compose up -d
```

`docker-compose up` でコンテナを起動します。

`-d` オプションはデーモンモードで起動し、プロセスがバックグラウンドで動作します。

`docker-compose ps` コマンドでコンテナの状態が確認出来ます。

```
$ docker-compose ps
 Name     Command   State   Ports
---------------------------------
python3   python3   Up
```

`State` が `Up` になっているので無事起動できています。

また、以下のコマンドで docker-compose.yml に設定した `working_dir` の場所が確認できます。

```
$ docker exec -it python3 pwd
/root/src
```

以下コマンドで python の version が確認できます。

```
$ docker exec -it python3 python --version
Python 3.9.1
```

以下コマンドでコンテナに install されている python モジュールを確認できます。

```
$ docker exec -it python3 pip list
Package        Version
-------------- ---------
beautifulsoup4 4.9.3
certifi        2020.12.5
chardet        4.0.0
idna           2.10
pip            20.3.3
requests       2.25.1
setuptools     51.3.3
soupsieve      2.1
urllib3        1.26.2
wheel          0.36.2
```

`requirement.txt` に記述した `requests` と `beautifulsoup4` モジュールが無事 install されています。

## python プログラムを実行する

それではコンテナで python プログラムを実行してみましょう。

`src` ディレクトリ直下に `sample.py` ファイルを作成してください。

以下コードです。

```py:sample.py
import requests
from bs4 import BeautifulSoup

load_url = 'https://zuma-lab.com/'
data = requests.get(load_url)
html = BeautifulSoup(data.content, 'html.parser')

for element in html.find_all('h4'):
  print(element.text)
```

内容としては本ブログの Top ページ  にある記事一覧を取得し表示しています。

以下コマンドでプログラムを実行します。

```
docker exec -it python3 python sample.py
```

```
$ docker exec -it python3 python sample.py
AWS Amplify 初心者入門 amplify initでamplifyバックエンド環境を初期化する
Next.js/TypeScriptのウェブサイトにStatic Formsでサーバレスなお問い合わせフォームを作成する
AWS Amplify 初心者入門 amplify configureでIAMユーザーを作成する
Next.js/TypeScriptプロジェクトのbuild時にsitemap.xmlを自動生成する
Next.js/TypeScriptで本番/ステージング/ローカル環境別にGoogle Analyticsを利用する
Next.js/TypeScript/ESLint/Prettier/Material-UI/styled-componentsの自作テンプレートを作る
Next.js/TypeScriptプロジェクトにMaterial-UI/styled-componentsを対応させる
TypeScriptのプロジェクトにESLintとPrettierを併用してVSCodeの保存時に自動フォーマットをする
Reactのimport文を絶対パスで設定する(TypeScript版)
Vercelにお名前.comで取得したドメインをカスタムドメインとして設定する
Next/TypeScript/Material-UI/Vercelでブログ始めました
```

このように検索結果一覧が表示されました。

## コンテナの終了

最後に後片付けです。

以下のコマンドでコンテナを終了します。

```
docker-compose down
```

ps コマンドで起動中のコンテナが表示されていないことを確認してください。

```
$ docker-compose ps
 Name     Command    State     Ports
------------------------------------
```

## 終わりに

筆者は基本的にローカルの開発環境は Docker の コンテナ を立てています。

作成した Dockerfile は Github で公開し、開発メンバーにはローカルにコンテナを立ててもらいます。

そうすることによりメンバー間の python の version 差異が発生するのを防いでいます。

また、2020 年の AWS の Re:Invent で Lambda Container Support が発表され、現在 Lambda で docker コンテナ が利用できるようになっています。

ローカルの コンテナ をまるっと Lambda にのせれる訳です。

そして Kubernetes の流行もあり、今後も コンテナ 需要が増えると思います。

という訳で筆者はとりあえずローカル開発環境は Docker コンテナ を立てています。

最後に、今回作成した Dockerfile や docker-compose.yml は Github にありますので参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="kazuma-fujita/python-docker" src="https://hatenablog-parts.com/embed?url=https://github.com/kazuma-fujita/python-docker" frameborder="0" scrolling="no"></iframe>

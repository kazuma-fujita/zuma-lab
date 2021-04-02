---
title: 'FlutterでiOSの開発/ステージング/本番環境を切り替える'
date: '2021-04-01'
isPublished: true
metaDescription: 'FlutterでiOSの開発/ステージング/本番環境を切り替える方法です。Flutter で環境を切り替えるには Debug build/Release build で切り替える方法や Flavor を使う方法がありますが、今回は dart-define を利用して環境を切り替えてみます。'
tags:
  - 'Flutter'
  - 'Dart'
  - 'Firebase'
  - 'FCM'
---

Flutter で開発/ステージング/本番環境を切り替える方法です。

プロダクト開発だと開発環境の他、本番環境、本番環境により近いステージング環境と 3 種類の環境を用意するケースが多いと思います。

ステージング環境は QA 環境やテスト環境とも呼んだりしますね。

Flutter で環境を切り替えるには Debug build/Release build で切り替える方法や Flavor を使う方法がありますが、今回は dart-define を利用して環境を切り替えてみます。

また、dart-define で環境変数を設定して Flutter や iOS のソースコード、Android の AndroidManifest.xml で環境変数の値を使用する記事を以前書きました。

dart-define の環境変数の利用方法をもっと知りたい方はこちらの記事を参考にしてください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Flutterの--dart-defineで環境変数を設定してソースコードやAndroidManifest.xmlで環境変数の値を使用する | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/flutter-dart-define-environment" frameborder="0" scrolling="no"></iframe>

それでは iOS で dart-define を利用して環境の切り替え方法を解説していきます。

今回は dart-define で開発/ステージング/本番環境を定義して環境ごとにアプリの BundleID やアプリアイコン、Firebase の GoogleService-Info.plist の切り替えをします。

今回 FCM でプッシュ通知をする用途で GoogleService-Info.plist を環境別に出力して切り替えをしたいと思います。

途中で FCM の設定が出てきますが、不要な方は読み飛ばしてください。

また、環境は以下のような構成を実現できるようにします。

- Debug build
  - 開発環境
  - ステージング環境
- Release build
  - ステージング環境
  - 本番環境

Debug build は IDE から Run/Debug を実行するか、`flutter run --debug` を実行した時を指します。

Release build は `flutter run --release` もしくは `flutter build` を実行した時を指します。

`flutter run (or build)` の引数で dart-define で 開発環境、ステージング環境、本番環境を切り替えます。

前提として、利用する OS は macOS、IDE は Android Studio になります。

途中 IDE 特有の設定が出てきますが、VSCode の方は読み替えて頂ければ幸いです。

### 環境

- macOS Big Sur 11.2.3
- Android Studio 4.1.3
- Flutter 2.0.3
- Dart 2.12.2

## IDE に環境変数を設定する

環境変数は以下のフォーマットで設定します。

```txt
--dart-define=ENVIRONMENT_NAME=value
```

例えば、以下のケースでは `flutter run` もしくは `flutter build` コマンドの引数で環境変数を設定します。

- コマンドラインからアプリをビルド/実行してテストする
- 本番 Release ビルドを作成する
- Circle CI や Github Actions など CI 環境で環境変数を利用する

コマンドラインから環境変数を設定する場合は以下のように引数に `--dart-define` を指定します。

- 開発環境

```txt
flutter run --debug --dart-define=BUNDLE_ID_SUFFIX=.dev --dart-define=BUILD_ENV=dev
```

- ステージング環境

```txt
flutter run --debug (or --release) --dart-define=BUNDLE_ID_SUFFIX=.stg --dart-define=BUILD_ENV=stg
```

- 本番環境

```txt
flutter run –release --dart-define=BUILD_ENV=prod
```

`BUNDLE_ID_SUFFIX` は BundleID の切り替えや、アプリアイコンの切り替えで使用します。

本番環境ではこの識別子が不要なので空で問題ないです。

Android Studio で `--dart-define` で環境変数を設定するには `Configurations` 画面から行います。

画面上部の `main.dart` をクリックするとプルダウンで `Edit Configurations...` が選択できます。

<img src='/images/posts/2021-03-29-1.png' class='img' alt='posted image' />

Configurations 画面を開いて `Additional run args` に `--dart-define` を入力します。

<img src='/images/posts/2021-03-30-6.png' class='img' alt='posted image' />

開発環境は `Name` を `main.dart` から develop にして、`Additional run args` 以下を追記します。

```txt
--dart-define=BUNDLE_ID_SUFFIX=.dev --dart-define=BUILD_ENV=dev
```

次にステージング環境の Configurations を作成します。

+ボタンをクリックして表示される Add New Configuration から Flutter を選択します。

<img src='/images/posts/2021-03-30-7.png' class='img' alt='posted image' style='width: 50%' />

ステージング環境は `Name` を staging にして、`Additional run args` 以下を追記します。

```txt
--dart-define=BUNDLE_ID_SUFFIX=.stg --dart-define=BUILD_ENV=stg
```

Dart entrypoint は `lib/main.dart` を選択します。

<img src='/images/posts/2021-03-30-8.png' class='img' alt='posted image' />

本来、本番環境は IDE での debug build はせず、`flutter run --release --dart-define=...` のようにコマンドラインから release build します。

今回は検証用のプロジェクトのため、Configurations を追加します。

本番環境は `Name` を production にして、`Additional run args` 以下を追記します。

```txt
--dart-define=BUILD_ENV=prod
```

Dart entrypoint は `lib/main.dart` を選択します。

設定後の Android Studio は以下のように Configurations が選択できるようになります。

<img src='/images/posts/2021-03-30-9.png' class='img' alt='posted image' />

VSCode でも環境変数の設定が可能です。

詳しくは [こちら](https://qiita.com/mr-hisa-child/items/a7efc63044fa52bf3db6) を参照ください。

## Firebase プロジェクトを作成する

ここからは FCM を利用した開発・ステージング・本番環境別のプッシュ通知を実現する為の手順です。

今回は Firebase の GoogleService-Info.plist を環境別に取得します。

ここでは Firebase プロジェクトが既に作成してあると仮定します。

Firebase のプロジェクトの作成方法は以前の記事を参照ください。

また事前準備として Apple Developer Console でアプリの Identifier を作成する必要があります。

こちらも以前の記事を参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Flutter初心者がFCMを使ってプッシュ通知を受け取る〜設定編〜(2021/3/22版) | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/flutter-fcm-push-notify-settings" frameborder="0" scrolling="no"></iframe>

## 本番環境の GoogleService-Info.plist を取得する

まず [Firebase Console](https://console.firebase.google.com/u/0/?hl=ja) を開き Firebase プロジェクトに移動します。

以下のアプリを追加ボタンをクリックして iOS を選択します。

<img src='/images/posts/2021-03-30-1.png' class='img' alt='posted image'/>

iOS バンドル ID を入力します。今回サンプルなので `com.example.flutter-fcm-push-notify` としました。

こちらは本番環境のバンドル ID となります。

`アプリを登録` ボタンをクリックします。

<img src='/images/posts/2021-03-22-11.png' class='img' alt='posted image' style='width: 50%'/>

次にプッシュ通知をする際に必須の設定である `GoogleService-Info.plist` を DL します。

後は何もせず 次へ 押してコンソールへ戻ります。

## 開発・ステージング環境の GoogleService-Info.plist を取得する

次に同じ要領で、開発環境、ステージング環境用のアプリを登録します。

iOS バンドル ID はそれぞれ以下を入力します。

- 開発環境
  - com.example.flutter-fcm-push-notify.dev
- ステージング環境
  - com.example.flutter-fcm-push-notify.stg

<img src='/images/posts/2021-03-30-2.png' class='img' alt='posted image'/>

各環境それぞれプッシュ通知をする際に必須の設定である `GoogleService-Info.plist` を DL します。

## Apple Developer Console で APNs Key を作成する

Apple Developer Console の [Certificates, Identifiers & Profiles](https://developer.apple.com/account/resources/certificates/list) にアクセスします。

左メニュー Keys から Key 一覧画面を開きます。

`+` ボタンをクリックして Key 作成画面を開きます。

<img src='/images/posts/2021-03-22-15.png' class='img' alt='posted image'/>

Key Name に作成する Key 名を入力します。

また Apple Push Notifications service(APNs) の ENABLE にチェックをします。

Continue ボタンをクリックして次の画面に進みます。

<img src='/images/posts/2021-03-22-16.png' class='img' alt='posted image'/>

Register ボタンをクリックします。

<img src='/images/posts/2021-03-22-17.png' class='img' alt='posted image'/>

Download Your Key 画面で Key を DL します。

<img src='/images/posts/2021-03-22-18.png' class='img' alt='posted image'/>

```txt
After downloading your key, it cannot be re-downloaded as the server copy is removed. If you are not prepared to download your key at this time, click Done and download it at a later time. Be sure to save a backup of your key in a secure place.
```

> キーをダウンロードした後、サーバーコピーが削除されているため、キーを再ダウンロードすることはできません。現時点でキーをダウンロードする準備ができていない場合は、[完了]をクリックして、後でダウンロードしてください。キーのバックアップは必ず安全な場所に保存してください。

こちらの警告が表示されている通り、一度 DL すると再取得できないので Key のバックアップを必ずとりましょう。

DL した Key は `AuthKey_XXXXXXXX.p8` のようなファイル名です。

## APNs 認証キーをアップロード

FirebaseConsole > プロジェクトの設定 > CloudMessaging タブをクリックします。

<img src='/images/posts/2021-03-22-34.png' class='img' alt='posted image'/>

iOS アプリの設定で APNs 認証キーのアップロードをクリックします。

<img src='/images/posts/2021-03-22-35.png' class='img' alt='posted image'/>

APNs 認証キーには、先程ダウンロードしておいた p8 のキーファイルをドラッグ&ドロップします。

キー ID は、Apple Developer Console の Keys より Key を選択すると確認できます。

チーム ID は Apple Developer Member Center メンバーシップより確認できます。

入力したらアップロードボタンをクリックします。

<img src='/images/posts/2021-03-22-36.png' class='img' alt='posted image' style='width: 50%'/>

もしも、「このアプリにチーム ID が保存されていません」というエラーが表示された場合は Key を削除後もう一度設定し直します。

このエラーが表示された後、チーム ID がプロジェクト全体設定に反映される為、再度アップロードダイアログを開くとちゃんとチーム ID が設定されています。

<img src='/images/posts/2021-03-22-37.png' class='img' alt='posted image' style='width: 50%'/>

後は以下の開発・ステージング環境のアプリにも同様に 認証キーファイルをアップロードします。

- 開発環境
  - com.example.flutter-fcm-push-notify.dev
- ステージング環境
  - com.example.flutter-fcm-push-notify.stg

<img src='/images/posts/2021-03-30-12.png' class='img' alt='posted image'/>

筆者は本番環境のみ認証キーを設定して、後の環境は認証キーを設定し忘れていた為、いつまでも本番環境以外にプッシュ通知が送信されずにハマりました。

## Provisioning Profile を取得する

開発環境/ステージング環境/本番環境別に Provisioning Profile を取得します。

こちらは以前の記事で取得方法を解説していますので記事を参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Flutter初心者がFCMを使ってプッシュ通知を受け取る〜設定編〜(2021/3/22版) | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/flutter-fcm-push-notify-settings" frameborder="0" scrolling="no"></iframe>

取得した Profile は DL して Xcode に登録しておきます。

## GoogleService-Info.plist を Xcode にコピーする

各環境で DL した GoogleService-Info.plist はそれぞれ以下ファイル名にリネームします。

- 開発環境
  - GoogleService-Info.dev.plist
- ステージング環境
  - GoogleService-Info.stg.plist
- 本番環境
  - GoogleService-Info.prod.plist

まず Xcode を開きます。

プロジェクトのルートで以下コマンドを実行してください。

```txt
open ios/Runner.xcworkspace
```

事前に Xcode で `Runner/Configurations` フォルダーを作成します。

Xcode の Configurations フォルダーにドラッグ&ドロップでリネームした三種の GoogleService-Info.plist をコピーします。

コピーの際は Destination の Copy items if needed にチェックを入れます。

<img src='/images/posts/2021-03-30-3.png' class='img' alt='posted image'/>

コピー後の Xcode の状態はこのようになります。

<img src='/images/posts/2021-03-30-4.png' class='img' alt='posted image' style='width: 50%'/>

## 環境変数に応じて GoogleService-Info.plist を書き換えるスクリプトを記述する

次に Xcode の TARGETS Runner > Build Phases を開きます。

左上の+ボタンをクリックして New Run Script Phase を選択します。

<img src='/images/posts/2021-03-30-5.png' class='img' alt='posted image'/>

Run Script が追加されるので、Shell に以下スクリプトを追記します。

```sh
echo "run start"
if [ "${$BUILD_ENV}" = "dev" ]; then
cp "${PROJECT_DIR}/${PROJECT_NAME}/Configurations/GoogleService-Info.dev.plist" "${BUILT_PRODUCTS_DIR}/${PRODUCT_NAME}.app/GoogleService-Info.plist"
echo "Debug GoogleService-Info copied."
elif [ "${BUILD_ENV}" = "stg" ]; then
cp "${PROJECT_DIR}/${PROJECT_NAME}/Configurations/GoogleService-Info.stg.plist" "${BUILT_PRODUCTS_DIR}/${PRODUCT_NAME}.app/GoogleService-Info.plist"
echo "Staging GoogleService-Info copied."
elif [ "${BUILD_ENV}" = "prod" ]; then
cp "${PROJECT_DIR}/${PROJECT_NAME}/Configurations/GoogleService-Info.prod.plist" "${BUILT_PRODUCTS_DIR}/${PRODUCT_NAME}.app/GoogleService-Info.plist"
echo "Production GoogleService-Info copied."
fi
echo "run end"
```

これで build 時に環境変数に応じて GoogleService-Info.plist を書き換えることができるようになりました。

次に実際の環境変数を `--dart-define` から取得して Xcode に設定する作業をします。

## iOS ビルド時に環境設定ファイルを出力する

iOS ビルド時に `--dart-define` の環境変数の値を書き出した環境設定ファイルを出力するスクリプトを実行します。

<img src='/images/posts/2021-03-29-2.png' class='img' alt='posted image' />

Xcode を開いたら Runner > Edit Scheme... をクリックします。

<img src='/images/posts/2021-03-29-3.png' class='img' alt='posted image' />

Build > Pre-actions をクリックします。

ウィンドウ左下の+ボタンをクリックしてプルダウンの中から New Run Script Action を選択します。

<img src='/images/posts/2021-03-29-4.png' class='img' alt='posted image' />

まず Provide build settings from のプルダウンから Runner を選択します。

次に以下のスクリプトを追記します。

```sh
function urldecode() {
    : "${*//+/ }";
    echo "${_//%/\\x}";
}

IFS=',' read -r -a define_items <<< "$DART_DEFINES"


for index in "${!define_items[@]}"
do
    define_items[$index]=$(urldecode "${define_items[$index]}");
done

printf "%s\n" "${define_items[@]}" > ${SRCROOT}/Flutter/EnvironmentVariables.xcconfig
```

これは iOS の build 時に `--dart-define` 環境変数を取得し、環境設定ファイルである `ios/Flutter/EnvironmentVariables.xcconfig` を自動生成するスクリプトです。

スクリプトを記述したらウィンドウを閉じて Android Studio から開発環境(develop)でビルドしてみましょう。

Android Studio には各環境に応じて以下の `--dart-define` を定義しましたね。

- 開発環境(develop)

```txt
--dart-define=BUNDLE_ID_SUFFIX=.dev --dart-define=BUILD_ENV=dev
```

- ステージング環境(staging)

```txt
--dart-define=BUNDLE_ID_SUFFIX=.stg --dart-define=BUILD_ENV=stg
```

- 本番環境(production)

```txt
--dart-define=BUILD_ENV=prod
```

`ios/Flutter` ディレクトリを Finder で開いてみると `EnvironmentVariables.xcconfig` というファイルが生成されています。

中身を確認してみると以下環境変数が記述されています。

```txt
BUNDLE_ID_SUFFIX=.dev
BUILD_ENV=dev
flutter.inspector.structuredErrors=true
```

注意点として、`flutter clean` などをしてプロジェクトを clean した直後や `EnvironmentVariables.xcconfig` が無い状態で実行した場合など環境変数が xcconfig ファイル内に出力されていない場合があります。

その場合は IDE からではなくコマンドラインから 何度か build してみて、 `ios/Flutter/EnvironmentVariables.xcconfig` に環境変数が出力されているか確認してください。

## 生成した環境設定ファイルを Xcode で利用できるようにする

`ios/Flutter` ディレクトリにある `Debug.xcconfig` を開きます。

以下 1 行を追記します。

```
#include "EnvironmentVariables.xcconfig"
```

また、同じく `ios/Flutter` ディレクトリにある `Release.xcconfig` を開いて同様 1 行追記します。

追記後のファイルは以下のようになります。

- `ios/Flutter/Debug.xcconfig`

```
#include? "Pods/Target Support Files/Pods-Runner/Pods-Runner.debug.xcconfig"
#include "Generated.xcconfig"
#include "EnvironmentVariables.xcconfig"
```

- `ios/Flutter/Release.xcconfig`

```
#include? "Pods/Target Support Files/Pods-Runner/Pods-Runner.release.xcconfig"
#include "Generated.xcconfig"
#include "EnvironmentVariables.xcconfig"
```

これで `#include` で EnvironmentVariables.xcconfig を読み込んで Xcode から環境変数が利用できるようになりました。

## .gitignore に EnvironmentVariables.xcconfig を追記する

`ios/.gitignore` ファイルを開いて以下の１行を追記します。

```txt
Flutter/EnvironmentVariables.xcconfig
```

EnvironmentVariables.xcconfig を git に上げると人により環境変数が違う場合がある為チーム開発に支障がでます。

また、プロジェクトによっては API Key など秘匿情報が含まれる可能性があるので ignore しておきます。

## 環境変数に応じて開発/ステージング/本番の Bundle Id を変更する

Xcode の TARGETS Runner > Build Settings を開きます。

右上の検索から `Product Bundle Identifier` を入力して Product Bundle Identifier を表示します。

<img src='/images/posts/2021-03-30-10.png' class='img' alt='posted image'/>

Runner で現在設定されている Bundle Identifier の末尾に `$(BUNDLE_ID_SUFFIX)` を追記します。

今回は `com.example.flutter-fcm-push-notify$(BUNDLE_ID_SUFFIX)` と入力しました。

<img src='/images/posts/2021-03-30-11.png' class='img' alt='posted image'/>

Debug/Profile/Release それぞれ `$(BUNDLE_ID_SUFFIX)` を追記します。

`$(BUNDLE_ID_SUFFIX)` には環境変数である `--dart-define=BUNDLE_ID_SUFFIX=XX` の値が代入されいます。

環境変数により BundleID を分けることにより、Firebase のアプリ設定で設定した各環境の BundleID と合わせることができます。

Firebase のアプリを追加した時に以下 BundleID を設定しましたね。

- 開発環境
  - com.example.flutter-fcm-push-notify.dev
- ステージング環境
  - com.example.flutter-fcm-push-notify.stg
- 本番環境
  - com.example.flutter-fcm-push-notify

## 環境変数に応じてアプリ表示名を変更する

環境変数に応じて iPhone に表示するアプリ名を変更します。

Xcode の TARGETS Runner > Info を開きます。

Bundle name の Value にデフォルトで Flutter のプロジェクト名がアプリ表示名としてセットされています。

アプリ表示名の末尾に `$(BUNDLE_ID_SUFFIX)` を追記します。

<img src='/images/posts/2021-03-30-18.png' class='img' alt='posted image'/>

例えば `App$(BUNDLE_ID_SUFFIX)` と設定すると、開発環境では `App.dev` とアプリ名に表示されます。

## 環境変数に応じてアプリアイコンを変更する

Xcode の Runner/Assets.xcassets ファイルを開きます。

右クリックのコンテキストメニュー > iOS > iOS App Icon で AppIcon を追加します。

<img src='/images/posts/2021-03-30-14.png' class='img' alt='posted image'/>

それぞれ環境別に色違いの Icon を用意して登録します。

その際の AppIcon は以下命名をします。

- 開発環境
  - AppIcon.dev
- ステージング環境
  - AppIcon.stg
- 本番環境
  - AppIcon

<img src='/images/posts/2021-03-30-13.png' class='img' alt='posted image' style='width: 50%'/>

次に環境変数に応じて AppIcon を出し分ける設定をします。

TARGETS Runner > Build Settings を開きます。

画面右上の検索から `Asset Catalog App Icon` と入力します。

Debug/Profile/Release それぞれ AppIcon の末尾に `$(BUNDLE_ID_SUFFIX)` を付けて `AppIcon$(BUNDLE_ID_SUFFIX)` とします。

<img src='/images/posts/2021-03-30-15.png' class='img' alt='posted image'/>

これで BundleID 同様環境変数に応じて AppIcon の出し分けができます。

## 環境変数に応じて API の向き先を変更する

プロダクトの開発・ステージング・本番環境別に API のエンドポイントが別れてるユースケースです。

環境変数に応じて API の向き先を変更するには Dart ソースコード内で `String.fromEnvironment` メソッドを利用して環境変数を取得して出し分けを行います。

ちなみに bool の値は `bool.fromEnvironment` で取得します。

bool 値は以下のように設定できます。

```txt
--dart-define=BOOL_VALUE=true
```

取得フォーマットはこちらです。

```dart
String.fromEnvironment('STRING_VALUE');
bool.fromEnvironment('BOOL_VALUE');
```

環境変数を複数の箇所から利用する場合を想定して以下のように纏めて宣言しておくと使いやすいです。

```dart
class EnvironmentVariables {
  static const environment = String.fromEnvironment('BUILD_ENV');
  static const isDebugging = bool.fromEnvironment('IS_DEBUGGING');
}
```

環境変数は以下の `BUILD_ENV` の値を利用します。

```txt
--dart-define=BUILD_ENV=XXX
```

`BUILD_ENV` は GoogleService-Info.plist の出し分けでも利用しました。

プログラムからはこんな感じで呼び出せます。

```dart
class EnvironmentVariables {
  static const environment = String.fromEnvironment('BUILD_ENV');
}

class Environment {
  static const development = 'dev';
  static const staging = 'stg';
  static const production = 'prod';
}

class ApiEndPoint {
  static const development = 'http://localhost:8080/endpoint';
  static const staging = 'https://api-stg.sample.com/endpoint';
  static const production = 'https://api.sample.com/endpoint';
}

void main() {
  const apiEndpoint =
      (EnvironmentVariables.environment == Environment.development)
          ? ApiEndPoint.development
          : ((EnvironmentVariables.environment == Environment.staging)
              ? ApiEndPoint.staging
              : ApiEndPoint.production);

  print('ApiEndPoint: $apiEndpoint');
                 :
                 :
                 :
}
```

## 動作確認

それでは動作確認を行います。

Debug Build で開発環境を実行するには IDE から develop を選択して Run or Debug するか以下のコマンドを実行します。

```txt
flutter run --debug --dart-define=BUNDLE_ID_SUFFIX=.dev --dart-define=BUILD_ENV=dev
```

`flutter clean` などをしてプロジェクトを clean した直後や `EnvironmentVariables.xcconfig` が無い状態で実行した場合など環境変数が xcconfig ファイル内に出力されていない場合があります。

その場合、環境変数が反映されないので IDE からではなくコマンドラインから実行してみたり何度か run してみて、 `ios/Flutter/EnvironmentVariables.xcconfig` に環境変数が出力されているか確認してください。

次に Debug Build でステージング環境を実行するには IDE から staging を選択して Run or Debug するか以下コマンドを実行します。

```txt
flutter run --debug --dart-define=BUNDLE_ID_SUFFIX=.stg --dart-define=BUILD_ENV=stg
```

Release Build でステージング環境を実行するには以下コマンドを実行します。

```txt
flutter run --release --dart-define=BUNDLE_ID_SUFFIX=.stg --dart-define=BUILD_ENV=stg
```

Release Build で本番環境を実行するには以下コマンドを実行します。

```txt
flutter run --release --dart-define=BUILD_ENV=prod
```

それぞれ実行すると以下のように環境別でアプリ名が設定され、アプリアイコンが色分けして表示されます。

<img src='/images/posts/2021-03-30-16.png' class='img' alt='posted image' style='width: 50%'/>

注意点として、筆者の環境では Debug build で開発環境とステージング環境など複数環境を同時に iPhone にデプロイすることができませんでした。

複数環境を一つの端末にデプロイしたい場合は開発環境を Debug Build でデプロイして、ステージング環境、本番環境はコマンドラインから Release Build する必要がありました。

Debug build で開発環境、ステージング環境をテストする際は片方のアプリ削除しておく必要があったのでメモまでに残しておきます。

最後に、環境変数に応じて BundleID を環境ごとに出し分けてるので、環境別でプッシュ通知も問題なく受信できました。

スクリーンショットはステージング環境でプッシュ通知を受信した例です。

<img src='/images/posts/2021-03-30-17.png' class='img' alt='posted image' style='width: 50%'/>

## おわりに

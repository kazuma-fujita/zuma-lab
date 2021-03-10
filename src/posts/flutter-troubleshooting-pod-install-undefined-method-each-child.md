---
title: 'Flutterのpod installで発生するundefined method each_child for #<Dir:0x0000XXXXX> Did you mean? each_sliceエラーのトラブルシューティング'
date: '2021-03-10'
isPublished: true
metaDescription: 'Flutterのpod installで発生するundefined method each_child for #<Dir:0x0000XXXXX> Did you mean? each_sliceエラーはRuby Version を上げて CocoaPods を再 install して解決しました。解決までの記録を残します。'
tags:
  - 'Flutter'
  - 'Dart'
---

Flutter の pod install で `undefined method each_child for #<Dir:0x0000XXXXX> Did you mean? each_slice` エラーに遭遇して解決するまでの記録です。

### 環境

- macOS Big Sur 11.2.1
- Android Studio 4.1.2
- Flutter 2.0.0
- Dart 2.12.0

## エラー発生

Flutter で作ったアプリの動作確認で iPhone エミュレーターで動かそうと思い build した所以下エラーが発生しました。

pod install でエラーが発生している模様です。

```txt
Launching lib/main.dart on iPhone 12 Pro Max in debug mode...
Running pod install...
CocoaPods' output:
↳
    Preparing

  Analyzing dependencies

  Inspecting targets to integrate
    Using `ARCHS` setting to build architectures of target `Pods-Runner`: (``)

  Fetching external sources
  -> Fetching podspec for `Flutter` from `Flutter`
  -> Fetching podspec for `qr_code_scanner` from `.symlinks/plugins/qr_code_scanner/ios`

  Resolving dependencies of `Podfile`
    CDN: trunk Relative path: CocoaPods-version.yml exists! Returning local because checking is only perfomed in repo update
    CDN: trunk Relative path: all_pods_versions_0_2_a.txt exists! Returning local because checking is only perfomed in repo update
                                       :
                                       :
                                       :
    A Flutter
    A MTBBarcodeScanner
    A qr_code_scanner

  Downloading dependencies

  -> Installing Flutter (1.0.0)

  -> Installing MTBBarcodeScanner (5.0.11)
    > Copying MTBBarcodeScanner from `/Users/kazuma/Library/Caches/CocoaPods/Pods/Release/MTBBarcodeScanner/5.0.11-f453b` to `Pods/MTBBarcodeScanner`

  -> Installing qr_code_scanner (0.2.0)

  Generating Pods project
    - Creating Pods project
    - Installing files into Pods project
      - Adding source files
      - Adding frameworks
      - Adding libraries
      - Adding resources
      - Adding development pod helper files
      - Linking headers
    - Installing Pod Targets
      - Installing target `Flutter` iOS 8.0
      - Installing target `MTBBarcodeScanner` iOS 8.0
        - Generating module map file at `Pods/Target Support Files/MTBBarcodeScanner/MTBBarcodeScanner.modulemap`
        - Generating umbrella header at `Pods/Target Support Files/MTBBarcodeScanner/MTBBarcodeScanner-umbrella.h`
        - Generating Info.plist file at `Pods/Target Support Files/MTBBarcodeScanner/MTBBarcodeScanner-Info.plist`
        - Generating dummy source at `Pods/Target Support Files/MTBBarcodeScanner/MTBBarcodeScanner-dummy.m`
      - Installing target `qr_code_scanner` iOS 8.0
        - Generating module map file at `Pods/Target Support Files/qr_code_scanner/qr_code_scanner.modulemap`
        - Generating umbrella header at `Pods/Target Support Files/qr_code_scanner/qr_code_scanner-umbrella.h`
        - Generating Info.plist file at `Pods/Target Support Files/qr_code_scanner/qr_code_scanner-Info.plist`
        - Generating dummy source at `Pods/Target Support Files/qr_code_scanner/qr_code_scanner-dummy.m`
    - Installing Aggregate Targets
      - Installing target `Pods-Runner` iOS 9.0
        - Generating Info.plist file at `Pods/Target Support Files/Pods-Runner/Pods-Runner-Info.plist`
        - Generating module map file at `Pods/Target Support Files/Pods-Runner/Pods-Runner.modulemap`
        - Generating umbrella header at `Pods/Target Support Files/Pods-Runner/Pods-Runner-umbrella.h`
        - Generating dummy source at `Pods/Target Support Files/Pods-Runner/Pods-Runner-dummy.m`
    - Generating deterministic UUIDs
    - Stabilizing target UUIDs
    - Running post install hooks
  [!] An error occurred while processing the post-install hook of the Podfile.

  undefined method `each_child' for #<Dir:0x00007fe1e3410fd8>
  Did you mean?  each_slice

  /Users/kazuma/Documents/github/flutter/flutter-sdk/flutter/packages/flutter_tools/bin/podhelper.rb:54:in `block in flutter_additional_ios_build_settings'
  /Users/kazuma/Documents/github/flutter/flutter-sdk/flutter/packages/flutter_tools/bin/podhelper.rb:51:in `each'
  /Users/kazuma/Documents/github/flutter/flutter-sdk/flutter/packages/flutter_tools/bin/podhelper.rb:51:in `flutter_additional_ios_build_settings'
                                       :
                                       :
                                       :
Error running pod install
Error launching application on iPhone 12 Pro Max.

```

pod install 中に `undefined method each_child for #<Dir:0x0000XXXXX> Did you mean? each_slice` エラーが発生している模様でした。

## エラー原因

エラーを検索すると StackOverflow で同じようなエラーが発生している方がいました。

[Flutter pod install problem - undefined method `each_child' for - StackOverflow](https://stackoverflow.com/questions/65197799/flutter-pod-install-problem-undefined-method-each-child-for-dir0x00007fa6)

> The method Dir.each_child was introduced in Ruby 2.5, but you are using Ruby 2.3.0.
> You should update Ruby to 2.5.0 or later 2.x version (I used 2.7.2).
> After Ruby updating you may also need to restart your IDE and re-install cocoapods.

Ruby を version を 2.5.0 以降にして試してみてとあります。

詳しく調査していないのですが、CocoaPods は Ruby を利用していて `each_child` method は 2.5 で導入されたが、古い Ruby を使用している為エラーになっている？と意訳しました。

## エラー解決方法

StackOverflow を参考に Ruby Version を上げて CocoaPods を再 install して解決しました。

## Ruby を version up する

まず、Ruby の version を上げる為、以下のコマンドを実行します。

```txt
rbenv install -l
```

現時点でアップデートできる Ruby version が一覧で表示されます。

```txt
2.5.8
2.6.6
2.7.1
jruby-9.2.12.0
maglev-1.0.0
mruby-2.1.1
rbx-5.0
truffleruby-20.1.0
truffleruby+graalvm-20.1.0

Only latest stable releases for each Ruby implementation are shown.
Use 'rbenv install --list-all' to show all local versions.
```

今回は最新の Ruby 2.7.1 にアップデートする為、以下 install コマンドを実行します。

```txt
rbenv install 2.7.1
```

最後に以下コマンドで Ruby の version を 2.7.1 に切り替えます。

```txt
rbenv global 2.7.1
```

以下確認コマンドを実行して 2.7.1 となっていれば OK です。

```txt
$ ruby --version
ruby 2.7.1p83 (2020-03-31 revision a0c7c23c9c) [x86_64-darwin20]
```

## CocoaPods を再 install する

次に CocoaPods を再 install する為、一度 CocoaPods を uninstall します。

```txt
sudo gem uninstall cocoapods
```

ちなみに筆者の場合、Android Studio の terminal でコマンドを実行した場合、CocoaPods が無いよエラーになったので、Mac の terminal を立ち上げて実行しました。

次に CocoaPods の install コマンドを実行します。

```txt
sudo gem install cocoapods
```

以下確認コマンドを実行して CocoaPods version が表示されることを確認します。

```txt
$ pod --version
1.10.1
```

## アプリを実行する

CocoaPods の再 install 後、エミュレーターを実行しましょう。

```txt
Launching lib/main.dart on iPhone11pro in debug mode...
Automatically signing iOS for device deployment using specified development team in Xcode project: WK7LW3JQ6K
Running Xcode build...
Xcode build done.                                           13.7s
Installing and launching...
(lldb) 2021-03-10 16:57:16.836404+0900 Runner[31780:14364261] Warning: Unable to create restoration in progress marker file
Debug service listening on ws://127.0.0.1:60013/3WTF0p85EYg=/ws
Syncing files to device genova-iPhone11pro...
fopen failed for data file: errno = 2 (No such file or directory)
Errors found! Invalidating cache...
fopen failed for data file: errno = 2 (No such file or directory)
Errors found! Invalidating cache...
Application finished.
```

pod install、Xcode build が完了し無事にアプリが実行できました！

ですが、次に実機で実行しようとしたところ以下のエラーが発生しました。

```txt
Launching lib/main.dart on genova-iPhone11pro in debug mode...
Automatically signing iOS for device deployment using specified development team in Xcode project: WK7LW3JQ6K
Running Xcode build...
Xcode build done.                                           17.3s
Failed to build iOS app
Error output from Xcode build:
↳
    ** BUILD FAILED **

Xcode's output:
↳
    /Users/kazuma/Documents/github/flutter/flutter_qr_code_scanner/ios/Runner/GeneratedPluginRegistrant.m:10:9: fatal error: module 'qr_code_scanner' not found
    @import qr_code_scanner;
     ~~~~~~~^~~~~~~~~~~~~~~
    1 error generated.
    note: Using new build system
    note: Building targets in parallel
    note: Planning build
    note: Constructing build description

Could not build the precompiled application for the device.

It appears that your application still contains the default signing identifier.
Try replacing 'com.example' with your signing id in Xcode:
  open ios/Runner.xcworkspace

Error launching application on genova-iPhone11pro.
```

これは 初歩的なミスで iOS プロジェクトの `Bundle Identifier` がユニークな名前になっていなかったせいでした。

プロジェクトルートで以下コマンドを実行して Xcode を開きます。

```txt
open ios/Runner.xcworkspace
```

TARGETS > Runner > Signing & Capabilities を開きます。

Bundle Identifier の `com.example.projectName` をユニークな名前に変更します。

<img src='/images/posts/2021-03-10-1.png' class='img' alt='posted image' />

Android Studio(or Visual Studio)に戻りアプリを実行します。

```txt
Launching lib/main.dart on iPhone11pro in debug mode...
Automatically signing iOS for device deployment using specified development team in Xcode project: WK7LW3JQ6K
Running Xcode build...
Xcode build done.                                           13.7s
Installing and launching...
(lldb) 2021-03-10 16:57:16.836404+0900 Runner[31780:14364261] Warning: Unable to create restoration in progress marker file
Debug service listening on ws://127.0.0.1:60013/3WTF0p85EYg=/ws
Syncing files to device genova-iPhone11pro...
fopen failed for data file: errno = 2 (No such file or directory)
Errors found! Invalidating cache...
fopen failed for data file: errno = 2 (No such file or directory)
Errors found! Invalidating cache...
Application finished.
```

実機も無事実行できました！

## おわりに

筆者だけでしょうか、CocoaPods 周りがいつもハマるので今回記事にしました。

同じ境遇の方の参考になれば幸いです！

また、先日 2021/03/04 に Flutter 2.0.0、Dart 2.12.0 のメジャーバージョンアップが発表されましたね。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Google Developers Blog: Announcing Flutter 2" src="https://hatenablog-parts.com/embed?url=https://developers.googleblog.com/2021/03/announcing-flutter-2.html" frameborder="0" scrolling="no"></iframe>

Flutter 2 で Flutter On Web、Desktop が Stable になったり、Dart の FFI が Stable になったりしましたが、個人的に一番嬉しかったのが Dart の Null Safety が Stable に昇格したことですね。

筆者の個人アプリに Flutter2 と Dart の Null Safety を導入してみたので、ぜひこちらの記事を参考にして Flutter2 と Null Safety を導入してみてください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Flutter2のDart Null Safetyを既存のプロジェクトに導入する | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/flutter-dart-sound-null-safety-replace" frameborder="0" scrolling="no"></iframe>

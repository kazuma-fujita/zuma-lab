---
title: 'Flutter 開発時のAndroid Studioショートカット集'
date: '2021-01-xx'
isPublished: true
metaDescription: ''
tags:
  - 'Flutter'
  - 'Dart'
  - 'Android Studio'
---

Flutter 開発時の便利な Android Studio のショートカット集です。

前提として OS は macOS です。

### 環境

- macOS Big Sur 11.1
- Android Studio 4.1.2
- Flutter 1.22.6
- Dart 2.10.5

## Tab 切り替え

`command` + `shift` + `[` or `]`

## Window 切り替え

- Message window

`command` + `0`

- Project window

`command` + `1`

- Run window

`command` + `4`

- Terminal

`control` + `

## Assist・Quick Fix

`option` + `Enter`

## StatefulWidget のテンプレートを作成

`stf` と入力

以下テンプレートが作成される

```dart
class MyComponent extends StatefulWidget {
  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  @override
  Widget build(BuildContext context) {
    return Container();
  }
}
```

## StatelessWidget のテンプレートを作成

`stl` と入力

以下テンプレートが作成される

```dart
class MyComponent extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container();
  }
}
```

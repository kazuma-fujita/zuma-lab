---
title: 'Flutter 開発便利ショートカット集'
date: '2021-01-xx'
isPublished: true
metaDescription: ''
tags:
  - 'Flutter'
  - 'Dart'
---

Flutter 開発時の便利なショートカット集です。

### 環境

- Flutter 1.22.6
- Dart 2.10.5
- Android Studio 4.1.2

## StatefulWidget を作成

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

## StatelessWidget を作成

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

---
title: 'Flutter JsonSerializableでスネークケースのjsonフィールドを自動で変換する'
date: '2021-02-22'
isPublished: true
metaDescription: ''
tags:
  - 'Flutter'
  - 'Dart'
---

Flutter で API 通信のレスポンスをオブジェクトに変換する便利な package の JsonSerializable の小ネタです。

JsonSerializable を使っていて json フィールドのキー名がスネークケース、変換したいオブジェクトのプロパティ名が同名のキャメルケースの場合があると思います。

```json
{
  "id": 330997542,
  "full_name": "Jasyyie/sympli.search.api",
  "html_url": "https://github.com/Jasyyie",
  "avatar_url": "https://avatars.githubusercontent.com/u/49047008?v=4"
}
```

API からこんな json レスポンスがあったとしたら、通常 `@JsonKey` アノテーションを付けてキー名とプロパティ名をマッピングします。

```dart
@freezed
abstract class RepositoryEntity with _$RepositoryEntity {
  const factory RepositoryEntity({
    @required final int id,
    @required @JsonKey(name: 'full_name') final String fullName,
    @required @JsonKey(name: 'html_url') final String htmlUrl,
    @required @JsonKey(name: 'avatar_url') final String avatarUrl,
  }) = _RepositoryEntity;

  factory RepositoryEntity.fromJson(Map<String, dynamic> json) =>
      _$RepositoryEntityFromJson(json);
}
```

このようにクラスのプロパティ数が少ない場合は良いですが、これが何十個もある場合都度 `@JsonKey` アノテーションをつけるのはミスも発生しやすくオススメしません。

そこで JsonSerializable の build.yaml を設置して `@JsonKey` のマッピングを自動化しましょう。

設定は簡単で、プロジェクトルートの階層に `build.yaml` を作成して以下コピペします。

元ネタは公式の [Build configuration](https://pub.dev/packages/json_serializable#build-configuration) を参照ください。

```yaml
targets:
  $default:
    builders:
      json_serializable:
        options:
          # Options configure how source code is generated for every
          # `@JsonSerializable`-annotated class in the package.
          #
          # The default value for each is listed.
          any_map: false
          checked: true # false -> true
          create_factory: true
          create_to_json: true
          disallow_unrecognized_keys: false
          explicit_to_json: false
          field_rename: snake # none -> snake
          generic_argument_factories: false
          ignore_unannotated: false
          include_if_null: true
          nullable: true
```

`field_rename` を `none` から `snake` にします。

するとスネークケースのキー名を自動でプロパティにマッピングしてくれます。

今回ついでに `checked` もデフォルト false から true にしています。

`checked` パラメータは [checked property](https://pub.dev/documentation/json_annotation/3.1.0/json_annotation/JsonSerializable/checked.html) にある通り、デシリアライズする時プロパティを検査して、型変換に失敗した場合に `CheckedFromJsonException` を投げてエラー箇所を教えてくれます。

それでは先程のクラスを設定に合わせて書き換えてみましょう。

```dart
@freezed
abstract class RepositoryEntity with _$RepositoryEntity {
  const factory RepositoryEntity({
    @required final int id,
    @required final String fullName,
    @required final String htmlUrl,
    @required final String avatarUrl,
  }) = _RepositoryEntity;

  factory RepositoryEntity.fromJson(Map<String, dynamic> json) =>
      _$RepositoryEntityFromJson(json);
}
```

このように先程のクラスから `@JsonKey` を書かなくても json からオブジェクトに変換してくれます。

## おわりに

今回作成した build.yaml はプロジェクト新規作成時に都度作成するのは面倒、そして作成するのを忘れやすいのです。

以前 Android Studio の Flutter テンプレートをカスタマイズしてプロジェクト新規作成時の設定を自動化する記事を書きました。

Flutter テンプレートで build.yaml を自動で作成するやり方も紹介しているので、ぜひ参考にしてください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Android StudioのFlutterテンプレートをカスタマイズして Riverpod / StateNotifier / Freezed をデフォルトで使用できるプロジェクトを作成する | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/flutter-create-new-project-template-with-riverpod-state-notifire-freezed" frameborder="0" scrolling="no"></iframe>

---
title: 'AWS CDKを使ってS3とCloudFrontでWebサイトを配信する'
date: '2021-04-21'
isPublished: true
metaDescription: 'AWS CDKを使ってS3とCloudFrontでWebサイトを配信します。今回 CDK で使用する言語は TypeScript です。'
tags:
  - 'AWS'
  - 'CDK'
  - 'S3'
  - 'CloudFront'
---

AWS CDK を使って S3 と CloudFront で Web サイトを配信します。

S3 にアップロードした HTML を CloudFront で配信し、CloudFront を経由してのみ HTML にアクセスできるように設定します。

また、今回 CDK で使用する言語は TypeScript です。

### 環境

- macOS Big Sur 11.2.3
- node 15.14.0
- npm 7.7.6
- yarn 1.22.4
- cdk 1.98.0

## プロジェクトの作成

作業ディレクトリとプロジェクトを作成します。

作業ディレクトリは `cdk-s3-cloud-front-deploy` という名前にしています。

```txt
mkdir cdk-s3-cloud-front-deploy && cd cdk-s3-cloud-front-deploy
```

`cdk init` を実行して雛形を作成します。

```txt
cdk init --language typescript
```

実行が完了すると以下雛形が作成されました。

```txt
├── README.md
├── bin
│   └── cdk-s3-cloud-front-deploy.ts
├── cdk.json
├── jest.config.js
├── lib
│   └── cdk-s3-cloud-front-deploy-stack.ts
├── node_modules
│   ├── @aws-cdk
│   ├── @babel
│   :
│   :
├── package-lock.json
├── package.json
├── test
│   └── cdk-s3-cloud-front-deploy.test.ts
└── tsconfig.json
```

## AWS module の install

S3 と CloudFront のモジュールを追加します。

S3 と CloudFront に加え IAM も利用するのでインストールしておきます。

```txt
$ yarn add @aws-cdk/aws-iam @aws-cdk/aws-s3 @aws-cdk/aws-cloudfront
```

## S3 の Bucket を作成する

最初に S3 の Bucket を新規作成してみたいと思います。

今回作成するバケット名は cdk.json に記述したいと思います。

今回は `cdk-sample-bucket` というバケット名にします。

プロジェクトルート直下にある cdk.json を開いて、context の中に以下の記述をします。

```json
{
  "app": "npx ts-node --prefer-ts-exts bin/cdk-s3-cloud-front-deploy.ts",
  "context": {
    "s3": {
      "bucketName": "cdk-sample-bucket"
    }
  }
}
```

次に実際に S3 のバケットを作成します。

記述は先程作成した雛形の以下ファイルを編集していきます。

- `bin/cdk-s3-cloud-front-deploy.ts`

```ts
import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';

export class CdkS3CloudFrontDeployStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucketName: string = this.node.tryGetContext('s3').bucketName;
    const originBucket = new s3.Bucket(this, 'S3Bucket', {
      bucketName: bucketName,
      // Bucketへの直接アクセスを禁止
      accessControl: s3.BucketAccessControl.PRIVATE,
      // CDK Stack削除時にBucketも削除する
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}
```

`this.node.tryGetContext('s3').bucketName;` で先程 cdk.json の context に記述した要素が取得できます。

それでは以下のコマンドを実行して deploy してみましょう。

```txt
cdk deploy
```

実行して以下のログが流れれば成功です。

```
$ cdk deploy
CdkS3CloudFrontDeployStack: deploying...
CdkS3CloudFrontDeployStack: creating CloudFormation changeset...
[█████████████████████████████·····························] (1/2)

 ✅  CdkS3CloudFrontDeployStack

Stack ARN:
arn:aws:cloudformation:ap-northeast-1:999216002524:stack/CdkS3CloudFrontDeployStack/cedbfd30-a24c-11eb-bd62-0ed47b91b1b7
```

実際にバケットが作成されたかコンソールを開いて確認します。

<img src='/images/posts/2021-04-21-1.png' class='img' alt='posted image'/>

確認したら以下のコマンドでバケットを削除しておきます。

```txt
cdk destroy
```

以下ログが流れたらコンソールを確認して S3 のバケットが削除されているか確認しましょう。

```
$ cdk destroy
Are you sure you want to delete: CdkS3CloudFrontDeployStack (y/n)? y
CdkS3CloudFrontDeployStack: destroying...
12:05:59 | DELETE_IN_PROGRESS   | AWS::CloudFormation::Stack | CdkS3CloudFrontDeployStack
12:06:02 | DELETE_IN_PROGRESS   | AWS::CDK::Metadata | CDKMetadata/Default
12:06:03 | DELETE_IN_PROGRESS   | AWS::S3::Bucket    | S3Bucket

 ✅  CdkS3CloudFrontDeployStack: destroyed
```

## CloudFormation の Distribution を作成する

先程のファイルに CloudFormation の distribution を作成する実装を追記します。

ソースコード全文はこちらになります。

- `bin/cdk-s3-cloud-front-deploy.ts`

```ts
import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as iam from '@aws-cdk/aws-iam';

export class CdkS3CloudFrontDeployStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // cdk.jsonからbucketNameを取得
    const bucketName: string = this.node.tryGetContext('s3').bucketName;
    // bucketを新規作成
    const bucket = new s3.Bucket(this, 'S3Bucket', {
      bucketName: bucketName,
      // Bucketへの直接アクセスを禁止
      accessControl: s3.BucketAccessControl.PRIVATE,
      // CDK Stack削除時にBucketも削除する
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
    });

    // S3 を公開状態にすることなく、S3 へのアクセスを CloudFront からのリクエストに絞る為の仕組み
    const identity = new cloudfront.OriginAccessIdentity(this, 'OriginAccessIdentity', {
      comment: `${bucket.bucketName} access identity`,
    });

    // principalsに設定したアクセス元からのみに S3 バケットのGetObject権限を渡す
    // ポリシーを設定することで、S3 バケットのオブジェクトは CloudFront を介してのみアクセスできる
    const bucketPolicyStatement = new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      effect: iam.Effect.ALLOW,
      principals: [identity.grantPrincipal],
      resources: [`${bucket.bucketArn}/*`],
    });
    // bucketにポリシーをアタッチ
    bucket.addToResourcePolicy(bucketPolicyStatement);
    // CloudFrontのdistribution作成
    new cloudfront.CloudFrontWebDistribution(this, 'WebDistribution', {
      enableIpV6: true,
      httpVersion: cloudfront.HttpVersion.HTTP2,
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket,
            originAccessIdentity: identity,
          },
          behaviors: [
            {
              isDefaultBehavior: true,
              allowedMethods: cloudfront.CloudFrontAllowedMethods.GET_HEAD,
              cachedMethods: cloudfront.CloudFrontAllowedCachedMethods.GET_HEAD,
              forwardedValues: {
                queryString: false,
              },
            },
          ],
        },
      ],
      // 403/404エラーはindex.htmlを表示
      errorConfigurations: [
        {
          errorCode: 403,
          responseCode: 200,
          errorCachingMinTtl: 0,
          responsePagePath: '/index.html',
        },
        {
          errorCode: 404,
          responseCode: 200,
          errorCachingMinTtl: 0,
          responsePagePath: '/index.html',
        },
      ],
      priceClass: cloudfront.PriceClass.PRICE_CLASS_200,
    });
  }
}
```

## Deploy する

それでは以下のコマンドを実行して deploy してみましょう。

```txt
cdk deploy
```

途中で `Do you wish to deploy these changes (y/n)?` と効かれるので y を入力します。

以下のログが流れれば deploy 成功です。

```
$ cdk deploy
This deployment will make potentially sensitive changes according to your current security approval level (--require-approval broadening).
Please confirm you intend to make the following modifications:

IAM Statement Changes
┌───┬─────────────────────────────────────┬────────┬──────────────┬──────────────────────────────────────┬───────────┐
│   │ Resource                            │ Effect │ Action       │ Principal                            │ Condition │
├───┼─────────────────────────────────────┼────────┼──────────────┼──────────────────────────────────────┼───────────┤
│ + │ ${S3Bucket.Arn}/*                   │ Allow  │ s3:GetObject │ CanonicalUser:${OriginAccessIdentity │           │
│   │                                     │        │              │ .S3CanonicalUserId}                  │           │
└───┴─────────────────────────────────────┴────────┴──────────────┴──────────────────────────────────────┴───────────┘
(NOTE: There may be security-related changes not in this list. See https://github.com/aws/aws-cdk/issues/1299)

Do you wish to deploy these changes (y/n)? y
CdkS3CloudFrontDeployStack: deploying...
CdkS3CloudFrontDeployStack: creating CloudFormation changeset...
[██████████████████████████████████████████████████████████] (6/6)

 ✅  CdkS3CloudFrontDeployStack

Stack ARN:
arn:aws:cloudformation:ap-northeast-1:999216002524:stack/CdkS3CloudFrontDeployStack/cd1f9570-a273-11eb-80c3-06420aaf754f
```

## 動作確認

動作確認の為、ローカルの HTML ファイルを S3 にアップロードします。

```txt
mkdir ./html
echo '<html><head><title>CDK deploy test</title></head><body><h1>Hello! CDK!</h1></body></html>' > ./html/index.html
```

上記のように `index.html` を作成して S3 にファイルをアップロードしておきます。

<img src='/images/posts/2021-04-21-2.png' class='img' alt='posted image'/>

次に CloudFront コンソールにアクセスして CloudFront の distribution が作成されていることを確認します。

Domain Name が作成された CloudFront のドメインです。

<img src='/images/posts/2021-04-21-5.png' class='img' alt='posted image'/>

CloudFront のドメインにアクセスして先程作成した HTML が表示されれば成功です。

<img src='/images/posts/2021-04-21-3.png' class='img' alt='posted image'/>

次に S3 のドメインにアクセスしてみてください。

S3 のドメインは CloudFront の Origin に記載されている ドメイン です。

アクセスすると以下のように Access Denied になるはずです。

<img src='/images/posts/2021-04-21-4.png' class='img' alt='posted image'/>

また、CloudFront のドメインの後に適当なパスを入力してみてください。

404 エラーは index.html を表示するように実装しているので、先程の `Hello! CDK!` が表示されるはずです。

## Deploy した環境を削除する

作成した環境を削除したい場合は `cdk destroy` コマンドを実行してください。

```txt
cdk destroy
```

途中で `Are you sure you want to delete: {StackName} (y/n)?` と聞かれますので y を入力します。

ここで注意が必要なのが S3 にファイルが残っていると以下のエラーが発生します。

以下ログが流れたら S3 にあるファイルを全て削除して再度 `cdk destroy` を実行します。

```
 ❌  CdkS3CloudFrontDeployStack: destroy failed Error: The stack named CdkS3CloudFrontDeployStack is in a failed state. You may need to delete it from the AWS console : DELETE_FAILED (The following resource(s) failed to delete: [S3Bucket07682993]. )
    at Object.waitForStackDelete (/usr/local/lib/node_modules/aws-cdk/lib/api/util/cloudformation.ts:277:11)
    at processTicksAndRejections (node:internal/process/task_queues:94:5)
    at Object.destroyStack (/usr/local/lib/node_modules/aws-cdk/lib/api/deploy-stack.ts:395:28)
    at CdkToolkit.destroy (/usr/local/lib/node_modules/aws-cdk/lib/cdk-toolkit.ts:253:9)
    at initCommandLine (/usr/local/lib/node_modules/aws-cdk/bin/cdk.ts:208:9)
The stack named CdkS3CloudFrontDeployStack is in a failed state. You may need to delete it from the AWS console : DELETE_FAILED (The following resource(s) failed to delete: [S3Bucket07682993]. )
```

以下のログが流れれば削除成功です。

```
$ cdk destroy
Are you sure you want to delete: CdkS3CloudFrontDeployStack (y/n)? y
CdkS3CloudFrontDeployStack: destroying...
17:21:45 | DELETE_IN_PROGRESS   | AWS::CloudFormation::Stack                      | CdkS3CloudFrontDeployStack

 ✅  CdkS3CloudFrontDeployStack: destroyed
```

S3 と CloudFront のコンソールにアクセスして、Bucket や Distribution が削除されていることを確認してください。

## おわりに

簡単ですが S3 と CloudFront で Web サイトを配信する方法でした。

筆者は CDK 初心者の為、内容が誤っていたり、もっとこういうやり方があるよ！という方はぜひ [Twitter](https://twitter.com/zuma_lab) で DM していただくか [Contact](/contact) で教えて頂けると助かります。

更に調べてみるとローカルのソースを CDK で S3 にデプロイしたり、CloudFront のキャッシュ削除の自動化、独自ドメインを CloudFront に割り当てるなど色々出来そうです。

これらも CDK で実装できたら記事にしていきます。

最後に、ここまでのソースは Github にもありますので参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="kazuma-fujita/cdk-s3-cloud-front-deploy: Upload the local source to S3 using CDK and deliver it via Cloud Front." src="https://hatenablog-parts.com/embed?url=https://github.com/kazuma-fujita/cdk-s3-cloud-front-deploy" frameborder="0" scrolling="no"></iframe>

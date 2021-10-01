---
title: 'Amplify 認証UIコンポーネントのスタイル・入力項目のカスタマイズと日本語対応方法'
date: '2021-10-01'
isPublished: true
metaDescription: 'Amplify 認証UIコンポーネントの見た目の変更と入力項目変更と日本語化をする方法です。'
tags:
  - 'AWS'
  - 'Amplify'
  - 'Next.js'
---

筆者は最近 Next.js と AWS Amplify をかじっている Web アプリ開発初心者です。

本ブログでは今後数回に渡って Next.js と Amplify で Web アプリを高速に作れないか検証していきます。

前回は Amplify CLI を利用して amplify add auth で認証機能をアプリケーションに追加しました。

今回は、Amplify の認証 UI コンポーネントのスタイル変更、入力項目変更と日本語対応をします。

## 環境

- macOS Big Sur 11.15.2
- Amplify 6.0.1
- Next.js 11.1.2
- Typescript 4.4.3

## Amplify add auth で認証機能を追加する

前回の記事を参考に、認証 UI コンポーネントの表示まで行ってください。

手順としては以下となります。

1. Next.js のプロジェクトを作成
1. Amplify CLI のインストール
1. Amplify IAM ユーザの作成
1. Amplify 環境の作成
1. amplify に認証機能を追加する
1. 認証機能をフロントエンドに実装する

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="AmplifyでNext.jsアプリに認証機能を追加してログイン画面を実装する | ZUMA Lab" src="https://hatenablog-parts.com/embed?url=https://zuma-lab.com/posts/amplify-next-add-auth" frameborder="0" scrolling="no"></iframe>

スタイル変更、日本語対応前の Sign-in 画面です。

<img src='/images/posts/2021-09-28-1.png' class='img' alt='post image' style='width:50%;' />

こちらはアカウント Sign-up 画面です。

<img src='/images/posts/2021-09-28-2.png' class='img' alt='post image' style='width:50%;' />

こちらの認証 UI コンポーネントのスタイル変更と日本語対応をしていきます。

## スタイルを変更する

`styles/globals.css` に以下のように root プロパティを設定してスタイルを変更することができます。

```css
:root {
  --amplify-primary-color: #29b6f6;
  --amplify-primary-tint: #4fc3f7;
  --amplify-primary-shade: #0288d1;
  --amplify-tertiary-color: #ce93d8;
  --amplify-secondary-tint: #f3e5f5;
  --amplify-secondary-shade: #ab47bc;
  --amplify-text-xs: 1rem;
  --amplify-text-sm: 1.2rem;
}
```

`--amplify-primary-color` でメインとなるリンク、ボタン色の変更、`--amplify-text-sm` でテキストボックス、ボタンなどのメインのフォントサイズ、`--amplify-text-xs` で Forgot your password? などの補足文のフォントサイズが変更できます。

ログイン画面が以下のようになりました。

<img src='/images/posts/2021-09-30-1.png' class='img' alt='post image' style='width:50%;' />

`--amplify-secondary-tint` でアラート表示の背景色を変更できます。

<img src='/images/posts/2021-09-30-6.png' class='img' alt='post image' style='width:50%;' />

その他のプロパティは公式ドキュメントを参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="Customization - Theming - AWS Amplify Docs" src="https://hatenablog-parts.com/embed?url=https://docs.amplify.aws/ui/customization/theming/q/framework/react/" frameborder="0" scrolling="no"></iframe>

## 初期表示画面を Sign-up 画面にする

Amplify の 認証 UI Components はデフォルトで Sign-in 画面が最初に表示されます。

これを Sign-up 画面に変更するには以下のように AmplifyAuthenticator の initialAuthState プロパティを設定します。

initialAuthState には AuthState.SignUp を指定します。

```ts
import { AuthState } from '@aws-amplify/ui-components';
```

```ts
<AmplifyAuthenticator initialAuthState={AuthState.SignUp} />
```

画面をリロードすると初期表示画面が Sign-up 画面に変わっています。

## Username の代わりに Email を使用する

デフォルトだと username が必須項目になっています。

username のエイリアスとして email を設定したいと思います。

方法は簡単で、以下のように AmplifyAuthenticator の usernameAlias プロパティに email を設定します。

```ts
<AmplifyAuthenticator usernameAlias='email' />
```

Sign-In 画面は Username のフィールドが Email Address に変わっています。

<img src='/images/posts/2021-09-30-2.png' class='img' alt='post image' style='width:50%;' />

Sign-Up 画面は Username フィールドがなくなっていますね。

<img src='/images/posts/2021-09-30-3.png' class='img' alt='post image' style='width:50%;' />

## Sign-up 画面から電話番号フィールドを削除する

Sign-up 画面から電話番号フィールドが必要ない場合は項目自体を非表示にすることができます。

AmplifySignUp コンポーネントに formFields プロパティを追加して、必要なフィールドの配列を記述します。

この時、配列内のフィールドの順番を変更することで画面表示した際の入力項目の順番を入れ替えることができます。

```ts
import { AmplifyAuthenticator, AmplifySignUp } from '@aws-amplify/ui-react';
```

```ts
<AmplifyAuthenticator>
  <AmplifySignUp slot='sign-up' formFields={[{ type: 'email' }, { type: 'password' }]} />
</AmplifyAuthenticator>
```

Sign-up 画面から Telephone Number フィールドが非表示になっています。

また、Password と Email Address 項目の表示順がデフォルトから変わっています。

<img src='/images/posts/2021-09-30-5.png' class='img' alt='post image' style='width:50%;' />

## Sign-in 画面から Sign-up リンクを削除する

Cognito コンソールや Amplify adminUI からユーザーを作成し、UI component からはログインのみさせたいユースケースを想定します。

こちらも方法は簡単で、AmplifySignIn コンポーネントに hideSignUp プロパティを追加するだけです。

```ts
import { AmplifyAuthenticator, AmplifySignIn } from '@aws-amplify/ui-react';
```

```ts
<AmplifyAuthenticator>
  <AmplifySignIn slot='sign-in' hideSignUp={true} />
</AmplifyAuthenticator>
```

Sign-in 画面から No account? Create account リンクが非表示になっています。

<img src='/images/posts/2021-09-30-4.png' class='img' alt='post image' style='width:50%;' />

## UI コンポーネントの日本語化

UI コンポーネントを日本語にローカライズする方法です。

src 配下に lib というディレクトリと、 `src/lib/l10n.ts` ファイルを作成し以下を追記します。

こちら各項目を洗い出し、UI コンポーネントのラベル、入力フィールドやボタンの他、エラー文言も日本語対応しました。

```ts
export const L10n = {
  ja: {
    'Sign In': 'サインイン',
    'Sign Up': 'サインアップ',
    'Sign Out': 'サインアウト',
    'Sign in to your account': 'サインイン',
    'Username *': 'ユーザー名 *',
    'Email Address *': 'メールアドレス *',
    'Password *': 'パスワード *',
    'New password': '新しいパスワード *',
    'Confirmation Code': 'セキュリティコード *',
    'Verification code': 'セキュリティコード *',
    'Enter your username': 'ユーザー名を入力',
    'Enter your email address': 'メールアドレスを入力',
    'Enter your password': 'パスワードを入力',
    'Enter your new password': '新しいパスワードを入力',
    'Enter your code': 'コードを入力',
    'Enter code': 'コードを入力',
    'No account?': 'アカウントがありませんか？',
    'Forgot your password?': 'パスワードをお忘れですか？',
    'Reset password': 'パスワードをリセット',
    'Create account': 'アカウントを作成',
    'Forgot Password': 'パスワードを忘れた',
    'Change Password': 'パスワードを変更',
    'New Password': '新しいパスワード',
    'Phone Number': '電話番号',
    'Confirm a Code': 'コードを確認',
    'Confirm Sign In': 'サインインを確認',
    'Confirm Sign up': 'サインアップを確認',
    'Back to Sign In': 'サインインに戻る',
    'Send Code': 'コードを送信',
    'Resend Code': 'コードを再送',
    Email: '登録メールアドレスにセキリティコードを送信する',
    Confirm: '確認',
    Submit: '送信',
    Change: '変更',
    Skip: 'スキップ',
    Verify: 'コードを送信',
    'Verify Contact': '連絡先を検証',
    'Lost your code?': 'コードがありませんか？',
    'Invalid phone number format':
      '不正な電話番号フォーマットです。 電話番号は次のフォーマットで入力してください: +819012345678',
    'Create Account': 'アカウントを作成',
    'Have an account?': 'アカウントをお持ちですか？',
    'Sign in': 'サインイン',
    'Create a new account': '新しいアカウントを作成',
    'Reset your password': 'パスワードをリセット',
    'User does not exist.': 'アカウントが存在しません',
    'Incorrect username or password.': 'メールアドレスまたはパスワードが違います',
    'User is not confirmed.': 'セキュリティコードによるアカウント認証がされていません',
    'User already exists': 'アカウントは既に存在します',
    'Invalid verification code provided, please try again.':
      '入力されたセキュリティコードが無効です。もう一度お試しください',
    'Invalid password format': 'パスワードのフォーマットが不正です',
    'Account recovery requires verified contact information':
      '本人確認のためメールに記載されたセキリティコードを入力してください',
    'An account with the given email already exists.': 'そのメールアドレスは既に存在します',
    'Username cannot be empty': 'メールアドレスは必須です',
    'Password cannot be empty': 'パスワードは必須です',
    'Phone number cannot be empty': '携帯電話番号は必須です',
    'Confirmation code cannot be empty': 'セキュリティコードは必須です',
    'Password attempts exceeded': 'パスワード試行回数が超過しました',
    'Attempt limit exceeded, please try after some time.':
      '試行制限を超過しました。しばらくしてからもう一度お試しください',
    'Username/client id combination not found.': 'アカウントが存在しません',
    'CUSTOM_AUTH is not enabled for the client.': 'パスワードは必須です',
    'Invalid email address format.': 'メールアドレスの形式が正しくありません',
    'Invalid phone number format.': '携帯電話番号の形式が正しくありません',
    'Password did not conform with policy: Password not long enough':
      'パスワードは8文字以上を入力してください (8文字以上の大文字小文字を含む英数字)',
    'Password does not conform to policy: Password not long enough':
      'パスワードは8文字以上を入力してください (8文字以上の大文字小文字を含む英数字)',
    'Password did not conform with policy: Password must have uppercase characters':
      'パスワードには大文字を含めてください (8文字以上の大文字小文字を含む英数字)',
    'Password does not conform to policy: Password must have uppercase characters':
      'パスワードには大文字を含めてください (8文字以上の大文字小文字を含む英数字)',
    'Password did not conform with policy: Password must have lowercase characters':
      'パスワードには小文字を含めてください (8文字以上の大文字小文字を含む英数字)',
    'Password does not conform to policy: Password must have lowercase characters':
      'パスワードには小文字を含めてください (8文字以上の大文字小文字を含む英数字)',
    'Password did not conform with policy: Password must have numeric characters':
      'パスワードには数字を含めてください (8文字以上の大文字小文字を含む英数字)',
    'Password does not conform to policy: Password must have numeric characters':
      'パスワードには数字を含めてください (8文字以上の大文字小文字を含む英数字)',
    'Password does not conform to policy: Password must have symbol characters':
      'パスワードには記号を含めてください (8文字以上の大文字小文字を含む英数字記号)',
    "1 validation error detected: Value at 'password' failed to satisfy constraint: Member must have length greater than or equal to 6":
      'パスワードは8文字以上、大文字小文字を含む英数字を指定してください',
    "2 validation errors detected: Value at 'password' failed to satisfy constraint: Member must have length greater than or equal to 6; Value at 'password' failed to satisfy constraint: Member must satisfy regular expression pattern: ^[\\S]+.*[\\S]+$":
      'パスワードは8文字以上、大文字小文字を含む英数字を指定してください',
    'Invalid session for the user, session is expired.': 'パスワード変更期間を超過しています',
    'Cannot reset password for the user as there is no registered/verified email or phone_number':
      'セキュリティコードによるアカウント認証がされていないためパスワードを再設定できません',
    'User is disabled.': '無効なアカウントです', // アカウントをcognitoコンソール上で無効
    'User is already confirmed.': 'アカウントは既に存在します', // セキュリティコード承認後のアカウントに対してセキュリティコード送信をすると発生
    'Incorrect current password.': '現在のパスワードが違います', // 独自error文言。useChangePassword hooks内で'Incorrect username or password.'を変換
    'not authenticated': 'アカウントが認証されていません', // 未認証時のcurrentAuthenticatedUser実行で発生
    'User cannot be confirmed. Current status is CONFIRMED': '現在認証済みなのでアカウントの確認は必要ありません', // 認証済みのアカウントでセキュリティコード入力時に発生
    'Internal server error.': 'サーバーエラーが発生しました',
    'User password cannot be reset in the current state.':
      '初回ログインが完了していない為、アカウントのパスワードをリセットすることはできません', // cognitoコンソールからアカウント発行後、初回ログイン時のパスワード設定を行っていない状態でforgotPassword API(パスワード忘れAPI)を実行すると発生
    'Invalid session for the user, session can only be used once.':
      'アカウントのセッションが無効です。セッションは1回しか使用できません。', // cognitoコンソールからアカウント発行後、初回ログイン時の新パスワード設定を連続で複数回行うと発生
  },
};
```

筆者はデフォルトからパスワードポリシーを変更している為、文言もパスワードのバリデーションに合わせた文言にしています。

適宜ご自身の環境に置き換えて文言を設定してください。

次に、作成した l10n をアプリに設定します。

`pages/_app.tsx` に I18n.setLanguage と I18n.putVocabularies の 2 行を追記します。

```ts
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { I18n } from 'aws-amplify';
import { L10n } from '../src/lib/l10n';

I18n.setLanguage('ja'); // Add
I18n.putVocabularies(L10n); // Add

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
export default MyApp;
```

画面をリロードすると日本語化されています。

<img src='/images/posts/2021-09-30-7.png' class='img' alt='post image' style='width:50%;' />

## 画面アクションによって独自処理を入れる

最後に UI コンポーネントのカスタマイズとは関係ありませんが、画面アクションをみて独自処理を入れる方法を紹介します。

onAuthUIStateChange を利用してアクションの状態を判定できます。

例えば、nextAuthState が AuthState.SignedIn、SignedOut で 認証成功時、ログアウト時の判定ができます。

authData は認証成功時に取得できる Cognito のユーザーオブジェクトです。

以下は Sign-in や Sign-up で認証成功時にダッシュボード画面へリダイレクトさせています。

Path.Dashboard は独自で定義した文字列定数ですのでそれぞれの環境に読み替えてください。

```js
useEffect(() => {
  router.prefetch(Path.Dashboard);
  return onAuthUIStateChange((nextAuthState, authData) => {
    if (nextAuthState === AuthState.SignedIn && authData) {
      router.replace(Path.Dashboard);
    }
  });
}, []);
```

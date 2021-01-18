---
title: 'Next.js/TypeScriptのウェブサイトにStatic Formsでサーバレスなお問い合わせフォームを作成する'
date: '2021-01-18'
isPublished: true
metaDescription: 'Next.js/TypeScriptのウェブサイトにStatic Formsでサーバレスなお問い合わせフォームを作成する方法です。お手軽に問い合わせフォームが実装出来るのでぜひお試し下さい。'
tags:
  - 'Next.js'
  - 'TypeScript'
  - 'StaticForms'
---

Next.js/TypeScript のウェブサイトに Static Forms でサーバレスなお問い合わせフォームを作成する方法です。

Static Forms はメール送信をサーバレスで実行してくれるサービスです。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="HTML Forms for you static websites - Static Forms" src="https://hatenablog-parts.com/embed?url=https://www.staticforms.xyz/" frameborder="0" scrolling="no"></iframe>

フォームの情報は Static Forms 側で保持せず、内部的には Amazon SES を利用してメール転送を行っているとのことです。

また、Qualascend 社がスポンサーについており無料で提供出来るとのことです。

個人情報の取り扱いは [Privacy Policy](https://www.staticforms.xyz/privacy) を読んで自己判断でご利用お願いします。

それでは問い合わせフォームを作成していきましょう。

### 環境

- macOS Catalina 10.15.5(19F101)
- VSCode 1.52.1
- Next 10.0.5
- React 16.14.0
- TypeScript 4.0.5
- Node 14.9.0
- yarn 1.22.4

## Next.js プロジェクトの雛形を作成する

今回は筆者が作成したテンプレートを利用します。

```
yarn create next-app --example "https://github.com/kazuma-fujita/next-ts-lint-mui-template" next-static-forms-sample
```

こちらのテンプレートは Next.js/TypeScript/ESLint/Prettier の利用環境があらかじめ用意されています。

## Static Forms AccessKey 環境変数を用意する

プロジェクトルートに `.env.local` ファイルを作成し以下を入力します。

- `.env.local`

```
STATIC_FORMS_ACCESS_KEY=
```

こちらは Static Forms の AccessKey の環境変数で、秘匿情報なので外部に漏れないようにします。

`.env.local` は `create next-app` した時にあらかじめ .gitignore されています。

また `.env.local` は `yarn dev` の development build 時に読み込まれます。

後ほど解説しますが、本番環境はホスティング先で環境変数を設定します。

## 環境変数をクライアントサイドで利用できるようにする

次にプロジェクトルートに `next.config.js` ファイルを作成します。

`.env.*` で設定した環境変数はサーバサイドの Node.js 環境でのみ取得できます。

具体的には `src/pages` 配下で動作するサーバサイド処理の `getStaticProps` function 内や `src/pages/api` 配下のコードで利用できます。

それ以外のコードでも環境変数を使えるようにする為、 `next.config.js` で env 設定をします。

設定内容は以下です。

- next.config.js

```js:next.config.js
module.exports = {
  env: {
    STATIC_FORMS_ACCESS_KEY: process.env.STATIC_FORMS_ACCESS_KEY,
  },
};
```

`.env.*` の値は `process.env.{.envで設定した環境変数キー名}` で取得できます。

`next.config.js` のサーバサイド処理で取得した `.env.*` の値をクライアントサイドに渡しています。

これでどこでも `process.env.*` で環境変数が利用できるようになりました。

## 問い合わせフォームの状態管理をする関数を実装する

問い合わせフォームの画面実装から、状態管理のロジックを分離させる為のカスタム hooks 関数を実装します。

以下の 3 ファイルを作成します。

- `src/interfaces/ContactParams.ts`

```ts:src/interfaces/ContactParams.ts
export interface ContactParams {
  name: string;
  email: string;
  message: string;
}
```

form の値をまとめて保持する為のオブジェクトです。

- `src/state/contact/useFormState.ts`

```ts:src/state/contact/useFormState.ts
export const useFormState = <S>(
  initialState: S
): [S, (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void] => {
  const [contact, setContact] = useState<S>(initialState);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContact({ ...contact, [event.target.name]: event.target.value });
  };

  return [contact, handleChange];
};
```

form の入力値を管理する為のカスタム hooks です。

- `src/state/contact/useSendContactForm.ts`

```ts:src/state/contact/useSendContactForm.ts
const SUBJECT_TITLE = 'お問い合わせ';
const STATIC_FORMS_URL = 'https://api.staticforms.xyz/submit';
const ACCESS_KEY = process.env.STATIC_FORMS_ACCESS_KEY as string;

export const useSendContactForm = (): [string, (postData: ContactParams) => void] => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const sendContactForm = useCallback(async (postData: ContactParams) => {
    const postParams = {
      ...postData,
      subject: SUBJECT_TITLE,
      replyTo: '@', // 送信メールのデフォルト返信先を問い合わせ元のメールアドレスにする
      accessKey: ACCESS_KEY,
    };
    const response = await fetch(STATIC_FORMS_URL, {
      method: 'POST',
      body: JSON.stringify(postParams),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((jsonData) => jsonData as { success: boolean; message: string })
      .catch((e) => {
        console.error('An error occurred', e);
        const error = e as Error;
        return { success: false, message: error.message };
      });
    response.success ? void router.push('contact_success') : setErrorMessage(response.message);
  }, []);
  return [errorMessage, sendContactForm];
};
```

form の値を Static Forms へ post するカスタム hooks です。

Static Forms は `{ success: boolean; message: string }` のレスポンスを返します。

Static Forms からのレスポンスの値 `response.success` が true の場合、問い合わせ完了画面である `contact_success` へ遷移します。

Static Forms からのレスポンスがエラーの場合、`response.message` の値を `setErrorMessage` にセットし form 画面にエラーを表示します。

## 問い合わせフォームを実装する

以下の 2 ファイルを作成します。

- src/pages/index.tsx

```ts:src/pages/index.tsx
const IndexPage: React.FC = () => {
  const [contact, handleChange] = useFormState<ContactParams>({
    name: '',
    email: '',
    message: '',
  });
  const [errorMessage, sendContactForm] = useSendContactForm();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendContactForm(contact);
  };

  return (
    <div>
      <h2>お問い合わせ</h2>
      {errorMessage && <p>{errorMessage}</p>}
      <form method='post' onSubmit={handleSubmit}>
        <div className='field'>
          <label>お名前</label>
          <div>
            <input type='text' placeholder='お名前' name='name' onChange={handleChange} required />
          </div>
        </div>
        <div>
          <label>メールアドレス</label>
          <div>
            <input type='email' placeholder='メールアドレス' name='email' onChange={handleChange} required />
          </div>
        </div>
        <div>
          <label>お問い合わせ内容</label>
          <div>
            <textarea placeholder='Your Message' name='message' onChange={handleChange} required />
          </div>
        </div>
        <button type='submit'>お問い合わせをする</button>
      </form>
    </div>
  );
};

export default IndexPage;
```

問い合わせフォームの画面実装です。

先程作成した `useFormState` hooks でフォームの値を管理しています。

`useSendContactForm` hooks の `sendContactForm` 関数で入力値を Static Forms に送信しています。

`errorMessage` で Static Forms のエラー時にエラー文言を画面表示しています。

- `src/pages/contact_success.tsx`

```ts:src/pages/contact_success.tsx
const ContactSuccessPage: React.FC = () => (
  <div>
    <h2>お問い合わせありがとうございます</h2>
  </div>
);

export default ContactSuccessPage;
```

シンプルなお問い合わせ完了画面です。

以上で一通りの問い合わせフォーム実装は完了です。

次に Static Forms の AccessKey を設定します。

## Static Forms の AccessKey を取得・設定する

<img src='/images/posts/2021-01-18-1.png' class='img' alt='post image' />

まず (Static Forms)[https://www.staticforms.xyz/] にアクセスして `Step 1 - Create Access Key` にお問い合わせメールを受信するメールアドレスを入力してください。

<img src='/images/posts/2021-01-18-2.png' class='img' alt='post image' />

入力したメールアドレス宛に AccessKey が送信されるので控えてください。

先程作成した `.env.local` に AccessKey を追記してください。

```
STATIC_FORMS_ACCESS_KEY={AccessKeyを追記}
```

## ホスティング先の環境変数を設定する

後はホスティング先で環境変数を設定します。

今回は Vercel の設定方法を説明します。

Vercel のコンソールで対象のプロジェクトを開きます。

Settings から Environment Variables 画面を開きます。

<img src='/images/posts/2021-01-18-4.png' class='img' alt='post image' />

Add New の `Which type of Environment Variable do you want to add?` は `Plaintext` を選択します。

`What's its name and value?` の NAME には `STATIC_FORMS_ACCESS_KEY` VALUE に AccessKey を入力します。

`In which Environments would you like to make it available?` には設定する環境を選択します。

環境を複数選択して、共通の環境変数を設定することも可能です。

`Save` ボタンを押して設定完了です。

## 問い合わせメール送信を確認する

全ての準備が完了したので、お問い合わせフォームに値を入力して送信してください。

<img src='/images/posts/2021-01-18-3.png' class='img' alt='post image' />

設定したメールアドレス宛にお問い合わせメールが受信されていることを確認してください。

## 終わりに

メール送信部分を自分で用意するとなると、AWS を利用する場合は Amazon API Gateway/AWS Lambda/Amazon SES などの組み合わせで実装することが多いと思います。

今回、Static Forms を利用してお手軽にお問合せフォームが作成できました。

実装のサンプルコードは Github にあるので参照ください。

<iframe class="hatenablogcard" style="width:100%;height:155px;margin:15px 0;max-width:680px;" title="kazuma-fujita/next-static-forms-sample: Next.js/TypeScript/StaticForms sample code." src="https://hatenablog-parts.com/embed?url=https://github.com/kazuma-fujita/next-static-forms-sample" frameborder="0" scrolling="no"></iframe>

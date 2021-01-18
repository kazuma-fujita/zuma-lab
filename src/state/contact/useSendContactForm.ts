import { useCallback, useState } from 'react';
import { ContactParams } from 'interfaces/ContactParams';
import { useRouter } from 'next/router';

const SUBJECT_TITLE = 'zuma-lab.comへのお問い合わせ';
const STATIC_FORMS_URL = 'https://api.staticforms.xyz/submit';
const ACCESS_KEY = process.env.STATIC_FORMS_ACCESS_KEY;

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
    // static formsからsuccess=trueが返却されれば問い合わせ完了画面へ遷移。falseの場合エラーメッセージ表示
    response.success ? void router.push('contact_success') : setErrorMessage(response.message);
  }, []);
  return [errorMessage, sendContactForm];
};

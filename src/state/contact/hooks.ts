import { useCallback, useState } from 'react';
import { ContactParams } from 'interfaces/ContactParams';
const metaDescription =
  '普段WebやMobileアプリ開発をしているエンジニアが個人開発を通して学んだ技術を発信をするブログです。お問い合わせはこちらからご連絡ください。';

export const useGetContactMetaDescription = (): string => {
  return metaDescription;
};

interface ContactState {
  isSuccess: boolean;
  errorMessage: string;
}

export const useSendContactForm = (): {
  state: ContactState;
  sendContactForm: (postData: ContactParams) => void;
} => {
  const [state, setState] = useState({
    isSuccess: false,
    errorMessage: '',
  });
  const sendContactForm = useCallback(async (postData: ContactParams) => {
    console.log('here1');
    const postParams = {
      ...postData,
      subject: 'zuma-lab.comへのお問い合わせ',
      honeypot: '', // このパラメータ調査
      replyTo: '@', // 送信メールのデフォルト返信先を問い合わせ元のメールアドレスにする
      accessKey: 'cd9e6a1f-06be-4750-a49d-786a215495cb', // .envで管理する,
    };
    // URLはconstで管理
    const response = await fetch('https://api.staticforms.xyz/submit', {
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

    console.log('responseData:', response);
    response.success ? setState({ ...state, isSuccess: true }) : setState({ ...state, errorMessage: response.message });
  }, []);
  return { state, sendContactForm };
};

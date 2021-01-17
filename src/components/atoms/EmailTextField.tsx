import OutlinedTextField from 'components/atoms/OutlinedTextField';
import { TextFieldProps } from 'interfaces/TextFieldProps';
import React from 'react';

const MAX_LENGTH = 256;

const pattern = (data: string) => {
  const FORMAT_ERROR_MESSAGE = 'メールアドレスの形式が正しくありません';
  // 使用可能文字列だけで構成されているかホワイトリストでチェック
  // ローカルパート
  // ^[A-Z0-9!#$%&'*+/=?^_`{|}~.\-\\]+  先頭から、半角英数字記号（!#$%&'*+/=?^_`{|}~.-\ 「-」「\」はエスケープ）1文字以上
  // ドメインパート
  // [A-Z0-9-]+                        半角英数字記号（-）1文字以上
  // (\.[A-Z0-9-]+)+$                  先頭.で、半角英数字記号（-）1文字以上の文字列が1以上
  const reg = /^[A-Z0-9!#$%&'*+/=?^_`{|}~.\-\\]+@[A-Z0-9-]+(\.[A-Z0-9-]+)+$/i;
  if (!reg.test(data)) {
    return FORMAT_ERROR_MESSAGE;
  }
  const localPart = data.split('@')[0];
  const domainParts = [...data.split('@')[1].split('.')].reverse();
  const topLevelDomain = domainParts[0];
  const subDomains = domainParts.slice(1);

  // NGケースををブラックリストでチェック
  // ローカルパートNG1 先頭 「\\」
  if (localPart.startsWith('\\\\')) {
    return FORMAT_ERROR_MESSAGE;
  }
  // ローカルパートNG2 末尾 「\」「\\」
  if (localPart.endsWith('\\') || localPart.endsWith('\\\\')) {
    return FORMAT_ERROR_MESSAGE;
  }
  // ドメインパートNG1 トップレベルドメイン 先頭 半角数字「-」
  const regNgTopLevelDomain = /^[0-9-]+.*$/i;
  if (regNgTopLevelDomain.test(topLevelDomain)) {
    return FORMAT_ERROR_MESSAGE;
  }
  // ドメインパートNG2 サブドメイン 先頭 「-」
  if (subDomains.filter((subDomain: string) => subDomain.startsWith('-')).length) {
    return FORMAT_ERROR_MESSAGE;
  }
  // ドメインパートNG3 サブドメイン 末尾 「-」
  if (subDomains.filter((subDomain: string) => subDomain.endsWith('-')).length) {
    return FORMAT_ERROR_MESSAGE;
  }
  return true;
};

const validate = {
  required: 'メールアドレスを入力してください',
  maxLength: { value: MAX_LENGTH, message: `メールアドレスは${MAX_LENGTH}文字以下で入力してください` },
  validate: pattern,
};

const EmailTextField: React.FC<TextFieldProps> = ({ register, errorMessage, ...rest }) => (
  <OutlinedTextField
    required
    type='email'
    id='email'
    name='email'
    label='メールアドレス'
    autoComplete='email'
    inputRef={register(validate)}
    inputProps={{
      maxLength: MAX_LENGTH,
    }}
    error={Boolean(errorMessage)}
    helperText={errorMessage}
    {...rest}
  />
);

export default EmailTextField;

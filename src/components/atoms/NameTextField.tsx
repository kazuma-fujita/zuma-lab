import OutlinedTextField from 'components/atoms/OutlinedTextField';
import { TextFieldProps } from 'interfaces/TextFieldProps';
import React from 'react';

const MAX_LENGTH = 256;

const validate = (data: string) => {
  const reg = /^[A-Z0-9!#$%&'*+/=?^_`{|}~.\-\\]+@[A-Z0-9-]+(\.[A-Z0-9-]+)+$/i;
  return !reg.test(data) ? 'お名前で使用できない文字が含まれています' : true;
};

const NameTextField: React.FC<TextFieldProps> = ({ register, errorMessage, ...rest }) => (
  <OutlinedTextField
    required
    type='text'
    id='name'
    name='name'
    label='お名前'
    autoComplete='name'
    inputRef={register({
      required: 'お名前を入力してください',
      maxLength: { value: MAX_LENGTH, message: `お名前は${MAX_LENGTH}文字以下で入力してください` },
      validate: validate,
      // pattern: {
      //   value: /^[^!"#$%&'()*+\-.,/:;<=>?@[\\\]^_`{|}~\s\p{Symbol}]+$/u, // 半角記号、空白、数学記号、通貨記号、音声記号、絵文字、機種依存文字を除外
      //   message: 'お名前で使用できない文字が含まれています',
      // },
    })}
    inputProps={{
      maxLength: MAX_LENGTH,
    }}
    error={Boolean(errorMessage)}
    helperText={errorMessage}
    {...rest}
  />
);

export default NameTextField;

import OutlinedTextField from 'components/atoms/OutlinedTextField';
import { TextFieldProps } from 'interfaces/TextFieldProps';
import React from 'react';

const MAX_LENGTH = 256;

const validate = {
  required: 'お名前を入力してください',
  maxLength: { value: MAX_LENGTH, message: `お名前は${MAX_LENGTH}文字以下で入力してください` },
  // pattern: {
  //   value: /^\S+$/i, // 空白文字を除外
  //   message: 'お名前で使用できない文字が含まれています',
  // },
};

const NameTextField: React.FC<TextFieldProps> = ({ register, errorMessage, ...rest }) => (
  <OutlinedTextField
    required
    type='text'
    id='name'
    name='name'
    label='お名前'
    autoComplete='name'
    inputRef={register(validate)}
    inputProps={{
      maxLength: MAX_LENGTH,
    }}
    error={Boolean(errorMessage)}
    helperText={errorMessage}
    {...rest}
  />
);

export default NameTextField;

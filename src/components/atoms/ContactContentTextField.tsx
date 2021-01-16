import OutlinedTextField from 'components/atoms/OutlinedTextField';
import { TextFieldProps } from 'interfaces/TextFieldProps';
import React from 'react';

const MAX_LENGTH = 10000;

// const validate = (data: string) => {
//   const reg = /^[A-Z0-9!#$%&'*+/=?^_`{|}~.\-\\]+@[A-Z0-9-]+(\.[A-Z0-9-]+)+$/i;
//   return !reg.test(data) ? 'お名前で使用できない文字が含まれています' : true;
// };

const ContactContentTextField: React.FC<TextFieldProps> = ({ register, errorMessage, ...rest }) => (
  <OutlinedTextField
    required
    multiline
    rows={12}
    type='text'
    id='content'
    name='content'
    label='お問い合わせ内容'
    inputRef={register({
      required: 'お問い合わせ内容を入力してください',
      maxLength: { value: MAX_LENGTH, message: `お問い合わせ内容は${MAX_LENGTH}文字以下で入力してください` },
    })}
    inputProps={{
      maxLength: MAX_LENGTH,
    }}
    error={Boolean(errorMessage)}
    helperText={errorMessage}
    {...rest}
  />
);

export default ContactContentTextField;

import { BaseTextFieldProps } from '@material-ui/core';
import { FieldElement, FieldValues, Ref, RegisterOptions } from 'react-hook-form';

export interface TextFieldProps extends BaseTextFieldProps {
  register<TFieldElement extends FieldElement<FieldValues>>(
    rules?: RegisterOptions
  ): (ref: (TFieldElement & Ref) | null) => void;
  errorMessage?: string;
}

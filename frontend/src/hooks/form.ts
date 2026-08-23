import { createFormHook } from '@tanstack/react-form';
import { fieldContext, formContext } from './form-context';
import TextField from '../components/Inputs/TextField';
import NumberField from '../components/Inputs/NumberField';
import DateField from '../components/Inputs/DateField';
import SelectField from '../components/Inputs/SelectField';
import TextareaField from '../components/Inputs/TextareaField';
import ComboboxField from '../components/Inputs/ComboboxField';
import FileField from '../components/Inputs/FileField';
import TagNotesField from '../components/Inputs/TagNotesField';
import SubmitButton from '../components/ui/SubmitButton';

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    TextField,
    NumberField,
    DateField,
    SelectField,
    TextareaField,
    ComboboxField,
    FileField,
    TagNotesField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});

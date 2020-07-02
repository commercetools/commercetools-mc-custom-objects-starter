import { defineMessages } from 'react-intl';

export default defineMessages({
  editSuccess: {
    id: 'EditCustomObject.form.message.edit.success',
    description: 'Success message for editing custom object',
    defaultMessage: 'Your custom object has been saved.',
  },
  editError: {
    id: 'EditCustomObject.form.message.edit.error',
    description: 'Error message for editing custom object',
    defaultMessage:
      'Something went wrong. Your custom object was not saved. {message}',
  },
});

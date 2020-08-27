import { defineMessages } from 'react-intl';

export default defineMessages({
  editSuccess: {
    id: 'EditContainer.form.message.edit.success',
    description: 'Success message for editing container',
    defaultMessage: 'Your container has been saved.',
  },
  editError: {
    id: 'EditContainer.form.message.edit.error',
    description: 'Error message for editing container',
    defaultMessage:
      'Something went wrong. Your container was not saved. {message}',
  },
});

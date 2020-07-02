import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'CreateContainer.title',
    description: 'The page title of create container',
    defaultMessage: 'Create a container',
  },
  backButton: {
    id: 'CreateContainer.button.back',
    description: 'Label for back button',
    defaultMessage: 'To containers list',
  },
  createSuccess: {
    id: 'CreateContainer.form.message.success',
    description: 'Success message for create container',
    defaultMessage: 'Your container has been created.',
  },
  createError: {
    id: 'CreateContainer.message.create.error',
    description: 'Error message for creating container',
    defaultMessage:
      'Something went wrong. The container was not created. {message}',
  },
});

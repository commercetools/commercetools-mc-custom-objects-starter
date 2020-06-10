import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'ContainerList.title',
    description: 'The page title of the container list view',
    defaultMessage: 'Container Manager'
  },
  titleResults: {
    id: 'ContainerList.title.results',
    description: 'Custom object title result total',
    defaultMessage: '{total} results'
  },
  createContainer: {
    id: 'ContainerList.button.createContainer',
    description: 'Label for the button to create an container',
    defaultMessage: 'Create container'
  },
  errorLoading: {
    id: 'ContainerList.error.loading',
    description: 'Error title when querying for containers fails',
    defaultMessage: 'Something went wrong loading the containers.'
  },
  errorNoResults: {
    id: 'ContainerList.error.noResults',
    description: 'Error title when no results are returned',
    defaultMessage: 'No containers found on this project.'
  }
});

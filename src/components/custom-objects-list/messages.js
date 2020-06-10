import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'CustomObjectList.title',
    description: 'The page title of the custom object list view',
    defaultMessage: 'Custom Object Manager'
  },
  titleResults: {
    id: 'CustomObjectList.title.results',
    description: 'Custom object title result total',
    defaultMessage: '{total} results'
  },
  container: {
    id: 'CustomObjectList.filter.container',
    description: 'The label for the container input',
    defaultMessage: 'Container'
  },
  filter: {
    id: 'CustomObjectList.filter.label',
    description: 'Label for filter',
    defaultMessage: 'Filter'
  },
  clear: {
    id: 'CustomObjectList.clear.label',
    description: 'Label for clear',
    defaultMessage: 'Clear'
  },
  errorLoading: {
    id: 'CustomObjectList.error.loading',
    description: 'Error title when querying for custom objects fails',
    defaultMessage: 'Something went wrong loading the custom objects.'
  },
  errorNoResults: {
    id: 'CustomObjectList.error.noResults',
    description: 'Error title when no results are returned',
    defaultMessage:
      'No custom objects with selected container found on this project.'
  },
  containerColumn: {
    id: 'CustomObjectList.column.container',
    description: 'The label for the container column',
    defaultMessage: 'Container'
  },
  keyColumn: {
    id: 'CustomObjectList.column.key',
    description: 'The label for the key column',
    defaultMessage: 'Key'
  },
  valueColumn: {
    id: 'CustomObjectList.column.value',
    description: 'The label for the value column',
    defaultMessage: 'Value'
  },
  lastModifiedAtColumn: {
    id: 'CustomObjectList.column.lastModified',
    description: 'The label for the last modified at column',
    defaultMessage: 'Last Modified'
  }
});

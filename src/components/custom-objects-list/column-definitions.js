import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

export const COLUMN_KEYS = {
  CONTAINER: 'container',
  KEY: 'key',
  VALUE: 'value',
  MODIFIED: 'lastModifiedAt'
};

export const columnDefinitions = [
  {
    key: COLUMN_KEYS.CONTAINER,
    isSortable: true,
    label: <FormattedMessage {...messages.containerColumn} />
  },
  {
    key: COLUMN_KEYS.KEY,
    isSortable: true,
    flexGrow: 1,
    label: <FormattedMessage {...messages.keyColumn} />
  },
  {
    key: COLUMN_KEYS.VALUE,
    flexGrow: 1,
    label: <FormattedMessage {...messages.valueColumn} />
  },
  {
    key: COLUMN_KEYS.MODIFIED,
    isSortable: true,
    flexGrow: 1,
    label: <FormattedMessage {...messages.lastModifiedAtColumn} />
  }
];

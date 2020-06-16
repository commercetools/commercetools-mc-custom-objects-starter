import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedDate, FormattedMessage, useIntl } from 'react-intl';
import { useQuery } from '@apollo/react-hooks';
import isObject from 'lodash/isObject';
import map from 'lodash/map';
import startCase from 'lodash/startCase';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import {
  FlatButton,
  SecondaryButton,
  SecondaryIconButton
} from '@commercetools-uikit/buttons';
import Card from '@commercetools-uikit/card';
import {
  CloseIcon,
  PlusBoldIcon,
  SearchIcon
} from '@commercetools-uikit/icons';
import { TextInput } from '@commercetools-uikit/inputs';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { PaginatedTable } from '@custom-applications-local/core/components';
import { SORT_OPTIONS } from '@custom-applications-local/core/constants';
import GetCustomObjects from '../get-custom-objects.rest.graphql';
import { DATE_FORMAT, DEFAULT_VARIABLES } from './constants';
import { columnDefinitions, COLUMN_KEYS } from './column-definitions';
import messages from './messages';
import styles from './custom-objects-list.mod.css';

export const ENTER = 'Enter';

const CustomObjectsList = ({ match }) => {
  const intl = useIntl();
  const [measurementCache, setMeasurementCache] = useState(null);
  const [container, setContainer] = useState('');
  const [sort, setSort] = useState(COLUMN_KEYS.MODIFIED);
  const [direction, setDirection] = useState(SORT_OPTIONS.DESC);
  const [variables, setVariables] = useState({
    ...DEFAULT_VARIABLES,
    sort: `${sort} ${direction}`
  });
  const { data, error } = useQuery(GetCustomObjects, {
    variables
  });

  function renderItem(results, { rowIndex, columnKey }) {
    const customObject = results[rowIndex];
    const { CONTAINER, KEY, VALUE, MODIFIED } = COLUMN_KEYS;

    switch (columnKey) {
      case CONTAINER:
        return customObject.container;
      case KEY:
        return customObject.key;
      case VALUE: {
        const { value } = customObject;
        return isObject(value) ? (
          <>
            {map(value, (val, key) => (
              <div key={key}>
                <Text.Body isBold as="span">
                  {startCase(key)}:
                </Text.Body>
                &nbsp;
                {isObject(val) ? JSON.stringify(val) : val.toString()}
              </div>
            ))}
          </>
        ) : (
          value.toString()
        );
      }
      case MODIFIED:
        return (
          <FormattedDate
            value={new Date(customObject.lastModifiedAt)}
            {...DATE_FORMAT}
          />
        );
      default:
        return NO_VALUE_FALLBACK;
    }
  }

  function clearMeasurementCache() {
    if (measurementCache) {
      measurementCache.clearAll();
    }
  }

  function getCustomObjects(updates) {
    clearMeasurementCache();
    setVariables({ ...variables, ...updates });
  }

  function next() {
    const offset = variables.offset + variables.limit;
    getCustomObjects({ offset });
  }

  function previous() {
    const offset = variables.offset - variables.limit;
    getCustomObjects({ offset });
  }

  function handleSortChange(column, sortDirection) {
    setSort(column);
    setDirection(sortDirection);
    getCustomObjects({
      sort: `${column} ${sortDirection}`,
      ...DEFAULT_VARIABLES
    });
  }

  function clearContainerFilter() {
    const { where, ...rest } = variables;
    clearMeasurementCache();
    setContainer('');
    setVariables(rest);
  }

  function filterByContainer() {
    return container
      ? getCustomObjects({
          where: `container="${container}"`
        })
      : clearContainerFilter();
  }

  const { customObjects } = data || {};
  const { results, count, total, offset } = customObjects || {};

  return (
    <Spacings.Inset scale="m">
      <div className={styles.stack}>
        <Spacings.Inline
          scale="m"
          alignItems="center"
          justifyContent="space-between"
        >
          <Spacings.Inline alignItems="baseline" scale="m">
            <Text.Headline
              as="h2"
              data-testid="title"
              intlMessage={messages.title}
            />
            {!!total && (
              <Text.Body tone="secondary" data-testid="subtitle">
                <FormattedMessage
                  {...messages.titleResults}
                  values={{ total }}
                />
              </Text.Body>
            )}
          </Spacings.Inline>
          <SecondaryButton
            iconLeft={<PlusBoldIcon />}
            as="a"
            href={`${match.url}/new`}
            label={intl.formatMessage(messages.createCustomObject)}
          />
        </Spacings.Inline>
        <Card theme="dark" type="flat">
          <Spacings.Inline scale="m" alignItems="center">
            <Text.Body intlMessage={messages.container} />
            <div
              data-testid="container-filter"
              className={styles.iconInput}
              onKeyPress={event =>
                event.key === ENTER ? filterByContainer() : null
              }
            >
              <TextInput
                data-testid="container-filter-input"
                onChange={event => setContainer(event.target.value)}
                value={container}
              />
              <div className={styles.icon}>
                <SecondaryIconButton
                  data-testid="container-filter-search"
                  label={intl.formatMessage(messages.filter)}
                  icon={<SearchIcon />}
                  onClick={filterByContainer}
                />
              </div>
            </div>
            {container && (
              <FlatButton
                data-testid="container-filter-clear"
                label={intl.formatMessage(messages.clear)}
                icon={<CloseIcon size="small" />}
                onClick={clearContainerFilter}
              />
            )}
          </Spacings.Inline>
        </Card>
        {error && (
          <Text.Body
            data-testid="loading-error"
            intlMessage={messages.errorLoading}
          />
        )}
        {count > 0 ? (
          <PaginatedTable
            columns={columnDefinitions}
            items={results}
            itemRenderer={item => renderItem(results, item)}
            registerMeasurementCache={setMeasurementCache}
            rowCount={count}
            total={total}
            offset={offset}
            sortBy={sort}
            sortDirection={direction}
            onSortChange={handleSortChange}
            next={next}
            previous={previous}
          />
        ) : (
          data && (
            <Text.Body
              data-testid="no-results-error"
              intlMessage={messages.errorNoResults}
            />
          )
        )}
      </div>
    </Spacings.Inset>
  );
};
CustomObjectsList.displayName = 'CustomObjectsList';
CustomObjectsList.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired
  }).isRequired
};

export default CustomObjectsList;

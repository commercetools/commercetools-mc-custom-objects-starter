import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedDate, FormattedMessage, useIntl } from 'react-intl';
import { useQuery } from '@apollo/react-hooks';
import camelCase from 'lodash/camelCase';
import find from 'lodash/find';
import includes from 'lodash/includes';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isPlainObject from 'lodash/isPlainObject';
import isString from 'lodash/isString';
import map from 'lodash/map';
import omit from 'lodash/omit';
import reduce from 'lodash/reduce';
import startCase from 'lodash/startCase';
import values from 'lodash/values';
import { stringify } from 'qs';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import { LinkButton, SecondaryButton } from '@commercetools-uikit/buttons';
import Card from '@commercetools-uikit/card';
import Constraints from '@commercetools-uikit/constraints';
import { PlusBoldIcon } from '@commercetools-uikit/icons';
import { SelectInput } from '@commercetools-uikit/inputs';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { PaginatedTable } from '@commercetools-us-ps/mc-app-core/components';
import { SORT_OPTIONS } from '@commercetools-us-ps/mc-app-core/constants';
import { useContainerContext } from '../../context';
import GetCustomObjects from './get-custom-objects.rest.graphql';
import { DATE_FORMAT, DATE_TIME_FORMAT, DEFAULT_VARIABLES } from './constants';
import { columnDefinitions, COLUMN_KEYS } from './column-definitions';
import messages from './messages';
import styles from './custom-objects-list.mod.css';
import TextFilter from './text-filter';

const CustomObjectsList = ({ match, history }) => {
  const intl = useIntl();
  const { hasContainers, containers, where } = useContainerContext();
  const [measurementCache, setMeasurementCache] = useState(null);
  const [container, setContainer] = useState('');
  const [key, setKey] = useState('');
  const [filters, setFilters] = useState({ where });
  const [sort, setSort] = useState(COLUMN_KEYS.MODIFIED);
  const [direction, setDirection] = useState(SORT_OPTIONS.DESC);
  const [variables, setVariables] = useState({
    ...DEFAULT_VARIABLES,
    sort: `${sort} ${direction}`,
    where,
  });
  const [queryString, setQueryString] = useState(stringify(variables));
  const { data, error } = useQuery(GetCustomObjects, {
    variables: { queryString },
    skip: !hasContainers,
  });

  React.useEffect(() => {
    setQueryString(stringify(variables, { arrayFormat: 'repeat' }));
  }, [variables]);

  function renderValue(value) {
    if (isPlainObject(value)) {
      return (
        <div data-testid="object-value" className={`${styles.nested}`}>
          {renderObject(value)}
        </div>
      );
    }

    if (isArray(value)) {
      return (
        <div className={styles.nested}>
          {map(value, (val, index) => (
            <div
              data-testid="list-value"
              className={styles.listItem}
              key={index}
            >
              {renderValue(val)}
            </div>
          ))}
        </div>
      );
    }

    const dateRegex = /\d{4}-\d{2}-\d{2}/;
    if (isString(value) && value.match(dateRegex)) {
      const format = includes(value, 'T') ? DATE_TIME_FORMAT : DATE_FORMAT;
      return <FormattedDate value={value} {...format} />;
    }

    return value.toString();
  }

  function renderObject(value) {
    return map(value, (val, valKey) => (
      <div key={valKey} className={styles.item}>
        <Text.Body data-testid="value-title" isBold as="span">
          {startCase(valKey)}:
        </Text.Body>
        &nbsp;
        {renderValue(val)}
      </div>
    ));
  }

  function getDisplayAttributes(attributes) {
    return reduce(
      attributes,
      (display, attribute) => {
        if (attribute.display) {
          display.push(camelCase(attribute.name));
        }

        if (attribute.attributes) {
          const nested = getDisplayAttributes(attribute.attributes);
          display.push(...nested);
        }

        return display;
      },
      []
    );
  }

  function getDisplayValues(value, attributes) {
    return reduce(
      value,
      (display, val, valKey) => {
        if (includes(attributes, valKey)) {
          return { ...display, [valKey]: val };
        }
        if (isPlainObject(val)) {
          const nested = getDisplayValues(val, attributes);
          if (!isEmpty(nested)) {
            return { ...display, [valKey]: nested };
          }
        }
        return display;
      },
      {}
    );
  }

  function renderItem(results, { rowIndex, columnKey }) {
    const customObject = results[rowIndex];
    const { CONTAINER, KEY, VALUE, MODIFIED } = COLUMN_KEYS;

    switch (columnKey) {
      case CONTAINER:
        return customObject.container;
      case KEY:
        return customObject.key;
      case VALUE: {
        const customObjectContainer = find(containers, {
          key: customObject.container,
        });
        const displayAttributes = getDisplayAttributes(
          customObjectContainer.value.attributes
        );
        const value = getDisplayValues(customObject.value, displayAttributes);
        return (
          <div className={styles.value} data-testid="custom-object-value">
            {renderObject(isEmpty(value) ? customObject.value : value)}
          </div>
        );
      }
      case MODIFIED:
        return (
          <FormattedDate
            value={new Date(customObject.lastModifiedAt)}
            {...DATE_TIME_FORMAT}
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
    setTimeout(() => clearMeasurementCache());
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
      ...DEFAULT_VARIABLES,
    });
  }

  function filter(type, value) {
    const newFilters = value
      ? { ...filters, [type]: `${type}="${value}"` }
      : omit(filters, type);
    setFilters(newFilters);
    getCustomObjects({
      where: values(newFilters),
    });
  }

  function filterByContainer(event) {
    const { value } = event.target;
    setContainer(value);
    filter('container', value);
  }

  function handleRowClick(id) {
    history.push(`${match.url}/${id}/general`);
  }

  const { customObjects } = data || {};
  const { results, count, total, offset } = customObjects || {};

  const containerOptions = map(containers, ({ key: containerKey }) => ({
    label: containerKey,
    value: containerKey,
  }));

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
          {hasContainers && (
            <SecondaryButton
              data-testid="create-custom-object"
              iconLeft={<PlusBoldIcon />}
              as="a"
              href={`${match.url}/new`}
              label={intl.formatMessage(messages.createCustomObject)}
            />
          )}
        </Spacings.Inline>
        {hasContainers && (
          <Card theme="dark" type="flat">
            <Spacings.Inline scale="m" alignItems="center">
              <Text.Body intlMessage={messages.filter} />
              <Constraints.Horizontal constraint="m">
                <SelectInput
                  data-testid="container-filter"
                  name="container"
                  placeholder={intl.formatMessage(messages.container)}
                  isClearable
                  value={container}
                  options={containerOptions}
                  onChange={filterByContainer}
                />
              </Constraints.Horizontal>
              <Constraints.Horizontal constraint="m">
                <TextFilter
                  data-testid="key-filter"
                  placeholder={intl.formatMessage(messages.key)}
                  value={key}
                  onChange={setKey}
                  onSubmit={(value) => filter('key', value)}
                  isCondensed
                />
              </Constraints.Horizontal>
            </Spacings.Inline>
          </Card>
        )}
        {!hasContainers && (
          <Spacings.Inline scale="xs" data-testid="no-containers-error">
            <Text.Body
              data-testid="loading-error"
              intlMessage={messages.errorNoContainers}
            />
            <LinkButton
              to={`${match.url}/containers/new`}
              label={intl.formatMessage(messages.errorCreateContainerLink)}
            />
          </Spacings.Inline>
        )}
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
            itemRenderer={(item) => renderItem(results, item)}
            registerMeasurementCache={setMeasurementCache}
            rowCount={count}
            total={total}
            offset={offset}
            sortBy={sort}
            sortDirection={direction}
            onSortChange={handleSortChange}
            next={next}
            previous={previous}
            onRowClick={(event, rowIndex) =>
              handleRowClick(results[rowIndex].id)
            }
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
    url: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default CustomObjectsList;

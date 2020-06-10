import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { FormattedMessage, useIntl } from 'react-intl';
import { SecondaryButton } from '@commercetools-uikit/buttons';
import Card from '@commercetools-uikit/card';
import Constraints from '@commercetools-uikit/constraints';
import { customProperties } from '@commercetools-uikit/design-system';
import { PlusBoldIcon } from '@commercetools-uikit/icons';
import { SelectInput } from '@commercetools-uikit/inputs';
import Grid from '@commercetools-uikit/grid';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import {
  Pagination,
  TabContainer,
  View,
  ViewHeader
} from '@custom-applications-local/core/components';
import { SORT_OPTIONS } from '@custom-applications-local/core/constants';
import GetContainers from '../get-custom-objects.rest.graphql';
import { DEFAULT_VARIABLES, FIELDS } from './constants';
import messages from './messages';

const sortOptions = [
  {
    label: <FormattedMessage {...messages.newestFirstLabel} />,
    value: `${FIELDS.CREATED} ${SORT_OPTIONS.DESC}`
  },
  {
    label: <FormattedMessage {...messages.oldestFirstLabel} />,
    value: `${FIELDS.CREATED} ${SORT_OPTIONS.ASC}`
  },
  {
    label: <FormattedMessage {...messages.lastModifiedLabel} />,
    value: `${FIELDS.LAST_MODIFIED} ${SORT_OPTIONS.DESC}`
  },
  {
    label: <FormattedMessage {...messages.alphabeticalAscLabel} />,
    value: `${FIELDS.KEY} ${SORT_OPTIONS.ASC}`
  },
  {
    label: <FormattedMessage {...messages.alphabeticalDescLabel} />,
    value: `${FIELDS.KEY} ${SORT_OPTIONS.DESC}`
  }
];

const ContainerList = ({ match }) => {
  const intl = useIntl();
  const [sort, setSort] = useState(`${FIELDS.KEY} ${SORT_OPTIONS.ASC}`);
  const [variables, setVariables] = useState({
    ...DEFAULT_VARIABLES,
    sort
  });

  const { data, error } = useQuery(GetContainers, {
    variables
  });

  function handleSortChange(event) {
    const { value } = event.target;
    setSort(value);
    setVariables({
      ...DEFAULT_VARIABLES,
      sort: value
    });
  }

  function next() {
    const offset = variables.offset + variables.limit;
    setVariables({ ...variables, offset });
  }

  function previous() {
    const offset = variables.offset - variables.limit;
    setVariables({ ...variables, offset });
  }

  const { customObjects } = data || {};
  const { results, count, total, offset } = customObjects || {};

  return (
    <View>
      <ViewHeader
        color="surface"
        title={
          <Spacings.Inset scale="s">
            <Spacings.Inline alignItems="baseline" scale="m">
              <span>
                <FormattedMessage {...messages.title} />
              </span>
              {!!total && (
                <Text.Body tone="secondary" data-testid="total-results">
                  <FormattedMessage
                    values={{ total }}
                    {...messages.titleResults}
                  />
                </Text.Body>
              )}
            </Spacings.Inline>
          </Spacings.Inset>
        }
        commands={
          <Spacings.Inset scale="m">
            <SecondaryButton
              iconLeft={<PlusBoldIcon />}
              as="a"
              href={`${match.url}/new`}
              label={intl.formatMessage(messages.createContainer)}
            />
          </Spacings.Inset>
        }
      />
      <TabContainer color="neutral">
        {error && (
          <Text.Body
            data-testid="loading-error"
            intlMessage={messages.errorLoading}
          />
        )}
        {count > 0 ? (
          <Spacings.Stack scale="l">
            <Spacings.Inline justifyContent="flex-end">
              <Constraints.Horizontal constraint="m">
                <SelectInput
                  value={sort}
                  onChange={handleSortChange}
                  options={sortOptions}
                />
              </Constraints.Horizontal>
            </Spacings.Inline>
            <Grid
              gridGap={customProperties.spacingM}
              gridAutoColumns="1fr"
              gridTemplateColumns={`repeat(auto-fill, minmax(${customProperties.constraintM}, 1fr))`}
            >
              {results.map(({ id, key, value }) => (
                <Link key={id} to={`${match.url}/${id}/general`}>
                  <Card>
                    <Spacings.Inline>
                      <Text.Body data-testid="container-key" truncate={true}>
                        {key}
                      </Text.Body>
                      <Text.Body>
                        <FormattedMessage
                          data-testid="container-attributes"
                          values={{
                            total: value.attributes.length
                          }}
                          {...messages.attributesLabel}
                        />
                      </Text.Body>
                    </Spacings.Inline>
                  </Card>
                </Link>
              ))}
            </Grid>
            <Pagination
              rowCount={count}
              offset={offset}
              total={total}
              previous={previous}
              next={next}
            />
          </Spacings.Stack>
        ) : (
          data && (
            <Text.Body
              data-testid="no-results-error"
              intlMessage={messages.errorNoResults}
            />
          )
        )}
      </TabContainer>
    </View>
  );
};
ContainerList.displayName = 'ContainerList';
ContainerList.propTypes = {
  match: PropTypes.shape({ url: PropTypes.string.isRequired }).isRequired
};

export default ContainerList;

import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router';
import { useQuery } from '@apollo/react-hooks';
import { FormattedMessage, useIntl } from 'react-intl';
import Text from '@commercetools-uikit/text';
import {
  BackToList,
  TabContainer,
  TabHeader,
  View,
  ViewHeader
} from '@custom-applications-local/core/components';
import { ROOT_PATH } from '../../constants';
import EditContainer from '../edit-container';
import GetContainer from '../get-custom-object.rest.graphql';
import messages from './messages';

const ContainerDetails = ({ match }) => {
  const mainRoute = `/${match.params.projectKey}/${ROOT_PATH}/containers`;
  const intl = useIntl();

  const { data, error, refetch } = useQuery(GetContainer, {
    variables: {
      id: match.params.id
    }
  });

  const { customObject } = data || {};
  const { key } = customObject || {};

  return (
    <View>
      <ViewHeader
        title={key || ''}
        backToList={
          <BackToList
            href={mainRoute}
            label={intl.formatMessage(messages.backButton)}
          />
        }
      >
        <TabHeader
          to={`${mainRoute}/${match.params.id}/general`}
          key={intl.formatMessage(messages.generalTab)}
          name={intl.formatMessage(messages.generalTab)}
        >
          <FormattedMessage {...messages.generalTab} />
        </TabHeader>
      </ViewHeader>
      <TabContainer>
        {error && (
          <Text.Body
            data-testid="loading-error"
            intlMessage={messages.errorLoading}
          />
        )}
        {data && (
          <Switch>
            <Route
              exact
              path={`${match.url}/general`}
              render={() => (
                <EditContainer container={customObject} onComplete={refetch} />
              )}
            />
          </Switch>
        )}
      </TabContainer>
    </View>
  );
};
ContainerDetails.displayName = 'ContainerDetails';
ContainerDetails.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
      projectKey: PropTypes.string.isRequired
    }).isRequired,
    url: PropTypes.string.isRequired
  }).isRequired
};

export default ContainerDetails;

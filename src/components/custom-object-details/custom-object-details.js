import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { FormattedMessage, useIntl } from 'react-intl';
import { ConfirmationDialog } from '@commercetools-frontend/application-components';
import { NOTIFICATION_KINDS_SIDE } from '@commercetools-frontend/constants';
import { IconButton } from '@commercetools-uikit/buttons';
import { BinLinearIcon } from '@commercetools-uikit/icons';
import Text from '@commercetools-uikit/text';
import {
  BackToList,
  TabContainer,
  TabHeader,
  View,
  ViewHeader,
} from '@custom-applications-local/core/components';
import { useShowSideNotification } from '@custom-applications-local/core/hooks';
import { ROOT_PATH } from '../../constants';
import EditCustomObject from '../edit-custom-object';
import GetCustomObject from '../get-custom-object.rest.graphql';
import DeleteCustomObject from '../delete-custom-object.rest.graphql';
import messages from './messages';
import styles from './custom-object-details.mod.css';

const CustomObjectDetails = ({ match, history }) => {
  const mainRoute = `/${match.params.projectKey}/${ROOT_PATH}`;
  const intl = useIntl();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const showSuccessNotification = useShowSideNotification(
    NOTIFICATION_KINDS_SIDE.success,
    messages.deleteSuccess
  );
  const showErrorNotification = useShowSideNotification(
    NOTIFICATION_KINDS_SIDE.error,
    messages.deleteError
  );

  const { data, error, refetch } = useQuery(GetCustomObject, {
    variables: {
      id: match.params.id,
    },
  });
  const [deleteCustomObject] = useMutation(DeleteCustomObject, {
    variables: {
      id: match.params.id,
    },
    onCompleted() {
      showSuccessNotification();
      history.push(mainRoute);
    },
    onError() {
      showErrorNotification();
    },
  });

  const { customObject } = data || {};
  const { key, version } = customObject || {};

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
        commands={
          <div className={styles.deleteCustomObject}>
            <IconButton
              label={intl.formatMessage(messages.deleteCustomObject)}
              icon={<BinLinearIcon />}
              onClick={() => setConfirmingDelete(true)}
            />
            <ConfirmationDialog
              title={intl.formatMessage(messages.deleteCustomObject)}
              isOpen={confirmingDelete}
              onClose={() => setConfirmingDelete(false)}
              onCancel={() => setConfirmingDelete(false)}
              onConfirm={() => deleteCustomObject({ variables: { version } })}
            >
              <Text.Body
                intlMessage={messages.deleteCustomObjectConfirmation}
              />
            </ConfirmationDialog>
          </div>
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
                <EditCustomObject
                  customObject={customObject}
                  onComplete={refetch}
                />
              )}
            />
          </Switch>
        )}
      </TabContainer>
    </View>
  );
};
CustomObjectDetails.displayName = 'ContainerDetails';
CustomObjectDetails.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
      projectKey: PropTypes.string.isRequired,
    }).isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default CustomObjectDetails;

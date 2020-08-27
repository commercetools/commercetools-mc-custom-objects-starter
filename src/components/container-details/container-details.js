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
} from '@commercetools-us-ps/mc-app-core/components';
import { useShowSideNotification } from '@commercetools-us-ps/mc-app-core/hooks';
import { ROOT_PATH } from '../../constants';
import EditContainer from '../edit-container';
import GetContainer from '../get-custom-object.rest.graphql';
import DeleteContainer from '../delete-custom-object.rest.graphql';
import messages from './messages';
import styles from './container-details.mod.css';

const ContainerDetails = ({ match, history }) => {
  const mainRoute = `/${match.params.projectKey}/${ROOT_PATH}/containers`;
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

  const { data, error, refetch } = useQuery(GetContainer, {
    variables: {
      id: match.params.id,
    },
  });
  const [deleteContainer] = useMutation(DeleteContainer, {
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
          <div className={styles.deleteContainer}>
            <IconButton
              label={intl.formatMessage(messages.deleteContainer)}
              icon={<BinLinearIcon />}
              onClick={() => setConfirmingDelete(true)}
            />
            <ConfirmationDialog
              title={intl.formatMessage(messages.deleteContainer)}
              isOpen={confirmingDelete}
              onClose={() => setConfirmingDelete(false)}
              onCancel={() => setConfirmingDelete(false)}
              onConfirm={() => deleteContainer({ variables: { version } })}
            >
              <Text.Body intlMessage={messages.deleteContainerConfirmation} />
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
      projectKey: PropTypes.string.isRequired,
    }).isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default ContainerDetails;

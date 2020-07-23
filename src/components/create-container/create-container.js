import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import { FormattedMessage, useIntl } from 'react-intl';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import {
  DOMAINS,
  NOTIFICATION_KINDS_SIDE,
} from '@commercetools-frontend/constants';
import Spacings from '@commercetools-uikit/spacings';
import {
  BackToList,
  TabContainer,
  View,
  ViewHeader,
} from '@commercetools-us-ps/mc-app-core/components';
import { useShowSideNotification } from '@commercetools-us-ps/mc-app-core/hooks';
import { CONTAINER, ROOT_PATH } from '../../constants';
import ContainerForm from '../container-form';
import CreateContainerCustomObject from '../update-custom-object.rest.graphql';
import messages from './messages';

const CreateContainer = ({ match, history }) => {
  const intl = useIntl();
  const mainRoute = `/${match.params.projectKey}/${ROOT_PATH}/containers`;
  const showSuccessNotification = useShowSideNotification(
    NOTIFICATION_KINDS_SIDE.success,
    messages.createSuccess
  );
  const showErrorNotification = useShowNotification({
    kind: NOTIFICATION_KINDS_SIDE.error,
    domain: DOMAINS.SIDE,
  });
  const [createContainer] = useMutation(CreateContainerCustomObject, {
    onCompleted() {
      showSuccessNotification();
      history.push(mainRoute);
    },
    onError({ message }) {
      showErrorNotification({
        text: (
          <FormattedMessage {...messages.createError} values={{ message }} />
        ),
      });
    },
  });

  function onSubmit(values) {
    const { key, attributes } = values;

    return createContainer({
      variables: {
        body: {
          container: CONTAINER,
          key,
          value: {
            attributes,
          },
        },
      },
    });
  }

  return (
    <View>
      <ViewHeader
        title={<FormattedMessage {...messages.title} />}
        backToList={
          <BackToList
            href={mainRoute}
            label={intl.formatMessage(messages.backButton)}
          />
        }
      />
      <TabContainer>
        <Spacings.Stack scale="m">
          <ContainerForm onSubmit={onSubmit} />
        </Spacings.Stack>
      </TabContainer>
    </View>
  );
};
CreateContainer.displayName = 'CreateContainer';
CreateContainer.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      projectKey: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default CreateContainer;

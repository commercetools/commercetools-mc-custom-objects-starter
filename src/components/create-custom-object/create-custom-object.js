import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { FormattedMessage, useIntl } from 'react-intl';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import {
  DOMAINS,
  NOTIFICATION_KINDS_SIDE
} from '@commercetools-frontend/constants';
import Spacings from '@commercetools-uikit/spacings';
import {
  BackToList,
  TabContainer,
  View,
  ViewHeader
} from '@custom-applications-local/core/components';
import { useShowSideNotification } from '@custom-applications-local/core/hooks';
import { CONTAINER, ROOT_PATH } from '../../constants';
import messages from './messages';
import GetContainers from '../get-custom-objects.rest.graphql';
import CreateCustomObjectMutation from '../update-custom-object.rest.graphql';
import CustomObjectForm from '../custom-object-form';

const CreateCustomObject = ({ match, history }) => {
  const mainRoute = `/${match.params.projectKey}/${ROOT_PATH}`;
  const intl = useIntl();
  const showSuccessNotification = useShowSideNotification(
    NOTIFICATION_KINDS_SIDE.success,
    messages.createSuccess
  );
  const showErrorNotification = useShowNotification({
    kind: NOTIFICATION_KINDS_SIDE.error,
    domain: DOMAINS.SIDE
  });
  const { data } = useQuery(GetContainers, {
    variables: { limit: 500, offset: 0, where: `container="${CONTAINER}"` }
  });

  const [createCustomObject] = useMutation(CreateCustomObjectMutation, {
    onCompleted() {
      showSuccessNotification();
      history.push(mainRoute);
    },
    onError({ message }) {
      showErrorNotification({
        text: (
          <FormattedMessage {...messages.createError} values={{ message }} />
        )
      });
    }
  });

  function onSubmit(values) {
    return createCustomObject({
      variables: {
        body: values
      }
    });
  }

  const { customObjects } = data || {};
  const { results } = customObjects || {};

  const containers = map(results, ({ id, key }) => ({ id, key }));

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
          <CustomObjectForm containers={containers} onSubmit={onSubmit} />
        </Spacings.Stack>
      </TabContainer>
    </View>
  );
};
CreateCustomObject.displayName = 'CreateCustomObject';
CreateCustomObject.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      projectKey: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

export default CreateCustomObject;

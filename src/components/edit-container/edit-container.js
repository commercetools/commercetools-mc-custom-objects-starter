import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import {
  DOMAINS,
  NOTIFICATION_KINDS_SIDE
} from '@commercetools-frontend/constants';
import { useShowSideNotification } from '@custom-applications-local/core/hooks';
import { CONTAINER } from '../../constants';
import UpdateContainer from '../update-custom-object.rest.graphql';
import ContainerForm from '../container-form';
import messages from './messages';

const EditContainer = ({ container, onComplete }) => {
  const showSuccessNotification = useShowSideNotification(
    NOTIFICATION_KINDS_SIDE.success,
    messages.editSuccess
  );
  const showErrorNotification = useShowNotification({
    kind: NOTIFICATION_KINDS_SIDE.error,
    domain: DOMAINS.SIDE
  });
  const [updateContainer] = useMutation(UpdateContainer, {
    onCompleted: showSuccessNotification,
    onError({ message }) {
      showErrorNotification({
        text: <FormattedMessage {...messages.editError} values={{ message }} />
      });
    }
  });

  function onSubmit(values) {
    const { key, attributes } = values;
    return updateContainer({
      variables: {
        body: {
          container: CONTAINER,
          key,
          value: {
            attributes
          }
        }
      }
    }).then(onComplete);
  }

  return <ContainerForm container={container} onSubmit={onSubmit} />;
};
EditContainer.displayName = 'EditContainer';
EditContainer.propTypes = {
  container: PropTypes.shape({
    key: PropTypes.string.isRequired,
    value: PropTypes.shape({
      attributes: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          type: PropTypes.string.isRequired,
          set: PropTypes.bool,
          required: PropTypes.bool,
          attributes: PropTypes.array,
          reference: PropTypes.string
        }).isRequired
      ).isRequired
    }).isRequired
  }).isRequired,
  onComplete: PropTypes.func.isRequired
};

export default EditContainer;

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import {
  DOMAINS,
  NOTIFICATION_KINDS_SIDE,
} from '@commercetools-frontend/constants';
import { useShowSideNotification } from '../../hooks';
import UpdateCustomObject from '../update-custom-object.rest.graphql';
import CustomObjectForm from '../custom-object-form';
import messages from './messages';
import { useContainerContext } from '../../context';

const EditCustomObject = ({ customObject, onComplete }) => {
  const { containers } = useContainerContext();
  const showSuccessNotification = useShowSideNotification(
    NOTIFICATION_KINDS_SIDE.success,
    messages.editSuccess
  );
  const showErrorNotification = useShowNotification({
    kind: NOTIFICATION_KINDS_SIDE.error,
    domain: DOMAINS.SIDE,
  });
  const [updateCustomObject] = useMutation(UpdateCustomObject, {
    onCompleted() {
      showSuccessNotification();
    },
    onError({ message }) {
      showErrorNotification({
        text: <FormattedMessage {...messages.editError} values={{ message }} />,
      });
    },
  });

  function onSubmit(values) {
    return updateCustomObject({
      variables: {
        body: values,
      },
    }).then(onComplete);
  }

  return (
    <CustomObjectForm
      containers={containers}
      customObject={customObject}
      onSubmit={onSubmit}
    />
  );
};
EditCustomObject.displayName = 'EditCustomObject';
EditCustomObject.propTypes = {
  customObject: PropTypes.shape({
    key: PropTypes.string.isRequired,
    value: PropTypes.object,
  }),
  onComplete: PropTypes.func.isRequired,
};

export default EditCustomObject;

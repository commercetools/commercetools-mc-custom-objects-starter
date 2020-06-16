import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import { FormattedMessage } from 'react-intl';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import {
  DOMAINS,
  NOTIFICATION_KINDS_SIDE
} from '@commercetools-frontend/constants';
import { useShowSideNotification } from '@custom-applications-local/core/hooks';
import { CONTAINER } from '../../constants';
import GetContainers from '../get-custom-objects.rest.graphql';
import UpdateCustomObject from '../update-custom-object.rest.graphql';
import CustomObjectForm from '../custom-object-form';
import messages from './messages';

const EditCustomObject = ({ customObject, onComplete }) => {
  const showSuccessNotification = useShowSideNotification(
    NOTIFICATION_KINDS_SIDE.success,
    messages.editSuccess
  );
  const showErrorNotification = useShowNotification({
    kind: NOTIFICATION_KINDS_SIDE.error,
    domain: DOMAINS.SIDE
  });
  const { data } = useQuery(GetContainers, {
    variables: { limit: 500, offset: 0, where: `container="${CONTAINER}"` }
  });
  const [updateCustomObject] = useMutation(UpdateCustomObject, {
    onCompleted() {
      showSuccessNotification();
    },
    onError({ message }) {
      showErrorNotification({
        text: <FormattedMessage {...messages.editError} values={{ message }} />
      });
    }
  });

  function onSubmit(values) {
    return updateCustomObject({
      variables: {
        body: values
      }
    }).then(onComplete);
  }

  const { customObjects } = data || {};
  const { results } = customObjects || {};

  const containers = map(results, ({ id, key, value }) => ({ id, key, value }));

  return (
    <>
      {containers.length > 0 && (
        <CustomObjectForm
          containers={containers}
          customObject={customObject}
          onSubmit={onSubmit}
        />
      )}
    </>
  );
};
EditCustomObject.displayName = 'EditCustomObject';
EditCustomObject.propTypes = {
  customObject: PropTypes.shape({
    key: PropTypes.string.isRequired,
    value: PropTypes.object
  }),
  onComplete: PropTypes.func.isRequired
};

export default EditCustomObject;

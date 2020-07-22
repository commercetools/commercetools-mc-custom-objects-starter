import React from 'react';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import { useIntl } from 'react-intl';
import FieldLabel from '@commercetools-uikit/field-label';
import { TYPES } from '../container-form/constants';
import messages from './messages';

const AttributeLabel = ({ type, title, isRequired, reference }) => {
  const intl = useIntl();
  return (
    <>
      {type !== TYPES.Boolean && (
        <FieldLabel
          title={title}
          hasRequiredIndicator={isRequired}
          hint={
            reference
              ? `${capitalize(reference.type)} ${capitalize(
                  reference.by
                )} ${intl.formatMessage(messages.referenceLabel)}`
              : ''
          }
        />
      )}
    </>
  );
};
AttributeLabel.displayName = 'AttributeLabel';
AttributeLabel.propTypes = {
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  reference: PropTypes.shape({
    by: PropTypes.string,
    type: PropTypes.string,
  }),
};

export default AttributeLabel;

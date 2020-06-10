import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import { FormattedMessage } from 'react-intl';
import Constraints from '@commercetools-uikit/constraints';
import { SelectField } from '@commercetools-uikit/fields';
import { REFERENCE_TYPES } from './constants';
import messages from './messages';
import styles from './nested-attributes.mod.css';

const options = map(REFERENCE_TYPES, type => ({
  label: type,
  value: type
}));

const ReferenceAttribute = ({
  name,
  value,
  errors,
  touched,
  handleChange,
  handleBlur
}) => {
  return (
    <div className={styles.nested}>
      <Constraints.Horizontal constraint="m">
        <SelectField
          name={`${name}.reference`}
          title={<FormattedMessage {...messages.referenceTitle} />}
          options={options}
          isRequired
          value={value}
          errors={errors}
          touched={touched}
          onChange={handleChange}
          onBlur={handleBlur}
          renderError={(key, error) => error}
        />
      </Constraints.Horizontal>
    </div>
  );
};
ReferenceAttribute.displayName = 'ReferenceAttribute';
ReferenceAttribute.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  errors: PropTypes.object,
  touched: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired
};

export default ReferenceAttribute;

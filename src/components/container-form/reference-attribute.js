import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import { FormattedMessage } from 'react-intl';
import { SelectField } from '@commercetools-uikit/fields';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { REFERENCE_BY, REFERENCE_TYPES } from './constants';
import messages from './messages';
import styles from './nested-attributes.mod.css';

const mapOptions = (options) =>
  map(options, (option) => ({
    label: option,
    value: option,
  }));

const referenceOptions = mapOptions(REFERENCE_BY);
const typeOptions = mapOptions(REFERENCE_TYPES);

const ReferenceAttribute = ({
  name,
  value,
  errors,
  touched,
  handleChange,
  handleBlur,
}) => {
  return (
    <div className={styles.nested}>
      <Spacings.Stack scale="xs">
        <Spacings.Inline scale="m">
          <SelectField
            name={`${name}.by`}
            title={<FormattedMessage {...messages.referenceByTitle} />}
            options={referenceOptions}
            horizontalConstraint="s"
            isRequired
            value={value.by}
            errors={errors.by}
            touched={touched.by}
            onChange={handleChange}
            onBlur={handleBlur}
            renderError={(key, error) => error}
          />
          <SelectField
            name={`${name}.type`}
            title={<FormattedMessage {...messages.referenceTypeTitle} />}
            options={typeOptions}
            horizontalConstraint="m"
            isRequired
            value={value.type}
            errors={errors.type}
            touched={touched.type}
            onChange={handleChange}
            onBlur={handleBlur}
            renderError={(key, error) => error}
          />
        </Spacings.Inline>
        <Text.Detail intlMessage={messages.referenceByHint} />
      </Spacings.Stack>
    </div>
  );
};
ReferenceAttribute.displayName = 'ReferenceAttribute';
ReferenceAttribute.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.shape({
    by: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
  errors: PropTypes.object,
  touched: PropTypes.shape({
    by: PropTypes.bool,
    type: PropTypes.bool,
  }),
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
};

export default ReferenceAttribute;

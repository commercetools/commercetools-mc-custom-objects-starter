import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { SecondaryIconButton } from '@commercetools-uikit/buttons';
import { SelectField, TextField } from '@commercetools-uikit/fields';
import FieldLabel from '@commercetools-uikit/field-label';
import { BinLinearIcon } from '@commercetools-uikit/icons';
import { CheckboxInput } from '@commercetools-uikit/inputs';
import Spacings from '@commercetools-uikit/spacings';
import { ATTRIBUTES, TYPES } from './constants';
import messages from './messages';
import styles from './attribute.mod.css';

const typeOptions = [
  {
    label: <FormattedMessage {...messages.stringLabel} />,
    value: TYPES.String
  },
  {
    label: <FormattedMessage {...messages.numberLabel} />,
    value: TYPES.Number
  },
  {
    label: <FormattedMessage {...messages.booleanLabel} />,
    value: TYPES.Boolean
  },
  {
    label: <FormattedMessage {...messages.moneyLabel} />,
    value: TYPES.Money
  },
  {
    label: <FormattedMessage {...messages.enumLabel} />,
    value: TYPES.Enum
  },
  {
    label: <FormattedMessage {...messages.objectLabel} />,
    value: TYPES.Object
  },
  {
    label: <FormattedMessage {...messages.referenceLabel} />,
    value: TYPES.Reference
  }
];

const Attribute = ({
  name,
  value,
  touched,
  errors,
  handleChange,
  handleBlur,
  removeDisabled,
  remove
}) => {
  const intl = useIntl();
  return (
    <Spacings.Inline alignItems="center" justifyContent="space-between">
      <div className={styles.attribute}>
        <TextField
          name={`${name}.${ATTRIBUTES.Name}`}
          title={<FormattedMessage {...messages.nameTitle} />}
          horizontalConstraint="m"
          isRequired
          value={value.name}
          touched={touched.name}
          errors={errors.name}
          onChange={handleChange}
          onBlur={handleBlur}
          renderError={(key, error) => error}
        />
        <SelectField
          name={`${name}.${ATTRIBUTES.Type}`}
          title={<FormattedMessage {...messages.typeTitle} />}
          horizontalConstraint="m"
          isRequired
          value={value.type}
          touched={touched.type}
          errors={errors.type}
          options={typeOptions}
          onChange={handleChange}
          onBlur={handleBlur}
          renderError={(key, error) => error}
        />
        <Spacings.Stack scale="s">
          <FieldLabel
            title={<FormattedMessage {...messages.attributeSettingsTitle} />}
          />
          <Spacings.Inline alignItems="center">
            <CheckboxInput
              name={`${name}.${ATTRIBUTES.Required}`}
              value={JSON.stringify(value.required)}
              isChecked={value.required}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <FormattedMessage {...messages.requiredTitle} />
            </CheckboxInput>
            <CheckboxInput
              name={`${name}.${ATTRIBUTES.Set}`}
              value={JSON.stringify(value.set)}
              isChecked={value.set}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <FormattedMessage {...messages.setTitle} />
            </CheckboxInput>
          </Spacings.Inline>
        </Spacings.Stack>
      </div>
      <SecondaryIconButton
        icon={<BinLinearIcon />}
        label={intl.formatMessage(messages.removeAttributeButton)}
        onClick={remove}
        isDisabled={removeDisabled}
      />
    </Spacings.Inline>
  );
};
Attribute.displayName = 'Attribute';
Attribute.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    required: PropTypes.bool,
    set: PropTypes.bool
  }).isRequired,
  touched: PropTypes.shape({
    name: PropTypes.bool,
    type: PropTypes.bool,
    required: PropTypes.bool,
    set: PropTypes.bool
  }).isRequired,
  errors: PropTypes.shape({
    name: PropTypes.object,
    type: PropTypes.object
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  removeDisabled: PropTypes.bool,
  remove: PropTypes.func.isRequired
};

export default Attribute;

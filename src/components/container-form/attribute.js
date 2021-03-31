import React from 'react';
import PropTypes from 'prop-types';
import includes from 'lodash/includes';
import keys from 'lodash/keys';
import { FormattedMessage, useIntl } from 'react-intl';
import { IconButton, SecondaryIconButton } from '@commercetools-uikit/buttons';
import { SelectField, TextField } from '@commercetools-uikit/fields';
import { BinLinearIcon, InformationIcon } from '@commercetools-uikit/icons';
import { CheckboxInput } from '@commercetools-uikit/inputs';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import Tooltip from '@commercetools-uikit/tooltip';
import { ATTRIBUTES, TYPES, VALIDATION_TYPES } from './constants';
import messages from './messages';
import styles from './attribute.mod.css';
import AttributeValidation from './attribute-validation';

const typeOptions = [
  {
    label: <FormattedMessage {...messages.stringLabel} />,
    value: TYPES.String,
  },
  {
    label: <FormattedMessage {...messages.localizedStringLabel} />,
    value: TYPES.LocalizedString,
  },
  {
    label: <FormattedMessage {...messages.numberLabel} />,
    value: TYPES.Number,
  },
  {
    label: <FormattedMessage {...messages.booleanLabel} />,
    value: TYPES.Boolean,
  },
  {
    label: <FormattedMessage {...messages.moneyLabel} />,
    value: TYPES.Money,
  },
  {
    label: <FormattedMessage {...messages.dateLabel} />,
    value: TYPES.Date,
  },
  {
    label: <FormattedMessage {...messages.timeLabel} />,
    value: TYPES.Time,
  },
  {
    label: <FormattedMessage {...messages.dateTimeLabel} />,
    value: TYPES.DateTime,
  },
  {
    label: <FormattedMessage {...messages.enumLabel} />,
    value: TYPES.Enum,
  },
  {
    label: <FormattedMessage {...messages.localizedEnumLabel} />,
    value: TYPES.LocalizedEnum,
  },
  {
    label: <FormattedMessage {...messages.objectLabel} />,
    value: TYPES.Object,
  },
  {
    label: <FormattedMessage {...messages.referenceLabel} />,
    value: TYPES.Reference,
  },
];

const Attribute = ({
  name,
  value,
  touched,
  errors,
  handleChange,
  handleBlur,
  remove,
  removeDisabled,
  isDisplayed,
}) => {
  const intl = useIntl();
  const isRequiredDisabled =
    value.type === TYPES.Object || value.type === TYPES.Boolean;
  const hasValidationOptions = includes(keys(VALIDATION_TYPES), value.type);

  React.useEffect(() => {
    if (isRequiredDisabled) {
      handleChange({
        target: { name: `${name}.required`, value: false },
      });
    }
  }, [value.type]);

  return (
    <Spacings.Stack scale="s">
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
            <Spacings.Inline alignItems="center">
              <Text.Body isBold intlMessage={messages.attributeSettingsTitle} />
              <Tooltip
                title={intl.formatMessage(messages.attributeSettingsHint)}
              >
                <IconButton
                  label={intl.formatMessage(messages.attributeSettingsTitle)}
                  icon={<InformationIcon />}
                  size="small"
                />
              </Tooltip>
            </Spacings.Inline>
            <Spacings.Inline alignItems="center">
              <CheckboxInput
                data-testid="attribute-required"
                name={`${name}.${ATTRIBUTES.Required}`}
                value={JSON.stringify(value.required)}
                isChecked={value.required}
                isDisabled={isRequiredDisabled}
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
              <CheckboxInput
                name={`${name}.${ATTRIBUTES.Display}`}
                value={JSON.stringify(value.display)}
                isDisabled={isDisplayed}
                isChecked={value.display}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <FormattedMessage {...messages.displayTitle} />
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
      {hasValidationOptions && (
        <AttributeValidation
          type={value.type}
          name={`${name}.${ATTRIBUTES.Validation}`}
          value={value.validation}
          touched={touched.validation}
          errors={errors.validation}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      )}
    </Spacings.Stack>
  );
};
Attribute.displayName = 'Attribute';
Attribute.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    required: PropTypes.bool,
    set: PropTypes.bool,
    display: PropTypes.bool,
    validation: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      })
    ),
  }).isRequired,
  touched: PropTypes.shape({
    name: PropTypes.bool,
    type: PropTypes.bool,
    required: PropTypes.bool,
    set: PropTypes.bool,
    validation: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.bool,
        value: PropTypes.bool,
      })
    ),
  }).isRequired,
  errors: PropTypes.shape({
    name: PropTypes.object,
    type: PropTypes.object,
    validation: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string,
        value: PropTypes.string,
      })
    ),
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  removeDisabled: PropTypes.bool,
  isDisplayed: PropTypes.bool,
};

export default Attribute;

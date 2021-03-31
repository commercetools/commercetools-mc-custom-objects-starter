import React from 'react';
import PropTypes from 'prop-types';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import { FormattedMessage, useIntl } from 'react-intl';
import { FieldArray } from 'formik';
import {
  SecondaryButton,
  SecondaryIconButton,
} from '@commercetools-uikit/buttons';
import Constraints from '@commercetools-uikit/constraints';
import { customProperties } from '@commercetools-uikit/design-system';
import FieldLabel from '@commercetools-uikit/field-label';
import Grid from '@commercetools-uikit/grid';
import { BinLinearIcon, PlusBoldIcon } from '@commercetools-uikit/icons';
import { SelectInput } from '@commercetools-uikit/inputs';
import { ErrorMessage } from '@commercetools-uikit/messages';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import AttributeValidationInput from './attribute-validation-input';
import { VALIDATION, VALIDATION_TYPES } from './constants';
import messages from './messages';
import nestedStyles from './nested-attributes.mod.css';
import styles from './attribute-validation.mod.css';

const validationOptions = [
  {
    value: VALIDATION.Min.method,
    label: <FormattedMessage {...messages.minValidationLabel} />,
  },
  {
    value: VALIDATION.Max.method,
    label: <FormattedMessage {...messages.maxValidationLabel} />,
  },
  {
    value: VALIDATION.Length.method,
    label: <FormattedMessage {...messages.lengthValidationLabel} />,
  },
  {
    value: VALIDATION.Email.method,
    label: <FormattedMessage {...messages.emailValidationLabel} />,
  },
  {
    value: VALIDATION.Url.method,
    label: <FormattedMessage {...messages.urlValidationLabel} />,
  },
  {
    value: VALIDATION.Matches.method,
    label: <FormattedMessage {...messages.matchesValidationLabel} />,
  },
  {
    value: VALIDATION.LessThan.method,
    label: <FormattedMessage {...messages.lessThanValidationLabel} />,
  },
  {
    value: VALIDATION.MoreThan.method,
    label: <FormattedMessage {...messages.moreThanValidationLabel} />,
  },
  {
    value: VALIDATION.Integer.method,
    label: <FormattedMessage {...messages.integerValidationLabel} />,
  },
  {
    value: VALIDATION.Positive.method,
    label: <FormattedMessage {...messages.positiveValidationLabel} />,
  },
  {
    value: VALIDATION.Negative.method,
    label: <FormattedMessage {...messages.negativeValidationLabel} />,
  },
];

const mapTypeToValidationOptions = (type) =>
  filter(validationOptions, (option) => {
    const validations = VALIDATION_TYPES[type];
    return !!find(validations, { method: option.value });
  });

const AttributeValidation = ({
  type,
  name,
  value,
  touched,
  errors,
  onChange,
  onBlur,
}) => {
  const intl = useIntl();
  return (
    <div className={nestedStyles.nested}>
      <FieldArray
        name={name}
        render={({ push, remove }) => (
          <Spacings.Stack scale="s">
            <FieldLabel
              title={<FormattedMessage {...messages.validationTitle} />}
            />
            <Constraints.Horizontal constraint="scale">
              <SecondaryButton
                label={intl.formatMessage(messages.addValidationButton)}
                iconLeft={<PlusBoldIcon />}
                onClick={() =>
                  push({
                    type: '',
                    value: '',
                  })
                }
              />
            </Constraints.Horizontal>
            {value && value.length > 0 ? (
              <Grid
                gridRowGap={customProperties.spacingS}
                gridColumnGap={customProperties.spacingM}
                gridTemplateColumns={`repeat(3, 1fr)`}
                justifyItems="start"
              >
                <FieldLabel
                  title={<FormattedMessage {...messages.validationTypeTitle} />}
                  hasRequiredIndicator
                />
                <FieldLabel
                  title={
                    <FormattedMessage {...messages.validationValueTitle} />
                  }
                  hasRequiredIndicator
                />
                <span></span>
                {value.map((validation, index) => {
                  const typeTouched = get(touched, `${index}.type`);
                  const typeErrors = get(errors, `${index}.type`);
                  return (
                    <React.Fragment key={index}>
                      <div className={styles.fullWidth}>
                        <Spacings.Stack scale="xs">
                          <SelectInput
                            name={`${name}.${index}.type`}
                            value={validation.type}
                            horizontalConstraint="scale"
                            options={mapTypeToValidationOptions(type)}
                            hasError={!!(typeTouched && typeErrors)}
                            onChange={onChange}
                            onBlur={onBlur}
                          />

                          {typeTouched && typeErrors && (
                            <ErrorMessage>{typeErrors}</ErrorMessage>
                          )}
                        </Spacings.Stack>
                      </div>
                      <div className={styles.fullWidth}>
                        <AttributeValidationInput
                          validation={validation.type}
                          type={type}
                          name={`${name}.${index}.value`}
                          value={validation.value}
                          touched={get(touched, `${index}.value`)}
                          errors={get(errors, `${index}.value`)}
                          onChange={onChange}
                          onBlur={onBlur}
                        />
                      </div>
                      <SecondaryIconButton
                        data-testid={`remove-validation-${index}`}
                        icon={<BinLinearIcon />}
                        label={intl.formatMessage(messages.removeLabel)}
                        onClick={() => remove(index)}
                      />
                    </React.Fragment>
                  );
                })}
              </Grid>
            ) : (
              <Text.Body intlMessage={messages.noValidationLabel} />
            )}
          </Spacings.Stack>
        )}
      />
    </div>
  );
};
AttributeValidation.displayName = 'AttributeValidation';
AttributeValidation.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  touched: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.bool,
      value: PropTypes.bool,
    })
  ),
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      value: PropTypes.string,
    })
  ),
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
};

export default AttributeValidation;

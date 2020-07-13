import React from 'react';
import PropTypes from 'prop-types';
import camelCase from 'lodash/camelCase';
import get from 'lodash/get';
import map from 'lodash/map';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import {
  CheckboxInput,
  DateInput,
  DateTimeInput,
  LocalizedTextInput,
  MoneyInput,
  NumberInput,
  SelectInput,
  TextInput,
  TimeInput,
} from '@commercetools-uikit/inputs';
import { ErrorMessage } from '@commercetools-uikit/messages';
import Spacings from '@commercetools-uikit/spacings';
import { TYPES } from '../container-form/constants';
import nestedStyles from '../container-form/nested-attributes.mod.css';
import AttributeField from './attribute-field'; // eslint-disable-line import/no-cycle

const AttributeInput = ({
  type,
  title,
  name,
  value,
  touched,
  errors,
  onChange,
  onBlur,
  isRequired,
  isSet,
  attributes,
  options,
}) => {
  const { dataLocale, project, user } = useApplicationContext();
  const { currencies } = project;
  const { timeZone } = user;

  switch (type) {
    case TYPES.String:
      return (
        <Spacings.Stack scale="xs">
          <TextInput
            data-testid="field-type-string"
            name={name}
            value={value}
            hasError={!!(touched && errors)}
            onChange={onChange}
            onBlur={onBlur}
          />
          {touched && errors && (
            <ErrorMessage data-testid="field-error">{errors}</ErrorMessage>
          )}
        </Spacings.Stack>
      );

    case TYPES.LocalizedString:
      return (
        <Spacings.Stack scale="xs">
          <LocalizedTextInput
            data-testid="field-type-i18n-string"
            selectedLanguage={dataLocale}
            name={name}
            value={value}
            hasError={!!(LocalizedTextInput.isTouched(touched) && errors)}
            onChange={onChange}
            onBlur={onBlur}
          />
          {LocalizedTextInput.isTouched(touched) && errors && (
            <ErrorMessage data-testid="field-error">{errors}</ErrorMessage>
          )}
        </Spacings.Stack>
      );

    case TYPES.Number:
      return (
        <Spacings.Stack scale="xs">
          <NumberInput
            data-testid="field-type-number"
            name={name}
            value={value}
            hasError={!!(touched && errors)}
            onChange={onChange}
            onBlur={onBlur}
          />
          {touched && errors && (
            <ErrorMessage data-testid="field-error">{errors}</ErrorMessage>
          )}
        </Spacings.Stack>
      );

    case TYPES.Boolean:
      return (
        <Spacings.Stack scale="xs">
          <CheckboxInput
            data-testid="field-type-boolean"
            name={name}
            isChecked={JSON.parse(value)}
            value={JSON.stringify(value)}
            hasError={!!(touched && errors)}
            onChange={onChange}
            onBlur={onBlur}
          >
            {title}
          </CheckboxInput>
          {touched && errors && (
            <ErrorMessage data-testid="field-error">{errors}</ErrorMessage>
          )}
        </Spacings.Stack>
      );

    case TYPES.Money:
      return (
        <Spacings.Stack scale="xs">
          <MoneyInput
            data-testid="field-type-money"
            currencies={currencies}
            name={name}
            value={value}
            hasError={!!(touched && errors)}
            onChange={onChange}
            onBlur={onBlur}
          />
          {touched && errors && (
            <ErrorMessage data-testid="field-error">
              {get(errors, 'amount')}
            </ErrorMessage>
          )}
        </Spacings.Stack>
      );

    case TYPES.Date:
      return (
        <Spacings.Stack scale="xs">
          <DateInput
            data-testid="field-type-date"
            name={name}
            value={value}
            hasError={!!(touched && errors)}
            onChange={onChange}
            onBlur={onBlur}
          />
          {touched && errors && (
            <ErrorMessage data-testid="field-error">{errors}</ErrorMessage>
          )}
        </Spacings.Stack>
      );

    case TYPES.Time:
      return (
        <Spacings.Stack scale="xs">
          <TimeInput
            data-testid="field-type-time"
            timeZone={timeZone}
            name={name}
            value={value}
            hasError={!!(touched && errors)}
            onChange={onChange}
            onBlur={onBlur}
          />
          {touched && errors && (
            <ErrorMessage data-testid="field-error">{errors}</ErrorMessage>
          )}
        </Spacings.Stack>
      );

    case TYPES.DateTime:
      return (
        <Spacings.Stack scale="xs">
          <DateTimeInput
            data-testid="field-type-datetime"
            timeZone={timeZone}
            name={name}
            value={value}
            hasError={!!(touched && errors)}
            onChange={onChange}
            onBlur={onBlur}
          />
          {touched && errors && (
            <ErrorMessage data-testid="field-error">{errors}</ErrorMessage>
          )}
        </Spacings.Stack>
      );

    case TYPES.Enum:
    case TYPES.LocalizedEnum: {
      return (
        <Spacings.Stack scale="xs">
          <SelectInput
            data-testid="field-type-enum"
            name={name}
            options={options}
            value={value}
            isClearable={!isRequired && !isSet}
            hasError={!!(touched && errors)}
            onChange={onChange}
            onBlur={onBlur}
          />
          {touched && errors && (
            <ErrorMessage data-testid="field-error">{errors}</ErrorMessage>
          )}
        </Spacings.Stack>
      );
    }

    case TYPES.Reference: {
      const refTouched = get(touched, 'id');
      const refErrors = get(errors, 'id');
      const hasError = !!(refTouched && refErrors);
      return (
        <Spacings.Stack scale="xs">
          <TextInput
            data-testid="field-type-reference"
            name={`${name}.id`}
            value={value.id}
            hasError={hasError}
            onChange={onChange}
            onBlur={onBlur}
          />
          {hasError && (
            <ErrorMessage data-testid="field-error">{refErrors}</ErrorMessage>
          )}
        </Spacings.Stack>
      );
    }

    case TYPES.Object:
      return (
        <div className={`${nestedStyles.nested}`}>
          <Spacings.Stack scale="s">
            {map(attributes, (attribute, index) => {
              const attributeName = camelCase(attribute.name);
              return (
                <AttributeField
                  data-testid={`field-type-object-${index}`}
                  key={index}
                  type={attribute.type}
                  name={`${name}.${attributeName}`}
                  title={attribute.name}
                  attributes={attribute.attributes}
                  reference={attribute.reference}
                  isRequired={attribute.required}
                  isSet={attribute.set}
                  options={attribute.enum || attribute.lenum}
                  value={get(value, attributeName)}
                  touched={get(touched, attributeName)}
                  errors={get(errors, attributeName)}
                  onBlur={onBlur}
                  onChange={onChange}
                />
              );
            })}
          </Spacings.Stack>
        </div>
      );

    default:
      return null;
  }
};
AttributeInput.displayName = 'AttributeInput';
AttributeInput.propTypes = {
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
  touched: PropTypes.any,
  errors: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  isRequired: PropTypes.bool,
  isSet: PropTypes.bool,
  attributes: PropTypes.array,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    })
  ),
};

export default AttributeInput;

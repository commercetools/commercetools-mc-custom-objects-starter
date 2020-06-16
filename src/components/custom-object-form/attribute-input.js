import React from 'react';
import PropTypes from 'prop-types';
import camelCase from 'lodash/camelCase';
import get from 'lodash/get';
import {
  CheckboxInput,
  TextInput,
  NumberInput
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
  attributes
}) => {
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
            {attributes.map((attribute, index) => {
              const attributeName = camelCase(attribute.name);
              return (
                <AttributeField
                  data-testid={`field-type-object-${index}`}
                  key={index}
                  type={attribute.type}
                  attributes={attribute.attributes}
                  reference={attribute.reference}
                  name={`${name}.${attributeName}`}
                  title={attribute.name}
                  isRequired={attribute.required}
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
  attributes: PropTypes.array
};

export default AttributeInput;

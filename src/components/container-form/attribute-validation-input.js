import React from 'react';
import PropTypes from 'prop-types';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import {
  DateInput,
  DateTimeInput,
  NumberInput,
  TextInput,
} from '@commercetools-uikit/inputs';
import { ErrorMessage } from '@commercetools-uikit/messages';
import Spacings from '@commercetools-uikit/spacings';
import { TYPES, VALIDATION } from './constants';

const AttributeValidationInput = ({
  validation,
  type,
  name,
  value,
  touched,
  errors,
  onChange,
  onBlur,
}) => {
  const { user } = useApplicationContext();
  const { timeZone } = user;

  switch (validation) {
    case VALIDATION.Matches.method:
      return (
        <Spacings.Stack scale="xs">
          <TextInput
            isRequired
            name={name}
            value={value}
            hasError={!!(touched && errors)}
            onChange={onChange}
            onBlur={onBlur}
          />
          {touched && errors && <ErrorMessage>{errors}</ErrorMessage>}
        </Spacings.Stack>
      );

    case VALIDATION.Length.method:
    case VALIDATION.Min.method:
    case VALIDATION.Max.method:
    case VALIDATION.LessThan.method:
    case VALIDATION.MoreThan.method: {
      const getInput = () => {
        switch (type) {
          case TYPES.Date:
            return (
              <DateInput
                isRequired
                name={name}
                value={value}
                hasError={!!(touched && errors)}
                onChange={onChange}
                onBlur={onBlur}
              />
            );
          case TYPES.DateTime:
            return (
              <DateTimeInput
                isRequired
                timeZone={timeZone}
                name={name}
                value={value}
                hasError={!!(touched && errors)}
                onChange={onChange}
                onBlur={onBlur}
              />
            );
          default:
            return (
              <NumberInput
                isRequired
                name={name}
                value={value}
                hasError={!!(touched && errors)}
                onChange={onChange}
                onBlur={onBlur}
              />
            );
        }
      };
      return (
        <Spacings.Stack scale="xs">
          {getInput()}
          {touched && errors && <ErrorMessage>{errors}</ErrorMessage>}
        </Spacings.Stack>
      );
    }
    default:
      return <span></span>;
  }
};
AttributeValidationInput.displayName = 'AttributeValidationInput';
AttributeValidationInput.propTypes = {
  validation: PropTypes.string,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
  touched: PropTypes.any,
  errors: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
};

export default AttributeValidationInput;

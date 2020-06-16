import React from 'react';
import reduce from 'lodash/reduce';
import camelCase from 'lodash/camelCase';
import * as yup from 'yup';
import { FormattedMessage } from 'react-intl';
import { TYPES } from '../container-form/constants';

export const getValue = (type, attributes, reference) => {
  switch (type) {
    case TYPES.String:
    case TYPES.Number:
      return '';

    case TYPES.Boolean:
      return false;

    case TYPES.Reference:
      return {
        typeId: reference,
        id: ''
      };

    case TYPES.Object:
      return getAttributeValues(attributes); // eslint-disable-line no-use-before-define

    default:
      return null;
  }
};

const getInitialValueByType = (type, isSet, attributes, reference) =>
  isSet
    ? [getValue(type, attributes, reference)]
    : getValue(type, attributes, reference);

export const getAttributeValues = attributes =>
  reduce(
    attributes,
    (value, { name, type, set, attributes: nested, reference }) => ({
      ...value,
      [camelCase(name)]: getInitialValueByType(type, set, nested, reference)
    }),
    {}
  );

const getValidation = ({ attributes, required, set }, method, messages) => {
  let validation = yup[method]();

  if (attributes) {
    validation = validation.shape(getAttributeValidation(attributes, messages)); // eslint-disable-line no-use-before-define
  }

  if (required) {
    validation = validation.required(
      <FormattedMessage {...messages.required} />
    );
  }

  return set ? yup.array(validation) : validation;
};

const getValidationByType = (attribute, messages) => {
  switch (attribute.type) {
    case TYPES.String:
      return getValidation(attribute, 'string', messages);

    case TYPES.Number:
      return getValidation(attribute, 'number', messages);

    case TYPES.Boolean:
      return getValidation(attribute, 'boolean', messages);

    case TYPES.Reference:
      return yup.object({
        typeId: yup.string(),
        id: getValidation(attribute, 'string', messages)
      });

    case TYPES.Object:
      return getValidation(attribute, 'object', messages);

    default:
      return null;
  }
};

export const getAttributeValidation = (attributes, messages) => {
  return reduce(
    attributes,
    (obj, attribute) => ({
      ...obj,
      [camelCase(attribute.name)]: getValidationByType(attribute, messages)
    }),
    {}
  );
};

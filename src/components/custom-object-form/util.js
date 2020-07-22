import React from 'react';
import camelCase from 'lodash/camelCase';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import reduce from 'lodash/reduce';
import * as yup from 'yup';
import { FormattedMessage } from 'react-intl';
import { LocalizedTextInput } from '@commercetools-uikit/inputs';
import { TYPES } from '../container-form/constants';

export const getValue = (
  type,
  attributes,
  reference,
  currencies,
  languages
) => {
  switch (type) {
    case TYPES.String:
    case TYPES.Number:
    case TYPES.Date:
    case TYPES.Time:
    case TYPES.DateTime:
    case TYPES.Enum:
    case TYPES.LocalizedEnum:
      return '';

    case TYPES.LocalizedString:
      return LocalizedTextInput.createLocalizedString(languages);

    case TYPES.Boolean:
      return false;

    case TYPES.Money:
      return {
        amount: '',
        currencyCode: currencies[0],
      };

    case TYPES.Reference:
      return {
        typeId: reference.type,
        [reference.by]: '',
      };

    case TYPES.Object:
      return getAttributeValues(attributes, currencies, languages); // eslint-disable-line no-use-before-define

    default:
      return null;
  }
};

const getInitialValueByType = (
  type,
  isSet,
  attributes,
  reference,
  currencies,
  languages
) =>
  isSet
    ? [getValue(type, attributes, reference, currencies, languages)]
    : getValue(type, attributes, reference, currencies, languages);

export const getAttributeValues = (attributes, currencies, languages) =>
  reduce(
    attributes,
    (value, { name, type, set, attributes: nested, reference }) => ({
      ...value,
      [camelCase(name)]: getInitialValueByType(
        type,
        set,
        nested,
        reference,
        currencies,
        languages
      ),
    }),
    {}
  );

const getValidation = (method, required, messages) => {
  const validation = yup[method]();
  return required
    ? validation.required(<FormattedMessage {...messages.required} />)
    : validation.nullable();
};

const getLocalizedStringValidation = (languages, required, messages) => {
  yup.addMethod(yup.object, 'atLeastOneOf', function (list) {
    return this.test({
      name: 'atLeastOneOf',
      message: <FormattedMessage {...messages.required} />,
      exclusive: true,
      test: (value) => value == null || list.some((f) => !isNil(get(value, f))),
    });
  });

  const localizedStringSchema = reduce(
    languages,
    (name, lang) => ({ ...name, [lang]: yup.string() }),
    {}
  );
  const validation = yup.object(localizedStringSchema);

  return required ? validation.atLeastOneOf(languages) : validation;
};

const getValidationByType = (
  { type, required, attributes, reference },
  languages,
  messages
) => {
  switch (type) {
    case TYPES.String:
    case TYPES.Enum:
    case TYPES.LocalizedEnum:
    case TYPES.Time:
      return getValidation('string', required, messages);

    case TYPES.LocalizedString:
      return getLocalizedStringValidation(languages, required, messages);

    case TYPES.Number:
      return getValidation('number', required, messages);

    case TYPES.Boolean:
      return getValidation('boolean', required, messages);

    case TYPES.Money:
      return yup.object({
        amount: getValidation('string', required, messages),
        currencyCode: yup.string(),
      });

    case TYPES.Date:
    case TYPES.DateTime:
      return getValidation('date', required, messages);

    case TYPES.Reference:
      return yup.object({
        typeId: yup.string(),
        [reference.by]: getValidation('string', required, messages),
      });

    case TYPES.Object:
      return yup.object(
        getAttributeValidation(attributes, languages, messages) // eslint-disable-line no-use-before-define
      );

    default:
      return null;
  }
};

const getValidationSpecification = (attribute, languages, messages) => {
  const validation = getValidationByType(attribute, languages, messages);
  return attribute.set ? yup.array(validation) : validation;
};

export const getAttributeValidation = (attributes, languages, messages) => {
  return reduce(
    attributes,
    (obj, attribute) => ({
      ...obj,
      [camelCase(attribute.name)]: getValidationSpecification(
        attribute,
        languages,
        messages
      ),
    }),
    {}
  );
};

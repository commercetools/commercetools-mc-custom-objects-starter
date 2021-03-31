import React from 'react';
import camelCase from 'lodash/camelCase';
import find from 'lodash/find';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import reduce from 'lodash/reduce';
import * as yup from 'yup';
import { FormattedMessage } from 'react-intl';
import { LocalizedTextInput } from '@commercetools-uikit/inputs';
import { TYPES, VALIDATION } from '../container-form/constants';

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

const getValidation = (method, required, validation, messages) => {
  const base = yup[method]();
  const schema = !isEmpty(validation)
    ? reduce(
        validation,
        (val, { type, value }) => {
          const message = find(VALIDATION, { method: type }).message;

          if (type === VALIDATION.Matches.method) {
            return val[type](value, {
              message: <FormattedMessage {...message} values={{ value }} />,
            });
          }

          return value
            ? val[type](
                value,
                <FormattedMessage {...message} values={{ value }} />
              )
            : val[type](<FormattedMessage {...message} />);
        },
        base
      )
    : base;

  return required
    ? schema.required(<FormattedMessage {...messages.required} />)
    : schema.nullable();
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
  { type, required, validation, attributes, reference },
  languages,
  messages
) => {
  switch (type) {
    case TYPES.String:
    case TYPES.Enum:
    case TYPES.LocalizedEnum:
    case TYPES.Time:
      return getValidation('string', required, validation, messages);

    case TYPES.LocalizedString:
      return getLocalizedStringValidation(languages, required, messages);

    case TYPES.Number:
      return getValidation('number', required, validation, messages);

    case TYPES.Boolean:
      return getValidation('boolean', required, validation, messages);

    case TYPES.Money:
      return yup.object({
        amount: getValidation('string', required, validation, messages),
        currencyCode: yup.string(),
      });

    case TYPES.Date:
    case TYPES.DateTime:
      return getValidation('date', required, validation, messages);

    case TYPES.Reference:
      return yup.object({
        typeId: yup.string(),
        [reference.by]: getValidation('string', required, validation, messages),
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

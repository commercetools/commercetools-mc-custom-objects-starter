import React from 'react';
import faker from 'faker';
import camelCase from 'lodash/camelCase';
import times from 'lodash/times';
import * as yup from 'yup';
import { FormattedMessage } from 'react-intl';
import { REFERENCE_TYPES, TYPES } from '../container-form/constants';
import { getAttributeValues, getAttributeValidation } from './util';
import messages from './messages';

describe('attribute utilities', () => {
  describe('attribute values', () => {
    it('when attribute is a string type, should return empty string as initial value', () => {
      const name = faker.random.words();
      const attributes = [
        {
          name,
          type: TYPES.String
        }
      ];
      const values = { [camelCase(name)]: '' };
      expect(getAttributeValues(attributes)).toEqual(values);
    });

    it('when attribute is a number type, should return empty string as initial value', () => {
      const name = faker.random.words();
      const attributes = [
        {
          name,
          type: TYPES.Number
        }
      ];
      const values = { [camelCase(name)]: '' };
      expect(getAttributeValues(attributes)).toEqual(values);
    });

    it('when attribute is a boolean type, should return false as initial value', () => {
      const name = faker.random.words();
      const attributes = [
        {
          name,
          type: TYPES.Boolean
        }
      ];
      const values = { [camelCase(name)]: false };
      expect(getAttributeValues(attributes)).toEqual(values);
    });

    it('when attribute is a money type, should return empty amount and first currency code as initial value', () => {
      const currencies = times(2, () => faker.finance.currencyCode());
      const name = faker.random.words();
      const attributes = [
        {
          name,
          type: TYPES.Money
        }
      ];
      const values = {
        [camelCase(name)]: { amount: '', currencyCode: currencies[0] }
      };
      expect(getAttributeValues(attributes, currencies)).toEqual(values);
    });

    // commercetools reference type: https://docs.commercetools.com/http-api-types#references
    it('when attribute is a reference type, should return a reference type with id as an empty string as initial value', () => {
      const name = faker.random.words();
      const reference = faker.random.arrayElement(
        Object.values(REFERENCE_TYPES)
      );
      const attributes = [
        {
          name,
          type: TYPES.Reference,
          reference
        }
      ];
      const values = { [camelCase(name)]: { typeId: reference, id: '' } };
      expect(getAttributeValues(attributes)).toEqual(values);
    });

    it('when attribute is an object type, should construct an object based on its attributes as initial value', () => {
      const name = faker.random.words();
      const nestedAttributes = [
        {
          name: `${name}-nested`,
          type: TYPES.String
        }
      ];
      const attributes = [
        {
          name,
          type: TYPES.Object,
          attributes: nestedAttributes
        }
      ];
      const value = { [camelCase(`${name}-nested`)]: '' };
      const values = {
        [camelCase(name)]: value
      };
      expect(getAttributeValues(attributes)).toEqual(values);
    });

    it('when attribute is a set, should return an array of values as initial value', () => {
      const name = faker.random.words();
      const attributes = [
        {
          name,
          type: TYPES.String,
          set: true
        }
      ];
      const values = { [camelCase(name)]: [''] };
      expect(getAttributeValues(attributes)).toEqual(values);
    });
  });

  describe('attribute validation', () => {
    it('when attribute is a string type, should return yup string as validation', () => {
      const name = faker.random.words();
      const attributes = [
        {
          name,
          type: TYPES.String
        }
      ];
      const validation = { [camelCase(name)]: yup.string().nullable() };
      expect(JSON.stringify(getAttributeValidation(attributes))).toEqual(
        JSON.stringify(validation)
      );
    });

    it('when attribute is an enum type, should return yup string as validation', () => {
      const name = faker.random.words();
      const attributes = [
        {
          name,
          type: TYPES.Enum
        }
      ];
      const validation = { [camelCase(name)]: yup.string().nullable() };
      expect(JSON.stringify(getAttributeValidation(attributes))).toEqual(
        JSON.stringify(validation)
      );
    });

    it('when attribute is a number type, should return yup number as validation', () => {
      const name = faker.random.words();
      const attributes = [
        {
          name,
          type: TYPES.Number
        }
      ];
      const validation = { [camelCase(name)]: yup.number().nullable() };
      expect(JSON.stringify(getAttributeValidation(attributes))).toEqual(
        JSON.stringify(validation)
      );
    });

    it('when attribute is a boolean type, should return yup boolean as validation', () => {
      const name = faker.random.words();
      const attributes = [
        {
          name,
          type: TYPES.Boolean
        }
      ];
      const validation = { [camelCase(name)]: yup.boolean().nullable() };
      expect(JSON.stringify(getAttributeValidation(attributes))).toEqual(
        JSON.stringify(validation)
      );
    });

    it('when attribute is a money type, should return yup object as validation', () => {
      const name = faker.random.words();
      const attributes = [
        {
          name,
          type: TYPES.Money
        }
      ];
      const validation = {
        [camelCase(name)]: yup.object({
          amount: yup.string().nullable(),
          currencyCode: yup.string().nullable()
        })
      };
      expect(JSON.stringify(getAttributeValidation(attributes))).toEqual(
        JSON.stringify(validation)
      );
    });

    it('when attribute is a reference type, should return yup object as validation', () => {
      const name = faker.random.words();
      const reference = faker.random.arrayElement(
        Object.values(REFERENCE_TYPES)
      );
      const attributes = [
        {
          name,
          type: TYPES.Reference,
          reference
        }
      ];
      const validation = {
        [camelCase(name)]: yup.object({
          typeId: yup.string(),
          id: yup.string().nullable()
        })
      };
      expect(JSON.stringify(getAttributeValidation(attributes))).toEqual(
        JSON.stringify(validation)
      );
    });

    it('when attribute is an object type, should construct a yup object based on its attributes as validation', () => {
      const name = faker.random.words();
      const nestedAttributes = [
        {
          name: `${name}-nested`,
          type: TYPES.String
        }
      ];
      const attributes = [
        {
          name,
          type: TYPES.Object,
          attributes: nestedAttributes
        }
      ];
      const nestedValidation = {
        [camelCase(`${name}-nested`)]: yup.string().nullable()
      };
      const validation = {
        [camelCase(name)]: yup
          .object()
          .shape(nestedValidation)
          .nullable()
      };
      expect(JSON.stringify(getAttributeValidation(attributes))).toEqual(
        JSON.stringify(validation)
      );
    });

    it('when attribute is an unknown type, should return null as validation', () => {
      const name = faker.random.words();
      const attributes = [
        {
          name,
          type: 'banana'
        }
      ];
      const validation = { [camelCase(name)]: null };
      expect(JSON.stringify(getAttributeValidation(attributes))).toEqual(
        JSON.stringify(validation)
      );
    });

    it('when attribute is a set, should return an array of typed validations as validation', () => {
      const name = faker.random.words();
      const attributes = [
        {
          name,
          type: TYPES.String,
          set: true
        }
      ];
      const validation = {
        [camelCase(name)]: yup.array(yup.string().nullable())
      };
      expect(JSON.stringify(getAttributeValidation(attributes))).toEqual(
        JSON.stringify(validation)
      );
    });

    it('when attribute is required, should return yup validation with required message as validation', () => {
      const name = faker.random.words();
      const attributes = [
        {
          name,
          type: TYPES.String,
          required: true
        }
      ];
      const validation = {
        [camelCase(name)]: yup
          .string()
          .required(<FormattedMessage {...messages.requiredFieldError} />)
      };
      expect(
        JSON.stringify(
          getAttributeValidation(attributes, {
            required: messages.requiredFieldError
          })
        )
      ).toEqual(JSON.stringify(validation));
    });
  });
});

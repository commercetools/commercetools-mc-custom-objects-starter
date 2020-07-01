import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';
import camelCase from 'lodash/camelCase';
import times from 'lodash/times';
import { FormattedMessage } from 'react-intl';
import * as ApplicationContext from '@commercetools-frontend/application-shell-connectors';
import { REFERENCE_TYPES, TYPES } from '../container-form/constants';
import AttributeInput from './attribute-input';
import messages from './messages';
import { generateContainer } from '../../test-util';
import { getValue } from './util';
import AttributeField from './attribute-field';

const project = {
  currencies: times(2, () => faker.finance.currencyCode()),
};

const mocks = {
  name: camelCase(faker.random.words()),
  title: faker.random.words(),
  onChange: jest.fn(),
  onBlur: jest.fn(),
};

const fieldErrors = '[data-testid="field-error"]';

const loadAttributeInput = ({
  type,
  value,
  touched,
  errors,
  attributes,
  isRequired,
  isSet,
}) =>
  shallow(
    <AttributeInput
      {...mocks}
      type={type}
      value={value}
      touched={touched}
      errors={errors}
      attributes={attributes}
      isRequired={isRequired}
      isSet={isSet}
    />
  );

describe('attribute input', () => {
  beforeAll(() => {
    jest
      .spyOn(ApplicationContext, 'useApplicationContext')
      .mockImplementation(() => ({ project }));
  });

  describe('string type', () => {
    const type = TYPES.String;
    const input = '[data-testid="field-type-string"]';
    const value = faker.random.word();

    it('should display text input', () => {
      const wrapper = loadAttributeInput({ type, value });
      expect(wrapper.find(input).exists()).toEqual(true);
    });

    describe('when input touched without error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({ type, value, touched: true });
      });

      it('input should not have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(false);
      });

      it('should not display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(false);
      });
    });

    describe('when input not touched with error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({
          type,
          value,
          touched: false,
          errors: <FormattedMessage {...messages.requiredFieldError} />,
        });
      });

      it('input should not have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(false);
      });

      it('should not display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(false);
      });
    });

    describe('when input touched with error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({
          type,
          value,
          touched: true,
          errors: <FormattedMessage {...messages.requiredFieldError} />,
        });
      });

      it('input should have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(true);
      });

      it('should display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(true);
      });
    });
  });

  describe('number type', () => {
    const type = TYPES.Number;
    const input = '[data-testid="field-type-number"]';
    const value = faker.random.number({ min: 1, max: 10 });

    it('should display number input', () => {
      const wrapper = loadAttributeInput({ type, value });
      expect(wrapper.find(input).exists()).toEqual(true);
    });

    describe('when input touched without error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({ type, value, touched: true });
      });

      it('input should not have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(false);
      });

      it('should not display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(false);
      });
    });

    describe('when input not touched with error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({
          type,
          value,
          touched: false,
          errors: <FormattedMessage {...messages.requiredFieldError} />,
        });
      });

      it('input should not have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(false);
      });

      it('should not display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(false);
      });
    });

    describe('when input touched with error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({
          type,
          value,
          touched: true,
          errors: <FormattedMessage {...messages.requiredFieldError} />,
        });
      });

      it('input should have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(true);
      });

      it('should display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(true);
      });
    });
  });

  describe('boolean type', () => {
    const type = TYPES.Boolean;
    const input = '[data-testid="field-type-boolean"]';
    const value = faker.random.boolean();

    it('should display checkbox input', () => {
      const wrapper = loadAttributeInput({ type, value });
      expect(wrapper.find(input).exists()).toEqual(true);
    });

    describe('when input touched without error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({ type, value, touched: true });
      });

      it('input should not have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(false);
      });

      it('should not display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(false);
      });
    });

    describe('when input not touched with error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({
          type,
          value,
          touched: false,
          errors: <FormattedMessage {...messages.requiredFieldError} />,
        });
      });

      it('input should not have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(false);
      });

      it('should not display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(false);
      });
    });

    describe('when input touched with error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({
          type,
          value,
          touched: true,
          errors: <FormattedMessage {...messages.requiredFieldError} />,
        });
      });

      it('input should have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(true);
      });

      it('should display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(true);
      });
    });
  });

  describe('money type', () => {
    const type = TYPES.Money;
    const input = '[data-testid="field-type-money"]';
    const value = {
      amount: JSON.stringify(faker.random.number({ min: 1000, max: 2000 })),
      currencyCode: faker.random.arrayElement(project.currencies),
    };

    it('should display money input', () => {
      const wrapper = loadAttributeInput({ type, value });
      expect(wrapper.find(input).exists()).toEqual(true);
    });

    describe('when currency input touched without error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({
          type,
          value,
          touched: {
            currencyCode: true,
          },
        });
      });

      it('input should not have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(false);
      });

      it('should not display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(false);
      });
    });

    describe('when amount input touched without error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({
          type,
          value,
          touched: { amount: true },
        });
      });

      it('input should not have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(false);
      });

      it('should not display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(false);
      });
    });

    describe('when input not touched with error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({
          type,
          value,
          errors: {
            amount: <FormattedMessage {...messages.requiredFieldError} />,
          },
        });
      });

      it('input should not have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(false);
      });

      it('should not display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(false);
      });
    });

    describe('when amount input touched with error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({
          type,
          value,
          touched: { amount: true },
          errors: {
            amount: <FormattedMessage {...messages.requiredFieldError} />,
          },
        });
      });

      it('input should have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(true);
      });

      it('should display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(true);
      });
    });
  });

  describe('enum type', () => {
    const type = TYPES.Enum;
    const input = '[data-testid="field-type-enum"]';
    const value = faker.random.word();

    it('should display enum input', () => {
      const wrapper = loadAttributeInput({ type, value });
      expect(wrapper.find(input).exists()).toEqual(true);
    });

    it('when input is not required and not in a set, should be clearable', () => {
      const wrapper = loadAttributeInput({
        type,
        value,
        isRequired: false,
        isSet: false,
      });
      expect(wrapper.find(input).prop('isClearable')).toEqual(true);
    });

    it('when input is not required and in a set, should not be clearable', () => {
      const wrapper = loadAttributeInput({
        type,
        value,
        isRequired: false,
        isSet: true,
      });
      expect(wrapper.find(input).prop('isClearable')).toEqual(false);
    });

    it('when input is required and in a set, should not be clearable', () => {
      const wrapper = loadAttributeInput({
        type,
        value,
        isRequired: true,
        isSet: true,
      });
      expect(wrapper.find(input).prop('isClearable')).toEqual(false);
    });

    it('when input is required and not in a set, should not be clearable', () => {
      const wrapper = loadAttributeInput({
        type,
        value,
        isRequired: true,
        isSet: false,
      });
      expect(wrapper.find(input).prop('isClearable')).toEqual(false);
    });

    describe('when input touched without error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({ type, value, touched: true });
      });

      it('input should not have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(false);
      });

      it('should not display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(false);
      });
    });

    describe('when input not touched with error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({
          type,
          value,
          errors: <FormattedMessage {...messages.requiredFieldError} />,
        });
      });

      it('input should not have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(false);
      });

      it('should not display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(false);
      });
    });

    describe('when input touched with error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({
          type,
          value,
          touched: true,
          errors: <FormattedMessage {...messages.requiredFieldError} />,
        });
      });

      it('input should have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(true);
      });

      it('should display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(true);
      });
    });
  });

  describe('reference type', () => {
    const type = TYPES.Reference;
    const input = '[data-testid="field-type-reference"]';
    const value = {
      typeId: faker.random.arrayElement(Object.values(REFERENCE_TYPES)),
      id: faker.random.uuid(),
    };

    it('should display checkbox input', () => {
      const wrapper = loadAttributeInput({ type, value });
      expect(wrapper.find(input).exists()).toEqual(true);
    });

    describe('when input touched without error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({ type, value, touched: { id: true } });
      });

      it('input should not have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(false);
      });

      it('should not display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(false);
      });
    });

    describe('when input not touched with error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({
          type,
          value,
          touched: {
            id: <FormattedMessage {...messages.requiredFieldError} />,
          },
        });
      });

      it('input should not have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(false);
      });

      it('should not display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(false);
      });
    });

    describe('when input touched with error', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = loadAttributeInput({
          type,
          value,
          touched: { id: true },
          errors: { id: <FormattedMessage {...messages.requiredFieldError} /> },
        });
      });

      it('input should have error', () => {
        expect(wrapper.find(input).prop('hasError')).toEqual(true);
      });

      it('should display error', () => {
        expect(wrapper.find(fieldErrors).exists()).toEqual(true);
      });
    });
  });

  describe('object type', () => {
    const type = TYPES.Object;
    const container = generateContainer();
    const { attributes } = container.value;
    const value = getValue(
      type,
      attributes,
      faker.random.arrayElement(Object.values(REFERENCE_TYPES)),
      project.currencies
    );

    it('should display attribute fields', () => {
      const wrapper = loadAttributeInput({
        type,
        value,
        attributes,
      });
      expect(wrapper.find(AttributeField).length).toEqual(attributes.length);
    });
  });

  it('unknown type, should display nothing', () => {
    const wrapper = loadAttributeInput({ type: 'banana' });
    expect(wrapper).toEqual({});
  });
});

import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';
import camelCase from 'lodash/camelCase';
import { FieldArray } from 'formik';
import { REFERENCE_TYPES, TYPES } from '../container-form/constants';
import AttributeField from './attribute-field';
import { generateContainer } from '../../test-util';
import { getValue } from './util';
import AttributeInput from './attribute-input';

const container = generateContainer();

const mocks = {
  type: faker.random.arrayElement(Object.values(TYPES)),
  title: faker.random.words(),
  isRequired: faker.random.boolean(),
  name: camelCase(faker.random.words()),
  touched: null,
  errors: null,
  onChange: jest.fn(),
  onBlur: jest.fn(),
  attributes: container.value.attributes,
  reference: faker.random.arrayElement(Object.values(REFERENCE_TYPES))
};

const loadAttributeField = isSet => {
  const value = isSet ? [''] : '';
  return shallow(<AttributeField {...mocks} isSet={isSet} value={value} />);
};

describe('attribute field', () => {
  describe('when attribute is a set', () => {
    const fieldArrayMocks = {
      push: jest.fn(),
      remove: jest.fn()
    };

    const loadAttributes = wrapper =>
      shallow(
        wrapper
          .find(FieldArray)
          .props()
          .render(fieldArrayMocks)
      );

    let attributes;

    beforeEach(() => {
      const wrapper = loadAttributeField(true);
      attributes = loadAttributes(wrapper);
    });

    it('should display attribute label', () => {
      expect(
        attributes.find('[data-testid="set-attribute-label"]').exists()
      ).toEqual(true);
    });

    it('should display set of attribute inputs', () => {
      expect(attributes.find(AttributeInput).length).toEqual(1);
    });

    it('when add button clicked, should display an additional attribute', () => {
      attributes
        .find('[data-testid="add-attribute"]')
        .props()
        .onClick();
      expect(fieldArrayMocks.push).toHaveBeenCalledWith(
        getValue(mocks.type, mocks.attributes)
      );
    });

    it('when remove button clicked, should remove attribute from display', () => {
      const index = 0;
      attributes
        .find(`[data-testid="remove-attribute-${index}"]`)
        .props()
        .onClick();
      expect(fieldArrayMocks.remove).toHaveBeenCalledWith(index);
    });
  });

  describe('when attribute is a single item', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = loadAttributeField(false);
    });

    it('should display attribute label', () => {
      expect(
        wrapper.find('[data-testid="single-attribute-label"]').exists()
      ).toEqual(true);
    });

    it('should display attribute input', () => {
      expect(
        wrapper.find('[data-testid="single-attribute-input"]').exists()
      ).toEqual(true);
    });
  });
});

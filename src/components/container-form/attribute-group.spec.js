import React from 'react';
import { shallow } from 'enzyme';
import kebabCase from 'lodash/kebabCase';
import faker from 'faker';
import { ATTRIBUTES, TYPES } from './constants';
import AttributeGroup from './attribute-group';
import ObjectAttributes from './object-attributes';
import ReferenceAttribute from './reference-attribute';
import Attribute from './attribute';
import EnumAttributes from './enum-attributes';

const mockValue = {
  name: faker.random.words(),
  type: faker.random.arrayElement(Object.values(TYPES)),
  required: faker.random.boolean(),
  set: faker.random.boolean(),
};

const mocks = {
  name: kebabCase(faker.random.words()),
  touched: {},
  errors: {},
  handleBlur: jest.fn(),
  handleChange: jest.fn(),
  remove: jest.fn(),
  removeDisabled: faker.random.boolean(),
};

const loadAttributeGroup = (value = mockValue) =>
  shallow(<AttributeGroup value={value} {...mocks} />);

describe('attribute group', () => {
  beforeEach(() => {
    mocks.handleChange.mockClear();
  });

  it('when value type is object, should display object attributes', () => {
    const value = { ...mockValue, type: TYPES.Object, attributes: [mockValue] };
    const wrapper = loadAttributeGroup(value);
    expect(wrapper.find(ObjectAttributes).exists()).toEqual(true);
  });

  it('when value type is reference, should display reference attribute', () => {
    const value = { ...mockValue, type: TYPES.Reference, reference: '' };
    const wrapper = loadAttributeGroup(value);
    expect(wrapper.find(ReferenceAttribute).exists()).toEqual(true);
  });

  it('when value type is enum, should display enum options', () => {
    const value = { ...mockValue, type: TYPES.Enum, enum: [] };
    const wrapper = loadAttributeGroup(value);
    expect(wrapper.find(EnumAttributes).exists()).toEqual(true);
  });

  describe('when attribute value changes', () => {
    const value = { ...mockValue, type: TYPES.String };

    it('with not attribute type, should call handle change', () => {
      const event = {
        target: {
          name: `${mocks.name}.${ATTRIBUTES.Required}`,
          value: faker.random.boolean(),
        },
      };
      const wrapper = loadAttributeGroup(value);
      wrapper.find(Attribute).props().handleChange(event);
      expect(mocks.handleChange).toHaveBeenCalledWith(event);
    });

    it('with attribute type of not object or reference, should call handle change', () => {
      const event = {
        target: {
          name: `${mocks.name}.${ATTRIBUTES.Type}`,
          value: TYPES.Boolean,
        },
      };
      const wrapper = loadAttributeGroup(value);
      wrapper.find(Attribute).props().handleChange(event);
      expect(mocks.handleChange).toHaveBeenCalledWith(event);
    });

    describe('with attribute type of object', () => {
      const event = {
        target: {
          name: `${mocks.name}.${ATTRIBUTES.Type}`,
          value: TYPES.Object,
        },
      };
      let wrapper;

      beforeEach(() => {
        wrapper = loadAttributeGroup(value);
        wrapper.find(Attribute).props().handleChange(event);
      });

      it('should call handle change with empty attribute value', () => {
        expect(mocks.handleChange).toHaveBeenCalledWith({
          target: {
            name: `${mocks.name}.${ATTRIBUTES.Attributes}`,
            value: [
              {
                name: '',
                type: '',
                set: false,
                required: false,
              },
            ],
          },
        });
      });

      it('should call handle change with attribute type change', () => {
        expect(mocks.handleChange).toHaveBeenCalledWith(event);
      });
    });

    describe('with attribute type of reference', () => {
      const event = {
        target: {
          name: `${mocks.name}.${ATTRIBUTES.Type}`,
          value: TYPES.Reference,
        },
      };
      let wrapper;

      beforeEach(() => {
        wrapper = loadAttributeGroup(value);
        wrapper.find(Attribute).props().handleChange(event);
      });

      it('should call handle change with empty reference value', () => {
        expect(mocks.handleChange).toHaveBeenCalledWith({
          target: {
            name: `${mocks.name}.${ATTRIBUTES.Reference}`,
            value: '',
          },
        });
      });

      it('should call handle change with attribute type change', () => {
        expect(mocks.handleChange).toHaveBeenCalledWith(event);
      });
    });

    describe('with attribute type of enum', () => {
      const event = {
        target: {
          name: `${mocks.name}.${ATTRIBUTES.Type}`,
          value: TYPES.Enum,
        },
      };
      let wrapper;

      beforeEach(() => {
        wrapper = loadAttributeGroup(value);
        wrapper.find(Attribute).props().handleChange(event);
      });

      it('should call handle change with empty enum value', () => {
        expect(mocks.handleChange).toHaveBeenCalledWith({
          target: {
            name: `${mocks.name}.${ATTRIBUTES.Enum}`,
            value: [{ value: '', label: '' }],
          },
        });
      });

      it('should call handle change with attribute type change', () => {
        expect(mocks.handleChange).toHaveBeenCalledWith(event);
      });
    });
  });
});

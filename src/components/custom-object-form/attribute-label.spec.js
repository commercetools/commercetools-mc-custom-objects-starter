import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';
import capitalize from 'lodash/capitalize';
import FieldLabel from '@commercetools-uikit/field-label';
import { REFERENCE_TYPES, TYPES } from '../container-form/constants';
import AttributeLabel from './attribute-label';

const mocks = {
  title: faker.random.words()
};

const loadAttributeLabel = (type, isRequired, reference) =>
  shallow(
    <AttributeLabel
      {...mocks}
      type={type}
      isRequired={isRequired}
      reference={reference}
    />
  );

describe('attribute label', () => {
  it('when type is boolean, should not display label', () => {
    const wrapper = loadAttributeLabel(TYPES.Boolean);
    expect(wrapper).toEqual({});
  });

  it('when type is not boolean, should display label with title', () => {
    const wrapper = loadAttributeLabel(TYPES.String);
    expect(wrapper.find(FieldLabel).prop('title')).toEqual(mocks.title);
  });

  it('when attribute is required, should display required indicator', () => {
    const wrapper = loadAttributeLabel(TYPES.Object, true);
    expect(wrapper.find(FieldLabel).prop('hasRequiredIndicator')).toEqual(true);
  });

  it('when attribute is not required, should not display required indicator', () => {
    const wrapper = loadAttributeLabel(TYPES.Object, false);
    expect(wrapper.find(FieldLabel).prop('hasRequiredIndicator')).toEqual(
      false
    );
  });

  it('when attribute has reference, should display label hint with reference type', () => {
    const reference = faker.random.arrayElement(Object.values(REFERENCE_TYPES));
    const wrapper = loadAttributeLabel(
      TYPES.Reference,
      faker.random.boolean(),
      reference
    );
    expect(wrapper.find(FieldLabel).prop('hint')).toContain(
      capitalize(reference)
    );
  });

  it('when attribute does not have reference, should not display hint', () => {
    const wrapper = loadAttributeLabel(TYPES.Number);
    expect(wrapper.find(FieldLabel).prop('hint')).toEqual('');
  });
});

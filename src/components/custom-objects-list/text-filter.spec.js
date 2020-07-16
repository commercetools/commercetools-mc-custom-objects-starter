import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';
import TextFilter, { ENTER } from './text-filter';

let wrapper;
const mocks = {
  value: '',
  onChange: jest.fn((value) => {
    wrapper.setProps({ value });
  }),
  onSubmit: jest.fn(),
  placeholder: faker.random.words(),
};

const filterWrapper = '[data-testid="filter-wrapper"]';
const filterInput = '[data-testid="filter-input"]';
const clearButton = '[data-testid="clear-button"]';
const filterButton = '[data-testid="filter-button"]';

const loadTextFilter = () => shallow(<TextFilter {...mocks} />);

describe('text filter', () => {
  describe('when no value entered', () => {
    beforeEach(() => {
      wrapper = loadTextFilter();
    });

    it('should not display clear button', () => {
      expect(wrapper.find(clearButton).exists()).toEqual(false);
    });

    it('should not autofocus input', () => {
      expect(wrapper.find(filterInput).props().isAutofocussed).toEqual(false);
    });

    it('should display filter button', () => {
      expect(wrapper.find(filterButton).exists()).toEqual(true);
    });

    it('should not display clear button', () => {
      expect(wrapper.find(clearButton).exists()).toEqual(false);
    });
  });

  describe('when value entered', () => {
    const newFilter = 'new query';

    beforeEach(() => {
      wrapper = loadTextFilter();
      wrapper
        .find(filterInput)
        .simulate('change', { target: { value: newFilter } });
    });

    it('should update filter value', () => {
      expect(mocks.onChange).toHaveBeenCalledWith(newFilter);
    });

    it('should autofocus input', () => {
      expect(wrapper.find(filterInput).prop('isAutofocussed')).toEqual(true);
    });

    it('should display filter button', () => {
      expect(wrapper.find(filterButton).exists()).toEqual(true);
    });

    it('should not display clear button', () => {
      expect(wrapper.find(clearButton).exists()).toEqual(false);
    });

    describe('when filter is performed', () => {
      beforeEach(() => {
        wrapper.find(filterButton).simulate('click');
      });

      it('should display clear button', () => {
        expect(wrapper.find(clearButton).exists()).toEqual(true);
      });

      it('when clear button clicked, should clear filter input', () => {
        wrapper.find(clearButton).simulate('click');
        expect(wrapper.find(filterInput).prop('value')).toEqual('');
      });
    });

    it('when enter pressed in input, should perform filter', () => {
      wrapper.find(filterWrapper).simulate('keypress', { key: ENTER });
      expect(wrapper.find(clearButton).exists()).toEqual(true);
    });

    it('when non-enter pressed in input, should not perform filter', () => {
      wrapper.find(filterWrapper).simulate('keypress', { key: 'a' });
      expect(wrapper.find(clearButton).exists()).toEqual(false);
    });
  });
});

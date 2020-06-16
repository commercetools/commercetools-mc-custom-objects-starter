import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';
import first from 'lodash/first';
import last from 'lodash/last';
import times from 'lodash/times';
import { useQuery, setQuery } from '@apollo/react-hooks';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import { PaginatedTable } from '@custom-applications-local/core/components';
import { SORT_OPTIONS } from '@custom-applications-local/core/constants';
import CustomObjectsList, { ENTER } from './custom-objects-list';
import GetCustomObjects from '../get-custom-objects.rest.graphql';
import { DEFAULT_VARIABLES, PAGE_SIZE } from './constants';
import { COLUMN_KEYS } from './column-definitions';

const generateCustomObject = () => ({
  container: faker.random.words(),
  key: faker.random.word(),
  value: faker.random.words(),
  lastModifiedAt: faker.date.recent()
});

const generateCustomObjects = (
  total = faker.random.number({ min: 1, max: 10 })
) => ({
  customObjects: {
    count: total,
    total,
    offset: 0,
    results: times(total, generateCustomObject)
  }
});

const mocks = {
  match: {
    url: faker.internet.url()
  }
};

const loadCustomObjectsList = () => shallow(<CustomObjectsList {...mocks} />);

describe('custom objects list', () => {
  beforeEach(() => {
    useQuery.mockClear();
  });

  it('should retrieve custom objects', () => {
    loadCustomObjectsList();
    expect(useQuery).toHaveBeenCalledWith(GetCustomObjects, {
      variables: {
        ...DEFAULT_VARIABLES,
        sort: `${COLUMN_KEYS.MODIFIED} ${SORT_OPTIONS.DESC}`
      }
    });
  });

  it('should display title', () => {
    const wrapper = loadCustomObjectsList();
    expect(wrapper.find('[data-testid="title"]').exists()).toEqual(true);
  });

  describe('when custom object query fails', () => {
    let wrapper;
    beforeEach(() => {
      setQuery({ error: { message: 'failed to load' } });
      wrapper = loadCustomObjectsList();
    });

    it('should display error message', () => {
      expect(wrapper.find('[data-testid="loading-error"]').exists()).toEqual(
        true
      );
    });

    it('should not display custom object list', () => {
      expect(wrapper.find(PaginatedTable).exists()).toEqual(false);
    });
  });

  describe('when custom object query returns data', () => {
    let wrapper;
    beforeEach(() => {
      setQuery({ data: generateCustomObjects() });
      wrapper = loadCustomObjectsList();
    });

    it('should display result count', () => {
      expect(wrapper.find('[data-testid="subtitle"]').exists()).toEqual(true);
    });

    it('should display custom object list', () => {
      expect(wrapper.find(PaginatedTable).exists()).toEqual(true);
    });
  });

  describe('when custom object returns an empty list', () => {
    let wrapper;
    beforeEach(() => {
      setQuery({ data: generateCustomObjects(0) });
      wrapper = loadCustomObjectsList();
    });

    it('should not display result count', () => {
      expect(wrapper.find('[data-testid="subtitle"]').exists()).toEqual(false);
    });

    it('should not display custom object list', () => {
      expect(wrapper.find(PaginatedTable).exists()).toEqual(false);
    });

    it('should display error message', () => {
      expect(wrapper.find('[data-testid="no-results-error"]').exists()).toEqual(
        true
      );
    });
  });

  describe('list columns', () => {
    const data = generateCustomObjects();

    it('should render fallback for default column', () => {
      setQuery({ data });
      const wrapper = loadCustomObjectsList();
      const actual = wrapper
        .find(PaginatedTable)
        .props()
        .itemRenderer({ rowIndex: 0 });
      expect(actual).toEqual(NO_VALUE_FALLBACK);
    });

    it('should render custom object container for container column', () => {
      setQuery({ data });
      const { container } = first(data.customObjects.results);
      const wrapper = loadCustomObjectsList();
      const actual = wrapper
        .find(PaginatedTable)
        .props()
        .itemRenderer({ rowIndex: 0, columnKey: COLUMN_KEYS.CONTAINER });
      expect(actual).toEqual(container);
    });

    it('should render custom object key for key column', () => {
      setQuery({ data });
      const { key } = first(data.customObjects.results);
      const wrapper = loadCustomObjectsList();
      const actual = wrapper
        .find(PaginatedTable)
        .props()
        .itemRenderer({ rowIndex: 0, columnKey: COLUMN_KEYS.KEY });
      expect(actual).toEqual(key);
    });

    it('should render custom object last modified date for last modified column', () => {
      setQuery({ data });
      const { lastModifiedAt } = first(data.customObjects.results);
      const wrapper = loadCustomObjectsList();
      const actual = wrapper
        .find(PaginatedTable)
        .props()
        .itemRenderer({ rowIndex: 0, columnKey: COLUMN_KEYS.MODIFIED });
      expect(actual.props.value).toEqual(lastModifiedAt);
    });

    it('when custom object value is a string, should render value for value column', () => {
      setQuery({ data });
      const { value } = first(data.customObjects.results);
      const wrapper = loadCustomObjectsList();
      const actual = wrapper
        .find(PaginatedTable)
        .props()
        .itemRenderer({ rowIndex: 0, columnKey: COLUMN_KEYS.VALUE });
      expect(actual).toEqual(value.toString());
    });

    it('when custom object value is a number, should render string value for value column', () => {
      const value = faker.random.number({ min: 1, max: 10 });
      const customObject = {
        ...generateCustomObject(),
        value
      };
      setQuery({
        data: {
          customObjects: {
            total: 1,
            count: 1,
            offset: 0,
            results: [customObject]
          }
        }
      });
      const wrapper = loadCustomObjectsList();
      const actual = wrapper
        .find(PaginatedTable)
        .props()
        .itemRenderer({ rowIndex: 0, columnKey: COLUMN_KEYS.VALUE });
      expect(actual).toEqual(value.toString());
    });

    it('when custom object value is a boolean, should render string value for value column', () => {
      const value = faker.random.boolean();
      const customObject = {
        ...generateCustomObject(),
        value
      };
      setQuery({
        data: {
          customObjects: {
            total: 1,
            count: 1,
            offset: 0,
            results: [customObject]
          }
        }
      });
      const wrapper = loadCustomObjectsList();
      const actual = wrapper
        .find(PaginatedTable)
        .props()
        .itemRenderer({ rowIndex: 0, columnKey: COLUMN_KEYS.VALUE });
      expect(actual).toEqual(value.toString());
    });
  });

  describe('container filter', () => {
    const filter = "[data-testid='container-filter']";
    const input = "[data-testid='container-filter-input']";
    const search = "[data-testid='container-filter-search']";
    const clear = "[data-testid='container-filter-clear']";

    const value = 'container-search';

    let wrapper;
    beforeEach(() => {
      setQuery({ data: generateCustomObjects() });
      wrapper = loadCustomObjectsList();
    });

    it('when search button clicked and container input has value, should query for custom objects in container', () => {
      wrapper
        .find(input)
        .props()
        .onChange({ target: { value } });
      wrapper
        .find(search)
        .props()
        .onClick();
      const result = last(useQuery.mock.calls)[1];
      expect(result.variables.where).toEqual(`container="${value}"`);
    });

    it('when search button clicked and container input has no value, should query for all custom objects', () => {
      wrapper
        .find(search)
        .props()
        .onClick();
      const result = last(useQuery.mock.calls)[1];
      expect(result.variables.where).toBeUndefined();
    });

    it('when enter pressed and container input has value, should query for custom objects in container', () => {
      wrapper
        .find(input)
        .props()
        .onChange({ target: { value } });
      wrapper
        .find(filter)
        .props()
        .onKeyPress({ key: ENTER });
      const result = last(useQuery.mock.calls)[1];
      expect(result.variables.where).toEqual(`container="${value}"`);
    });

    it('when enter pressed and container input has no value, should query for all custom objects', () => {
      wrapper
        .find(filter)
        .props()
        .onKeyPress({ key: ENTER });
      const result = last(useQuery.mock.calls)[1];
      expect(result.variables.where).toBeUndefined();
    });

    it('when non-enter key pressed, should not query for custom objects', () => {
      wrapper
        .find(filter)
        .props()
        .onKeyPress({ key: 'Tab' });
      expect(useQuery).toHaveBeenCalledTimes(1);
    });

    describe('when clear button clicked', () => {
      beforeEach(() => {
        wrapper
          .find(input)
          .props()
          .onChange({ target: { value } });
        wrapper
          .find(clear)
          .props()
          .onClick();
      });

      it('should query for all custom objects', () => {
        const result = last(useQuery.mock.calls)[1];
        expect(result.variables.where).toBeUndefined();
      });

      it('should reset input value', () => {
        expect(wrapper.find(input).prop('value')).toEqual('');
      });
    });
  });

  it('when next pagination button clicked, should query for next page', () => {
    setQuery({ data: generateCustomObjects() });
    const wrapper = loadCustomObjectsList();
    wrapper
      .find(PaginatedTable)
      .props()
      .next();
    const result = last(useQuery.mock.calls)[1];
    expect(result.variables.offset).toEqual(PAGE_SIZE);
  });

  // In the UI, clicking previous on the first page is disallowed, but for ease of testing
  // that's what is happening here, hence the strange expectation.
  it('when previous pagination button clicked, should query for previous page', () => {
    setQuery({ data: generateCustomObjects() });
    const wrapper = loadCustomObjectsList();
    wrapper
      .find(PaginatedTable)
      .props()
      .previous();
    const result = last(useQuery.mock.calls)[1];
    expect(result.variables.offset).toEqual(-PAGE_SIZE);
  });

  it('when table column sort direction clicked, should update table sort order', () => {
    setQuery({ data: generateCustomObjects() });
    const wrapper = loadCustomObjectsList();
    wrapper
      .find(PaginatedTable)
      .props()
      .onSortChange(COLUMN_KEYS.MODIFIED, SORT_OPTIONS.DESC);
    wrapper.update();
    const result = last(useQuery.mock.calls)[1];
    expect(result.variables.sort).toEqual(
      `${COLUMN_KEYS.MODIFIED} ${SORT_OPTIONS.DESC}`
    );
  });
});

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
import { generateContainerContext } from '../../test-util';
import * as ContainerContext from '../../context/container-context';
import GetCustomObjects from '../get-custom-objects.rest.graphql';
import CustomObjectsList from './custom-objects-list';
import { DEFAULT_VARIABLES, PAGE_SIZE } from './constants';
import { COLUMN_KEYS } from './column-definitions';

const containerContext = generateContainerContext();

const generateCustomObject = () => ({
  container: faker.random.words(),
  key: faker.random.word(),
  value: faker.random.words(),
  lastModifiedAt: faker.date.recent(),
});

const generateCustomObjects = (
  total = faker.random.number({ min: 1, max: 10 })
) => ({
  customObjects: {
    count: total,
    total,
    offset: 0,
    results: times(total, generateCustomObject),
  },
});

const mocks = {
  match: {
    url: faker.internet.url(),
  },
  history: {
    push: jest.fn(),
  },
};

const createButton = '[data-testid="create-custom-object"]';
const filter = '[data-testid="container-filter"]';
const noContainerError = '[data-testid="no-containers-error"]';

const loadCustomObjectsList = () => shallow(<CustomObjectsList {...mocks} />);

describe('custom objects list', () => {
  beforeAll(() => {
    jest
      .spyOn(ContainerContext, 'useContainerContext')
      .mockImplementation(() => containerContext);
  });

  beforeEach(() => {
    useQuery.mockClear();
  });

  it('should retrieve custom objects', () => {
    loadCustomObjectsList();
    expect(useQuery).toHaveBeenCalledWith(GetCustomObjects, {
      variables: {
        ...DEFAULT_VARIABLES,
        sort: `${COLUMN_KEYS.MODIFIED} ${SORT_OPTIONS.DESC}`,
        where: containerContext.where,
      },
      skip: false,
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
        value,
      };
      setQuery({
        data: {
          customObjects: {
            total: 1,
            count: 1,
            offset: 0,
            results: [customObject],
          },
        },
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
        value,
      };
      setQuery({
        data: {
          customObjects: {
            total: 1,
            count: 1,
            offset: 0,
            results: [customObject],
          },
        },
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
    const value = 'container-search';
    let wrapper;

    beforeEach(() => {
      setQuery({ data: generateCustomObjects() });
      wrapper = loadCustomObjectsList();
    });

    it('when container selected, should query for custom objects in selected container', () => {
      wrapper.find(filter).props().onChange({ target: { value } });
      const result = last(useQuery.mock.calls)[1];
      expect(result.variables.where).toEqual(`container="${value}"`);
    });

    it('when container cleared, should query for custom objects in all managed containers', () => {
      wrapper
        .find(filter)
        .props()
        .onChange({ target: { value: '' } });
      const result = last(useQuery.mock.calls)[1];
      expect(result.variables.where).toEqual(containerContext.where);
    });
  });

  it('when next pagination button clicked, should query for next page', () => {
    setQuery({ data: generateCustomObjects() });
    const wrapper = loadCustomObjectsList();
    wrapper.find(PaginatedTable).props().next();
    const result = last(useQuery.mock.calls)[1];
    expect(result.variables.offset).toEqual(PAGE_SIZE);
  });

  // In the UI, clicking previous on the first page is disallowed, but for ease of testing
  // that's what is happening here, hence the strange expectation.
  it('when previous pagination button clicked, should query for previous page', () => {
    setQuery({ data: generateCustomObjects() });
    const wrapper = loadCustomObjectsList();
    wrapper.find(PaginatedTable).props().previous();
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

  it('when row clicked, should open custom object details', () => {
    const data = generateCustomObjects(1);
    const customObject = data.customObjects.results[0];
    setQuery({ data });
    const wrapper = loadCustomObjectsList();
    wrapper.find(PaginatedTable).props().onRowClick({}, 0);
    expect(mocks.history.push).toHaveBeenCalledWith(
      `${mocks.match.url}/${customObject.id}/general`
    );
  });

  describe('when container context has containers', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = loadCustomObjectsList();
    });

    it('should display container filter', () => {
      expect(wrapper.find(filter).exists()).toEqual(true);
    });

    it('should display create custom object button', () => {
      expect(wrapper.find(createButton).exists()).toEqual(true);
    });

    it('should not display no container error', () => {
      expect(wrapper.find(noContainerError).exists()).toEqual(false);
    });
  });

  describe('when container context has no containers', () => {
    let wrapper;

    beforeAll(() => {
      jest
        .spyOn(ContainerContext, 'useContainerContext')
        .mockImplementation(() => ({
          hasContainers: false,
          containers: [],
          where: '',
        }));
    });

    beforeEach(() => {
      wrapper = loadCustomObjectsList();
    });

    it('should not display container filter', () => {
      expect(wrapper.find(filter).exists()).toEqual(false);
    });

    it('should not display create custom object button', () => {
      expect(wrapper.find(createButton).exists()).toEqual(false);
    });

    it('should display no container error', () => {
      expect(wrapper.find(noContainerError).exists()).toEqual(true);
    });
  });
});

import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';
import { Route } from 'react-router';
import { setQuery, useQuery } from '@apollo/react-hooks';
import { generateContainer } from '../../test-util';
import GetCustomObject from '../get-custom-object.rest.graphql';
import CustomObjectDetails from './custom-object-details';

const mocks = {
  match: {
    params: {
      id: faker.random.uuid(),
      projectKey: 'test-project'
    },
    url: faker.internet.url()
  }
};

const loadCustomObjectDetails = () =>
  shallow(<CustomObjectDetails {...mocks} />);

describe('custom object details', () => {
  it('should query for custom object by id', () => {
    loadCustomObjectDetails();
    expect(useQuery).toHaveBeenCalledWith(GetCustomObject, {
      variables: { id: mocks.match.params.id }
    });
  });

  it('when custom object query fails, should display error message', () => {
    setQuery({ error: { message: 'failed to load' } });
    const wrapper = loadCustomObjectDetails();
    expect(wrapper.find('[data-testid="loading-error"]').exists()).toEqual(
      true
    );
  });

  it('when custom object query returns data, should display edit custom object form', () => {
    setQuery({ data: generateContainer() });
    const wrapper = loadCustomObjectDetails();
    expect(wrapper.find(Route).prop('path')).toEqual(
      `${mocks.match.url}/general`
    );
  });
});

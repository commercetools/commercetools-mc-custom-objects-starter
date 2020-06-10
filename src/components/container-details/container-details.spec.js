import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';
import { Route } from 'react-router';
import { setQuery, useQuery } from '@apollo/react-hooks';
import { generateContainer } from '../../test-util';
import GetContainer from '../get-custom-object.rest.graphql';
import ContainerDetails from './container-details';

const mocks = {
  match: {
    params: {
      id: faker.random.uuid(),
      projectKey: 'test-project'
    },
    url: faker.internet.url()
  }
};

const loadContainerDetails = () => shallow(<ContainerDetails {...mocks} />);

describe('container details', () => {
  it('should query for container by id', () => {
    loadContainerDetails();
    expect(useQuery).toHaveBeenCalledWith(GetContainer, {
      variables: { id: mocks.match.params.id }
    });
  });

  it('when container query fails, should display error message', () => {
    setQuery({ error: { message: 'failed to load' } });
    const wrapper = loadContainerDetails();
    expect(wrapper.find('[data-testid="loading-error"]').exists()).toEqual(
      true
    );
  });

  it('when container query returns data, should display edit container form', () => {
    setQuery({ data: generateContainer() });
    const wrapper = loadContainerDetails();
    expect(wrapper.find(Route).prop('path')).toEqual(
      `${mocks.match.url}/general`
    );
  });
});

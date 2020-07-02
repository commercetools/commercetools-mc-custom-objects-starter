import React from 'react';
import { shallow } from 'enzyme';
import { Route } from 'react-router';
import * as AppContext from '@commercetools-frontend/application-shell-connectors';
import { ApplicationCustomObjects } from './entry-point';
import { ROOT_PATH } from '../../constants';

const environment = {
  mcApiUrl: 'https://mc-api.commercetools.co',
};

const project = {
  key: 'test-project',
};

jest.mock('apollo-link-rest');
jest.mock('apollo-client');

describe('rendering', () => {
  let wrapper;
  beforeEach(() => {
    jest
      .spyOn(AppContext, 'useApplicationContext')
      .mockImplementation(() => ({ environment, project }));
    wrapper = shallow(<ApplicationCustomObjects />);
  });

  it('should render main route', () => {
    expect(wrapper.find(Route).prop('path')).toEqual(
      `/:projectKey/${ROOT_PATH}`
    );
  });
});

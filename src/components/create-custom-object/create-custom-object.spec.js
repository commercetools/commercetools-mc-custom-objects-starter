import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';
import kebabCase from 'lodash/kebabCase';
import { FormattedMessage } from 'react-intl';
import {
  getMutation,
  setMutation,
  setQuery,
  useQuery
} from '@apollo/react-hooks';
import { mockShowNotification } from '@commercetools-frontend/actions-global';
import { CONTAINER, ROOT_PATH } from '../../constants';
import { generateContainers } from '../../test-util';
import GetContainers from '../get-custom-objects.rest.graphql';
import CreateCustomObjectMutation from '../update-custom-object.rest.graphql';
import CreateCustomObject from './create-custom-object';
import CustomObjectForm from '../custom-object-form';
import messages from './messages';

const formValues = {
  container: kebabCase(faker.random.words())
};

const mocks = {
  match: {
    params: {
      projectKey: 'test-project'
    }
  },
  history: {
    push: jest.fn()
  }
};

const loadCreateCustomObject = () => shallow(<CreateCustomObject {...mocks} />);

describe('create custom object', () => {
  const submitForm = async (wrapper, values = formValues) =>
    wrapper
      .find(CustomObjectForm)
      .props()
      .onSubmit(values);

  beforeEach(() => {
    mockShowNotification.mockClear();
    mocks.history.push.mockClear();
  });

  it('should retrieve list of containers', () => {
    setQuery({ loading: true });
    loadCreateCustomObject();
    expect(useQuery).toHaveBeenCalledWith(GetContainers, {
      variables: { limit: 500, offset: 0, where: `container="${CONTAINER}"` }
    });
  });

  it('when containers query is loading, should pass empty containers to form', () => {
    setQuery({ loading: true });
    const wrapper = loadCreateCustomObject();
    expect(wrapper.find(CustomObjectForm).prop('containers')).toEqual([]);
  });

  it('when containers query returns data, should pass containers to form', () => {
    const data = generateContainers();
    setQuery({ data });
    const wrapper = loadCreateCustomObject();
    expect(wrapper.find(CustomObjectForm).prop('containers').length).toEqual(
      data.customObjects.results.length
    );
  });

  it('when form submitted, should create container with form values', () => {
    setMutation({ loading: true });
    const wrapper = loadCreateCustomObject();
    const mutation = getMutation(CreateCustomObjectMutation);
    submitForm(wrapper);
    expect(mutation).toHaveBeenCalledWith({
      variables: {
        body: formValues
      }
    });
  });

  it('when create container fails, should show error message', async () => {
    const error = { message: 'failed' };
    setMutation({ error });
    const wrapper = loadCreateCustomObject();
    await submitForm(wrapper).catch(() =>
      expect(mockShowNotification).toHaveBeenCalledWith({
        text: (
          <FormattedMessage
            {...messages.createError}
            values={{ message: error.message }}
          />
        )
      })
    );
  });

  describe('when create container succeeds', () => {
    const data = {};
    let wrapper;

    beforeEach(async () => {
      setMutation({ data });
      wrapper = loadCreateCustomObject();
      await submitForm(wrapper);
    });

    it('should display success message', () => {
      expect(mockShowNotification).toHaveBeenCalledWith({
        text: <FormattedMessage {...messages.createSuccess} />
      });
    });

    it('should redirect to main route', () => {
      expect(mocks.history.push).toHaveBeenCalledWith(
        `/${mocks.match.params.projectKey}/${ROOT_PATH}`
      );
    });
  });
});

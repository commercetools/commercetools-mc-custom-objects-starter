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
import { CONTAINER } from '../../constants';
import { generateContainers } from '../../test-util';
import GetContainers from '../get-custom-objects.rest.graphql';
import UpdateCustomObject from '../update-custom-object.rest.graphql';
import CustomObjectForm from '../custom-object-form';
import EditCustomObject from './edit-custom-object';
import messages from './messages';

const container = kebabCase(faker.random.words());
const formValues = {
  container,
  value: {}
};
const mocks = {
  customObject: {
    id: faker.random.uuid(),
    version: faker.random.number({ min: 1, max: 10 }),
    container,
    key: faker.random.word(),
    value: {}
  },
  onComplete: jest.fn()
};

const loadEditCustomObject = () => shallow(<EditCustomObject {...mocks} />);

describe('edit custom object', () => {
  const submitForm = async (wrapper, values = formValues) =>
    wrapper
      .find(CustomObjectForm)
      .props()
      .onSubmit(values);

  beforeEach(() => {
    mockShowNotification.mockClear();
  });

  it('should retrieve list of containers', () => {
    setQuery({ loading: true });
    loadEditCustomObject();
    expect(useQuery).toHaveBeenCalledWith(GetContainers, {
      variables: { limit: 500, offset: 0, where: `container="${CONTAINER}"` }
    });
  });

  it('when containers query is loading, should not display form', () => {
    setQuery({ loading: true });
    const wrapper = loadEditCustomObject();
    expect(wrapper.find(CustomObjectForm).exists()).toEqual(false);
  });

  it('when containers query returns data, should pass containers to form', () => {
    const data = generateContainers();
    setQuery({ data });
    const wrapper = loadEditCustomObject();
    expect(wrapper.find(CustomObjectForm).prop('containers').length).toEqual(
      data.customObjects.results.length
    );
  });

  it('when form submitted, should edit container with form values', () => {
    setMutation({ loading: true });
    const wrapper = loadEditCustomObject();
    const mutation = getMutation(UpdateCustomObject);
    submitForm(wrapper);
    expect(mutation).toHaveBeenCalledWith({
      variables: {
        body: formValues
      }
    });
  });

  it('when edit container fails, should show error message', async () => {
    const error = { message: 'failed' };
    setMutation({ error });
    const wrapper = loadEditCustomObject();
    await submitForm(wrapper).catch(() =>
      expect(mockShowNotification).toHaveBeenCalledWith({
        text: (
          <FormattedMessage
            {...messages.editError}
            values={{ message: error.message }}
          />
        )
      })
    );
  });

  describe('when edit container succeeds', () => {
    const data = {};
    let wrapper;

    beforeEach(async () => {
      setMutation({ data });
      wrapper = loadEditCustomObject();
      await submitForm(wrapper);
    });

    it('should display success message', () => {
      expect(mockShowNotification).toHaveBeenCalledWith({
        text: <FormattedMessage {...messages.editSuccess} />
      });
    });

    it('should invoke on complete prop', () => {
      expect(mocks.onComplete).toHaveBeenCalled();
    });
  });
});

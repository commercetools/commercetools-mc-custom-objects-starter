import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';
import kebabCase from 'lodash/kebabCase';
import { FormattedMessage } from 'react-intl';
import { getMutation, setMutation } from '@apollo/react-hooks';
import { mockShowNotification } from '@commercetools-frontend/actions-global';
import * as ContainerContext from '../../context/container-context';
import {
  generateContainerContext,
  generateCustomObject,
} from '../../test-util';
import UpdateCustomObject from '../update-custom-object.rest.graphql';
import CustomObjectForm from '../custom-object-form';
import EditCustomObject from './edit-custom-object';
import messages from './messages';

const containerContext = generateContainerContext();
const container = kebabCase(faker.random.words());

const formValues = {
  container,
  value: {},
};

const mocks = {
  customObject: generateCustomObject(),
  onComplete: jest.fn(),
};

const loadEditCustomObject = () => shallow(<EditCustomObject {...mocks} />);

describe('edit custom object', () => {
  const submitForm = async (wrapper, values = formValues) =>
    wrapper.find(CustomObjectForm).props().onSubmit(values);

  beforeEach(() => {
    jest
      .spyOn(ContainerContext, 'useContainerContext')
      .mockImplementation(() => containerContext);
    mockShowNotification.mockClear();
  });

  it('when form submitted, should edit container with form values', () => {
    setMutation({ loading: true });
    const wrapper = loadEditCustomObject();
    const mutation = getMutation(UpdateCustomObject);
    submitForm(wrapper);
    expect(mutation).toHaveBeenCalledWith({
      variables: {
        body: formValues,
      },
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
        ),
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
        text: <FormattedMessage {...messages.editSuccess} />,
      });
    });

    it('should invoke on complete prop', () => {
      expect(mocks.onComplete).toHaveBeenCalled();
    });
  });
});

import React from 'react';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import { getMutation, setMutation } from '@apollo/react-hooks';
import { mockShowNotification } from '@commercetools-frontend/actions-global';
import { generateContainer, generateFormValues } from '../../test-util';
import { CONTAINER } from '../../constants';
import UpdateContainer from '../update-custom-object.rest.graphql';
import ContainerForm from '../container-form';
import EditContainer from './edit-container';
import messages from './messages';

const formValues = generateFormValues();

const mocks = {
  container: generateContainer(),
  onComplete: jest.fn(),
};

const loadEditContainer = () => shallow(<EditContainer {...mocks} />);

describe('edit container', () => {
  const submitForm = async (wrapper, values = formValues) =>
    wrapper.find(ContainerForm).props().onSubmit(values);

  describe('when edit container fails', () => {
    const error = { message: 'failed' };
    let wrapper;

    beforeEach(() => {
      setMutation({ error });
      wrapper = loadEditContainer();
    });

    it('should not invoke on complete', async () => {
      await submitForm(wrapper).catch(() => {
        expect(mocks.onComplete).not.toHaveBeenCalled();
      });
    });

    it('should show error message', async () => {
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
  });

  describe('when edit container succeeds', () => {
    const data = {};

    beforeEach(async () => {
      setMutation({ data });
      const wrapper = loadEditContainer();
      await submitForm(wrapper);
    });

    it('should invoke on complete', () => {
      expect(mocks.onComplete).toHaveBeenCalled();
    });

    it('should display success message', () => {
      expect(mockShowNotification).toHaveBeenCalledWith(
        {
          text: <FormattedMessage {...messages.editSuccess} />,
        },
        data
      );
    });
  });

  it('when form submitted, should modify container', () => {
    setMutation({ data: {} });
    const mutation = getMutation(UpdateContainer);
    const wrapper = loadEditContainer();
    submitForm(wrapper);
    expect(mutation).toHaveBeenCalledWith({
      variables: {
        body: {
          container: CONTAINER,
          key: formValues.key,
          value: {
            attributes: formValues.attributes,
          },
        },
      },
    });
  });
});

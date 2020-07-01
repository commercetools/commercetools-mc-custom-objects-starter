import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Formik } from 'formik';
import * as yup from 'yup';
import Form from './form';
import messages from './messages';
import { TYPES } from './constants';

const initializeContainerValues = ({ key, value }) => ({
  key,
  attributes: value.attributes
});

const initializeEmptyValues = () => ({
  key: '',
  attributes: [
    {
      name: '',
      type: '',
      set: false,
      required: false
    }
  ]
});

const ContainerForm = ({ container, onSubmit }) => {
  const intl = useIntl();

  const initialValues = container
    ? initializeContainerValues(container)
    : initializeEmptyValues();

  const stringSchema = yup.string().required({
    required: intl.formatMessage(messages.requiredFieldError)
  });
  const attributeSchema = {
    name: stringSchema,
    type: stringSchema,
    set: yup.bool(),
    required: yup.bool(),
    attributes: yup.array(yup.lazy(() => yup.object(attributeSchema))),
    reference: yup.string().when('type', {
      is: val => val === TYPES.Reference,
      then: stringSchema
    }),
    enum: yup.array().when('type', {
      is: val => val === TYPES.Enum,
      then: yup.array(
        yup.object({
          value: yup
            .string()
            .required(intl.formatMessage(messages.requiredFieldError)),
          label: yup
            .string()
            .required(intl.formatMessage(messages.requiredFieldError))
        })
      )
    })
  };
  const validationSchema = yup.object({
    key: stringSchema,
    attributes: yup.array(yup.object(attributeSchema))
  });

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={values => onSubmit(values)}
    >
      {props => <Form {...props} />}
    </Formik>
  );
};
ContainerForm.displayName = 'ContainerForm';
ContainerForm.propTypes = {
  container: PropTypes.object,
  onSubmit: PropTypes.func.isRequired
};

export default ContainerForm;

import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Formik } from 'formik';
import * as yup from 'yup';
import reduce from 'lodash/reduce';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import Form from './form';
import messages from './messages';
import { TYPES } from './constants';

const initializeContainerValues = ({ key, value }) => ({
  key,
  attributes: value.attributes,
});

const initializeEmptyValues = () => ({
  key: '',
  attributes: [
    {
      name: '',
      type: '',
      set: false,
      required: false,
      display: false,
    },
  ],
});

const ContainerForm = ({ container, onSubmit }) => {
  const intl = useIntl();
  const { project } = useApplicationContext();
  const { languages } = project;

  const initialValues = container
    ? initializeContainerValues(container)
    : initializeEmptyValues();

  const requiredFieldMessage = intl.formatMessage(messages.requiredFieldError);
  const requiredFieldError = {
    required: requiredFieldMessage,
  };
  const stringSchema = yup.string().required(requiredFieldError);
  const attributeSchema = {
    name: stringSchema,
    type: stringSchema,
    set: yup.bool(),
    required: yup.bool(),
    display: yup.bool(),
    attributes: yup.array(yup.lazy(() => yup.object(attributeSchema))),
    reference: yup.object().when('type', {
      is: (val) => val === TYPES.Reference,
      then: yup.object({
        by: stringSchema,
        type: stringSchema,
      }),
    }),
    enum: yup.array().when('type', {
      is: (val) => val === TYPES.Enum,
      then: yup.array(
        yup.object({
          value: yup.string().required(requiredFieldMessage),
          label: yup.string().required(requiredFieldMessage),
        })
      ),
    }),
    lenum: yup.array().when('type', {
      is: (val) => val === TYPES.LocalizedEnum,
      then: yup.array(
        yup.object({
          value: yup.string().required(requiredFieldMessage),
          label: yup.object(
            reduce(
              languages,
              (name, lang) => ({
                ...name,
                [lang]: yup.string().required(requiredFieldMessage),
              }),
              {}
            )
          ),
        })
      ),
    }),
  };
  const validationSchema = yup.object({
    key: stringSchema,
    attributes: yup.array(yup.object(attributeSchema)),
  });

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => onSubmit(values)}
    >
      {(props) => <Form {...props} />}
    </Formik>
  );
};
ContainerForm.displayName = 'ContainerForm';
ContainerForm.propTypes = {
  container: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
};

export default ContainerForm;

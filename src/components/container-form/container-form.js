import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Formik } from 'formik';
import * as yup from 'yup';
import find from 'lodash/find';
import reduce from 'lodash/reduce';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import Form from './form';
import { TYPES, VALIDATION } from './constants';
import messages from './messages';

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
      validation: [],
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
    validation: yup.array(
      yup.object({
        type: yup.string().required(requiredFieldMessage),
        value: yup.string().when('type', {
          is: (val) => val && find(VALIDATION, { method: val }).hasValue,
          then: yup.string().required(requiredFieldMessage),
        }),
      })
    ),
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

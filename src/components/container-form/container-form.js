import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
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
  const { project } = useApplicationContext();
  const { languages } = project;

  const initialValues = container
    ? initializeContainerValues(container)
    : initializeEmptyValues();

  const stringSchema = yup
    .string()
    .required(<FormattedMessage {...messages.requiredFieldError} />);
  const attributeSchema = {
    name: stringSchema,
    type: stringSchema,
    set: yup.bool(),
    required: yup.bool(),
    display: yup.bool(),
    attributes: yup.array(yup.lazy(() => yup.object(attributeSchema))),
    reference: yup.string().when('type', {
      is: (val) => val === TYPES.Reference,
      then: stringSchema,
    }),
    enum: yup.array().when('type', {
      is: (val) => val === TYPES.Enum,
      then: yup.array(
        yup.object({
          value: yup
            .string()
            .required(<FormattedMessage {...messages.requiredFieldError} />),
          label: yup
            .string()
            .required(<FormattedMessage {...messages.requiredFieldError} />),
        })
      ),
    }),
    lenum: yup.array().when('type', {
      is: (val) => val === TYPES.LocalizedEnum,
      then: yup.array(
        yup.object({
          value: yup
            .string()
            .required(<FormattedMessage {...messages.requiredFieldError} />),
          label: yup.object(
            reduce(
              languages,
              (name, lang) => ({
                ...name,
                [lang]: yup
                  .string()
                  .required(
                    <FormattedMessage {...messages.requiredFieldError} />
                  ),
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

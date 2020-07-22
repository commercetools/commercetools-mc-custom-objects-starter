import React, { useState } from 'react';
import PropTypes from 'prop-types';
import find from 'lodash/find';
import get from 'lodash/get';
import isPlainObject from 'lodash/isPlainObject';
import reduce from 'lodash/reduce';
import { useIntl } from 'react-intl';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { getAttributeValidation, getAttributeValues } from './util';
import Form from './form';
import messages from './messages';

const getValueForAttributes = (value, empty) =>
  reduce(
    empty,
    (result, val, key) => ({
      ...result,
      [key]: isPlainObject(val)
        ? getValueForAttributes(get(value, key), val)
        : get(value, key) || val,
    }),
    {}
  );

const initializeCustomObjectValues = (
  customObject,
  containers,
  currencies,
  languages
) => {
  const container = find(containers, { key: customObject.container });
  const attributes = container.value.attributes;
  return {
    ...customObject,
    container: JSON.stringify(container),
    // combining empty attribute values with saved values in case schema changed
    value: getValueForAttributes(
      customObject.value,
      getAttributeValues(attributes, currencies, languages)
    ),
    attributes,
  };
};

const initializeEmptyValues = () => ({
  container: '',
  key: '',
  value: {},
});

const CustomObjectForm = ({ containers, customObject, onSubmit }) => {
  const intl = useIntl();
  const { project } = useApplicationContext();
  const { currencies, languages } = project;

  const initialValues = customObject
    ? initializeCustomObjectValues(
        customObject,
        containers,
        currencies,
        languages
      )
    : initializeEmptyValues();

  const stringSchema = yup.string().required({
    required: intl.formatMessage(messages.requiredFieldError),
  });
  const baseValidationSchema = {
    container: stringSchema,
    key: stringSchema,
    value: yup.object(),
  };
  const [validationSchema, setValidationSchema] = useState(
    yup.object(baseValidationSchema)
  );

  function onAttributesChange(attributes) {
    if (attributes) {
      const valueSchema = getAttributeValidation(attributes, languages, {
        required: messages.requiredFieldError,
      });
      setValidationSchema(
        yup.object({ ...baseValidationSchema, value: yup.object(valueSchema) })
      );
    }
  }

  function handleSubmit({ container, key, value }) {
    return onSubmit({
      container: JSON.parse(container).key,
      key,
      value,
    });
  }

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {(props) => {
        React.useEffect(() => {
          onAttributesChange(props.values.attributes); // eslint-disable-line react/prop-types
        }, [props.values.attributes]); // eslint-disable-line react/prop-types

        return <Form containers={containers} {...props} />;
      }}
    </Formik>
  );
};
CustomObjectForm.displayName = 'CustomObjectForm';
CustomObjectForm.propTypes = {
  containers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  customObject: PropTypes.shape({
    key: PropTypes.string.isRequired,
    value: PropTypes.object,
  }),
  onSubmit: PropTypes.func.isRequired,
};

export default CustomObjectForm;

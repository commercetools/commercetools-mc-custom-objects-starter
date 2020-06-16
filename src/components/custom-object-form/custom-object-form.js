import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Formik } from 'formik';
import * as yup from 'yup';
import { getAttributeValidation } from './util';
import Form from './form';
import messages from './messages';

const CustomObjectForm = ({ containers, onSubmit }) => {
  const intl = useIntl();
  const initialValues = {
    container: '',
    key: '',
    value: {}
  };

  const stringSchema = yup.string().required({
    required: intl.formatMessage(messages.requiredFieldError)
  });
  const baseValidationSchema = {
    container: stringSchema,
    key: stringSchema,
    value: yup.object()
  };
  const [validationSchema, setValidationSchema] = useState(
    yup.object(baseValidationSchema)
  );

  function onAttributesChange(attributes) {
    if (attributes) {
      const valueSchema = getAttributeValidation(attributes, {
        required: messages.requiredFieldError
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
      value
    });
  }

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {props => {
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
      key: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default CustomObjectForm;

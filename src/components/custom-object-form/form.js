import React from 'react';
import PropTypes from 'prop-types';
import camelCase from 'lodash/camelCase';
import get from 'lodash/get';
import map from 'lodash/map';
import { FormattedMessage, useIntl } from 'react-intl';
import { PrimaryButton } from '@commercetools-uikit/buttons';
import Card from '@commercetools-uikit/card';
import Constraints from '@commercetools-uikit/constraints';
import CollapsiblePanel from '@commercetools-uikit/collapsible-panel';
import { SelectField, TextField } from '@commercetools-uikit/fields';
import Spacings from '@commercetools-uikit/spacings';
import AttributeField from './attribute-field';
import { getAttributeValues } from './util';
import messages from './messages';
import styles from './form.mod.css';

const Form = ({
  containers,
  initialValues,
  values,
  touched,
  errors,
  dirty,
  isValid,
  isSubmitting,
  handleBlur,
  handleChange,
  handleSubmit,
  setFieldValue
}) => {
  const intl = useIntl();

  const containerOptions = map(containers, container => ({
    label: container.key,
    value: JSON.stringify(container)
  }));

  React.useEffect(() => {
    if (values.container) {
      const container = JSON.parse(values.container);
      const attributes = container.value.attributes;
      setFieldValue('attributes', null);
      const value =
        values.container !== initialValues.container
          ? getAttributeValues(attributes)
          : initialValues.value;
      setFieldValue('value', value);
      setFieldValue('attributes', attributes);
    }
  }, [values.container]);

  return (
    <Spacings.Stack scale="m">
      <CollapsiblePanel
        header={
          <CollapsiblePanel.Header>
            <FormattedMessage {...messages.generalInformationTitle} />
          </CollapsiblePanel.Header>
        }
        className={styles.panel}
      >
        <div className={styles.form}>
          <Card type="flat" className={styles['field-card']}>
            <SelectField
              name="container"
              title={<FormattedMessage {...messages.containerTitle} />}
              isRequired
              options={containerOptions}
              value={values.container}
              touched={touched.container}
              errors={errors.container}
              onChange={handleChange}
              onBlur={handleBlur}
              renderError={(key, error) => error}
            />
          </Card>
          <Card type="flat" className={styles['field-card']}>
            <TextField
              name="key"
              value={values.key}
              title={<FormattedMessage {...messages.keyTitle} />}
              isRequired
              errors={errors.key}
              touched={touched.key}
              onBlur={handleBlur}
              onChange={handleChange}
              renderError={(key, error) => error}
            />
          </Card>
        </div>
      </CollapsiblePanel>
      {values.attributes && (
        <CollapsiblePanel
          header={
            <CollapsiblePanel.Header>
              <FormattedMessage {...messages.customObjectInformationTitle} />
            </CollapsiblePanel.Header>
          }
          className={styles.panel}
        >
          <div className={styles.form}>
            {values.attributes.map((attribute, index) => {
              const name = `value.${camelCase(attribute.name)}`;
              return (
                <Card key={index} type="flat" className={styles['field-card']}>
                  <AttributeField
                    key={index}
                    type={attribute.type}
                    attributes={attribute.attributes}
                    reference={attribute.reference}
                    name={name}
                    title={attribute.name}
                    isRequired={attribute.required}
                    isSet={attribute.set}
                    value={get(values, name)}
                    touched={get(touched, name)}
                    errors={get(errors, name)}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                </Card>
              );
            })}
          </div>
        </CollapsiblePanel>
      )}
      <Constraints.Horizontal constraint="scale">
        <PrimaryButton
          label={intl.formatMessage(messages.submitButton)}
          isDisabled={!dirty || !isValid || isSubmitting}
          onClick={handleSubmit}
        />
      </Constraints.Horizontal>
    </Spacings.Stack>
  );
};
Form.displayName = 'Form';
Form.propTypes = {
  containers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  initialValues: PropTypes.shape({
    container: PropTypes.string,
    key: PropTypes.string,
    value: PropTypes.object,
    attributes: PropTypes.array
  }).isRequired,
  values: PropTypes.shape({
    container: PropTypes.string,
    key: PropTypes.string,
    value: PropTypes.object,
    attributes: PropTypes.array
  }).isRequired,
  touched: PropTypes.shape({
    container: PropTypes.bool,
    key: PropTypes.bool,
    value: PropTypes.object
  }),
  errors: PropTypes.shape({
    container: PropTypes.object,
    key: PropTypes.object,
    value: PropTypes.object
  }),
  dirty: PropTypes.bool,
  isValid: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  handleBlur: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired
};

export default Form;

import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { FormattedMessage, useIntl } from 'react-intl';
import { FieldArray } from 'formik';
import Card from '@commercetools-uikit/card';
import CollapsiblePanel from '@commercetools-uikit/collapsible-panel';
import Constraints from '@commercetools-uikit/constraints';
import { PrimaryButton, SecondaryButton } from '@commercetools-uikit/buttons';
import FieldLabel from '@commercetools-uikit/field-label';
import { TextField } from '@commercetools-uikit/fields';
import { PlusBoldIcon } from '@commercetools-uikit/icons';
import Spacings from '@commercetools-uikit/spacings';
import AttributeGroup from './attribute-group';
import messages from './messages';
import styles from './form.mod.css';

const Form = ({
  values,
  touched,
  errors,
  dirty,
  isValid,
  isSubmitting,
  handleBlur,
  handleChange,
  handleSubmit,
}) => {
  const intl = useIntl();
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
      <CollapsiblePanel
        header={
          <CollapsiblePanel.Header>
            <FormattedMessage {...messages.containerInformationTitle} />
          </CollapsiblePanel.Header>
        }
        className={styles.panel}
      >
        <div className={styles.form}>
          <Card type="flat">
            <FieldArray
              name="attributes"
              render={({ push, remove }) => (
                <Spacings.Stack>
                  <FieldLabel
                    title={<FormattedMessage {...messages.attributesTitle} />}
                    hasRequiredIndicator
                  />
                  <Constraints.Horizontal constraint="scale">
                    <SecondaryButton
                      label={intl.formatMessage(messages.addAttributeButton)}
                      iconLeft={<PlusBoldIcon />}
                      onClick={() =>
                        push({
                          name: '',
                          type: '',
                          set: false,
                          required: false,
                        })
                      }
                    />
                  </Constraints.Horizontal>
                  {values.attributes.map((value, index) => (
                    <Card type="flat" theme="dark" key={index}>
                      <AttributeGroup
                        name={`attributes.${index}`}
                        index={index}
                        value={values.attributes[index]}
                        touched={get(touched, `attributes[${index}]`, {})}
                        errors={get(errors, `attributes[${index}]`, {})}
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        remove={() => remove(index)}
                        removeDisabled={
                          index === 0 && values.attributes.length === 1
                        }
                      />
                    </Card>
                  ))}
                </Spacings.Stack>
              )}
            />
          </Card>
        </div>
      </CollapsiblePanel>
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
  values: PropTypes.shape({
    key: PropTypes.string.isRequired,
    attributes: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        type: PropTypes.string,
        required: PropTypes.bool,
        set: PropTypes.bool,
        attributes: PropTypes.array,
        reference: PropTypes.shape({
          by: PropTypes.string,
          type: PropTypes.string,
        }),
      }).isRequired
    ).isRequired,
  }).isRequired,
  touched: PropTypes.shape({
    key: PropTypes.bool,
    attributes: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.bool,
        type: PropTypes.bool,
        required: PropTypes.bool,
        set: PropTypes.bool,
        attributes: PropTypes.array,
        reference: PropTypes.shape({
          by: PropTypes.bool,
          type: PropTypes.bool,
        }),
      })
    ),
  }),
  errors: PropTypes.shape({
    key: PropTypes.object,
    attributes: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.object,
        type: PropTypes.object,
        attributes: PropTypes.array,
        reference: PropTypes.shape({
          by: PropTypes.object,
          type: PropTypes.object,
        }),
      })
    ),
  }),
  dirty: PropTypes.bool,
  isValid: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  handleBlur: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default Form;

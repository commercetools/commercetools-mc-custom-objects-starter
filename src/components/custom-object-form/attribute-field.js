import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { useIntl } from 'react-intl';
import { FieldArray } from 'formik';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import {
  SecondaryButton,
  SecondaryIconButton,
} from '@commercetools-uikit/buttons';
import Card from '@commercetools-uikit/card';
import Constraints from '@commercetools-uikit/constraints';
import { BinLinearIcon, PlusBoldIcon } from '@commercetools-uikit/icons';
import Spacings from '@commercetools-uikit/spacings';
import { getValue } from './util';
import AttributeLabel from './attribute-label';
import AttributeInput from './attribute-input'; // eslint-disable-line import/no-cycle
import messages from './messages';
import styles from './attribute-field.mod.css';

const AttributeField = ({
  type,
  title,
  isRequired,
  isSet,
  name,
  value,
  touched,
  errors,
  onChange,
  onBlur,
  attributes,
  reference,
  options,
}) => {
  const intl = useIntl();
  const { project } = useApplicationContext();
  const { currencies } = project;

  return (
    <>
      {isSet ? (
        <FieldArray
          name={name}
          render={({ push, remove }) => (
            <Spacings.Stack scale="s">
              <AttributeLabel
                data-testid="set-attribute-label"
                type={type}
                title={title}
                isRequired={isRequired}
                reference={reference}
              />
              <Constraints.Horizontal constraint="scale">
                <SecondaryButton
                  data-testid="add-attribute"
                  iconLeft={<PlusBoldIcon />}
                  label={intl.formatMessage(messages.addLabel)}
                  onClick={() =>
                    push(getValue(type, attributes, reference, currencies))
                  }
                />
              </Constraints.Horizontal>
              {value.map((val, index) => (
                <Card key={index} theme="dark" type="flat">
                  <Spacings.Inline alignItems="center">
                    <div className={styles.fullWidth}>
                      <AttributeInput
                        data-testid={`set-attribute-input-${index}`}
                        type={type}
                        title={title}
                        name={`${name}.${index}`}
                        value={val}
                        touched={get(touched, index)}
                        errors={get(errors, index)}
                        onChange={onChange}
                        onBlur={onBlur}
                        isRequired={isRequired}
                        isSet={isSet}
                        attributes={attributes}
                        options={options}
                      />
                    </div>
                    <SecondaryIconButton
                      data-testid={`remove-attribute-${index}`}
                      icon={<BinLinearIcon />}
                      label={intl.formatMessage(messages.removeLabel)}
                      isDisabled={index === 0 && value.length === 1}
                      onClick={() => remove(index)}
                    />
                  </Spacings.Inline>
                </Card>
              ))}
            </Spacings.Stack>
          )}
        />
      ) : (
        <Spacings.Stack scale="xs">
          <AttributeLabel
            data-testid="single-attribute-label"
            type={type}
            title={title}
            isRequired={isRequired}
            reference={reference}
          />
          <AttributeInput
            data-testid="single-attribute-input"
            type={type}
            title={title}
            name={name}
            value={value}
            touched={touched}
            errors={errors}
            onChange={onChange}
            onBlur={onBlur}
            isRequired={isRequired}
            isSet={isSet}
            attributes={attributes}
            options={options}
          />
        </Spacings.Stack>
      )}
    </>
  );
};
AttributeField.displayName = 'AttributeField';
AttributeField.propTypes = {
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  isSet: PropTypes.bool,
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
  touched: PropTypes.any,
  errors: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  attributes: PropTypes.array,
  reference: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    })
  ),
};

export default AttributeField;

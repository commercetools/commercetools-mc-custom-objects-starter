import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { FormattedMessage, useIntl } from 'react-intl';
import { FieldArray } from 'formik';
import Constraints from '@commercetools-uikit/constraints';
import { SecondaryButton } from '@commercetools-uikit/buttons';
import FieldLabel from '@commercetools-uikit/field-label';
import { PlusBoldIcon } from '@commercetools-uikit/icons';
import Spacings from '@commercetools-uikit/spacings';
// eslint-disable-next-line import/no-cycle
import AttributeGroup from './attribute-group';
import messages from './messages';
import styles from './nested-attributes.mod.css';

const ObjectAttributes = ({
  object,
  isDisplayed,
  name,
  value,
  touched,
  errors,
  handleBlur,
  handleChange,
}) => {
  const intl = useIntl();
  return (
    <div className={styles.nested}>
      <FieldArray
        name={name}
        render={({ push, remove }) => (
          <Spacings.Stack>
            <FieldLabel
              title={
                <FormattedMessage
                  {...messages.objectAttributesTitle}
                  values={{ name: object }}
                />
              }
            />
            <Constraints.Horizontal constraint="scale">
              <SecondaryButton
                data-testid="add-attribute"
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
            {value.map((objectValue, objectIndex) => (
              <AttributeGroup
                data-testid={`attribute-${objectIndex}`}
                key={objectIndex}
                name={`${name}.${objectIndex}`}
                index={objectIndex}
                value={objectValue}
                touched={get(touched, objectIndex, {})}
                errors={get(errors, objectIndex, {})}
                handleBlur={handleBlur}
                handleChange={handleChange}
                remove={() => remove(objectIndex)}
                removeDisabled={objectIndex === 0 && value.length === 1}
                isDisplayed={isDisplayed}
              />
            ))}
          </Spacings.Stack>
        )}
      />
    </div>
  );
};
ObjectAttributes.displayName = 'ObjectAttributes';
ObjectAttributes.propTypes = {
  object: PropTypes.string.isRequired,
  isDisplayed: PropTypes.bool,
  name: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(
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
    })
  ).isRequired,
  touched: PropTypes.arrayOf(
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
  errors: PropTypes.arrayOf(
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
  handleBlur: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default ObjectAttributes;

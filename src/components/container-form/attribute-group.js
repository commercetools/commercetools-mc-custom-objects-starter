import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import includes from 'lodash/includes';
import Spacings from '@commercetools-uikit/spacings';
import Attribute from './attribute';
import { ATTRIBUTES, TYPES } from './constants';
// eslint-disable-next-line import/no-cycle
import ObjectAttributes from './object-attributes';
import ReferenceAttribute from './reference-attribute';
import EnumAttributes from './enum-attributes';

const AttributeGroup = ({
  name,
  value,
  touched,
  errors,
  handleBlur,
  handleChange,
  remove,
  removeDisabled,
}) => {
  function onChange(event) {
    const { name: eventName, value: eventValue } = event.target;
    if (includes(eventName, ATTRIBUTES.Type)) {
      if (eventValue === TYPES.Object) {
        handleChange({
          target: {
            name: `${name}.${ATTRIBUTES.Attributes}`,
            value: [
              {
                name: '',
                type: '',
                set: false,
                required: false,
              },
            ],
          },
        });
      } else if (eventValue === TYPES.Reference) {
        handleChange({
          target: {
            name: `${name}.${ATTRIBUTES.Reference}`,
            value: '',
          },
        });
      } else if (eventValue === TYPES.Enum) {
        handleChange({
          target: {
            name: `${name}.${ATTRIBUTES.Enum}`,
            value: [{ value: '', label: '' }],
          },
        });
      }
    }
    handleChange(event);
  }
  return (
    <Spacings.Stack scale="m">
      <Attribute
        name={name}
        value={value}
        touched={touched}
        errors={errors}
        handleBlur={handleBlur}
        handleChange={onChange}
        remove={remove}
        removeDisabled={removeDisabled}
      />
      {value.type === TYPES.Object && (
        <ObjectAttributes
          object={value.name}
          name={`${name}.${ATTRIBUTES.Attributes}`}
          value={get(value, ATTRIBUTES.Attributes)}
          touched={get(touched, ATTRIBUTES.Attributes, [])}
          errors={get(errors, ATTRIBUTES.Attributes, [])}
          handleBlur={handleBlur}
          handleChange={handleChange}
        />
      )}
      {value.type === TYPES.Reference && (
        <ReferenceAttribute
          name={`${name}.${ATTRIBUTES.Reference}`}
          value={get(value, ATTRIBUTES.Reference)}
          touched={get(touched, ATTRIBUTES.Reference, false)}
          errors={get(errors, ATTRIBUTES.Reference, {})}
          handleBlur={handleBlur}
          handleChange={handleChange}
        />
      )}
      {value.type === TYPES.Enum && (
        <EnumAttributes
          name={`${name}.${ATTRIBUTES.Enum}`}
          value={get(value, ATTRIBUTES.Enum)}
          touched={get(touched, ATTRIBUTES.Enum, [])}
          errors={get(errors, ATTRIBUTES.Enum, [])}
          handleBlur={handleBlur}
          handleChange={handleChange}
        />
      )}
    </Spacings.Stack>
  );
};
AttributeGroup.displayName = 'AttributeGroup';
AttributeGroup.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    required: PropTypes.bool,
    set: PropTypes.bool,
    attributes: PropTypes.array,
    reference: PropTypes.string,
  }).isRequired,
  touched: PropTypes.shape({
    name: PropTypes.bool,
    type: PropTypes.bool,
    required: PropTypes.bool,
    set: PropTypes.bool,
    attributes: PropTypes.array,
    reference: PropTypes.bool,
  }),
  errors: PropTypes.shape({
    name: PropTypes.object,
    type: PropTypes.object,
    attributes: PropTypes.array,
    reference: PropTypes.object,
  }),
  handleBlur: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  removeDisabled: PropTypes.bool,
};

export default AttributeGroup;

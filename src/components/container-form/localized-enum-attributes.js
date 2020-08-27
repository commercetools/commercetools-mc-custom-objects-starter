import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import upperCase from 'lodash/upperCase';
import { FieldArray } from 'formik';
import { FormattedMessage, useIntl } from 'react-intl';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import {
  SecondaryButton,
  SecondaryIconButton,
} from '@commercetools-uikit/buttons';
import Constraints from '@commercetools-uikit/constraints';
import { customProperties } from '@commercetools-uikit/design-system';
import FieldLabel from '@commercetools-uikit/field-label';
import Grid from '@commercetools-uikit/grid';
import { BinLinearIcon, PlusBoldIcon } from '@commercetools-uikit/icons';
import { LocalizedTextInput, TextInput } from '@commercetools-uikit/inputs';
import { ErrorMessage } from '@commercetools-uikit/messages';
import Spacings from '@commercetools-uikit/spacings';
import messages from './messages';
import styles from './enum-attributes.mod.css';
import nestedStyles from './nested-attributes.mod.css';

const LocalizedEnumAttributes = ({
  name,
  value,
  errors,
  touched,
  handleChange,
  handleBlur,
}) => {
  const intl = useIntl();
  const { project } = useApplicationContext();
  const { languages } = project;
  const gridColumns = 2 + languages.length;

  return (
    <div className={nestedStyles.nested}>
      <FieldArray
        name={name}
        render={({ push, remove }) => (
          <Spacings.Stack scale="s">
            <FieldLabel
              title={<FormattedMessage {...messages.enumOptionsTitle} />}
            />
            <Constraints.Horizontal constraint="scale">
              <SecondaryButton
                data-testid="add-enum-option"
                iconLeft={<PlusBoldIcon />}
                label={intl.formatMessage(messages.addLabel)}
                onClick={() =>
                  push({
                    value: '',
                    label: LocalizedTextInput.createLocalizedString(languages),
                  })
                }
              />
            </Constraints.Horizontal>
            <Grid
              gridRowGap={customProperties.spacingS}
              gridColumnGap={customProperties.spacingM}
              gridTemplateColumns={`repeat(${gridColumns}, 1fr)`}
              justifyItems="start"
            >
              <FieldLabel
                title={<FormattedMessage {...messages.keyLabel} />}
                hasRequiredIndicator
              />
              {languages.map((language) => (
                <FieldLabel
                  key={language}
                  title={
                    <FormattedMessage
                      {...messages.labelLocalizedLabel}
                      values={{ language: upperCase(language) }}
                    />
                  }
                  hasRequiredIndicator
                />
              ))}
              <span></span>
              {value.map((val, index) => {
                const valuePath = `${index}.value`;
                const labelPath = (language) => `${index}.label.${language}`;
                const hasValueError =
                  get(touched, valuePath) && get(errors, valuePath);
                const hasLabelError = (language) =>
                  get(touched, `${labelPath(language)}`) &&
                  get(errors, `${labelPath(language)}`);
                return (
                  <React.Fragment key={index}>
                    <div className={styles.fullWidth}>
                      <Spacings.Stack scale="xs">
                        <TextInput
                          data-testid={`option-value-${index}`}
                          name={`${name}.${valuePath}`}
                          value={value[index].value}
                          hasError={!!hasValueError}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {hasValueError && (
                          <ErrorMessage
                            data-testid={`option-value-error-${index}`}
                          >
                            {get(errors, valuePath)}
                          </ErrorMessage>
                        )}
                      </Spacings.Stack>
                    </div>
                    {languages.map((language) => (
                      <div className={styles.fullWidth} key={language}>
                        <Spacings.Stack scale="xs">
                          <TextInput
                            data-testid={`option-label-${index}-${language}`}
                            name={`${name}.${labelPath(language)}`}
                            value={value[index].label[language]}
                            hasError={!!hasLabelError(language)}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {hasLabelError(language) && (
                            <ErrorMessage
                              data-testid={`option-label-error-${index}-${language}`}
                            >
                              {get(errors, labelPath(language))}
                            </ErrorMessage>
                          )}
                        </Spacings.Stack>
                      </div>
                    ))}
                    <SecondaryIconButton
                      data-testid={`remove-enum-option-${index}`}
                      icon={<BinLinearIcon />}
                      label={intl.formatMessage(messages.removeLabel)}
                      isDisabled={index === 0 && value.length === 1}
                      onClick={() => remove(index)}
                    />
                  </React.Fragment>
                );
              })}
            </Grid>
          </Spacings.Stack>
        )}
      />
    </div>
  );
};
LocalizedEnumAttributes.displayName = 'LocalizedEnumAttributes';
LocalizedEnumAttributes.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.object,
    })
  ).isRequired,
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.object,
    })
  ),
  touched: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.bool,
      label: PropTypes.object,
    })
  ),
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
};

export default LocalizedEnumAttributes;

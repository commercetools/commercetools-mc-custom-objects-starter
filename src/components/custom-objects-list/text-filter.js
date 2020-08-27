import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { SecondaryIconButton } from '@commercetools-uikit/buttons';
import { CloseIcon, SearchIcon } from '@commercetools-uikit/icons';
import { TextInput } from '@commercetools-uikit/inputs';
import styles from './text-filter.mod.css';
import messages from './messages';

export const ENTER = 'Enter';

const TextFilter = ({ value, onChange, onSubmit, placeholder }) => {
  const intl = useIntl();
  const [filterPerformed, setFilterPerformed] = useState(false);

  function clear() {
    onChange('');
    onSubmit('');
    setFilterPerformed(false);
  }

  function filter() {
    onSubmit(value);
    setFilterPerformed(true);
  }

  function onKeyPress(event) {
    if (event.key === ENTER) {
      filter();
    }
  }

  return (
    <div
      data-testid="filter-wrapper"
      className={styles.filterWrapper}
      onKeyPress={onKeyPress}
    >
      <TextInput
        data-testid="filter-input"
        style="primary"
        name="filter-text"
        placeholder={placeholder}
        value={value}
        isAutofocussed={!!value}
        onChange={(event) => onChange(event.target.value)}
      />

      <div className={styles.iconContainer}>
        {filterPerformed ? (
          <SecondaryIconButton
            data-testid="clear-button"
            tone="primary"
            type="reset"
            icon={<CloseIcon size="medium" />}
            label={intl.formatMessage(messages.clearButton)}
            onClick={clear}
          />
        ) : (
          <SecondaryIconButton
            data-testid="filter-button"
            tone="primary"
            icon={<SearchIcon size="medium" />}
            label={intl.formatMessage(messages.filterButton)}
            onClick={filter}
          />
        )}
      </div>
    </div>
  );
};
TextFilter.displayName = 'TextFilter';
TextFilter.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default TextFilter;

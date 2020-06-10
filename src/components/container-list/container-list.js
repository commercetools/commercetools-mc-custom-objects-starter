import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { SecondaryButton } from '@commercetools-uikit/buttons';
import { PlusBoldIcon } from '@commercetools-uikit/icons';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import messages from './messages';

const ContainerList = ({ match }) => {
  const intl = useIntl();

  return (
    <Spacings.Inset scale="m">
      <Spacings.Inline
        scale="m"
        alignItems="center"
        justifyContent="space-between"
      >
        <Spacings.Inline alignItems="baseline" scale="m">
          <Text.Headline
            as="h2"
            data-testid="title"
            intlMessage={messages.title}
          />
        </Spacings.Inline>
        <SecondaryButton
          iconLeft={<PlusBoldIcon />}
          as="a"
          href={`${match.url}/new`}
          label={intl.formatMessage(messages.createContainer)}
        />
      </Spacings.Inline>
    </Spacings.Inset>
  );
};
ContainerList.displayName = 'ContainerList';
ContainerList.propTypes = {
  match: PropTypes.shape({ url: PropTypes.string.isRequired }).isRequired
};

export default ContainerList;

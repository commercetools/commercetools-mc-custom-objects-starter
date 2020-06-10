import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Route, Switch } from 'react-router-dom';
import { useIsAuthorized } from '@commercetools-frontend/permissions';
import LockedDiamondSVG from '@commercetools-frontend/assets/images/locked-diamond.svg';
import { MaintenancePageLayout } from '@commercetools-frontend/application-components';
import CustomObjectsList from './components/custom-objects-list';
import { PERMISSIONS } from './constants';
import { messages } from './messages';

const PageUnauthorized = () => (
  <MaintenancePageLayout
    imageSrc={LockedDiamondSVG}
    title={<FormattedMessage {...messages.accessDeniedTitle} />}
    paragraph1={<FormattedMessage {...messages.accessDeniedMessage} />}
  />
);
PageUnauthorized.displayName = 'PageUnauthorized';

const ApplicationRoutes = () => {
  const canManageProducts = useIsAuthorized({
    demandedPermissions: [PERMISSIONS.ManageProducts]
  });
  const canManageOrders = useIsAuthorized({
    demandedPermissions: [PERMISSIONS.ManageOrders]
  });
  const canManageCustomers = useIsAuthorized({
    demandedPermissions: [PERMISSIONS.ManageCustomers]
  });
  const canManageCustomObjects =
    canManageProducts && canManageOrders && canManageCustomers;

  if (!canManageCustomObjects) {
    return <PageUnauthorized />;
  }

  return (
    <Switch>
      <Route component={CustomObjectsList} />
    </Switch>
  );
};

ApplicationRoutes.displayName = 'ApplicationRoutes';
ApplicationRoutes.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string,
    params: PropTypes.shape({
      projectKey: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default ApplicationRoutes;

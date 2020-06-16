import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Route, Switch } from 'react-router-dom';
import { useIsAuthorized } from '@commercetools-frontend/permissions';
import LockedDiamondSVG from '@commercetools-frontend/assets/images/locked-diamond.svg';
import { MaintenancePageLayout } from '@commercetools-frontend/application-components';
import ContainerList from './components/container-list';
import CreateContainer from './components/create-container';
import ContainerDetails from './components/container-details';
import CustomObjectsList from './components/custom-objects-list';
import { PERMISSIONS } from './constants';
import { messages } from './messages';
import CreateCustomObject from './components/create-custom-object/create-custom-object';

const PageUnauthorized = () => (
  <MaintenancePageLayout
    imageSrc={LockedDiamondSVG}
    title={<FormattedMessage {...messages.accessDeniedTitle} />}
    paragraph1={<FormattedMessage {...messages.accessDeniedMessage} />}
  />
);
PageUnauthorized.displayName = 'PageUnauthorized';

const ApplicationRoutes = ({ match }) => {
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
      <Route
        path={`${match.path}/containers/new`}
        render={props => <CreateContainer {...props} />}
      />
      <Route
        path={`${match.path}/containers/:id`}
        render={props => <ContainerDetails {...props} />}
      />
      <Route
        path={`${match.path}/containers`}
        render={props => <ContainerList {...props} />}
      />
      <Route
        path={`${match.path}/new`}
        render={props => <CreateCustomObject {...props} />}
      />
      <Route render={props => <CustomObjectsList {...props} />} />
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

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Route, Switch } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { useIsAuthorized } from '@commercetools-frontend/permissions';
import LockedDiamondSVG from '@commercetools-frontend/assets/images/locked-diamond.svg';
import { MaintenancePageLayout } from '@commercetools-frontend/application-components';
import CustomObjectsList from './components/custom-objects-list';
import CreateCustomObject from './components/create-custom-object';
import CustomObjectDetails from './components/custom-object-details';
import ContainerList from './components/container-list';
import CreateContainer from './components/create-container';
import ContainerDetails from './components/container-details';
import GetContainers from './components/get-custom-objects.rest.graphql';
import { ContainerProvider } from './context';
import { CONTAINER, PERMISSIONS } from './constants';
import { messages } from './messages';

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

  const { data, loading } = useQuery(GetContainers, {
    variables: { limit: 500, offset: 0, where: `container="${CONTAINER}"` }
  });

  if (!canManageCustomObjects) {
    return <PageUnauthorized />;
  }

  if (loading) {
    return null;
  }

  const { customObjects } = data || {};
  const { results } = customObjects || {};

  return (
    <ContainerProvider value={results}>
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
        <Route
          path={`${match.path}/:id`}
          render={props => <CustomObjectDetails {...props} />}
        />
        <Route render={props => <CustomObjectsList {...props} />} />
      </Switch>
    </ContainerProvider>
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

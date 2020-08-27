import React, { useContext } from 'react';
import map from 'lodash/map';

const ContainerContext = React.createContext([]);
const useContainerContext = () => {
  const containers = useContext(ContainerContext);
  return {
    hasContainers: containers && containers.length > 0,
    containers,
    where: `container in (${map(containers, ({ key }) => `"${key}"`).join(
      ','
    )})`,
  };
};
const ContainerProvider = ContainerContext.Provider;

export { ContainerContext, ContainerProvider, useContainerContext };

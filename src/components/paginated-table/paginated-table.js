import React from 'react';
import PropTypes from 'prop-types';
import { Table } from '@commercetools-frontend/ui-kit';
import Pagination from '../pagination';

const PaginatedTable = ({
  columns,
  items,
  rowCount,
  sortBy,
  sortDirection,
  onSortChange,
  total,
  offset,
  itemRenderer,
  registerMeasurementCache,
  onRowClick,
  defaultHeight,
  next,
  previous,
}) => (
  <>
    <Table
      columns={columns}
      items={items}
      itemRenderer={itemRenderer}
      registerMeasurementCache={registerMeasurementCache}
      onRowClick={onRowClick}
      defaultHeight={defaultHeight}
      rowCount={rowCount}
      sortBy={sortBy}
      sortDirection={sortDirection}
      onSortChange={onSortChange}
    />
    {rowCount !== total && (
      <Pagination
        next={next}
        previous={previous}
        offset={offset}
        rowCount={rowCount}
        total={total}
      />
    )}
  </>
);
PaginatedTable.displayName = 'PaginatedTable';
PaginatedTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.node.isRequired,
      flexGrow: PropTypes.number,
    })
  ).isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  registerMeasurementCache: PropTypes.func,
  onRowClick: PropTypes.func,
  defaultHeight: PropTypes.number,
  rowCount: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  offset: PropTypes.number.isRequired,
  itemRenderer: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
  previous: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortDirection: PropTypes.string.isRequired,
  onSortChange: PropTypes.func.isRequired,
};

export default PaginatedTable;

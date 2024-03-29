import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';
import PaginatedTable from './paginated-table';
import Pagination from '../pagination';

const mockItems = [];
const mockColumns = [{ key: faker.random.uuid(), label: faker.random.word() }];
const mockSort = {
  column: 'test.column.key',
  direction: 'ASC',
};
const mockItemRenderer = jest.fn();
const mockNext = jest.fn();
const mockPrevious = jest.fn();
const mockOnSortChange = jest.fn();

function loadPaginatedTable(rowCount, total, offset) {
  return shallow(
    <PaginatedTable
      itemRenderer={mockItemRenderer}
      offset={offset}
      items={mockItems}
      previous={mockPrevious}
      next={mockNext}
      columns={mockColumns}
      rowCount={rowCount}
      total={total}
      sortBy={mockSort.column}
      sortDirection={mockSort.direction}
      onSortChange={mockOnSortChange}
    />
  );
}

describe('paginated table', () => {
  it('when total results more than page size, should render pagination', async () => {
    const wrapper = loadPaginatedTable(30, 60, 30);
    expect(wrapper.find(Pagination).exists()).toEqual(true);
  });

  it('when total results less than page size, should not render pagination', async () => {
    const wrapper = loadPaginatedTable(15, 15, 30);
    expect(wrapper.find(Pagination).exists()).toEqual(false);
  });
});

const base = {
  loading: false,
  error: null,
  data: null,
  refetch: jest.fn()
};

let query = base;
let lazyQuery = base;
let mutation = base;
let mockLazyQuery = jest.fn();
const mockMutations = {};

function createMock(results, options = {}) {
  const { data, error } = results;
  const { onCompleted, onError } = options;
  return jest.fn(() => {
    if (error && onError) {
      onError(error);
    }

    if (data && onCompleted) {
      onCompleted(data);
    }

    return new Promise((resolve, reject) => {
      if (error) {
        reject(error);
      } else {
        resolve({ data });
      }
    });
  });
}

function createMockLazyQuery(options) {
  const mock = createMock(lazyQuery, options);
  mockLazyQuery = mock;
  return mock;
}

function createMockMutation(document, options) {
  const mock = createMock(mutation, options);
  mockMutations[JSON.stringify(document)] = mock;
  return mock;
}

function getQuery() {
  return query;
}

function getLazyQuery() {
  return mockLazyQuery;
}

function getMutation(document) {
  return mockMutations[JSON.stringify(document)];
}

function setQuery(value) {
  query = { ...base, ...value };
  query.refetch = createMock(query);
}

function setLazyQuery(value) {
  lazyQuery = { ...base, ...value };
  lazyQuery.refetch = createMock(lazyQuery);
}

function setMutation(value) {
  mutation = { ...base, ...value };
  mutation.refetch = createMock(mutation);
}

const useQuery = jest.fn(() => query);
const useLazyQuery = jest.fn((document, options) => [
  createMockLazyQuery(options),
  lazyQuery
]);
const useMutation = jest.fn((document, options) => [
  createMockMutation(document, options),
  mutation
]);

export {
  useQuery,
  useLazyQuery,
  useMutation,
  getQuery,
  getLazyQuery,
  getMutation,
  setQuery,
  setLazyQuery,
  setMutation
};

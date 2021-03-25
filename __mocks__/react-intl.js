/* eslint-disable import/extensions */
import intlMock from '../src/test-util/intl-mock';

const useIntl = jest.fn(() => intlMock);
export * from 'react-intl';
export { useIntl };

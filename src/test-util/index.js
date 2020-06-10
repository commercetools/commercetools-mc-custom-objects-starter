import faker from 'faker';
import kebabCase from 'lodash/kebabCase';
import times from 'lodash/times';
import { CONTAINER } from '../constants';
import { TYPES } from '../components/container-form/constants';

export const generateContainer = () => ({
  id: faker.random.uuid(),
  container: CONTAINER,
  key: faker.random.word(),
  value: {
    attributes: times(faker.random.number({ min: 1, max: 5 }), () => ({
      name: faker.random.words(),
      type: faker.random.arrayElement(Object.values(TYPES)),
      set: faker.random.boolean(),
      required: faker.random.boolean()
    }))
  },
  lastModifiedAt: faker.date.recent()
});

export const generateFormValues = () => ({
  key: kebabCase(faker.random.words()),
  attributes: times(3, () => ({
    name: faker.random.word(),
    type: faker.random.arrayElement(Object.values(TYPES)),
    required: faker.random.boolean(),
    set: faker.random.boolean()
  }))
});

import faker from 'faker';
import kebabCase from 'lodash/kebabCase';
import times from 'lodash/times';
import { CONTAINER } from '../constants';
import { TYPES } from '../components/container-form/constants';

export const generateContainer = () => ({
  id: faker.random.uuid(),
  version: faker.random.number({ min: 1, max: 10 }),
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

export const generateContainers = (
  total = faker.random.number({ min: 1, max: 10 })
) => ({
  customObjects: {
    count: total,
    total,
    offset: 0,
    results: times(total, generateContainer)
  }
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

export const generateCustomObject = () => ({
  id: faker.random.uuid(),
  version: faker.random.number({ min: 1, max: 10 }),
  container: kebabCase(faker.random.words()),
  key: faker.random.word(),
  value: {}
});

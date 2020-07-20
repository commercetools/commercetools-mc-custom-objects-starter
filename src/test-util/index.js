import faker from 'faker';
import kebabCase from 'lodash/kebabCase';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import times from 'lodash/times';
import { CONTAINER } from '../constants';
import { REFERENCE_TYPES, TYPES } from '../components/container-form/constants';
import { getAttributeValues } from '../components/custom-object-form/util';

export const generateAttribute = ({
  type = faker.random.arrayElement(Object.values(TYPES)),
  display = faker.random.boolean(),
  displayNested = faker.random.boolean(),
  set = faker.random.boolean(),
  languages = times(2, () => faker.random.locale()),
}) => ({
  name: faker.random.words(),
  type,
  set,
  required: faker.random.boolean(),
  display,
  ...(type === TYPES.Object && {
    attributes: generateAttributes(displayNested), // eslint-disable-line no-use-before-define
  }),
  ...(type === TYPES.Reference && {
    reference: faker.random.arrayElement(Object.values(REFERENCE_TYPES)),
  }),
  ...(type === TYPES.Enum && {
    enum: times(2, () => ({
      value: faker.random.number(),
      label: faker.random.words,
    })),
  }),
  ...(type === TYPES.LocalizedEnum && {
    lenum: times(2, () => ({
      value: faker.random.number(),
      label: reduce(
        languages,
        (label, language) => ({ ...label, [language]: faker.random.words() }),
        {}
      ),
    })),
  }),
});

const generateAttributes = (display = faker.random.boolean()) =>
  times(faker.random.number({ min: 1, max: 5 }), () =>
    generateAttribute({ display })
  );

export const generateContainer = (attributes = generateAttributes()) => ({
  id: faker.random.uuid(),
  version: faker.random.number({ min: 1, max: 10 }),
  container: CONTAINER,
  key: kebabCase(faker.random.words()),
  value: {
    attributes,
  },
  lastModifiedAt: faker.date.recent(),
});

export const generateContainers = (
  total = faker.random.number({ min: 1, max: 10 })
) => ({
  customObjects: {
    count: total,
    total,
    offset: 0,
    results: times(total, generateContainer),
  },
});

export const generateFormValues = () => ({
  key: kebabCase(faker.random.words()),
  attributes: times(3, () => ({
    name: faker.random.word(),
    type: faker.random.arrayElement(Object.values(TYPES)),
    required: faker.random.boolean(),
    set: faker.random.boolean(),
  })),
});

export const generateCustomObject = (
  container = generateContainer(),
  currencies = times(2, () => faker.finance.currencyCode()),
  languages = times(2, faker.random.locale())
) => ({
  id: faker.random.uuid(),
  version: faker.random.number({ min: 1, max: 10 }),
  container: container.key,
  key: kebabCase(faker.random.words()),
  lastModifiedAt: faker.date.recent(),
  value: getAttributeValues(container.value.attributes, currencies, languages),
});

export const generateContainerContext = (
  containers = generateContainers(2).customObjects.results
) => {
  return {
    hasContainers: true,
    containers,
    where: `container in (${map(containers, ({ key }) => `"${key}"`).join(
      ','
    )})`,
  };
};

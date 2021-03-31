import messages from './messages';

export const TYPES = {
  String: 'String',
  LocalizedString: 'LocalizedString',
  Number: 'Number',
  Boolean: 'Boolean',
  Money: 'Money',
  Date: 'Date',
  Time: 'Time',
  DateTime: 'DateTime',
  Enum: 'Enum',
  LocalizedEnum: 'LocalizedEnum',
  Object: 'Object',
  Reference: 'Reference',
};

export const REFERENCE_BY = {
  Key: 'key',
  Id: 'id',
};

export const REFERENCE_TYPES = {
  Cart: 'cart',
  CartDiscount: 'cart-discount',
  Category: 'category',
  Channel: 'channel',
  Customer: 'customer',
  CustomerGroup: 'customer-group',
  DiscountCode: 'discount-code',
  KeyValueDocument: 'key-value-document',
  Payment: 'payment',
  Product: 'product',
  ProductDiscount: 'product-discount',
  ProductPrice: 'product-price',
  ProductType: 'product-type',
  Order: 'order',
  OrderEdit: 'order-edit',
  ShippingMethod: 'shipping-method',
  ShoppingList: 'shopping-list',
  State: 'state',
  Store: 'store',
  TaxCategory: 'tax-category',
  Type: 'type',
  Zone: 'zone',
};

export const ATTRIBUTES = {
  Name: 'name',
  Type: 'type',
  Required: 'required',
  Set: 'set',
  Display: 'display',
  Validation: 'validation',
  Attributes: 'attributes',
  Reference: 'reference',
  Enum: 'enum',
  LocalizedEnum: 'lenum',
};

export const VALIDATION = {
  Min: { method: 'min', hasValue: true, message: messages.minQuantityError },
  Max: { method: 'max', hasValue: true, message: messages.maxQuantityError },
  Length: {
    method: 'length',
    hasValue: true,
    message: messages.lengthError,
  },
  Email: {
    method: 'email',
    hasValue: false,
    message: messages.emailError,
  },
  Url: { method: 'url', hasValue: false, message: messages.urlError },
  Matches: {
    method: 'matches',
    hasValue: true,
    message: messages.matchesError,
  },
  LessThan: {
    method: 'lessThan',
    hasValue: true,
    message: messages.lessThanError,
  },
  MoreThan: {
    method: 'moreThan',
    hasValue: true,
    message: messages.moreThanError,
  },
  Integer: {
    method: 'integer',
    hasValue: false,
    message: messages.integerError,
  },
  Positive: {
    method: 'positive',
    hasValue: false,
    message: messages.positiveError,
  },
  Negative: {
    method: 'negative',
    hasValue: false,
    message: messages.negativeError,
  },
};

const stringValidation = [
  VALIDATION.Min,
  VALIDATION.Max,
  VALIDATION.Length,
  VALIDATION.Email,
  VALIDATION.Url,
  VALIDATION.Matches,
];
const numberValidation = [
  VALIDATION.Min,
  VALIDATION.Max,
  VALIDATION.LessThan,
  VALIDATION.MoreThan,
  VALIDATION.Integer,
  VALIDATION.Positive,
  VALIDATION.Negative,
];
const dateValidation = [VALIDATION.Min, VALIDATION.Max];

export const VALIDATION_TYPES = {
  [TYPES.String]: stringValidation,
  [TYPES.LocalizedString]: stringValidation,
  [TYPES.Number]: numberValidation,
  [TYPES.Money]: numberValidation,
  [TYPES.Date]: dateValidation,
  [TYPES.DateTime]: dateValidation,
};

import createSchema from 'part:@sanity/base/schema-creator';
import schemaTypes from 'all:part:@sanity/base/schema-type';
import customTypes from './schemas';

export default createSchema({
  name: 'default',
  types: schemaTypes.concat(customTypes),
});

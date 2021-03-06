import Ember from 'ember';
import DS from 'ember-data';
import lazyCapabilities, { apiPath } from 'vault/macros/lazy-capabilities';
import { expandAttributeMeta } from 'vault/utils/field-to-attrs';

const { attr } = DS;
const { computed } = Ember;

const CREDENTIAL_TYPES = [
  {
    value: 'iam_user',
    displayName: 'IAM User',
  },
  {
    value: 'assumed_role',
    displayName: 'Assumed Role',
  },
  {
    value: 'federation_token',
    displayName: 'Federation Token',
  },
];
export default DS.Model.extend({
  backend: attr('string', {
    readOnly: true,
  }),
  name: attr('string', {
    label: 'Role name',
    fieldValue: 'id',
    readOnly: true,
  }),
  // credentialTypes are for backwards compatibility.
  // we use this to populate "credentialType" in
  // the serializer. if there is more than one, the
  // show and edit pages will show a warning
  credentialTypes: attr('array', {
    readOnly: true,
  }),
  credentialType: attr('string', {
    defaultValue: 'iam_user',
    possibleValues: CREDENTIAL_TYPES,
  }),
  roleArns: attr({
    editType: 'stringArray',
    label: 'Role ARNs',
  }),
  policyArns: attr({
    editType: 'stringArray',
    label: 'Policy ARNs',
  }),
  policyDocument: attr('string', {
    editType: 'json',
  }),
  fields: computed('credentialType', function() {
    let keys;
    let credentialType = this.get('credentialType');
    let keysForType = {
      iam_user: ['name', 'credentialType', 'policyArns', 'policyDocument'],
      assumed_role: ['name', 'credentialType', 'roleArns', 'policyDocument'],
      federation_token: ['name', 'credentialType', 'policyDocument'],
    };
    keys = keysForType[credentialType];
    return expandAttributeMeta(this, keys);
  }),

  updatePath: lazyCapabilities(apiPath`${'backend'}/roles/${'id'}`, 'backend', 'id'),
  canDelete: computed.alias('updatePath.canDelete'),
  canEdit: computed.alias('updatePath.canUpdate'),
  canRead: computed.alias('updatePath.canRead'),

  generatePath: lazyCapabilities(apiPath`${'backend'}/creds/${'id'}`, 'backend', 'id'),
  canGenerate: computed.alias('generatePath.canUpdate'),
});

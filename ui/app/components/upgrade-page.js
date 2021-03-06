import Ember from 'ember';

const { computed } = Ember;

export default Ember.Component.extend({
  title: 'Vault Enterprise',
  featureName: computed('title', function() {
    let title = this.get('title');
    return title === 'Vault Enterprise' ? 'This' : title;
  }),
  minimumEdition: 'Vault Enterprise',
});

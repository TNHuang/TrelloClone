TrelloClone.Collections.Lists = Backbone.Collection.extend({
  comparator: 'ord',
  model: TrelloClone.Models.List,
  url: '/api/lists',

  initialize: function (options) {
    console.log('inside the collection')
  }
});

TrelloClone.Collections.Lists = Backbone.Collection.extend({
  comparator: 'ord',
  model: TrelloClone.Models.List,
  url: '/api/lists',
  // initialize: function ( options) {
  //   this.board = options.board;
  // },

  getOrFetch: function (id) {
    var list = this.get(id),
      lists = this;
    if(!list) {
      list = new TrelloClone.Models.List({ id: id });
      list.fetch({
        success: function () {
          lists.add(list);
        },
      });
    } else {
      list.fetch();
    }
    return list;
  },

});

TrelloClone.Routers.Router = Backbone.Router.extend({
  initialize: function() {
    this.boards = TrelloClone.Collections.boards;
    this.$rootEl = $('#main');
  },
  routes: {
    "": "boardsIndex",
    "boards/:id": "boardShow"
  },

  boardsIndex: function () {
    this.boards.fetch({
      success: function () {
        var indexView = new TrelloClone.Views.BoardsIndex({ collection: this.boards});
        this._swapView(indexView);
      }.bind(this)
    });
  },

  boardShow: function (id) {
    var board = this.boards.getOrFetch(id);

    board.fetch({
      success: function () {

        var showView = new TrelloClone.Views.BoardShow({model: board})

        this._swapView(showView);

      }.bind(this)
    })
  },

  _swapView: function (newView) {
    if (this.currentView) {
      this.currentView.remove();
    };
    this.currentView = newView;
    this.$rootEl.html(newView.render().$el);
  }

})
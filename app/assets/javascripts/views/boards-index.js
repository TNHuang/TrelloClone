TrelloClone.Views.BoardsIndex = Backbone.View.extend({
  template: JST["boards/index"],
  render: function () {
    var content = this.template({boards: this.collection});
    this.$el.html(content);
    return this;
  },

  initialize: function () {
    this.listenTo(this.collection, "sync add remove", this.render);
  },

  events: {
    "click .board.new-board": "addNewBoard",
    "click .button.delete": "deleteBoard"
  },

  addNewBoard: function (event) {
    var model = new TrelloClone.Models.Board();
    var newView = new TrelloClone.Views.BoardNew({collection: this.collection, model: model});
    $(event.target).html(newView.render().$el);
  },

  deleteBoard: function (event) {
    event.preventDefault();
    var board_id = $(event.currentTarget).data("board-id");
    var model = this.collection.getOrFetch(board_id);
    model.destroy();
  }

})
TrelloClone.Views.BoardRow = Backbone.View.extend({
  template: JST["boards/row"],
  className: "board",

  initialize: function (options) {
    this.board = options.board;
    this.listenTo(this.board, 'sync change destroy',  this.render);
  },

  render: function () {
    var content = this.template({ board: this.board});
    this.$el.html(content);
    return this;
  },

  events: {
    "click .button.delete": "deleteBoard"
  },

  deleteBoard: function (event) {
    event.preventDefault();
    this.board.destroy();
    this.remove();
    // $.ajax({
    //   url: "api/boards/" + this.board.id,
    //   type: "DELETE",
    //   data: { id: this.board.id },
    //   dataType: 'json',
    //   success: function () {
    //     this.remove();
    //   }.bind(this)
    // });

  },
})

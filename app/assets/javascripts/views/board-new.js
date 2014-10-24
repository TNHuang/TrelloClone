TrelloClone.Views.BoardNew = Backbone.View.extend({
  template: JST["boards/new"],
  tagName: "div class=wrapper clearfix",
  render: function () {
    var content = this.template({boards: this.collection, board: this.model});
    this.$el.html(content);
    return this;
  },

  events: {
    "submit form": "createBoard"
  },

  createBoard: function (event) {
    event.preventDefault();
    var formData = $(event.currentTarget).serializeJSON();

    var board = new TrelloClone.Models.Board(formData["board"]);
    board.save({}, {
      success: function () {
        this.collection.add(board);
      }.bind(this),
      error: function () {
        $(".wrapper").remove();
        $(".new-board").append("Create new board...");
      }
    })
  }

})
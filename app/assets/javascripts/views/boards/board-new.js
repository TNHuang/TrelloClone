TrelloClone.Views.BoardNew = Backbone.View.extend({
  template: JST["boards/new"],
  className: "new-board-container",

  initialize: function (options) {
    this.boards = options.boards;
  },
  render: function () {
    var content = this.template();
    this.$el.html(content);
    return this;
  },

  events: {
    "click .new-board": "toggleBoard",
    "submit form": "createBoard",

  },

  toggleBoard: function (event) {
    $(event.currentTarget).toggleClass('not-active');
    this.$('.create-board').toggleClass('not-active');
  },

  createBoard: function (event) {
    event.preventDefault();
    var formData = $(event.currentTarget).serializeJSON();

    var board = new TrelloClone.Models.Board(formData["board"]);
    board.save({}, {
      success: function () {
        this.boards.add(board);
        this.$('#title').val("");
      }.bind(this)
    });

    this.$(".new-board").toggleClass('not-active');
    this.$('.create-board').toggleClass('not-active');
  },


})

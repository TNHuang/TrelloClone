TrelloClone.Views.BoardsIndex = Backbone.View.extend({
  template: JST["boards/index"],


  initialize: function () {
    this.subViews = [];
    this.boards = this.collection;
    this.listenTo(this.collection, "sync change", this.render);
    this.listenTo(this.collection,  "add", this.addRender);
  },

  events: {
    // "click .board.new-board": "addNewBoard",

  },

  render: function () {
    var content = this.template({boards: this.collection});
    this.$el.html(content);

    this.boards.forEach( this.addRender.bind(this) );
    this.addCreateRender();
    return this;
  },

  addRender: function (board) {
    var view = new TrelloClone.Views.BoardRow({ board: board});
    this.subViews.push(view);
    this.$('.boards-container').append(view.render().$el);
  },

  addCreateRender: function () {
    var view = new TrelloClone.Views.BoardNew({ boards: this.boards});
    this.subViews.push(view);
    this.$('.boards-container').append(view.render().$el);
  },

  remove: function () {
    this.subViews.forEach(function (subView) {
      subView.remove();
    });
    Backbone.View.prototype.remove.call(this);
  },

})

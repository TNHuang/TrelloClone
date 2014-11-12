TrelloClone.Views.BoardShow = Backbone.View.extend({
  template: JST["boards/show"],
  initialize: function (options) {
    // $('body').css('background-color', 'rgb(43, 91, 144)');
    this.board = options.board;

    this.subViews = [];
    this.listenTo(this.board, "sync", this.render);
    this.listenTo(this.board, 'add', this.addListRender);
  },


  render: function () {

    var content = this.template({board: this.board});
    this.$el.html(content);

    this.board.lists().forEach( this.addListRender.bind(this) );
    return this;
  },

  addListRender: function (list) {

    var view = new TrelloClone.Views.ListRow({list: list});
    this.subViews.push(view);
    this.$('.lists-container').append(view.render().$el);
  },

})

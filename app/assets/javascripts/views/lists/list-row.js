TrelloClone.Views.ListRow = Backbone.View.extend({
  template: JST['lists/row'],
  className: "list-container",
  initialize: function (options) {
    this.list = options.list;
    this.subViews = [];
    this.listenTo(this.list, 'sync change add', this.render);
  },

  render: function () {

    var content = this.template({ list: this.list});
    this.$el.html(content);
    this.list.cards().forEach( this.addCardRender.bind(this))
    return this;
  },

  addCardRender: function (card) {
    var view = new TrelloClone.Views.CardRow({card: card});
    this.subViews.push(view);
    this.$('.cards-container').append(view.render().$el);
  },



})

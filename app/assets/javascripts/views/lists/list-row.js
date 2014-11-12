TrelloClone.Views.ListRow = Backbone.View.extend({
  template: JST['lists/row'],
  className: "list-container",
  tagName: "li",
  initialize: function (options) {
    this.list = options.list;
    this.subViews = [];
    this.listenTo(this.list, 'sync change destroy', this.render);
    this.listenTo(this.list.cards(), 'remvoe', this.render);
    this.listenTo(this.list.cards(), 'add', this.addCardRender);
  },

  events: {
    'click .delete-list': 'deleteList',
  },

  render: function () {
    var content = this.template({ list: this.list});
    this.$el.html(content);
    this.list.cards().forEach( this.addCardRender.bind(this))
    this.$('.cards-container').sortable({
      connectWith:".cards-container",
      placeholder: "ui-state-highlight",
      drop: function (event) {
        alert("dropped!");
      }
    });
    this.$('.cards-container').disableSelection();

    this.addCreateCardRender();

    return this;
  },

  addCardRender: function (card) {
    var view = new TrelloClone.Views.CardRow({card: card});
    this.subViews.push(view);
    this.$('.cards-container').prepend(view.render().$el);
  },

  addCreateCardRender: function () {
    var view = new TrelloClone.Views.CardNew({
      cards: this.list.cards(), list_id: this.list.id
    });

    this.subViews.push(view);
    this.$('.cards-container').append(view.render().$el);
  },

  deleteList: function (event) {
    event.preventDefault();
    this.list.destroy();
    this.remove();
  },

  remove: function () {
    this.subViews.forEach(function (subView) {
      subView.remove();
    });
    Backbone.View.prototype.remove.call(this);
  },


})

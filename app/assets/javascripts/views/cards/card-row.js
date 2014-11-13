TrelloClone.Views.CardRow = Backbone.View.extend({
  template: JST['cards/row'],
  className: "card-container new-create",
  initialize: function (options) {
    this.card = options.card;

    this.listenTo(this.card, 'sync change destroy', this.render);
  },

  events: {
    'click .delete-card': 'deleteCard',
  },

  render: function () {
    var content = this.template({ card: this.card});
    this.$el.html(content);

    return this;
  },

  deleteCard: function (event) {
    event.preventDefault();
    this.remove();
    this.card.destroy();

  },


})

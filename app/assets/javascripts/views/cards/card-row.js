TrelloClone.Views.ListRow = Backbone.View.extend({
  template: JST['cards/row'],
  className: "card-container",
  initialize: function (options) {
    this.card = options.card;

    this.listenTo(this.card, 'sync change add', this.render);
  },

  render: function () {

    var content = this.template({ card: this.card});
    this.$el.html(content);

  },




})

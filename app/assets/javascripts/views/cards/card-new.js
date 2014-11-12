TrelloClone.Views.CardNew = Backbone.View.extend({
  template: JST['cards/new'],
  className: "card-container",
  initialize: function (options) {
    this.cards = options.cards
    this.list_id = options.list_id;
  },
  events: {
    "submit .form-new-card": "createCard",
    "click .new-card": "toggleCard"
  },

  render: function () {
    var content = this.template({ list_id: this.list_id });
    this.$el.html(content);
    return this;
  },

  toggleCard: function (event) {
    $(event.currentTarget).toggleClass('not-active');
    this.$('.create-card').toggleClass('not-active');
  },

  createCard: function(event) {
    event.preventDefault();
    var params = $(event.currentTarget).serializeJSON();

    var newCard = new TrelloClone.Models.Card( params['card'] );

    newCard.save({},{
      success: function () {
        this.cards.add(newCard);
        this.$('#title').val("");
        this.$('#description').val("");
      }.bind(this)
    });

    this.$('.new-card').toggleClass('not-active');
    this.$('.create-card').toggleClass('not-active');
  }

})

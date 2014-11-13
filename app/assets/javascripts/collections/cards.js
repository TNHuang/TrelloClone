TrelloClone.Collections.Cards = Backbone.Collection.extend({
  comparator: 'ord',
  model: TrelloClone.Models.Card,
  url: '/api/cards',

  getOrFetch: function (id) {
    var card = this.get(id),
      cards = this;
    if(!card) {
      card = new TrelloClone.Models.Card({ id: id });
      card.fetch({
        success: function () {
          cards.add(card);
        },
      });
    } else {
      card.fetch();
    }
    return card;
  },
  
})

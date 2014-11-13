TrelloClone.Views.ListRow = Backbone.View.extend({
  template: JST['lists/row'],
  className: "list-container ",
  tagName: "li",
  initialize: function (options) {
    this.ord = options.ord;
    this.list = options.list;
    this.cards = this.list.cards();
    this.subViews = [];

    this.listenTo(this.list, 'sync', this.render);
    this.listenTo(this.cards, 'add', this.addCardRender);
    this.listenTo(this.cards, "add remove", this.saveOrds);
  },

  events: {
    'click .delete-list': 'deleteList',
  },

  render: function () {
    var content = this.template({ list: this.list, ord: this.ord });
    this.$el.html(content);
    this.cards.forEach( this.addCardRender.bind(this))
    this.addCreateCardRender();
    this.saveOrds();

    var that = this;
    this.$('.cards-container').sortable({
      connectWith:".cards-container",
      items: "li",
      remove: function(event, ui) {},
      recieve: function (event, ui) {event.stopPropagation()},
      update: function(event, ui) {event.stopPropagation()}
    });

    this.$('.cards-container').on("sortremove", function (event, ui) {
      event.stopPropagation();
      var card_id = ui.item.find('p').data("card-id");
      var card = that.cards.get(card_id);
      console.log(that.cards.get(card_id))
      that.cards.remove(card);
      that.saveOrds();
    });

    this.$('.cards-container').on("sortreceive", function(event, ui){
      event.stopPropagation();
      var reciever_list_id = $(event.target).data("list-id");
      var current_event = $(event.target);
      var card_id = ui.item.find('p').data("card-id");
      // var newCard = new TrelloClone.Collections.Cards().getOrFetch(card_id);
      // newCard.set({card: {list_id: reciever_list_id}});
      // newCard.save({}, {
      //   success: function () {
      //     that.cards.add(newCard);
      //     that.saveOrds();
      //   }
      // });

      $.ajax({
        url: "api/cards/" + card_id,
        type: "PUT",
        data: { id: card_id, card: { list_id: reciever_list_id } },
        success: function () {

          that.cards.add(newCard);

          that.saveOrds();
        }.bind(this)
      });

    }.bind(this))

    this.$('.cards-container').disableSelection();

    this.$('.cards-container').on('sortupdate', function(event, ui){
      event.stopPropagation();
      console.log('getting inner trigger')

      var sender_list_id = ui.item.find('> p').data("list-id");
      var reciever_list_id = $(event.target).data("list-id");


      if (sender_list_id !== reciever_list_id) {
        var start_ord = 1000;
      } else {
        var start_ord = ui.item.find('> p').data('ord');
      }

      var end_ord = ui.item.index();
      var direction = end_ord - start_ord;
      var start_card_id = $(ui.item.find('> p')).data('card-id');

      function bigger(e){
        if (e.get('ord') >= end_ord && e.get('ord') <= start_ord ) {
          return e;
        }
      }
      function smaller(e){
        if (e.get('ord') <= end_ord && e.get('ord') >= start_ord) {
           return e;
        }
      }

      if (direction < 0){
        var newcards = this.cards.filter(bigger);

        newcards.forEach(function(e){
          if (e.get('id') === start_card_id){
            ord = end_ord
          } else {
            ord = e.get('ord') + 1
          }

          $.ajax({
                url: "api/cards/" + e.get('id'),
                type: "PATCH",
                data: { id: e.id, card: { ord: ord } },
                success: function (response) {
                  e.set({ord: response.ord})
                },
          });
        });
      } else if (direction > 0) {
        var newcards = this.cards.filter(smaller);

        newcards.forEach(function(e){
          if (e.get('id') === start_card_id){
            ord = end_ord
          } else {
            ord = e.get('ord') -1
          }

          $.ajax({
                url: "api/cards/" + e.get('id'),
                type: "PATCH",
                data: { id: e.id, card: { ord: ord } },
                success: function (response) {
                  e.set({ord: response.ord})
                },
          });

        });
      }


    }.bind(this));

    return this;
  },

  addCardRender: function (card) {
    var view = new TrelloClone.Views.CardRow({card: card});
    this.subViews.push(view);

    this.$('.cards-container').append(view.render().$el);
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

  saveOrds: function (event) {

    this.cards.each( function(element, index) {
      if (element.get('ord') === index) {
        return ;
      }
      element.save( {ord: index} );
    });

    console.log('getting inside trigger')

  },

})

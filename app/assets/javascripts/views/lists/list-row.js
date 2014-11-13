TrelloClone.Views.ListRow = Backbone.View.extend({
  template: JST['lists/row'],
  className: "list-container ",
  tagName: "li",
  initialize: function (options) {
    this.ord = options.ord;
    this.list = options.list;
    this.subViews = [];

    this.listenTo(this.list, 'sync', this.render);

    this.listenTo(this.list.cards(), 'add', this.addCardRender);
  },

  events: {
    'click .delete-list': 'deleteList',
  },

  render: function () {
    var content = this.template({ list: this.list, ord: this.ord });
    this.$el.html(content);
    this.list.cards().forEach( this.addCardRender.bind(this))
    this.$('.cards-container').sortable({
      connectWith:".cards-container",
      placeholder: "ui-state-highlight",
      // remove: function (event, ui) {}
    });


    this.$('.cards-container').on('sortremove', function(event, ui){
      var sender_list_id = ui.sender.data("list-id");
      var reciever_list_id = $(event.target).data("list-id");
      var card_id = ui.item.find('p').data("card-id");

      $.ajax({
        url: "api/cards/" + card_id,
        type: "PUT",
        data: { id: card_id, card: { list_id: reciever_list_id } }
      });
    })
    // this.$('.lists-container').on('sortstop', function(event, ui){
    //
    //   var start_ord = ui.item.find('> ul').data('ord');
    //   var end_ord = ui.item.index();
    //   var start_list_id = $(ui.item.find(' ul')).data('list-id');
    //   var end_list_id = this.lists.where({ ord: end_ord})[0].get('id');
    //
    //   $.ajax({
    //     url: "api/lists/" + start_list_id,
    //     type: "PUT",
    //     data: { id: start_list_id, list: { ord: end_ord } }
    //   });
    //   $.ajax({
    //     url: "api/lists/" + end_list_id,
    //     type: "PUT",
    //     data: { id: end_list_id, list: { ord: start_ord } }
    //   });
    //
    // }.bind(this));

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

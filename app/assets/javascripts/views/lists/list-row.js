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

    this.$('.cards-container').sortable({
      connectWith:".cards-container",
      items: "li",
      placeholder: "placeholder-card",
      recieve: function (event, ui) {event.stopPropagation()},
      update: function(event, ui) {event.stopPropagation()}
    });


    this.$('.cards-container').on("sortreceive", function(event, ui){
      event.stopPropagation();
      var reciever_list_id = $(event.target).data("list-id");
      var card_id = ui.item.find('p').data("card-id");
      console.log('getting recieve trigger too')
      $.ajax({
        url: "api/cards/" + card_id,
        type: "PUT",
        data: { id: card_id, card: { list_id: reciever_list_id } }
      });
      this.saveOrds();
    }.bind(this))

    this.$('.cards-container').on('sortupdate', function(event, ui){
      event.stopPropagation();
      var start_ord = ui.item.find('> p').data('ord');
      // console.log("event",event.target)
      // console.log("ui item",ui.item.index());
      // console.log('placeholder', ui.placeholder.index())
      console.log(ui.item.prev())
      var end_ord = ui.item.index();
      var start_card_id = $(ui.item.find(' p')).data('card-id');
      var end_card_id = this.cards.where({ ord: end_ord})[0].get('id');
      console.log("inside", start_ord, ":", end_ord, ":", start_card_id,":", end_card_id)

      if (start_ord !== undefined && start_ord !== end_ord) {
        $.ajax({
          url: "api/cards/" + start_card_id,
          type: "PUT",
          data: { id: start_card_id, card: { ord: end_ord } }
        });
        $.ajax({
          url: "api/cards/" + end_card_id,
          type: "PUT",
          data: { id: end_card_id, card: { ord: start_ord } }
        });
        this.saveOrds();
      }
    }.bind(this));


    this.$('.cards-container').disableSelection();


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

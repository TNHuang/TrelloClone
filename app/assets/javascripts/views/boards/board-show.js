TrelloClone.Views.BoardShow = Backbone.View.extend({
  template: JST["boards/show"],
  initialize: function (options) {
    // $('body').css('background-color', 'rgb(43, 91, 144)');
    this.board = options.board;
    this.lists = this.board.lists();
    this.subViews = [];
    this.listenTo(this.board, "sync", this.render);
    this.listenTo(this.lists, "add change", this.addListRender);

  },

  events: {
    "click .save-ord": "saveOrds",
  },

  render: function () {

    var content = this.template({board: this.board});
    this.$el.html(content);

    this.lists.forEach( this.addListRender.bind(this) );

    this.$('.lists-container').sortable({
       placeholder: "placeholder",
      //  receive: function( event, ui ) {},
       stop: function (event, ui) {}
    });

    this.$('.lists-container').on('sortover', function(event, ui){
      var sender_list_id = ui.sender.data("list-id");
      var reciever_list_id = $(event.target).data("list-id");
      var card_id = ui.item.find('p').data("card-id");

      $.ajax({
        url: "api/cards/" + card_id,
        type: "PUT",
        data: { id: card_id, card: { list_id: reciever_list_id } }
      });
    })

    this.$('.lists-container').on('sortstop', function(event, ui){

      var start_ord = ui.item.find('> ul').data('ord');
      var end_ord = ui.item.index();
      var start_list_id = $(ui.item.find(' ul')).data('list-id');
      var end_list_id = this.lists.where({ ord: end_ord})[0].get('id');

      $.ajax({
        url: "api/lists/" + start_list_id,
        type: "PUT",
        data: { id: start_list_id, list: { ord: end_ord } }
      });
      $.ajax({
        url: "api/lists/" + end_list_id,
        type: "PUT",
        data: { id: end_list_id, list: { ord: start_ord } }
      });

    }.bind(this));


    this.$('.lists-container').disableSelection();
    this.addCreateListRender();

    return this;
  },

  addListRender: function (list) {

    var view = new TrelloClone.Views.ListRow({list: list, ord: list.get('ord') });
    this.subViews.push(view);

    this.$('.lists-container').append(view.render().$el);

  },

  addCreateListRender: function () {
    var view = new TrelloClone.Views.ListNew({
      lists: this.board.lists(), board_id: this.board.id
      });

    this.subViews.push(view);
    this.$('.lists-container').append(view.render().$el);
  },


  remove: function () {
    this.subViews.forEach(function (subView) {
      subView.remove();
    });
    Backbone.View.prototype.remove.call(this);
  },

  saveOrds: function (event) {

    this.subViews.forEach( function(view){
      console.log("list-id:", view.$(' > ul').data('list-id'), ", ord:", view.$(' > ul').data('ord'));
    })
    this.lists.each( function(element, index) {
      if (element.get('ord') !== index) {
        element.save({ord: index})
        console.log('reassign getting trigger')
      }
      // element.save( {ord: index} );
    });

    // this.lists.forEach( function(e){
    //   console.log("title:", e.get('title'), " ord:", e.get('ord'))
    // })
    // this.render();
  },
})

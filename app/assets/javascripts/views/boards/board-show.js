TrelloClone.Views.BoardShow = Backbone.View.extend({
  template: JST["boards/show"],
  initialize: function (options) {
    // $('body').css('background-color', 'rgb(43, 91, 144)');
    this.board = options.board;

    this.subViews = [];
    this.listenTo(this.board, "sync change remove", this.render);
    this.listenTo(this.board.lists(), "add", this.addListRender);
  },


  render: function () {

    var content = this.template({board: this.board});
    this.$el.html(content);

    this.board.lists().forEach( this.addListRender.bind(this) );
    this.$('.lists-container').sortable({
       placeholder: "placeholder",
       receive: function( event, ui ) {alert('test')}
    });

    var that = this;
    this.$('.lists-container').on('sortover', function(event, ui){
      sender_list_id = ui.sender.data("list-id");
      reciever_list_id = $(event.target).data("list-id");
      console.log(ui.item)
      // $.ajax({
      //   url: "api/cards/" + that,
      //   type: "PUT",
      //   data: {},
      //   success: function () {
      //       list=
      //   }
      // })
    })

    this.$('.lists-container').disableSelection();
    this.addCreateListRender();

    return this;
  },

  addListRender: function (list) {

    var view = new TrelloClone.Views.ListRow({list: list});
    this.subViews.push(view);
    this.$('.lists-container').prepend(view.render().$el);
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


})

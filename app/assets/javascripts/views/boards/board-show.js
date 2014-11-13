TrelloClone.Views.BoardShow = Backbone.View.extend({
  template: JST["boards/show"],
  initialize: function (options) {
    // $('body').css('background-color', 'rgb(43, 91, 144)');
    this.board = options.board;
    this.lists = this.board.lists();
    this.subViews = [];
    this.listenTo(this.board, "sync change", this.render);
    this.listenTo(this.lists, "add", this.addListRender);
    this.listenTo(this.lists, "add remove", this.saveOrds);
  },

  events: {
    "click .save-ord": "saveOrds",
  },

  render: function () {

    var content = this.template({board: this.board});
    this.$el.html(content);


    this.addCreateListRender();
    this.lists.forEach( this.addListRender.bind(this) );

    this.$('.lists-container').sortable({
       placeholder: "placeholder",
       items: " > li",
       update: function(event, ui){},
    });


    this.$('.lists-container').on('sortupdate', function(event, ui){

      var start_ord = ui.item.find('> ul').data('ord');
      var end_ord = ui.item.index();
      var start_list_id = $(ui.item.find(' ul')).data('list-id');
      var end_list_id = this.lists.where({ ord: end_ord})[0].get('id');
      console.log("outer", start_ord, ":", end_ord, ":", start_list_id,":", end_list_id)

      if (start_ord !== undefined && start_ord !== end_ord) {
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
        this.saveOrds();
      }


    }.bind(this));


    this.$('.lists-container').disableSelection();


    return this;
  },

  addListRender: function (list) {

    var view = new TrelloClone.Views.ListRow({list: list, ord: list.get('ord') });
    this.subViews.push(view);

    // this.$('.lists-container').append(view.render().$el);
    (view.render().$el).insertBefore(".creation")
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

    this.lists.each( function(element, index) {
      if (element.get('ord') === index) {
        return ;
      }
      element.save( {ord: index} );
    });
    console.log('getting trigger')

  },
})

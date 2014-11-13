TrelloClone.Views.BoardShow = Backbone.View.extend({
  template: JST["boards/show"],
  initialize: function (options) {
    $('body').css('background-color', 'rgb(43, 91, 144)');

    this.board = options.board;
    this.lists = this.board.lists();
    this.subViews = [];
    this.listenTo(this.board, "sync", this.render);
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
    this.saveOrds();

    this.$('.lists-container').sortable({
      //  placeholder: "placeholder",
       items: " > li",
       update: function(event, ui){},
    });



    this.$('.lists-container').on('sortupdate', function(event, ui){

      var start_ord = ui.item.find('> ul').data('ord');
      var end_ord = ui.item.index();
      var direction = end_ord - start_ord;
      var start_list_id = $(ui.item.find('> ul')).data('list-id');

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
        var newlists = this.lists.filter(bigger);

        newlists.forEach(function(e){
          if (e.get('id') === start_list_id){
            ord = end_ord
          } else {
            ord = e.get('ord') + 1
          }

          $.ajax({
                url: "api/lists/" + e.get('id'),
                type: "PATCH",
                data: { id: e.id, list: { ord: ord } },
                success: function (response) {
                  e.set({ord: response.ord})
                },
          });
        });
      } else if (direction > 0) {
        var newlists = this.lists.filter(smaller);

        newlists.forEach(function(e){
          if (e.get('id') === start_list_id){
            ord = end_ord
          } else {
            ord = e.get('ord') - 1
          }

          $.ajax({
                url: "api/lists/" + e.get('id'),
                type: "PATCH",
                data: { id: e.id, list: { ord: ord } },
                success: function (response) {
                  e.set({ord: response.ord})
                },
          });

        });
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

  saveOrds: function () {

    this.lists.each( function(element, index) {
      if (element.get('ord') === index) {
        return ;
      }
      element.save( {ord: index} );
    });

  },
})

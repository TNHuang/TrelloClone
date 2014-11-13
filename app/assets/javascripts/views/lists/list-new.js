TrelloClone.Views.ListNew = Backbone.View.extend({
  template: JST['lists/new'],
  className: "list-container creation",
  initialize: function (options) {

    this.lists = options.lists;
    this.board_id = options.board_id;
  },

  events: {
    "click .new-list": "toggleList",
    "submit .form-new-list": "createNewList"

  },

  render: function () {
    var content = this.template({ board_id: this.board_id });
    this.$el.html(content);
    return this;
  },

  toggleList: function () {
    $(event.target).toggleClass('not-active');
    this.$('.create-list').toggleClass('not-active');
  },

  createNewList: function (event) {
    event.preventDefault();
    var params = $(event.currentTarget).serializeJSON();
    var newList = new TrelloClone.Models.List( params['list'] );

    newList.save({},{
      success: function () {
        this.lists.add(newList);
        this.$('#title').val("");
      }.bind(this)
    });

    this.$('.new-list').toggleClass('not-active');
    this.$('.create-list').toggleClass('not-active');
  }


})

import Backbone from 'backbone';

var taskModel = Backbone.Model.extend({
  url: function () {
    if (this.id) {
      return "http://localhost:3000/tasks/" + this.id;
    } else {
      return "http://localhost:3000/tasks";
    }
  },
});

export default taskModel;
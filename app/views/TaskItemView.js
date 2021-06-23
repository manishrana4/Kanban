import Marionette from "backbone.marionette";        
import $ from "jquery"; 

import template from '../templates/taskItem.html';


var TaskItemView = Marionette.View.extend({
  // childView:TaskItemView,
  template: template,
  initialize(){
      console.log("hello form task item continer");
  },
  onrender(){
    console.log("this on task container", this);
  }
});

export default TaskItemView;
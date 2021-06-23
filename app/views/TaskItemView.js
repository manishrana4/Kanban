import Marionette from "backbone.marionette";        
import $ from "jquery"; 

import template from '../templates/task.html';


var TaskItemView = Marionette.CollectionView.extend({
  childView:TaskItemView,
  template: template,
  initialize(){
      console.log("hello form task continer");
  },
  onrender(){
    console.log("this on task container", this);
  }
});

export default TaskItemView;
import Marionette from "backbone.marionette";        
import TaskItemView from './TaskItemView';
import $ from "jquery"; 

import template from '../templates/task.html';


var TaskContainer = Marionette.CollectionView.extend({
  childView:TaskItemView,
  template: template,
  childViewContainer:'',
  initialize(){
      console.log("hello form task continer");
  },
  onrender(){
    console.log("this on task container", this);
  }
});

export default TaskContainer;

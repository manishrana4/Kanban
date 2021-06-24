import Marionette from "backbone.marionette";        
import TaskItemView from './TaskItemView';
import $ from "jquery"; 

import template from '../templates/task.html';


var TaskContainer = Marionette.CollectionView.extend({
  childView:TaskItemView,
  // childViewContainer:'.task',
  // template: template,
  initialize(){
      // console.log("hello form task continer");
  },
  onrender(){
    
  }
});

export default TaskContainer;

import Marionette from "backbone.marionette";        
import variables from "../services/variables";
import $ from "jquery"; 
import template from '../templates/taskItem.html';


var TaskItemView = Marionette.View.extend({
  template: template,
  ui:{
    deleteOption:".kanban-card__body__task__option"
  },
  events:{
    'click @ui.deleteOption':"destroyTask"
  },
  destroyTask(){
    console.log("destroy task clicked id",this.model.toJSON().id);
    this.model.destroy({
      success:function(){
        console.log("task removed");
      },
      error:function(){
        console.log("error removing task")
      }
    })
  },
  initialize(){
      // console.log("hello form task item continer");
      console.log("this on task item", this.model.toJSON());
  },
  onrender(){
    console.log("this on task container", this);
  }
});

export default TaskItemView;
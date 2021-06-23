import Marionette from "backbone.marionette";
import TaskContainer from "./TaskContainer";
import variables from "../services/variables";
import $ from "jquery";

import template from "../templates/column.html";

var thisColumnsTasks=[];

var ColumnContainer = Marionette.View.extend({
  //   tagName: "div",
  // el: ".kanban-card",
  // childView: TaskContainer,
  // childViewContainer: ".kanban-card",
  regions:{
    task:".task",
  },
  template: template,
  childViewOptions: function (model, index) {
    console.log("column model column Container", model)
    return {
      parentModel: this.model,
    };
  },
  onRender(){
    console.log("hello from the Column view")
    console.log("this.model in Column view", this.model.toJSON());
    let thisModel=this.model.toJSON();
    // console.log("variables.tasksCollection", variables.tasksCollection)
    // thisColumnsTasks=variables.tasksCollection.filter((taskItem)=>{
    //   var task = taskItem.toJSON();
    //   console.log("taskItem,thisModel.id", task.colId,thisModel.id);
    //   task.colId===thisModel.id;
    // })

    thisColumnsTasks=variables.tasksCollection.where({colId:thisModel.id});

    console.log("thisColumnsTasks", thisColumnsTasks);

    // var taskContainer= new TaskContainer({
    //   collection:thisColumnsTasks
    // })
    // console.log("taskContainer", taskContainer)
    this.showChildView('task',new TaskContainer());
  }


});

export default ColumnContainer;

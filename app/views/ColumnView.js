import Marionette from "backbone.marionette";
import TaskContainer from "./TaskContainer";
import TasksCollection from "../collections/tasks";
import TaskModel from "../models/task";
import variables from "../services/variables";
import $ from "jquery";

import template from "../templates/column.html";

var ColumnView = Marionette.View.extend({
  regions: {
    taskContainer: ".kanban-card__body",
  },
  template: template,

  childViewEvents: {
    'task:destroyed': 'reRenderView'
  },
  reRenderView(){
    // console.log("!!!!!this.reRenderView!!!!!");
    this.render(); 
  },
  onRender() {

    // console.log("COLUMN VIEW RENDERED")
    let thisModel = this.model;

    let thisColumnsTasks = new TasksCollection();

    let thisColumnsTasksArray = variables.tasksCollection.where({
      colId: thisModel.id,
    });

    thisColumnsTasksArray.forEach((task) => {
      thisColumnsTasks.add(new TaskModel({ ...task.toJSON() }));
    });
    
    this.showChildView(
      "taskContainer",
      new TaskContainer({
        collection: thisColumnsTasks,
        colId:this.model.id
      })
    );
  },
});

export default ColumnView;

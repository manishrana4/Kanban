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
  childViewOptions: function (model, index) {
    // console.log("column model column Container", model);
    return {
      parentModel: this.model,
    };
  },
  onRender() {
    let thisModel = this.model;

    let thisColumnsTasks = new TasksCollection();

    let thisColumnsTasksArray = variables.tasksCollection.where({
      colId: thisModel.id,
    });

    thisColumnsTasksArray.forEach((task) => {
      // console.log("task:", task);
      thisColumnsTasks.add(new TaskModel({ ...task.toJSON() }));
    });

    // console.log("thisColumnsTasks", thisColumnsTasks);
    // console.log("variables.columnsCollection", variables.columnsCollection);

    this.showChildView(
      "taskContainer",
      new TaskContainer({
        collection: thisColumnsTasks,
      })
    );
    // add task button here
    // this.showChildView("addTask", new AddTaskContainer());
  },
});

export default ColumnView;

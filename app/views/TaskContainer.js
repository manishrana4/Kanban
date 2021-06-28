import Marionette from "backbone.marionette";
import TaskItemView from "./TaskItemView";
import AddItemView from "./AddItemView";
import TaskModel from "../models/task";
import template from "../templates/task.html";
import TimeStamp from "../services/timeStamp";
import variables from "../services/variables";
import $ from "jquery";

var TaskContainer = Marionette.CollectionView.extend({
  childView: TaskItemView,
  childViewTriggers: {
    "destroy:empty": "destroy:empty:child:view",
  },
  onDestroyEmptyChildView(childView) {
    console.log("childView from onDestroyEmptyChildView", childView);
    this.removeChildView(childView);
  },
  childViewEvents: {
    "add:task": "addNewTask", // add new html
    "destroy:task": "removeView",
    "render:task": "renderTasks",
    render() {
      console.log("A child view has been rendered.");
    },
  },
  renderTasks() {
    this.trigger("render:task");
  },
  removeView(childView) {
    let childViewModel = childView.model;
    childView.model.destroy({
      success: () => {
        variables.tasksCollection.remove(childViewModel); // remove model from local taskCollection
        this.removeChildView(childView); // removes the childView

        // this.render();

        this.trigger("task:destroyed");
        // to re-renders the column View for tasks remainng
      },
      error: function () {
        console.log("error removing task");
      },
    });
  },
  addNewTask(childView) {
    let taskCreateDate = TimeStamp();
    let columnId = this.options.colId;
    let newTaskModel = new TaskModel({
      colId: columnId,
      created_at: taskCreateDate,
    });
    let taskItemView = new TaskItemView({
      inputFocus: true,
      model: newTaskModel,
    });
    this.addChildView(taskItemView, this.children.length - 1);
  },
  initialize() {
    
  },
  onRender() {
    let addItemView = new AddItemView();
    this.addChildView(addItemView, this.children.length);
    console.log("Task Container onRender");
    
  },
});

export default TaskContainer;

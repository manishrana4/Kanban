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
    render() {
      console.log("A child view has been rendered.");
    },
  },
  removeView(childView) {
    // check if the input is empty
    // console.log("from removeChildView");
    // console.log("childView to be removed", childView, childView.model.id);
    let childViewModel = childView.model;
    childView.model.destroy({
      success: () => {
        console.log("task removed  childView.model", childView.model);
        console.log("task removed  childViewModel", childViewModel);
        console.log("this.children.length on remove", this.children.length);

        variables.tasksCollection.remove(childViewModel); // remove model from local taskCollection
        this.removeChildView(childView); // removes the childView
        
        // this.render();
        // call the column view with updated collection

        this.trigger("task:destroyed");
        // to re-renders the column View for tasks remainng
      },
      error: function () {
        console.log("error removing task");
      },
    });
  },
  addNewTask(childView) {
    //show or add a new html input area i.e similar to the taskItemView => with input focused at first
    // and when enter is done then show the text area
    // console.log('item selected model id: ' + childView.model.id);
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
    // console.log("hello form task continer");
  },
  onRender() {
    let addItemView = new AddItemView();
    this.addChildView(addItemView, this.children.length);
    console.log("Task Container onRender");
    // add child on adding a task
  },
});

export default TaskContainer;

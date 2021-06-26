import Marionette from "backbone.marionette";
import TaskItemView from "./TaskItemView";
import AddItemView from "./AddItemView";
import TaskModel from "../models/task";
import $ from "jquery";

import template from "../templates/task.html";
import TimeStamp from "../services/timeStamp";

var TaskContainer = Marionette.CollectionView.extend({
  childView: TaskItemView,
  // childViewContainer:'.task',
  // template: template,
  // childViewOptions:{
  //   inputFocus:false,
  // },
  onChildViewFooEvent(childView, model) {
    console.log("childView, model onChildViewFooEvent", childView, model);
    // NOTE: we must wait for the server to confirm
    // the destroy PRIOR to removing it from the collection
    model.destroy({ wait: true });

    // but go ahead and remove it visually
    this.removeChildView(childView);
  },
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
    // "destroy:empty":"removeView",
    // This callback will be called whenever a child is rendered or emits a `render` event
    render() {
      console.log("A child view has been rendered.");
    },
  },
  removeView(childView) {
    // check if the input is empty
    console.log("from removeChildView");
    console.log("childView to be removed", childView, childView.model.id);

    childView.model.destroy({
      success: () => {
        console.log("task removed");
        this.removeChildView(childView);
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
    console.log("this in Task Container", this);
    console.log("!!!TASK CONTAINER RENDERED");

    console.log(
      "!!!!!!!!!!!!!!!!!! this.children.length on ADD ITEM",
      this.children.length
    );
    let addItemView = new AddItemView();
    this.addChildView(addItemView, this.children.length);
    // add child on adding a task
  },
});

export default TaskContainer;

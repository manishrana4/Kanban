import Marionette from "backbone.marionette";
import TaskContainer from "./TaskContainer";
import TasksCollection from "../collections/tasks";
import TaskModel from "../models/task";
import variables from "../services/variables";
import TimeStamp from "../services/timeStamp";
import $ from "jquery";

import template from "../templates/column.html";

var prevInputInputValue;
var isEnterPressed = false;

var ColumnView = Marionette.View.extend({
  // className: "kanban-card",
  regions: {
    taskContainer: ".kanban-card__body",
  },
  template: template,
  ui: {
    thisColumn: ".kanban-card",
    deleteOption: ".kanban-card__header__options",
    columnTitle: ".kanban-card__header__title",
    inputArea: ".kanban-card__header__title__input",
    inputField: ".kanban-card__header__title__input__field",
  },
  triggers: {
    // "click @ui.deleteOption": "destroy:column",
  },
  events: {
    "drop @ui.thisColumn": "onDrop",
    "dragover @ui.thisColumn": "onDragOverAllowDrop",
    "click @ui.deleteOption": "destroyColumn",
    "click @ui.columnTitle": "showInputField",
    "focusout @ui.inputArea": "onFocusOut",
    "keydown @ui.inputArea": "onPressEnter",
  },
  onDragOverAllowDrop(event) {
    event.preventDefault();
  },
  onDrop(ev) {
    ev.preventDefault();

    // $.event.addProp('dataTransfer');
    var data = ev.originalEvent.dataTransfer.getData("text/plain");
    var modelData = JSON.parse(data);

    // change colId and re render old col and new col
    if (this.model.id !== modelData.colId) {
      this.onTaskDragAndDrop(modelData);
    }
  },
  onTaskDragAndDrop(modelData) {
    console.log(
      "variables.tasksCollection on  task drag and drop",
      variables.tasksCollection
    );
    let draggedTaskModel = variables.tasksCollection.findWhere({
      taskId: modelData.taskId,
    });
    console.log("modelDataon drop", modelData);
    console.log("draggedTaskModel", draggedTaskModel);
    let prevColId = modelData.colId;
    draggedTaskModel.set("colId", this.model.id);

    draggedTaskModel.save(
      {},
      {
        success: () => {
          this.reRenderView();

          variables.tasksCollection
            .findWhere({ id: modelData.id }) //TODO id or taskId??
            .set("colId", this.model.id);

          this.trigger("render:column");
        },
        error: (err) => {
          console.log("error in task drag and drop:", err);
        },
      }
    );
  },
  destroyColumn() {
    const taskCollectionView = this.getChildView("taskContainer");

    let childModels = [...taskCollectionView.collection.models];
    // console.log("childModels in destroyColumn", childModels);
    this.model.destroy({
      success: (model) => {
        console.log("model of CLOMUN destroyed", model);
        console.log("model of CLOMUN destroyed taskCollectionView.collection.models", taskCollectionView.collection.models);
        this.destroyChildTaskModels(childModels, taskCollectionView.collection.models); //remove the children in db
      },
      error: (error) => {
        console.log("Error in delete COLUMN error", error);
      },
    });
  },
  destroyChildTaskModels(childModels, taskCollectionModels) {
    // destroy this view
    // this.model.destroy({
    //   success: () => {
    console.log("childModels in destroyChildTaskModels:", childModels);
    childModels.forEach((childModel) => {
      // _.each(childModels,(childModel) => {
      console.log("forEach childModel on destroy JSON", childModel.toJSON());
      console.log("taskCollectionModels in loop before destroy", taskCollectionModels);
      childModel.destroy({
        success: (model) => {
          console.log("childModel removed model:", model);
          // console.log("childModel removed:", childModel);
          variables.tasksCollection.remove(childModel);
          console.log("childModels.length", childModels.length);
          console.log("variables.tasksCollection on child destroy", variables.tasksCollection);
        },
        error: (model, response, options) => {
          console.log("error iin childmodel remove model, response, options", model, response, options);
          variables.tasksCollection.remove(childModel); 
          //even though error delete from local since deleted from db too, bug cause needs to be found
        },
      });
      console.log("taskCollectionModels in loop", taskCollectionModels);
    });

    console.log(
      "variables.tasksCollection on Column View",
      variables.tasksCollection
    );

    this.trigger("destroy:column");
  },
  onFocusOut() {
    if (!isEnterPressed) {
      console.log("clicked outside the input");
      this.editConfirm();
    } else {
      isEnterPressed = !isEnterPressed;
    }
  },
  onPressEnter(e) {
    if (e.which === 13) {
      console.log("enter pressed");
      this.editConfirm();
      isEnterPressed = true;
    }
  },
  setPrevInputValue(inputValue) {
    prevInputInputValue = inputValue;
  },
  editConfirm() {
    let title = this.getInputValue();

    // hide text on click to edit
    this.$(".kanban-card__header__title").removeClass("hide");
    this.$(".kanban-card__header__options").removeClass("hide");

    // show with text on click
    this.$(".kanban-card__header__title__input").addClass("hide");
    // also check with previous value to avoid network call if no change
    if (title !== "" && title !== prevInputInputValue) {
      this.$(".kanban-card__header__title").html(title);
      this.saveColumn(title);
    } else if (title === "" && prevInputInputValue !== "") {
      // prev value is set wihout this case too
      this.$(".kanban-card__header__title").html(prevInputInputValue);
    } else if (title === "" && prevInputInputValue === "") {
      // for only new
      // trigger remove child event from parent and show add child button
      console.log("removing this view since empty on add new title");
      this.trigger("destroy:empty", this);
    }
  },
  saveColumn(title) {
    this.model.set("name", title);
    this.model.set("modified_at", TimeStamp());

    if (this.model) {
      this.model.save(
        {},
        {
          success: () => {
            // on success make the change in task collection and rerender Task Collection
            variables.columnsCollection.push(this.model);
            // re render the parent
            this.trigger("render:column");
          },
          error: (err) => {
            console.log("err", err);
          },
        }
      );
    }
  },
  getInputValue() {
    let inputValue = this.$(".kanban-card__header__title__input__field").val();
    return inputValue;
  },
  childViewEvents: {
    "task:destroyed": "reRenderView",
    "render:task": "reRenderView",
  },
  reRenderView() {
    this.render();
  },
  showInputField() {
    let title = $.trim(this.$(".kanban-card__header__title").html());

    this.setPrevInputValue(title);

    // // hide text on click to edit
    this.$(".kanban-card__header__title").toggleClass("hide");
    this.$(".kanban-card__header__options").toggleClass("hide");

    // // show with text on click
    this.$(".kanban-card__header__title__input").toggleClass("hide");
    this.$(".kanban-card__header__title__input__field").focus();
    this.$(".kanban-card__header__title__input__field").val(title);
  },
  initialize(options) {
    console.log("Column View Initialized");
  },
  onRender() {
    let thisModel = this.model;

    let thisColumnsTasks = new TasksCollection();

    let thisColumnsTasksArray = variables.tasksCollection.where({
      colId: thisModel.id,
    });

    thisColumnsTasksArray.forEach((task) => {
      thisColumnsTasks.add(new TaskModel({ ...task.toJSON() }));
    });

    console.log("thisColumnsTasks", thisColumnsTasks);

    this.showChildView(
      "taskContainer",
      new TaskContainer({
        collection: thisColumnsTasks,
        colId: this.model.id,
      })
    );

    if (this.options && this.options.inputFocus) {
      this.showInputField();
    }
  },
});

export default ColumnView;

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
    "click @ui.deleteOption": "destroy:column",
  },
  modelEvents: {
    "change:colId": "actOnChange",
  },
  actOnChange() {
    console.log("change:colId");
  },
  collectionEvents: {
    // "taskDragAndDrop": 'taskDragAndDrop'
    sync: "onSync",
    update: "onCollectionUpdate",
  },
  onCollectionUpdate() {
    console.log("models were added or removed in the collection");
  },
  onSync(collection) {
    console.log("Collection was synchronised with the server");
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
    console.log("on drop ev", ev);
    console.log("on drop ev", ev.currentTarget);
    // $.event.addProp('dataTransfer');
    var data = ev.originalEvent.dataTransfer.getData("text/plain");
    var modelData = JSON.parse(data);
    console.log("JSON parsed data model Data", modelData);
    // ev.target.appendChild(document.getElementById(data));
    console.log("on Drop to COLUMN", ev);
    console.log("on Drop to COLUMN data", data);
    console.log(
      "on Drop to COLUMN ev.dataTransfer.getData('text):",
      ev.originalEvent.dataTransfer
    );

    // change colId and re render old col and new col
    if (this.model.id !== modelData.colId) {
      this.onTaskDragAndDrop(modelData);
    }
  },
  onTaskDragAndDrop(modelData) {
    let draggedTaskModel = variables.tasksCollection.findWhere({
      id: modelData.id,
    });
    let prevColId = modelData.colId;
    draggedTaskModel.set("colId", this.model.id);

    console.log("draggedTaskModel:", draggedTaskModel);

    draggedTaskModel.save(
      {},
      {
        success: () => {
          console.log("task drag and drop done", draggedTaskModel);
          this.reRenderView();
          //until model and collection event in setup for rerender'

          variables.tasksCollection
            .findWhere({ id: modelData.id })
            .set("colId", this.model.id);

          // trigger and pass col ID of prev and presend col an rerender
          console.log("prevColId", prevColId);
          this.trigger("render:column");

        },
        error: (err) => {
          console.log("error in task drag and drop:", err);
        },
      }
    );
  },
  destroyColumn() {
    // this needs to change
    // console.log("destroy task clicked id", this.model.toJSON().id);
    // console.log("to be destroyed model", this.model);
    // this.model.destroy({
    //   success: function () {
    //     console.log("column removed");
    //     // destroy all the task with its colId
    //   },
    //   error: function () {
    //     console.log("error removing column");
    //   },
    // });

    // trigger remove child in parent
    // Remove its childs models

    console.log(this.model);

    const taskCollectionView = this.getChildView("taskContainer");
    // console.log("!!!!!!!taskCollectionView!!!!!!!!!!!", taskCollectionView);
    console.log(
      "!!!!!!!taskCollectionViewMODELS!!!!!!!!!!!",
      taskCollectionView.collection.models
    );
    let childModels = taskCollectionView.collection.models;
    this.destroyChildTaskModels(childModels); //remove the children in db
  },
  destroyChildTaskModels(childModels) {
    childModels.forEach((childModel) => {
      childModel.destroy({
        success: () => {
          console.log("childModel removed:", childModel);
          variables.tasksCollection.remove(childModel);
        },
        error: (err) => {
          console.log("error iin childmodel remove", err);
        },
      });
    });
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
    // save title Must trigger so that the model is added to the collection
    // console.log("this model inSave column task", this.model)
    this.model.set("name", title);
    this.model.set("modified_at", TimeStamp());

    if (this.model) {
      this.model.save(
        {},
        {
          success: () => {
            console.log("!!!!Column saved with new title value!!!!:", title);
            console.log("!!!!Column saved with this model ::!!!!:", this.model);
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
    // console.log("!!!!!this.reRenderView!!!!!");
    this.render();
  },
  showInputField() {
    // // console.log("title clicked");
    let title = $.trim(this.$(".kanban-card__header__title").html());

    this.setPrevInputValue(title);

    // // console.log("title", title);
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
    // TODO: trigger Collection event
    let thisColumnsTasksArray = variables.tasksCollection.where({
      colId: thisModel.id,
    });

    thisColumnsTasksArray.forEach((task) => {
      thisColumnsTasks.add(new TaskModel({ ...task.toJSON() }));
    });
    console.log("thisColumnsTasksArray",thisColumnsTasksArray);
    console.log("thisColumnsTasksArray",variables.tasksCollection);
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

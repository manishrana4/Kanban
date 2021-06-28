import Marionette from "backbone.marionette";
import variables from "../services/variables";
import TaskModel from "../models/task";
import TimeStamp from "../services/timeStamp";
import $ from "jquery";
import template from "../templates/taskItem.html";

var prevInputInputValue;
var isEnterPressed = false;

var TaskItemView = Marionette.View.extend({
  // className: "kanban-card__body__task",
  attributes: {
    // draggable: "true",
  },
  template: template,
  ui: {
    thisTaskCard: ".kanban-card__body__task",
    deleteOption: ".kanban-card__body__task__option",
    taskTitle: ".kanban-card__body__task__title",
    inputArea: ".kanban-card__body__task__title-input",
    inputField: ".kanban-card__body__task__title-input__input",
  },
  triggers: {
    "click @ui.deleteOption": "destroy:task",

    // "focusout @ui.inputArea": "destroy:empty",
    // "keydown @ui.inputArea": "destroy:empty",
  },
  events: {
    // "drag @ui.thisTaskCard": "onDrag",
    "dragstart @ui.thisTaskCard": "onDragStart",
    "click @ui.deleteOption": "destroyTask",
    "click @ui.taskTitle": "showInputField",
    "focusout @ui.inputArea": "onFocusOut",
    "keydown @ui.inputArea": "onPressEnter",
  },
  onDrag(event) {
    let thisModel = this.model.toJSON();

    event.originalEvent.dataTransfer.effectAllowed = "move";
    event.originalEvent.dataTransfer.setData("text/plain", thisModel.id);

    console.log(
      "form task item event.dataTransfer",
      event.originalEvent.dataTransfer
    );
  },
  onDragStart(event) {
    let thisModel = this.model.toJSON();

    event.originalEvent.dataTransfer.effectAllowed = "move";

    event.originalEvent.dataTransfer.setData(
      "text/plain",
      JSON.stringify(thisModel)
    );
    console.log(
      "form task item event.dataTransfer",
      event.originalEvent.dataTransfer.getData("text/plain")
    );
  },
  destroyTask() {
    // TODO : DESTROY NEWLY ADDED TASK ERROR
    // console.log("to be destroyed model", this.model);
    // this.model.destroy({
    //   success: function () {
    //     console.log("task removed");
    //   },
    //   error: function () {
    //     console.log("error removing task");
    //   },
    // });
  },
  setPrevInputValue(inputValue) {
    prevInputInputValue = inputValue;
  },
  showInputField() {
   
    let task = $.trim(this.$(".kanban-card__body__task__title").html());

    this.setPrevInputValue(task);

    // hide text on click to edit
    this.$(".kanban-card__body__task__title").toggleClass("hide");
    this.$(".kanban-card__body__task__option").toggleClass("hide");

    // show with text on click
    this.$(".kanban-card__body__task__title-input").toggleClass("hide");
    this.$(".kanban-card__body__task__title-input__field").focus();
    this.$(".kanban-card__body__task__title-input__field").val(task);
  },
  saveTask(taskTitle) {
    // save Task Must trigger so that the model is added to the collection
    console.log("new value", taskTitle);
    this.model.set("name", taskTitle);
    this.model.set("modified_at", TimeStamp());
    if (prevInputInputValue !== "") {
      console.log("prevInputInputValue", prevInputInputValue);

      let thisModel = variables.tasksCollection.findWhere("id", this.model.id);
      thisModel.set("name", taskTitle);
      thisModel.set("modified_at", TimeStamp());
      this.model.save({}, { success: () => {}, error: () => {} });
    } else {
      // if there is no id of same in variables.taskCollection push to varibales
      if (this.model) {
        this.model.save(
          {},
          {
            success: () => {
              console.log(
                "!!!!task saved with new title value!!!!:",
                taskTitle
              );
              // on success make the change in task collection and rerender Task Collection
              variables.tasksCollection.push(this.model); //this is for new add

              // for edit
              // re render the parent
              this.trigger("render:task");
            },
          }
        );
      }
    }
  },
  getInputValue() {
    let inputValue = this.$(
      ".kanban-card__body__task__title-input__field"
    ).val();
    return inputValue;
  },
  onPressEnter(e) {
    if (e.which === 13) {
      console.log("enter pressed");
      this.editConfirm();
      isEnterPressed = true;
    }
  },
  onFocusOut() {
    if (!isEnterPressed) {
      console.log("clicked outside the input");
      this.editConfirm();
    } else {
      isEnterPressed = !isEnterPressed;
    }
  },
  editConfirm() {
    let task = this.getInputValue();

    // hide text on click to edit
    this.$(".kanban-card__body__task__title").removeClass("hide");
    this.$(".kanban-card__body__task__option").removeClass("hide");

    // show with text on click
    this.$(".kanban-card__body__task__title-input").addClass("hide");
    // also check with previous value to avoid network call if no change
    if (task !== "" && task !== prevInputInputValue) {
      this.$(".kanban-card__body__task__title").html(task);
      this.saveTask(task);
    } else if (task === "" && prevInputInputValue !== "") {
      // prev value is set wihout this case too
      this.$(".kanban-card__body__task__title").html(prevInputInputValue);
    } else if (task === "" && prevInputInputValue === "") {
      // for only new
      // trigger remove child event from parent and show add child button
      console.log("removing this view since empty on add new task");
      this.trigger("destroy:empty", this);
    }
  },
  initialize(options) {},
  onRender() {
    if (this.options && this.options.inputFocus) {
      this.showInputField();
    }
  },
});

export default TaskItemView;

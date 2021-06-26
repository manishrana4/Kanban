import Marionette from "backbone.marionette";
import variables from "../services/variables";
import TaskModel from "../models/task";
import TimeStamp from "../services/timeStamp";
import $ from "jquery";
import template from "../templates/taskItem.html";

var prevInputInputValue;
var isEnterPressed = false;

var TaskItemView = Marionette.View.extend({
  template: template,
  ui: {
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
    "click @ui.deleteOption": "destroyTask",
    "click @ui.taskTitle": "showInputField",
    "focusout @ui.inputArea": "onFocusOut",
    "keydown @ui.inputArea": "onPressEnter",
  },
  destroyTask() {
    // TODO : DESTROY NEWLY ADDED TASK ERROR
    // console.log("destroy task clicked id", this.model.toJSON().id);
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
    // console.log("title clicked");
    let task = $.trim(this.$(".kanban-card__body__task__title").html());

    this.setPrevInputValue(task);

    // console.log("task", task);
    // hide text on click to edit
    this.$(".kanban-card__body__task__title").toggleClass("hide");
    this.$(".kanban-card__body__task__option").toggleClass("hide");

    // show with text on click
    this.$(".kanban-card__body__task__title-input").toggleClass("hide");
    this.$(".kanban-card__body__task__title-input__field").val(task);

    this.$(".kanban-card__body__task__title-input__field").focus();
  },
  saveTask(taskTitle) {
    // save Task Must trigger so that the model is added to the collection
    this.model.set("name", taskTitle);
    this.model.set("modified_at", TimeStamp());

    if (this.model) {
      // this.model.colId=
      this.model.save(
        {},
        {
          success: () => {
            console.log("!!!!task saved with new title value!!!!:", taskTitle);
            // on success make the change in task collection and rerender Task Collection
            variables.tasksCollection.push(this.model);
            // re render the parent
          },
        }
      );
    } else {
      // this.model.save({
      //   success: function () {
      //     console.log("task saved with new title value :", taskTitle);
      //   },
      // });
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
      // console.log("options.focusInput on RENder:", this.options.inputFocus);
      this.showInputField();
    }
  },
});

export default TaskItemView;

import Marionette from "backbone.marionette";
import variables from "../services/variables";
import TimeStamp from "../services/timeStamp";
import $ from "jquery";
import template from "../templates/taskItem.html";

var prevInputInputValue;

var TaskItemView = Marionette.View.extend({
  template: template,
  ui: {
    deleteOption: ".kanban-card__body__task__option",
    taskTitle: ".kanban-card__body__task__title",
    inputArea: ".kanban-card__body__task__title-input",
  },
  events: {
    "click @ui.deleteOption": "destroyTask",
    "click @ui.taskTitle": "showInputField",
    "focusout @ui.inputArea": "onFocusOut",
    "keydown @ui.inputArea": "onPressEnter",
    // onEnter or focus out event
  },
  destroyTask() {
    console.log("destroy task clicked id", this.model.toJSON().id);
    this.model.destroy({
      success: function () {
        console.log("task removed");
      },
      error: function () {
        console.log("error removing task");
      },
    });
  },
  setPrevInputValue(inputValue){
    prevInputInputValue=inputValue;
  },
  showInputField() {
    
    console.log("title clicked");
    let task = $.trim(this.$(".kanban-card__body__task__title").html());

    this.setPrevInputValue(task);

    console.log("task", task);
    // hide text on click to edit
    this.$(".kanban-card__body__task__title").addClass("hide");
    this.$(".kanban-card__body__task__option").addClass("hide");

    // show with text on click
    this.$(".kanban-card__body__task__title-input").addClass("show");
    this.$(".kanban-card__body__task__title-input__field").val(task);
    this.$(".kanban-card__body__task__title-input__field").focus();
  },
  saveTask(taskTitle) {
    this.model.set("name", taskTitle);
    this.model.set("modified_at", TimeStamp());

    this.model.save({success:function(){
      console.log("task saved with new title value :", taskTitle);
    }})
  },
  getInputValue() {
    let inputValue = this.$(
      ".kanban-card__body__task__title-input__field"
    ).val();
    return inputValue;
  },
  onPressEnter(e) {
    console.log("e", e.which);
    if (e.which === 13) {
      console.log("enter pressed");
      this.editConfirm();
    }
  },
  onFocusOut() {
    console.log("clicked outside the input");
    this.editConfirm();
  },
  editConfirm() {
    console.log("Edit confirmed", this.getInputValue());

    let task = this.getInputValue();
    console.log("task", task);
    // hide text on click to edit
    this.$(".kanban-card__body__task__title").removeClass("hide");
    this.$(".kanban-card__body__task__option").removeClass("hide");

    // show with text on click
    this.$(".kanban-card__body__task__title-input").removeClass("show");
    // also check with previous value to avoid network call if no change
    if (task !== "" && task !== prevInputInputValue) {
      this.$(".kanban-card__body__task__title").html(task);
      this.saveTask(task);
    }
  },
  initialize() {
    // console.log("hello form task item continer");
    console.log("this on task item", this.model.toJSON());
  },
  onrender() {
    console.log("this on task container", this);
  },
});

export default TaskItemView;

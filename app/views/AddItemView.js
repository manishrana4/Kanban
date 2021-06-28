import Marionette from "backbone.marionette";
import variables from "../services/variables";
import TimeStamp from "../services/timeStamp";
import $ from "jquery";
import template from "../templates/addItem.html";

var AddItemView = Marionette.View.extend({
  template: template,
  ui: {
    addTaskBtn: ".kanban-card__body__task__add__btn",
    addTaskText: ".kanban-card__body__task__add__btn__text",
    inputWrapper: ".kanban-card__body__task__add__input",
    inputField: ".kanban-card__body__task__add__input__field",
  },
  triggers: {
    "click @ui.addTaskBtn": "add:task",
  },
  events: {
    "click @ui.addTaskBtn": "showInputField",
    "focusout @ui.inputArea": "onFocusOut",
    "keydown @ui.inputArea": "onPressEnter",
    "mouseup @ui.addTaskBtn": "preventDefault",
  },
  preventDefault(e) {
    console.log(e);
    e.preventDefault();
  },
  showInputField() {},
});

export default AddItemView;

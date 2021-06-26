import Marionette from "backbone.marionette";
import $ from "jquery";
import template from "../templates/addColumn.html";

var AddColumnView = Marionette.View.extend({
  className: "column",
  template: template,
  ui: {
    addColumnBtn: ".column__add__btn",
    addColumnText: ".column__add__btn__text",
    inputWrapper: ".column__add__input",
    inputField: ".column__add__input__field",
  },
  triggers: {
    'click @ui.addColumnBtn': 'add:column'
  },
  events: {
    "click @ui.addColumnBtn": "showInputField",
    "focusout @ui.inputArea": "onFocusOut",
    "keydown @ui.inputArea": "onPressEnter",
    "mouseup @ui.addColumnBtn":"preventDefault",
  },
  preventDefault(e){
    console.log(e);
    e.preventDefault();
  },
});

export default AddColumnView;

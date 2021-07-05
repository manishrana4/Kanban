import Marionette from "backbone.marionette";
import variables from "../services/variables";
import TaskModel from "../models/task";
import TimeStamp from "../services/timeStamp";
import { v4 as uuidv4 } from "uuid";
import $, { each } from "jquery";
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
    // "click @ui.deleteOption": "destroy:task",
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
  // onDrag(event) {
  //   let thisModel = this.model.toJSON();

  //   event.originalEvent.dataTransfer.effectAllowed = "move";
  //   event.originalEvent.dataTransfer.setData("text/plain", thisModel.id);

  //   console.log(
  //     "form task item event.dataTransfer",
  //     event.originalEvent.dataTransfer
  //   );
  // },
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
    console.log("to be destroyed model", this.model);
    this.model.destroy({
      success: (model) => {
        console.log("task removed");
        // trigger task container re render
        variables.tasksCollection.remove(model); // remove model from local taskCollection
        // this.destroy();
        
        this.trigger("destroy:task");
      },
      error: () => {
        console.log("error removing task");
      },
    });
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
    console.log("NEW TASK TITLLE (saveTask):", taskTitle);
    console.log("this.model (saveTask):", this.model.get("taskId"));
    console.log("this.model (saveTask):", this.model.toJSON());

    let thisModelTaskId = this.model.get("taskId");
    this.model.set("name", taskTitle);
    this.model.set("modified_at", TimeStamp());

    if (prevInputInputValue !== "") {
      // UPDATE PREVIOUS TASK SECTION
      console.log("UPDATE PREVIOUS TASK SECTION");
      console.log("prevInputInputValue", prevInputInputValue);

      this.model.save(
        {},
        {
          success: () => {
            // change id to taskId since for each Col there is duplicate id but not taskId
            console.log(
              "variables.tasksCollection findWhere taskId this.model.taskId",
              variables.tasksCollection.findWhere({ taskId: thisModelTaskId })
            );
            variables.tasksCollection
              .findWhere({ taskId: thisModelTaskId })
              .set("name", taskTitle);
            variables.tasksCollection
              .findWhere({ taskId: thisModelTaskId })
              .set("modified_at", TimeStamp());

            console.log("variables.tasksCollection", variables.tasksCollection);
            variables.tasksCollection.forEach((task) => {
              console.log(
                `variables.tasksCollection id: ${task.id}: `,
                task.toJSON()
              );
            });

            console.log(
              "this.model.save-> success-> variables.tasksCollection.findWhere('id', this.model.id):",
              variables.tasksCollection
                .findWhere({ taskId: thisModelTaskId })
                .toJSON()
            );
            console.log("variables.tasksCollection", variables.tasksCollection);

            this.trigger("render:task");
          },
          error: () => {},
        }
      );
    } else {
      // ADD NEW TASK SECTION
      console.log("Create new TASK SECTION");
      console.log("this.model", this.model);
      console.log("this.model uuidv4", uuidv4());

      this.model.set("taskId", uuidv4());
      // BUG: The Json-server deletes all the task on one task delete because taskId is
      // not related to any other table

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
  initialize(options) {
    console.log(
      "variables.tasksCollection on initialisation TASK ITEM VIEW",
      variables.tasksCollection
    );
  },
  onRender() {
    console.log(
      "variables.tasksCollection onRender TASK ITEM VIEW",
      variables.tasksCollection
    );

    if (this.options && this.options.inputFocus) {
      this.showInputField();
    }
  },
});

export default TaskItemView;

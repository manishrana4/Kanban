import Marionette from "backbone.marionette";
import ColumnView from "./ColumnView";
import TimeStamp from "../services/timeStamp";
import ColumnModel from "../models/column";
import variables from "../services/variables";
import $ from "jquery";

import template from "../templates/columnContainer.html";
import AddColumnView from "./addColumnView";

// TODO: need to add an extra childColumn for adding to list
var MainContainer = Marionette.CollectionView.extend({
  childView: ColumnView,
  childViewContainer: ".board-container",
  template: template,
  regions: {
    // container: ".board-container",
  },
  childViewTriggers: {
    "destroy:empty": "destroy:empty:child:view",
  },
  onDestroyEmptyChildView(childView) {
    console.log("childView from onDestroyEmptyChildView", childView);
    this.removeChildView(childView);
  },
  childViewEvents: {
    "add:column": "addNewColumn",
    "destroy:column": "removeView",
    "render:column": "reRenderColumns",
    render() {
      console.log("COLUMN COLLECTION VIEW CHILD EVENTS.");
    },
  },
  reRenderView() {
    this.render();
  },
  reRenderColumns() {
    console.log("rerender Columns trigger");
    this.trigger("render:main");
  },
  removeView(childView) {
    let childViewModel = childView.model;
    console.log("childView on remove ChildVIEW", childView);
    childView.model.destroy({
      success: () => {
        console.log("column removed  childView.model", childView.model);
        console.log("column removed  childViewModel", childViewModel);
        console.log("this.children.length on remove", this.children.length);

        variables.columnsCollection.remove(childViewModel); // remove model from local taskCollection
        // variables.tasksCollection.remove(childViewModel); // remove model from local taskCollection
        this.removeChildView(childView); // removes the childView

        // this.render();
        // call the column view with updated collection

        this.trigger("column:destroyed");
        // to re-renders the column View for tasks remainng
      },
      error: function () {
        console.log("error removing task");
      },
    });
  },
  addNewColumn(childView) {
    let columnCreateDate = TimeStamp();

    let newColumnModel = new ColumnModel({
      created_at: columnCreateDate,
    });
    let columnView = new ColumnView({
      inputFocus: true,
      model: newColumnModel,
    });
    this.addChildView(columnView, this.children.length - 1);
  },
  initialize() {
    // TODO: need to add an extra childColumn for adding to list
  },
  onRender() {
    // TODO: need to add an extra childColumn for adding to list

    let addColumnView = new AddColumnView();
    this.addChildView(addColumnView, this.children.length);
  },
});

export default MainContainer;

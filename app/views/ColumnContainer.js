import Marionette from "backbone.marionette";
import ColumnView from "./ColumnView";
import TimeStamp from "../services/timeStamp";
import ColumnModel from "../models/column";
import variables from "../services/variables";
import $ from "jquery";

import template from "../templates/columnContainer.html";
import AddColumnView from "./addColumnView";


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
   
    this.trigger("render:main");
  },
  removeView(childView) {
    let childViewModel = childView.model;
  
    childView.model.destroy({
      success: () => {
       

        variables.columnsCollection.remove(childViewModel); 
       
        this.removeChildView(childView); 

        // this.render();
        
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
    console.log("add new COLUMN")
    let newColumnModel = new ColumnModel({
      created_at: columnCreateDate,
    });
    let columnView = new ColumnView({
      inputFocus: true,
      model: newColumnModel,
    });
    this.addChildView(columnView, this.children.length - 1);
  },
  initialize() {},
  onRender() {
    let addColumnView = new AddColumnView();
    this.addChildView(addColumnView, this.children.length);
  },
});

export default MainContainer;

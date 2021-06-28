import Marionette from "backbone.marionette";
import ColumnContainer from "./ColumnContainer";
import TimeStamp from "../services/timeStamp";
import ColumnModel from "../models/column";
import variables from "../services/variables";
import $ from "jquery";

import template from "../templates/mainContainer.html";
import AddColumnView from "./addColumnView";

var MainView = Marionette.View.extend({
  el: "#app",
  template: template,
  regions: {
    container: ".container",
  },
  childViewEvents: {
    "column:destroyed": "reRenderView",
    "render:main": "reRenderView",
  },
  reRenderView() {
    this.render();
  },
  onRender() {
    console.log("Main container rendered");
    this.showChildView(
      "container",
      new ColumnContainer({
        collection: variables.columnsCollection,
      })
    );
  },
});

export default MainView;

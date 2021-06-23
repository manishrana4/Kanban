import Marionette from "backbone.marionette";
import ColumnView from "./ColumnView";
import variables from "../services/variables";
import $ from "jquery";

import template from "../templates/container.html";

// TODO: need to add an extra childColumn for adding to list  
var MainContainer = Marionette.CollectionView.extend({
  el: "#app",
  childView: ColumnView,
  childViewContainer: ".board-container",
  template: template,
  regions: {
    // container: ".board-container",
  },
  initialize() {
    // TODO: need to add an extra childColumn for adding to list 
  },
  onRender() {
    // TODO: need to add an extra childColumn for adding to list 
    // console.log("this column .collection", this)

  },
});

export default MainContainer;

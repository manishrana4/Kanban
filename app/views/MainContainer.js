import Marionette from "backbone.marionette";
import ColumnView from "./ColumnView";
import variables from "../services/variables";
import $ from "jquery";

import template from "../templates/container.html";

var MainContainer = Marionette.CollectionView.extend({
  el: "#app",
  childView: ColumnView,
  childViewContainer: ".board-container",
  template: template,
  regions: {
    // container: ".board-container",
  },
  initialize() {

  },
  onRender() {

    // console.log("this column .collection", this)

  },
});

export default MainContainer;

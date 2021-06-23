import Marionette from "backbone.marionette";
import ColumnContainer from "./ColumnContainer";
import variables from "../services/variables";
import $ from "jquery";

import template from "../templates/container.html";

var MainContainer = Marionette.CollectionView.extend({
  el: "#app",
  childView: ColumnContainer,
  childViewContainer: ".board-container",
  template: template,
  regions: {
    // container: ".board-container",
  },
  initialize() {
    // console.log("hello from maincontaier intialize");
    // console.log("variables.columnsCollection", variables.columnsCollection);
    // var columnContainer = new ColumnContainer({
    //     collection: variables.tasksCollection,
    //   });
    //   columnContainer.render();
  },
  onRender() {
    // console.log(
    //   "variables.tasksCollection from main container",
    //   variables.tasksCollection
    // );
    console.log("this column .collection", this)
    // var columnContainer = new ColumnContainer({
    //   collection: variables.tasksCollection,
    // });
    // columnContainer.render();

    // this.showChildView(
    //   "container",
    //   new ColumnContainer({
    //     collection: variables.tasksCollection,
    //   })
    // );
  },
});

export default MainContainer;

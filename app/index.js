import Marionette from "backbone.marionette";
import MainView from "./views/MainView";
import variables from "./services/variables";
import ColumnsCollection from "./collections/columns";
import TasksCollection from "./collections/tasks";
import $ from "jquery";

variables.columnsCollection = new ColumnsCollection();
variables.tasksCollection = new TasksCollection();

const App = Marionette.Application.extend({
  onStart(app, options) {
    console.log("app started");
    // var mainView = new MainView({
    //   collection:options.columns
    // });
    var mainView = new MainView();
    mainView.render();
  },
});

const app = new App();

variables.columnsCollection.fetch({
  success: () => {
    variables.tasksCollection.fetch({
      success:()=>{
          // console.log("tasks loaded successfully");
          console.log("task collection", variables.tasksCollection);
          console.log("columnsCollection", variables.columnsCollection);
        //   app.start({
        //     columns: variables.columnsCollection
        //  });
        app.start();
      },
      error:(error)=>{
          console.log("error in r=tasks fetch", error);
      }
  })
    // app.start({
    //    columns: variables.columnsCollection
    // });
    // also fetch tasks here
    // console.log("variables.columnsCollection", variables.columnsCollection);
  },
  error: (error) => {
    console.log("error in collection fetch:", error);
  },
});

// variables.tasksCollection.fetch({
//     success:()=>{
//         // console.log("tasks loaded successfully");
//         // console.log("task collection", variables.tasksCollection);
//     },
//     error:(error)=>{
//         console.log("error in r=tasks fetch", error);
//     }
// })

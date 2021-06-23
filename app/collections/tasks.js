import Backbone from 'backbone';
import taskModel from '../models/task';

var TasksCollection= Backbone.Collection.extend({
    model:taskModel,
    url: "http://localhost:3000/tasks",
});

export default TasksCollection;

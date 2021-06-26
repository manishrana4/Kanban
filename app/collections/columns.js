import Backbone from 'backbone';
import columnModel from '../models/column';

var ColumnsCollection= Backbone.Collection.extend({
    model:columnModel,
    url: "http://localhost:3000/columns",
})

export default ColumnsCollection;
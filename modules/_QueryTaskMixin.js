/*global dojo, console, esri*/
dojo.provide("ijit.modules._QueryTaskMixin");

dojo.declare("ijit.modules._QueryTaskMixin", null, {
    // summary:
    //      Easily add a query task to your class
    
    // query: esri.tasks.Query
    query: null,
    
    // qTask: esri.tasks.QueryTask
    qTask: null,
    
    setUpQueryTask: function(url, queryParams){
        // summary:
        //      sets up the query task and query parameters objects
        //      and wires events
        // url: String
        //      The url to the layer that you want the task based upon
        // queryParams: {
        //      geometry: esri.Geometry,
        //      maxAllowableOffset: Number,
        //      outFields: String[],
        //      returnGeometry: Boolean (default: false),
        //      where: String
        // }
        //      The parameters that will be mixed into the esri.tasks.Query object
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
        
        this.query = new esri.tasks.Query();
        dojo.mixin(this.query, queryParams);
        
        this.qTask = new esri.tasks.QueryTask(url);
        
        dojo.connect(this.qTask, 'onComplete', this, 'onQueryTaskComplete');
        dojo.connect(this.qTask, "onError", this, 'onQueryTaskError');
    },
    onQueryTaskComplete: function(fSet){
        // summary:
        //      callback for the query task
        // fSet: esri.tasks.FeatureSet
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
    },
    onQueryTaskError: function(er){
        // summary:
        //      callback for when the query task returns an error
        // er: Error
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
    },
    executeQueryTask: function(geo, where){
        // summary:
        //      updates the query and fires the task
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
        
        this.query.geometry = geo;
        this.query.where = where;
        
        this.qTask.execute(this.query);
    }
});

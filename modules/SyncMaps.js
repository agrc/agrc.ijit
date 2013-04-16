/*global dojo, console*/
dojo.provide('ijit.modules.SyncMaps');

dojo.declare('ijit.modules.SyncMaps', null, {
    // summary:
    //      synchronizes the extents of multiple maps
    //      Got most of code from: http://www.arcgis.com/apps/Compare/Configure/index.html?webmap=ce4cbe1d06e2484284ffd692dfa62545

    // connects: dojo.connect signatures[]
    //      All of the connects
    connects: null,

    // manualSettingExtent: Boolean
    //      Switch to let me know when I'm setting the extent on the
    //      map rather than another object
    manualSettingExtent: false,

    // parameters passed in via the constructor

    // maps: esri.Map[]
    //      The maps that you want to sync
    maps: null,
    
    constructor: function (params) {
        // summary:
        //      The first function to fire. Sets up this class
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);

        dojo.mixin(this, params);

        this.wireEvents();
    },
    wireEvents: function () {
        // summary:
        //      Wires the up the mouse events for the maps
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
    
        // wire to mouse events
        dojo.forEach(this.maps, function (map) {
            dojo.connect(map, 'onMouseWheel', this, function () {
                this.connectEvents(map);
            });
            dojo.connect(map, 'onMouseDragStart', this, function () {
                this.connectEvents(map);
            });
            dojo.connect(map, 'setExtent', this, function (extent) {
                this.onSetExtent(map, extent);
            });
        }, this);
    },
    connectEvents: function (map) {
        // summary:
        //      wires up the onexchange event for the only the affected map
        // map: esri.Map
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
    
        this.disconnectEvent();

        this._extentChangeEvent = dojo.connect(map, 'onExtentChange', this, function () {
            this.syncMaps(map);

            this.disconnectEvent();
        });
    },
    disconnectEvent: function () {
        // summary:
        //      disconnects the onExtentChange event
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
    
        dojo.disconnect(this._extentChangeEvent);
    },
    syncMaps: function (changeMap, extent) {
        // summary:
        //      updates the other maps with the extent of changeMap
        // changeMap: esri.Map
        // extent: esri.geometry.Extent [optional]
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
        
        this.manualSettingExtent = true;

        dojo.forEach(this.maps, function (map) {
            if (map !== changeMap) {
                if (extent) {
                    map.setExtent(extent);
                } else {
                    map.setExtent(changeMap.extent);
                }
            }
        });

        this.manualSettingExtent = false;
    },
    onSetExtent: function (map, extent) {
        // summary:
        //      Fires when set extent is called on a map
        // map: esri.Map
        //      The map that setExtent was called on
        // extent: esri.geometry.Extent
        //      The new extent
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
    
        // don't do anything if I'm the one setting the extent
        if (!this.manualSettingExtent) {
            this.syncMaps(map, extent);
        }
    }
});
define(function (require) {

    // one Factory is created and used, even on second module load attempt
    return function visFactory() {
        
        // singleton visualisations of each type can be created (mini dashboards could be created)
        // if only one type can be instatiated, allow for only one vis handle to be stored and assigned
        var visD3;
        var d3 = require("d3v4");
        var ConceptMap = require('./concept-map');
        var plot = undefined;
        
        this.createVis = function(type, init) {
            
            if (type === "vis_d3") {
                // singleton d3 visualisation is created
                //if (bar === undefined) bar = new bar(init);
                visD3 = new vis_d3(init);
                return visD3;
            }
            else
                return undefined;
        };

        function item(name, flink){
            this.name = name;
            this.type = "ditem";
            this.description = "#";
            this.ditem = 1;
            this.date = "2012-05-05 23:50:11";
            this.slug = name;
            this.links = flink.map(function(link){
                return link.key;
            });
        }

        function theme(name) {
            this.type = "theme",
            this.name = name,
            this.description = "",
            this.slug = name;
        }

        function buscartheme(mi_array, name) {
            var posicion = -1;
            for (var i = 0; i < mi_array.length && posicion == -1; i++) {
                if (mi_array[i].name == name) {
                    posicion = i;
                }
            }   
            return posicion;
        }
        
        /*
         * d3 visualisation;
         */
        var vis_d3 = function (init) {
            //Width and height
            var svgRoot = init;
            var svg;
             
            // functions
            this.updateData = function(data) {
                if (data !== null) {
                   this.dataset = data;
                };
            };
            
            this.render = function (vis) {

                /* Data Elasticsearch */
                var dataset = this.dataset;
                var ditems = [];
                var themes = [];
                var index = 0;

                // PARSER DATA 
                dataset.forEach(function(elem){
                    ditems.push(new item(elem.label, elem.value));
                    elem.value.forEach(function(link){
                        index = buscartheme(themes, link.key);
                        if (index == -1) {
                            themes.push(new theme(link.key));
                        }
                    });

                });

                
                var dataJson = {
                    "ditems": ditems,
                    "themes": themes,
                    "perspectives": [
                    ]
                }

                $('svg').remove();
                ConceptMap("graph", "graph-info", dataJson);    
                
            };

            return this;
        }
    };
});
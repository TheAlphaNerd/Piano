/*
Google Summer of Code 2012: Automagic Music Maker

Primarily written by Myles Borins
Strongly influenced by GSOC Mentor Colin Clark
Using the Infusion framework and Flocking Library


Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

var automm = automm || {};

(function ($, fluid) {
    fluid.defaults("automm.piano", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        preInitFunction: "automm.piano.preInitFunction",
        postInitFunction: "automm.piano.postInitFunction",
        
        model: {
            firstNote: 60, // Middle C
            octaves: 1,
            octaveNotes: 12,
            afour: 69,
            afourFreq: 440,
            padding: 50,
            pattern: ['white','black','white','black','white','white','black','white','black','white','black','white'],
            keys: {
                white: {width: 50, height: 200, stroke: "black", fill: "white", highlight: "yellow", notes: []},
                black: {width: 30, height: 125, stroke: "black", fill: "black", highlight: "yellow", notes: []}
            },
        },
        
        events: {
            
        },
        
        listeners: {
            
        }
    });
    
    automm.piano.preInitFunction = function (that) {
        that.setup = function (){
            that.model.keys.white.notes = [];
            that.model.keys.black.notes = [];
            for (i = that.model.firstNote; i < (that.model.firstNote + (that.model.octaves * that.model.octaveNotes)); i+=1){
                that.model.keys[that.model.pattern[i % that.model.octaveNotes]].notes.push(i);
            }
        
            that.model.whiteNotes = that.model.keys.white.notes.length;
            that.model.blackNotes = that.model.keys.black.notes.length;
        
            that.model.viewbox = {
                width: (that.model.keys.white.width * that.model.whiteNotes) + that.model.padding,
                height: that.model.keys.white.height + that.model.padding,
            };
            
            // Calculate to create string neccesary to generate viewbox (should be in JSON?)
            that.model.viewbox.dim = "0 0 " + that.model.viewbox.width + " " + that.model.viewbox.height;
        };
        
        
        // Automation of drawing all the keys on the canvas
        that.drawNote = function(noteType, x, y, id){
            var r = that.noteGroup.append("rect");
            r.style("stroke", noteType.stroke);
            r.style("fill", noteType.fill);
            r.attr("x", x);
            r.attr("y", y);
            r.attr("width", noteType.width);
            r.attr("height", noteType.height);
            r.attr("id", id);
            r.attr("class", "note");
        };
        
        // Automation of drawing all the keys on the canvas
        that.draw = function(){
            var blackX = 0 - (that.model.keys.black.width / 2),
                prevNote,
                blackCount = 0;
            
            // Draw White Keys
            for (i = 0; i < that.model.keys.white.notes.length; i+=1){
                that.drawNote(that.model.keys.white, i * that.model.keys.white.width, 0, that.model.keys.white.notes[i]);
            }
            
            // Draw Black Keys
            for (i = 0; i < that.model.octaves * that.model.octaveNotes; i+=1){
                
                // If the current key in the pattern is black then draw it!
                if (that.model.pattern[i%12] === "black") {
                    blackX = blackX + that.model.keys.white.width;
                    that.drawNote(that.model.keys.black, blackX, 0, that.model.keys.black.notes[blackCount]);
                    blackCount = blackCount + 1;
                }
                
                // If it is white, but the previous key was white, skip the key
                if (that.model.pattern[i%12] === prevNote){
                    blackX = blackX + that.model.keys.white.width;
                }
                
                // Keep track of previous key
                prevNote = that.model.pattern[i%12]
            }
        };
        
        that.init = function(){            
            // Calculate it all
            that.setup();
            // Draw viewbox and subsequent group to draw keys into
            that.d3container = d3.select("#piano");  // ??????
            var svg = that.d3container.append("svg");
            svg.attr("viewBox", that.model.viewbox.dim)
            svg.attr("id", "viewbox")
            
            that.noteGroup = svg.append("g")
            that.noteGroup.attr("transform", "translate(" + that.model.padding / 2 + "," + that.model.padding / 2 + ")");
            
            // Draw the keys
            that.draw();
        };
        
        that.update = function (param, value) {
            that.applier.requestChange(param, value);
            that.container.html('');
            that.init();
        };
    };
    
    automm.piano.postInitFunction = function (that) {
        that.init();
    };
    
    // fluid.defaults("automm.key", {
    //     gradeNames: ["fluid.modelComponent", "autoInit"],
    //     postInitFunction: "automm.key.postInitFunction",
    //     
    //     model: {
    //         x: 0,
    //         y: 0,
    //         width: 50,
    //         height: 200,
    //         stroke: black,
    //         fill: white,
    //         id: 60,
    //         cssclass: "note",
    //         shape: "rect"
    //     }
    // });
    // 
    // automm.key.postInitFunction = function (that){
    //     that.html = function (){
    //         return "<" + shape +"style\"stoke: " + 
    //     };
    // };
    
    // fluid.defaults("automm.viewBox", {
    //     gradeNames: ["fluid.modelComponent", "autoInit"],
    //     postInitFunction: "automm.viewBox.postInitFunction",
    //     
    //     model: {
    //         width: 600,
    //         height: 200
    //     }
    // });
    // 
    // automm.viewBox.postInitFunction = function (that){
    //     that.html = function(){
    //         return ["<svg viewbox=\"0 0 " + that.model.width + " " + that.model.height + "\" id=\"viewbox\">", "</svg>"];
    //     }
    // };
    
})(jQuery, fluid_1_4);
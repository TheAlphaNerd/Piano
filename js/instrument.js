/*
Google Summer of Code 2012: Automagic Music Maker

Primarily written by Myles Borins
Strongly influenced by GSOC Mentor Colin Clark
Using the Infusion framework and Flocking Library

The Automagic Music Maker is distributed under the terms the MIT or GPL2 Licenses. 
Choose the license that best suits your project. The text of the MIT and GPL 
licenses are at the root of the Piano directory. 

*/
/*global jQuery, fluid */

var automm = automm || {};

(function () {
    "use strict";
    fluid.defaults("automm.instrument", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        postInitFunction: "automm.instrument.postInitFunction",

        model: {
            instrumentType: "piano",
            autoPiano: false,
            autoGrid: false,
            autoGui: false,
            columns: 8,
            rows: 8,
            afour: 69,     // The note number of A4... this could probably be calculate based on all the other stuff (probably should be)
            afourFreq: 440, // Standard freq for A4, used to calculate all other notes
            firstNote: 60, // Middle C
            octaves: 1,
            octaveNotes: 12,
            padding: 0,
            pattern: ['white', 'black', 'white', 'black', 'white', 'white', 'black', 'white', 'black', 'white', 'black', 'white'],
            keys: {
                white: {
                    fill: '#ffffff', // White
                    stroke: '#000000', //  Black
                    highlight: '#fff000' //  Yellow
                },
                black: {
                    fill: '#000000', // Black
                    stroke: '#000000', // Black
                    highlight: '#fff000' //  Yellow
                }
            }
        },
        
        selectors: {
            piano: ".piano"
        },
        
        events: {
            onNote: null,
            afterNote: null,
            afterInstrumentUpdate: null,
            afterGuiUpdate: null,
            afterNoteCalc: null,
            afterUpdate: null,
            getNoteCalc: null,
            afterPoly: null
        },

        components: {
            userInterface: {
                type: "automm.piano",
                container: "{instrument}.dom.piano",
                applier: "{instrument}.applier",
                selectors: {
                    notes: ".notes"
                },
                options: {
                    model: {
                        auto: "{instrument}.model.autoPiano",
                        firstNote: "{instrument}.model.firstNote", // Middle C
                        octaves: "{instrument}.model.octaves",
                        octaveNotes: "{instrument}.model.octaveNotes",
                        padding: "{instrument}.model.padding",
                        pattern: "{instrument}.model.pattern",
                        keys: "{instrument}.model.keys"
                    },
                    events: {
                        onNote: "{instrument}.events.onNote",
                        afterNote: "{instrument}.events.afterNote",
                        afterInstrumentUpdate: "{instrument}.events.afterInstrumentUpdate",
                        afterNoteCalc: "{instrument}.events.afterNoteCalc",
                        afterUpdate: "{instrument}.events.afterUpdate",
                        getNoteCalc: "{instrument}.events.getNoteCalc"
                    }
                }
            },

            oscillator: {
                type: "automm.oscillator",
                options: {
                    model: {
                        afour: "{instrument}.afour",
                        afourFreq: "{instrument}.afourFreq",
                        ocaveNotes: "{instrument}.octaveNotes"
                    },
                    events: {
                        onNote: "{instrument}.events.onNote",
                        afterNote: "{instrument}.events.afterNote",
                        afterInstrumentUpdate: "{instrument}.events.afterInstrumentUpdate"
                    }
                }
            },

            gui: {
                type: "automm.gui",
                container: "{instrument}.container",
                options: {
                    model: {
                        drawGui: "{instrument}.model.drawGui",
                        firstNote: "{instrument}.model.firstNote", // Middle C
                        octaves: "{instrument}.model.octaves",
                        octaveNotes: "{instrument}.model.octaveNotes",
                        padding: "{instrument}.model.padding",
                        pattern: "{instrument}.model.pattern",
                        keys: "{instrument}.model.keys"
                    },
                    events: {
                        afterGuiUpdate: "{instrument}.events.afterGuiUpdate"
                    }
                }
            },

            eventBinder: {
                type: "automm.eventBinder",
                container: "{piano}.container",
                options: {
                    events: {
                        afterUpdate: "{instrument}.events.afterUpdate",
                        onNote: "{instrument}.events.onNote",
                        afterNote: "{instrument}.events.afterNote",
                        afterPoly: "{instrument}.events.afterPoly"
                    }
                }
            },

            highlighter: {
                type: "automm.highlighter",
                container: "{grid}.container",
                options: {
                    model: {
                        keys: "{instrument}.model.keys"
                    },
                    events: {
                        onNote: "{instrument}.events.onNote",
                        afterNote: "{instrument}.events.afterNote",
                        afterNoteCalc: "{instrument}.events.afterNoteCalc",
                        getNoteCalc: "{instrument}.events.getNoteCalc"
                    }
                }
            }
        }
    });

    automm.instrument.postInitFunction = function (that) {
        that.container.append("<div class='" + that.model.instrumentType + "'></div>");
        
        that.update = function (param, value) {
            that.applier.requestChange(param, value);
            that.events.afterInstrumentUpdate.fire(param, value);
            return that;
        };
        that.events.afterGuiUpdate.addListener(that.update);
    };
    
    fluid.demands("automm.instrument", "automm.instrumentWithGrid", {
        
        option: {
            userInterface: {
                type: "automm.grid"
            }
        }
    });
    
    automm.gridstrument = function (container, options) {
        container.append("<div class='grid'></div>");        
        fluid.staticEnvironment.something(fluid.typeTag("automm.instrumentWithGrid"));
        return fluid.instrument(container, options);
    };
    
    automm.pianoInstrument = function (container, options) {
        return automm.instrument(container, options);
    };
}());
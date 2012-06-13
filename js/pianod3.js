var automm = automm || {};

(function ($) {
    automm.midiToFreq = function(m){
        return Math.pow(2, ((m-69)/12))*440;
    };
    automm.piano = function (container){
        // Initialize that
        var that = {};
        
        // Initializae key values ~ These should be coming in via JSON
        var firstNote = 60;         // Note Number of first key drawn
        var octaves = 2;             // Number of Octaves to Draw
        var octaveNotes = 12;       // Number of notes per octave
        var afour = 69;             // Note Number of A4
        var afourFreq = 440;        // Frequency of A4
        var padding = 50;            // Size of padding to be 
        
        // Store variable to be used for drawing
        // Stores width and height of both white and black notes as well as fill colour and highlight colour
        // This too should be coming in via json
        var keys = {
            white: {width: 50, height: 200, stroke: "black", fill: "white", highlight: "yellow", notes: []},
            black: {width: 30, height: 125, stroke: "black", fill: "black", highlight: "yellow", notes: []}
        };
        
        // Pattern of how keys should be drawn
        var pattern = ['white','black','white','black','white','white','black','white','black','white','black','white'];
        
        // Assign Specific Notes to key Based on Pattern
        // Assuming that info is coming in via JSON these three lines could be executed outside of this code
        // JSON could serve the keys object complete with all notes already in there
        for (i = firstNote; i < (firstNote + (octaves * octaveNotes)); i+=1){
            keys[pattern[i % octaveNotes]].notes.push(i);
        }
        
        // Perhaps these would be better as part of the keys object, but for not this was a bit cleaner
        var whiteNotes = keys.white.notes.length;
        var blackNotes = keys.black.notes.length;
        
        // Calculations to figure out size of viewbox
        // This also could be supplied with the json
        var viewbox = {
            width: (keys.white.width * whiteNotes) + padding,
            height: keys.white.height + padding,
        };
        
        // Calculate to create string neccesary to generate viewbox (should be in JSON?)
        viewbox.dim = "0 0 " + viewbox.width + " " + viewbox.height
        
        // Equation for converting note numbers to frequencies
        that.noteToFreq = function(notenum){
            return Math.pow(2, ((notenum-afour)/octaveNotes))*afourFreq;
        }
        
        // Function used to draw individual notes regardless of colour
        // noteType is supplied to fill in all sorts of details
        // Perhaps with the size that the key object is getting (tracking all notes) this object is getting too big?
        that.drawNote = function(svg, noteType, x, y, id){
            svg.append("rect")
                .style("stroke", noteType.stroke)
                .style("fill", noteType.fill)
                .attr("x", x)
                .attr("y", y)
                .attr("width", noteType.width)
                .attr("height", noteType.height)
                .attr("id", id)
                .attr("class", "note");
        };
        
        // Automation of drawing all the keys on the canvas
        that.draw = function(){
            var blackX = 0 - (keys.black.width / 2),
                prevNote
                blackCount = 0;
            
            // Draw White Keys
            for (i = 0; i < keys.white.notes.length; i+=1){
                that.drawNote(that.svg, keys.white, i * keys.white.width, 0, keys.white.notes[i]);
            }
            
            // Draw Black Keys
            for (i = 0; i < octaves * octaveNotes; i+=1){
                
                // If the current key in the pattern is black then draw it!
                if (pattern[i%12] === "black") {
                    blackX = blackX + keys.white.width;
                    that.drawNote(that.svg, keys.black, blackX, 0, keys.black.notes[blackCount]);
                    blackCount = blackCount + 1;
                }
                
                // If it is white, bu tthe previous key was white, skip the key
                if (pattern[i%12] === prevNote){
                    blackX = blackX + keys.white.width;
                }
                
                // Keep track of previous key
                prevNote = pattern[i%12]
            }
        }
        
        // Start Drawing
        that.init = function(){
            // Find place in DOM to draw keyboard
            that.container = $(container);
            
            // Draw viewbox and subsequent group to draw keys into
            that.svg = d3.select(container)
                .append("svg")
                .attr("viewBox", viewbox.dim)
                .attr("id", "viewbox")
                .append("g")
                .attr("transform", "translate(" + padding / 2 + "," + padding / 2 + ")");
            
            // Draw the keys
            that.draw();
        };
        
        // Execute Init Function from Above
        that.init();
        
        // Return object, to allow for cascading
        return that;
    };
}(jQuery));
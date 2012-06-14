// I have no idea what I'm doing . gif
// Starting to figure it out though yipee
// Update of color should be moved out of here
var myles = myles || {};

(function ($) {
    myles.midiToFreq = function(m){
        return Math.pow(2, ((m-69)/12))*440;
    };
    myles.piano = function (container){
        var that = {};
        that.container = $(container);
        that.keys = {
            white: [],
            black: []
        };
        that.pattern = ['white','black','white','black','white','white','black','white','black','white','black','white'];
        for (i = 0; i < 128; i+=1){
            that.keys[that.pattern[i % 12]].push(i);
        }
        that.keyCodes = {
            "65": 60,
            "87": 61,
            "83": 62,
            "69": 63,
            "68": 64,
            "70": 65,
            "84": 66,
            "71": 67,
            "89": 68,
            "72": 69,
            "85": 70,
            "74": 71
        };
        that.noteOn = function(note){
            // Flocking Related 
            var freq = myles.midiToFreq(note[0].id);
            that.synth.input("carrier.freq", freq);
            that.synth.input("asr.gate", 1.0);
            // UI related
            note.css('fill', 'yellow');
        };
        that.noteOff = function(note){
            // Flocking Related
            that.synth.input("asr.gate", 0.0);
            // UI Related
            if($.inArray(parseInt(note[0].id), that.keys.white) != -1){
                note.css('fill', 'white');
            }
            else{
                note.css('fill', 'black');
            }
        };
        that.bindEvents = function(){
            var lastPressed = {};
            var isPressed = false;
            $(document).keydown(function(e){
                var note = that.container.find("#"+that.keyCodes[e.keyCode]+".note");
                that.noteOn(note);
             });
             $(document).keyup(function(e){
                 var note = that.container.find("#"+that.keyCodes[e.keyCode]+".note");
                 that.noteOff(note);
             });
            that.notes = that.container.find(".note");
            that.notes.each(function(i,note){
                note = $(note);
                note.mousedown(function(){
                    lastPressed = note;
                    isPressed = true;
                    that.noteOn(note);
                });
                note.mouseup(function(){
                    isPressed = false;
                    that.noteOff(note);
                    lastPressed = {}
                });
                note.hover(function(){
                    if(isPressed){
                        that.noteOff(lastPressed);
                        that.noteOn(note);
                        lastPressed = note;
                    }
                });
                
            });
        };
        that.init = function(){
            that.synth = flock.synth({
                id: "carrier",
                ugen: "flock.ugen.sinOsc",
                freq: 440,
                mul: {
                    id: "asr",
                    ugen: "flock.ugen.env.simpleASR",
                    attack: 0.25,
                    sustain: 0.6,
                    release: 0.5
                }
            });
            that.bindEvents();
            flock.enviro.shared.play();
        };
        that.init();
        return that;
    };
})(jQuery);
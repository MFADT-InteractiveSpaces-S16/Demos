var opts = [];
var notes = ['G','B','D','F#','G'];
var scales = ['3','4','2'];

var pattern = new Tone.Pattern(function(time, note){
    synth.triggerAttackRelease(note, .1);
}, ["G2", "B3", "G4", "D3"]);

var synth;

window.onload = function () {
	console.log("Yes")
	// setup
	for (var i=0; i<6; i++){
		opts.push( (i+1) );
	}
	// var delay = new Tone.FeedbackDelay(.8, .3).toMaster();

	synth = new Tone.SimpleSynth({
		"oscillator":{
			"type":"triangle"
		},
		"envelope":{
			"attack":0.001,
			"decay":0.9,
			"sustain":1.0,
			"release":1
		},
	}).toMaster();
	synth.portamento = .1;
	Tone.Transport.start();
	Tone.Transport.bpm.rampTo(200, .1);
	// synth.connect(delay);

	$("#click").click(roll);

	// roll!
	refreshDivs();
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


function refreshDivs(){
	$("#dice").html("");

	shuffle(opts);
	var opp = false;

	for (var i=0; i<opts.length; i++){
		var d = document.createElement("div");
		d.id = opts[i];
		d.className = "number";
		d.innerHTML = opts[i];
		d.style.zIndex = 0;
		d.style.top = window.innerHeight * i +"px";
		opp = !opp;
		$("#dice")[0].appendChild(d);
	}
}

var rollCount = 0;
var int = null;
var lastId  = -1;
var lastIndex  = -1;

function rr(max){
	return Math.round(Math.random() * max );
}

function roll(){
	rollCount = 0;
	window.clearInterval(int);

	if (opts.length == 0 ){
		$("#dice").html("<div class='number'>DONE</div>");
		return;
	}

	if ( lastId != -1){
		$("#dice")[0].removeChild($("#"+lastId)[0]);
		opts.splice(lastIndex,1);

		console.log("REMOVE "+lastId);
		lastId = -1;
		if (opts.length == 0 ){
			$("#dice").html("<div id='y' class='number'>DONE</div>");
			$("#y").css("font-size", "30vmin");
			pattern.start();
			setTimeout(function(){
				pattern.stop();
			}, 2000);
			return;
		}
	}

	int = window.setInterval(function(){
		var note = notes[Math.floor(Math.random() * notes.length)];
		var scale = scales[Math.floor(Math.random() * scales.length)];
		synth.triggerAttackRelease(note+scale, "4n");
		
		// pattern.start();

		if ( lastId != -1){
			var last = document.getElementById(lastId);
			last.style.backgroundColor = "white";
			last.style.top = (Math.random() > .4) ? window.innerHeight +"px" : -window.innerHeight +"px";
			// last.style.left = (window.innerWidth - Math.random() * window.innerWidth) +"px";
		}
		rollCount ++;
		lastIndex = Math.floor(Math.random() * (opts.length));
		lastId = opts[lastIndex];

		var d = document.getElementById(lastId);
		if (d){
			d.style.zIndex = rollCount;
			d.style.top = "0px";
			d.style.left = "0px";
			d.style.backgroundColor = "rgb(" + rr(255) + "," + rr(255) + "," + rr(255) + ")";
		} else {
			console.log(lastIndex, lastId);
		}

		if ( rollCount > 10){
			clearInterval(int);
			// pattern.stop();
		}

	}, 250);
}
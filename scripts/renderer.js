var CanvasRenderer = function(canvas, width, height, cellSize, fgColour, bgColour, beepColour) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.width = +width;
    this.height = +height;
    this.cellSize = +cellSize;

    this.fgColour = fgColour || "#0f0";
    this.bgColour = bgColour || "transparent";

    canvas.width = cellSize * width;
    canvas.height = cellSize * height;
	
	this.audioContext = window.AudioContext && new AudioContext ||
	                    window.webkitAudioContext && new webkitAudioContext;
	
};

CanvasRenderer.prototype = {

    clear: function () {
        this.ctx.clearRect(0, 0, this.width * this.cellSize, this.height * this.cellSize);
    },

    render: function (display) {
        this.clear();
        var i, x, y;
        for (i = 0; i < display.length; i++) {
              x = (i % this.width) * this.cellSize;
              y = Math.floor(i / this.width) * this.cellSize;

            this.ctx.fillStyle = display[i] ? this.fgColour : this.bgColour;
            this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
        }
    },

    beep: function() {
		// If Web Audio is supported, we "beep".
		// Otherwise, we shake the display.
		if (this.audioContext) {
			var osc = this.audioContext.createOscillator();
			osc.connect(this.audioContext.destination);
			osc.type = 3;
			osc.noteOn(0);
			setTimeout(function() {
				osc.noteOff(0);
			}, 100);
			return;
		}
		
        var times = 5;
        var interval = setInterval(function(canvas) {
            if ( ! times--) {
                clearInterval(interval);
            }

            canvas.style.left = times % 2 ? "-3px" : "3px";

        }, 50, this.canvas);
    }
};
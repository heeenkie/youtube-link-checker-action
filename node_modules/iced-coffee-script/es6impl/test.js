
var Deferrals = (function () {

	function Deferrals(it) {
		this.count = 1;
		this.it = it;
	}

	Deferrals.prototype.fulfill = function() {
		if (--this.count == 0) {
			this.it.next()	
		}	
	}

	Deferrals.prototype.defer = function () {
		this.count++;
		var _this = this;
		return function() { 
			_this.fulfill(); 
		}
	}

	return Deferrals;	
})();

function foo (x, cb) {
	var __it = (function* () {
		for (var i = 0; i < x; i++) {
			(function (it) {
				var __d = new Deferrals(it);
				console.log("+ wait " + i);
				setTimeout(__d.defer(), 100);
				__d.fulfill()
			})(__it);
			yield;
			console.log("- wait " + i);
		}
		if (x % 2 == 0) {
			(function (it) {
				var __d = new Deferrals(it);
				console.log("+ if even then wait 2");
				setTimeout(__d.defer(), 2000);
				__d.fulfill();
			})(__it);
			yield;
			console.log("- done");
		} else {
			(function (it) {
				var __d = new Deferrals(it);
				for (var j = 0; j < x; j++) {
					var amt = Math.random()*3
					console.log("+ parallel wait " + amt);
					setTimeout(__d.defer(), amt*1000)
				}
				__d.fulfill();
			})(__it); yield;
			console.log("- done with the wait");
		}
		cb()
	})()
	__it.next()
}

foo(6, function() {
	console.log("done with first foo");
	foo(13, function() {
		console.log("done with second foo");	
	})
})
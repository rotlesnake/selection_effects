
function dqs(x) {
	return document.querySelector(x);
}

function offElm(x,y) {
	if(y==0) {	
		dqs(x).classList.add('off');
		dqs(x).previousElementSibling.classList.add('off');
		
	} else { 
		dqs(x).classList.remove('off');
		dqs(x).previousElementSibling.classList.remove('off');
	}
}
	

function set1() {
	dqs('body').style.setProperty('--eqz1', this.value);
	//if(this.value==0) {	dqs('.music').classList.add('off') } else { dqs('.music').classList.remove('off');}
	offElm('.music',this.value);
}

function set2() {
	dqs('body').style.setProperty('--eqz2', this.value);
	offElm('.microphone',this.value);
}

function set3() {
	dqs('body').style.setProperty('--eqz3', this.value);
	offElm('.headphones',this.value);
}



['click','input'].forEach( evt => 
    dqs('#equalizer1').addEventListener(evt, set1, false)
);

['click','input'].forEach( evt => 
    dqs('#equalizer2').addEventListener(evt, set2, false)
);

['click','input'].forEach( evt => 
    dqs('#equalizer3').addEventListener(evt, set3, false)
);

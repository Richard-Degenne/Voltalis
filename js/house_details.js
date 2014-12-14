window.onload = function(){
/*
 * "Logement collectif" event listener
 */
	document.getElementById('fieldCollective').addEventListener('click', function(){
		if(this.checked) {
			document.getElementById('houseCollectiveDiv').style.display='block';
		}
		else {
			document.getElementById('houseCollectiveDiv').style.display='none';
		}
	});

/*
 * Doubloon buttons event listener
 */

// BIS

	document.getElementById('fieldBis').addEventListener('click', function() {
		document.getElementById('fieldTer').checked = false;
	});

// TER

	document.getElementById('fieldTer').addEventListener('click', function() {
		document.getElementById('fieldBis').checked = false;
	});

/*
 * Save button
 */

	document.getElementById('houseSave').addEventListener('click', function() {
		window.location.href='houses.html';
	});

/*
 * Save & stay button
 */

	document.getElementById('houseSaveAndStay').addEventListener('click', function() {
		console.log("Save and stay!");
	});

/*
 * Discard button
 */

	document.getElementById('houseCancel').addEventListener('click', function() {
		window.location.href='houses.html';
	});
}

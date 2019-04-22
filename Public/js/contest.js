function rating(element, attachrating, uprating, pid, contestid) {

	console.log(element.value);
	var upper = document.getElementById(uprating);
	var attach = document.getElementById(attachrating);
	upper.innerHTML = '<i class="fas text-warning fa-star">&nbsp;</i>' + element.value;
	attach.innerHTML = '<i class="fas text-warning fa-star">&nbsp;</i>' + element.value;


}

function submitrating(id, attachrating, uprating, pid, contestid) {
	console.log('submit')
	var upper = document.getElementById(uprating);
	var attach = document.getElementById(attachrating);
	var element = document.getElementById(id);
	var xhr = new XMLHttpRequest();
	var url = "http://localhost:3000/design/rating";
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type", "application/json");
	var data = JSON.stringify({
		DESIGNID: pid,
		RATING: element.value,
		CONTESTID: contestid

	});

	xhr.send(data);



}


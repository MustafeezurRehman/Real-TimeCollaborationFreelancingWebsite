function update(element, id, t, pid) {

	var label = document.getElementById(id);
	var total = document.getElementById(t);
	if (element.checked) {

		var xhr = new XMLHttpRequest();
		var url = "http://localhost:3000/portfolio/1/getlike";
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200)
				var json = JSON.parse(xhr.responseText);
			if (json) {

				//	label.firstChild.style.color = "#eb4d4b"
				total.innerHTML = '<i class="fas fa-heart ">&nbsp;&nbsp;</i>' + json.Count;

			}

		}

		var data = JSON.stringify({
			POSTID: pid

		});
		xhr.send(data);




	}

	if (!element.checked) {
		var xhr = new XMLHttpRequest();
		var url = "http://localhost:3000/portfolio/1/dislike";
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200)
				var json = JSON.parse(xhr.responseText);
			if (json) {

				//	label.firstChild.style.color = "#aaa"
				total.innerHTML = '<i class="fas fa-heart ">&nbsp;&nbsp;</i>' + json.Count;

			}

		}

		var data = JSON.stringify({
			POSTID: pid

		});
		xhr.send(data);






	}
}



function comment(comment, id, commentrow, name, pic) {

	var com = document.getElementById(comment);

	if (com.value) {
		var commen = '<div style="background-color: rgb(235, 235, 235)" class="px-2 py-1 border border-muted  my-2 shadows-sm rounded "><div class="row"><div class="col-1"><img src="/user/profile-pic/' + pic + '" width="35" height="35"class="rounded-circle mt-1"></div><div class="col-9 mt-2"><span><span class="px-1 font-weight-bold">' + name + '</span><br><span style="font-size:12px;" class="px-1">' + com.value + '</span></span></div></div></div>'

		$('#'+commentrow).prepend(commen);
		
				var xhr = new XMLHttpRequest();
				var url = "http://localhost:3000/comment/post";
				xhr.open("POST", url, true);
				xhr.setRequestHeader("Content-Type", "application/json");
				var data = JSON.stringify({
					PORTFOLIOID: id,
					TEXT: com.value


				});

				xhr.send(data);
				
				com.value='';

	}

}
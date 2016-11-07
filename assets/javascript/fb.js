//Initialize Firebase
var config = {
	apiKey: "AIzaSyDFm-saYStavpsDe-QGMEvervOVN1FKdGc",
	authDomain: "train-schedule-839db.firebaseapp.com",
	databaseURL: "https://train-schedule-839db.firebaseio.com",
	storageBucket: "",
	messagingSenderId: "378427714095"
};
firebase.initializeApp(config);


//Various Variables
var trainName = "";
var destination = "";
var trainTime = 0;
var frequency = 0;
var database = firebase.database(); 


//calculates the next time the train arrives
function nextTrain(trainTime, frequency){

	var tFrequency = frequency;
	var firstTime = trainTime;
	console.log("The frequency is " + frequency);
	console.log("The first train is " + trainTime);

	// First Time (pushed back 1 year to make sure it comes before current time)
	var firstTimeConverted = moment(firstTime,"hh:mm").subtract(1, "years");
	console.log("firstTimeConverted: " + moment(firstTimeConverted).format("hh:mm"));

	// Current Time
	var currentTime = moment();
	console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

	// Difference between the times
	var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
	console.log("DIFFERENCE IN TIME: " + diffTime);

	// Time apart (remainder)
	var tRemainder = diffTime % tFrequency;
	console.log("tRemainder: " + tRemainder);

	// Minute Until Train
	var tMinutesTillTrain = tFrequency - tRemainder;
	console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

	// Next Train
	var nextTrainTime = moment().add(tMinutesTillTrain, "minutes")
	console.log("ARRIVAL TIME: " + moment(nextTrainTime).format("hh:mm"))


	return (moment(nextTrainTime).format("hh:mm"));

};


//updates Firebase every time a new child value is added
database.ref().on('child_added', function (childSnapshot){
	console.log(childSnapshot.val().trainName);
	console.log(childSnapshot.val().destination);
	console.log(childSnapshot.val().trainTime);
	console.log(childSnapshot.val().frequency);
	console.log(childSnapshot.val().nextTrainTime);


	//passes info into nextTrain function
	var nextTrainTime = nextTrain((childSnapshot.val().trainTime), (childSnapshot.val().frequency));
	console.log("nextTrainTime is " + nextTrainTime);

	//updates table with inputted info
	var html = "<tr><td>" + childSnapshot.val().trainName + "</td>";
	html += "<td>" + childSnapshot.val().destination + "</td>";
	html += "<td>" + childSnapshot.val().frequency + "</td>";
	html += "<td>" + nextTrainTime +"</td>";
	$("#tableData").append(html);

});


//does stuff when the submit button is clicked
$('button').on('click', function(){
	console.log("Submit button has been clicked!");

	//captures the info from the form
	trainName = $('#addTrainName').val().trim();
	destination = $('#addDestination').val().trim();
	trainTime = $('#addTrainTime').val().trim();
	frequency = $('#addFrequency').val().trim();


	// saves initial values to Firebase
	database.ref().push({
		trainName: trainName,
		destination: destination,
		trainTime: trainTime,
		frequency: frequency,
	});

//keeps page from refreshing if 'enter' is used instead of clicking the button
return false;
});
// Initialize Firebase
var config = {
	apiKey: "AIzaSyBi7OGXLmvnGfhmkXsRf_d7OOLvxFQu6jo",
	authDomain: "train-scheduler-7011f.firebaseapp.com",
	databaseURL: "https://train-scheduler-7011f.firebaseio.com",
	storageBucket: "train-scheduler-7011f.appspot.com",
	messagingSenderId: "715906356708"
};

firebase.initializeApp(config);

// Variables 
var trainName = "";
var destination = "";
var trainTime = 0;
var frequency = 0;
var minutesAway = 0;
var database = firebase.database();

// Calculates Train Arrival Time 
function nextTrain(trainTime, frequency){
	var tFrequency = frequency;
	var firstTime = trainTime;
	console.log("The frequency is " + frequency);
	console.log("The first train is " + trainTime);

	// This is the First Time
	var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
	console.log("firstTimeConverted: " + moment(firstTimeConverted).format("hh:mm"));

	// Current Time 
	var currentTime = moment();
	console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

	// Difference Between Times
	var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
	console.log("DIFFERENCE IN TIME: " + diffTime);

	// Minutes until Train 
	var minutesAway = tFrequency - diffTime;
	console.log("MINUTES AWAY: " + minutesAway);

	// Next Train Time 
	var nextTrainTime = moment().add(minutesAway, "minutes")
	console.log("ARRIVAL TIME: " + moment(nextTrainTime).format("hh:mm"))

	return (moment(nextTrainTime).format("hh:mm"));

};

// This Updates Firebase everytime new child value is added 
database.ref().on('child_added', function(childSnapshot){
	console.log(childSnapshot.val().trainName);
	console.log(childSnapshot.val().destination);
	console.log(childSnapshot.val().trainTime);
	console.log(childSnapshot.val().frequency);
	console.log(childSnapshot.val().nextTrainTime);

	// This passes the info into nextTrain function
	var nextTrainTime = nextTrain((childSnapshot.val().trainTime), (childSnapshot.val().frequency));
	console.log("nextTrainTime is " + nextTrainTime);

	// This updates the table with inputted info
	var html = "<tr><td>" + childSnapshot.val().trainName + "</td>";
	html += "<td>" + childSnapshot.val().destination + "</td>";
	html += "<td>" + childSnapshot.val().frequency + "</td>";
	html += "<td>" + nextTrainTime + "</td>";
	$("#tableData").append(html);

});

// Fires when submit button is clicked
$('#submitbtn').on('click', function(){
	console.log("Submit button has been clicked!");

	// Captures form info 
	trainName = $('#addTrainName').val().trim();
	destination = $('#addDestination').val().trim();
	trainTime = $('#addTrainTime').val().trim();
	frequency = $('#addFrequency').val().trim();
	minutesAway = $('#addMinutesAway').val().trim();

	// This saves initial values to Firebase 
	database.ref().push({
		trainName: trainName,
		destination: destination,
		trainTime: trainTime,
		frequency: frequency,
		minutesAway: minutesAway,


	});

// This keeps the page from refreshing if "Enter" is used instead of "clicking" button 
return false; 
})

// Sign Up on.click function to open signupModal
$("#signupbtn").on('click', function() 
{
	$('#signupModal').modal('show');
});

// Sign Up & Submit New Email & Password
$("#signup-btn").on('click', function() 
{
	var email = $("#email").val();
	var password = $("#password").val();
	firebaseref.createUser({
		email: email,
		password: password
	},function(error, userData) {
		if (error) {
			console.log("Error creating user:", error);
		} 
		else {
			console.log("Successfully created user account with uid:", userData.uid);
			
		}
	});
});

// Login on.click function to open loginModal
$("#loginbtn").on('click', function() 
{
	$('#loginModal').modal('show');
});
	

// Login with Email & Password 
$("#login-btn").on('click', function() 
{

        var email = $("#login-email").val();
        var password = $("#login-password").val();
        firebaseref.authWithPassword({
            email: email,
            password: password
        }, 
        function(error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                console.log("Authenticated successfully with payload:", authData);
            }
        });
});

// Sign Out
$("#signoutbtn").on('click', function() 
{
	$('#signoutModal').modal('show');

});

firebase.auth().signOut().then(function() {
  // Sign-out successful.
}, function(error) {
  // An error happened.
});





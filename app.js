$(document).ready(function () {

    var config = {
        apiKey: "AIzaSyB_Djv1zfeO2xtAQL1VEQykCDp4gQsRrJ0",
        authDomain: "train-scheduler-4244e.firebaseapp.com",
        databaseURL: "https://train-scheduler-4244e.firebaseio.com",
        projectId: "train-scheduler-4244e",
        storageBucket: "train-scheduler-4244e.appspot.com",
        messagingSenderId: "808705076001"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    $("#submit-btn").click(function () {
        var trainName = $("#train-name-input").val().trim();
        var destination = $("#destination-input").val().trim();
        var frequency = $("#train-frequency").val().trim();
        var trainTime = $("#train-time").val().trim();

        console.log(trainName);
        database.ref().push({
            trainName: trainName,
            destination: destination,
            trainTime: trainTime,
            frequency: frequency,
            timeAdded: firebase.database.ServerValue.TIMESTAMP
        });
        $("input").val('');
        return false;
    });



    database.ref().on("child_added", function (childSnapshot) {
        var trainName = childSnapshot.val().trainName;
        var destination = childSnapshot.val().destination;
        var frequency = childSnapshot.val().frequency;
        var trainTime = childSnapshot.val().trainTime;

        var frequency = parseInt(frequency);

        // var dConverted = moment(time,'hh:mm').subtract(1, 'years');
        var dConverted = moment(childSnapshot.val().trainTime, 'HH:mm').subtract(1, 'years');
        console.log("DATE CONVERTED: " + dConverted);
        var trainTime = moment(dConverted).format('HH:mm');
        console.log("TRAIN TIME : " + trainTime);

        //DIFFERENCE B/T THE TIMES 
        var tConverted = moment(trainTime, 'HH:mm').subtract(1, 'years');
        var tDifference = moment().diff(moment(tConverted), 'minutes');
        console.log("DIFFERENCE IN TIME: " + tDifference);
        //REMAINDER 
        var tRemainder = tDifference % frequency;
        console.log("TIME REMAINING: " + tRemainder);
        //MINUTES UNTIL NEXT TRAIN
        var minsAway = frequency - tRemainder;
        console.log("MINUTES UNTIL NEXT TRAIN: " + minsAway);
        //NEXT TRAIN
        var nextTrain = moment().add(minsAway, 'minutes');
        console.log("ARRIVAL TIME: " + moment(nextTrain).format('HH:mm A'));

        $('#trainTable').append(
            "<tr><td id='nameDisplay'>" + childSnapshot.val().trainName +
            "</td><td id='destDisplay'>" + childSnapshot.val().destination +
            "</td><td id='freqDisplay'>" + childSnapshot.val().frequency +
            "</td><td id='nextDisplay'>" + moment(nextTrain).format("HH:mm") +
            "</td><td id='awayDisplay'>" + minsAway + ' minutes until arrival' + "</td></tr>");
    },

        function (errorObject) {
            console.log("Read failed: " + errorObject.code)
        });

    // var tBody = $("tbody");
    // var tRow = $("<tr>");
    // employeeName = $("<td>").html(childSnapshot.val().Employee);
    // employeeRole = $("<td>").html(childSnapshot.val().Role);
    // employeeStart = $("<td>").html(childSnapshot.val().startDate);
    // employeeTime = $("<td>").html(monthsWorked);
    // employeeMonth = $("<td>").html(childSnapshot.val().MonthlyRate);
    // employeeBill = $("<td>").html(totalBilled);
    // tRow.append(employeeName, employeeRole, employeeStart, employeeMonth);
    // tBody.append(tRow);
});

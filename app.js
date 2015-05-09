$("#login").show();
$("#app").hide();
// Authenticate with Dropbox
var client = new Dropbox.Client({key: "kGl4GS6AUi0AAAAAAAATa0-CF-LJFEo5JNnPUIGUmx487o-qXmZa4lc7oGhS1EsM"});
client.authenticate({interactive: false}, function (error) {
    if (error) {
        alert('Authentication error: ' + error);
    }
});
if (client.isAuthenticated()) {
    $("#login").hide();
    $("#app").show();
}

// Bind authenticate method to your login button and listen for click on button
$("#login").on("click", client.authenticate());


var datastoreManager = client.getDatastoreManager();
datastoreManager.openDefaultDatastore(function (error, datastore) {
    if (error) {
        alert('Error opening default datastore: ' + error);
    }

    // Let the user read all tasks by printing them to the screen
    var taskTable = datastore.getTable('tasks');
    var results = taskTable.query({completed: false});

    for (var k=0; k<results.length;k++ ) {
        $("#todos").append( "<li>"+results[k].get("taskname") + "</li>");
    }
    $("li").addClass("list-group-item");


    // Let users add tasks
    $("#add").on("click", function() {
        taskTable.insert({
            taskname: $("#newTask").val(),
            completed: false,
            created: new Date()
        });

    });

    // As new tasks are added automatically update the task list
    datastore.recordsChanged.addListener(function (event) {
        var records = event.affectedRecordsForTable('tasks');
        for (var k=0; k<records.length;k++ ) {
            $("#todos").append( "<li>"+records[k].get("taskname") + "</li>");
        }
        $("li").addClass("list-group-item");    
    });     
});
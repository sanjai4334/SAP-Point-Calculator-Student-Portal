function validateLogin(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get the input element by their IDs
    const registerNumberInput = document.getElementById('RegisterNumber');
    const dobInput = document.getElementById('dob');

    // Get the entered value
    const registerNumberInputValue = registerNumberInput.value;
    const dobInputValue = dobInput.value;

    // Define the patterns
    const registerNumberPattern = /^[0-9]{2}[A-Z]{3}[0-9]{3}$/;
    const dobPattern = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;

    // Test the input against the pattern
    if (!dobPattern.test(dobInputValue)) {
        // Invalid input
        dobInput.classList.add("is-invalid");
        return false; // Exit the function without further execution
    } else {
        dobInput.classList.remove("is-invalid");
    }
    if (!registerNumberPattern.test(registerNumberInputValue)) {
        // Invalid input
        registerNumberInput.classList.add("is-invalid");
        return false; // Exit the function without further execution
    } else {
        registerNumberInput.classList.remove("is-invalid");
    }

    return true;
}


async function handleLogin(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    if (validateLogin(event)) {
        const registerNumber = document.getElementById('RegisterNumber').value;
        const dob = document.getElementById('dob').value;

        // Send AJAX request to server
        try {
            const response = await fetch('http://127.0.0.1:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ registerNumber, dob })
            });

            if (response.ok) {
                const responseData = await response.json();
                if (responseData) {
                    console.log(responseData);
                    if (responseData.dob == dob) {
                        // Convert user data to JSON
                        var userDataJSON = JSON.stringify(responseData);

                        // Set the user data as a cookie
                        setCookie('userData', userDataJSON, 30); // Assuming the cookie should expire in 30 days
                        // Redirect to activities page
                        window.location.href = "./activities.html";
                    } else {
                        // Incorrect date of birth
                        document.getElementById('dob').classList.add("is-invalid");
                    }
                } else {
                    // User not found
                    document.getElementById('RegisterNumber').classList.add("is-invalid");
                }
            } else {
                // Server error
                throw new Error('Network response was not ok.');
            }
        } catch (error) {
            // Fetch operation failed
            console.error('There was a problem with the fetch operation:', error);
        }
    }
}

// Function to set a cookie
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Function to get a cookie value by name
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Function to delete a cookie by name
function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}

async function updateUserDataInDatabase(userData) {    
    console.log(userData);

    // Send AJAX request to server
    try {
        const response = await fetch('http://127.0.0.1:3000/update', {
            method: 'PUT', // Changed method to PUT
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userDetails: userData }) // Changed key to userDetails
        });


        if (!response.ok) {
            // Server error
            throw new Error('Network response was not ok.');
        }
    } catch (error) {
        // Fetch operation failed
        console.error('There was a problem with the fetch operation:', error);
    }
}

async function handleActivityFormSubmit(event) {
    event.preventDefault(); // Prevent default form submission behavior

    var userDataJSON = getCookie('userData');
    var userData = JSON.parse(userDataJSON);

    // Create a FormData object to store file data
    const formFileData = new FormData();

    // Append the registration number to the FormData object
    formFileData.append('regno', userData.regno);

    const form = event.target.closest('form'); // Find the closest form element
    
    if (form) {
        const formData = {}; // Object to store form data
        
        // Iterate through each form control element
        form.querySelectorAll('input, select, textarea').forEach(input => {
            const { name, type, value } = input;
            // Handle different types of inputs differently
            if (type === 'checkbox') {
                formData[name] = input.checked; // Store checkbox value as boolean
            } else if (type === 'radio') {
                if (input.checked) {
                    formData[name] = value; // Store the value of the checked radio button
                }
            } else if (type === 'select-one') {
                // Get the selected option
                const selectedOption = input.options[input.selectedIndex];
                // Store the name and innerHTML of the selected option
                formData[name] = selectedOption.innerHTML;
            } else {
                formData[name] = value; // Store input value in formData object
            }
        });
        
        console.log(formData); // Log the collected form data

        const fileInput = form.querySelector('input[type="file"]'); // Find the file input element
        
        if (fileInput.files.length === 0) {
            console.error('No file selected');
            return;
        }
        
        const file = fileInput.files[0]; // Get the selected file
        
        // Append the file to the FormData object
        formFileData.append('file', file);
        
        // Use Fetch API to send the file data to the server
        try {
            const response = await fetch('http://localhost:3000/upload', {
                method: 'POST',
                body: formFileData
            });
            
            if (response.ok) {
                const responseData = await response.json();
                const filename = responseData.filename;
                formData.proof = filename; // Add filename to form data
            } else {
                console.error('Failed to upload file');
                // Optionally, handle error
            }
        } catch (error) {
            console.error('Error:', error);
            // Optionally, handle error
        }

        // Remove the filename stored in formData
        delete formData[""];

        // Fixing spaces in presented at
        formData["Presented At"] = formData["Presented At"].replaceAll(/(%20)+/g, " ")

        // Add the collected form data to user data object
        if (userData.submissions) {
            userData.submissions = [...userData.submissions, formData];;
        } else {
            userData.submissions = [formData];
        }
        console.log(userData);

        // Convert user data to JSON
        var userDataJSON = JSON.stringify(userData);

        // Set the user data as a cookie
        setCookie('userData', userDataJSON, 30); // Assuming the cookie should expire in 30 days

        // test
        userData.text = true;

        // Update user data in the database
        updateUserDataInDatabase(userData);

        // Go back to activities page
        window.location.href = '../activities.html';
    }
}
function courseVal(event) {
    const courseType = document.getElementById("presentationDropdown").value;
    const courseName = document.getElementById("floatingInput").value;
    const fileInput = document.getElementById("formFileLg").files.length;

    let errorMessage = "";

    if (courseType === "Select course type") {
        errorMessage = "Please select a course type.";
    } else if (courseName.trim() === "") {
        errorMessage = "Please enter a course name.";
    } else if (fileInput === 0) {
        errorMessage = "Please upload your proof file.";
    }

    if (errorMessage) {
        event.preventDefault(); // Prevent the form from submitting
        document.getElementById("invalid-input").textContent = errorMessage; // Display the error message
    }
    else{
        document.getElementById("invalid-input").textContent ="";
    }
}
function entrepreneurVal(event) {
    const progressLevel = document.getElementById("presentationDropdown").value;
    const fileInput = document.getElementById("formFileLg").files.length;

    let errorMessage = "";

    if (progressLevel === "Select level of implementation") {
        errorMessage = "Please select a level of implementation.";
    } else if (fileInput === 0) {
        errorMessage = "Please upload your proof file.";
    }

    if (errorMessage) {
        event.preventDefault(); // Prevent the form from submitting
        document.getElementById("invalid-input").textContent = errorMessage; // Display the error message
    }
    else{
        document.getElementById("invalid-input").textContent ="";
    }
}
function examformval(event) {
    const examCategory = document.getElementById("presentationDropdown").value;
    const fileInput = document.getElementById("formFileLg").files.length;
    
    let errorMessage = "";

    if (examCategory === "Select category") {
        errorMessage = "Please select an exam category.";
    } else if (fileInput === 0) {
        errorMessage = "Please upload your proof file."+fileInput;
    }
   

    if (errorMessage) {
        event.preventDefault(); // Prevent the form from submitting
        document.getElementById("invalid-input").textContent = errorMessage; // Display the error message
    }
    else{
        document.getElementById("invalid-input").textContent ="";
    }
}
function leadformVal(event) {
    const memberIn = document.getElementById("memberDropdown").value;
    const position = document.getElementById("positionDropdown").value;
    const fileInput = document.getElementById("formFileLg").files.length;

    let errorMessage = "";

    if (memberIn === "Club/Association Name") {
        errorMessage = "Please select a club or association.";
    } else if (position === "Select position") {
        errorMessage = "Please select a position.";
    } else if (fileInput === 0) {
        errorMessage = "Please upload your proof file.";
    }

    if (errorMessage) {
        event.preventDefault(); // Prevent the form from submitting
        document.getElementById("invalid-input").textContent = errorMessage; // Display the error message
    }
    else{
        document.getElementById("invalid-input").textContent ="";
    }
}
function memberformVal(event) {
    const clubName = document.getElementById("memberDropdown").value;
    const clubType = document.getElementById("clubTypeDropdown").value;
    const fileInput = document.getElementById("formFileLg").files.length;

    let errorMessage = "";

    if (clubName === "Club/Association Name") {
        errorMessage = "Please select a club or association.";
    } else if (clubType === "default") {
        errorMessage = "Please select a club type.";
    } else if (fileInput === 0) {
        errorMessage = "Please upload your proof file.";
    }

    if (errorMessage) {
        event.preventDefault(); // Prevent the form from submitting
        document.getElementById("invalid-input").textContent = errorMessage; // Display the error message
    }
    else{
        document.getElementById("invalid-input").textContent ="";
    }
}
function paperinVal(event) {
    const presentedAt = document.getElementById("presentedAtDropdown").value;
    const presentedOn = document.getElementById("presentedOnInput").value;
    const topicName = document.getElementById("topicNameInput").value;
    const prizeParticipation = document.getElementById("prizeParticipationDropdown").value;
    const fileInput = document.getElementById("formFileLg").files.length;

    let errorMessage = "";

    if (presentedAt === "Club/Association Name") {
        errorMessage = "Please select a club or association.";
    } else if (presentedOn === "") {
        errorMessage = "Please select a date for when the presentation was made.";
    } else if (topicName.trim() === "") {
        errorMessage = "Please enter the topic name.";
    } else if (prizeParticipation === "default") {
        errorMessage = "Please select prize/participation status.";
    } else if (fileInput === 0) {
        errorMessage = "Please upload your proof file.";
    }

    if (errorMessage) {
        event.preventDefault(); // Prevent the form from submitting
        document.getElementById("invalid-input").textContent = errorMessage; // Display the error message
    }
    else{
        document.getElementById("invalid-input").textContent ="";
    }
}
function paperoutVal(event) {
    const collegeName = document.getElementById("collegeNameInput").value.trim();
    const premierRadio = document.getElementById("premierRadio").checked;
    const nonPremierRadio = document.getElementById("nonPremierRadio").checked;
    const presentedOn = document.getElementById("presentedOnInput").value;
    const topicName = document.getElementById("topicNameInput").value.trim();
    const prizeParticipation = document.getElementById("prizeParticipationDropdown").value;
    const fileInput = document.getElementById("formFileLg").files.length;

    let errorMessage = "";

    if (collegeName === "") {
        errorMessage = "Please enter the college name.";
    } else if (!premierRadio && !nonPremierRadio) {
        errorMessage = "Please select Premier or Non-Premier.";
    } else if (presentedOn === "") {
        errorMessage = "Please choose the presentation date.";
    } else if (topicName === "") {
        errorMessage = "Please enter the topic name.";
    } else if (prizeParticipation === "Select prize/participation") {
        errorMessage = "Please select prize/participation.";
    } else if (fileInput === 0) {
        errorMessage = "Please upload your proof file.";
    }

    if (errorMessage) {
        event.preventDefault(); // Prevent form submission
        document.getElementById("invalid-input").textContent = errorMessage; // Display error message
    }
    else{
        document.getElementById("invalid-input").textContent ="";
    }
}
function patentVal(event) {
    const patentType = document.getElementById("patentTypeDropdown").value;
    const submittedRadio = document.getElementById("submittedRadio").checked;
    const publishedRadio = document.getElementById("publishedRadio").checked;
    const obtainedRadio = document.getElementById("obtainedRadio").checked;
    const fileInput = document.getElementById("formFileLg").files.length;

    let errorMessage = "";

    if (patentType === "Select patent type") {
        errorMessage = "Please select a patent type.";
    } else if (!submittedRadio && !publishedRadio && !obtainedRadio) {
        errorMessage = "Please select a status (submitted, published, or obtained).";
    } else if (fileInput === 0) {
        errorMessage = "Please upload your proof file.";
    }

    if (errorMessage) {
        event.preventDefault(); // Prevent form submission
        document.getElementById("invalid-input").textContent = errorMessage; // Display error message
    }
}
function placementVal(event) {
    const category = document.getElementById("categoryDropdown").value;
    const fileInput = document.getElementById("formFileLg").files.length;

    let errorMessage = "";

    if (category === "Select category") {
        errorMessage = "Please select a category.";
    } else if (fileInput === 0) {
        errorMessage = "Please upload your proof file.";
    }

    if (errorMessage) {
        event.preventDefault(); // Prevent form submission
        document.getElementById("invalid-input").textContent = errorMessage; // Display error message
    }
}
function projectinVal(event) {
    const presentedAt = document.getElementById("presentedAtDropdown").value;
    const presentedOn = document.getElementById("presentedOnInput").value;
    const topicName = document.getElementById("topicNameInput").value.trim();
    const prizeParticipation = document.getElementById("prizeParticipationDropdown").value;
    const fileInput = document.getElementById("formFileLg").files.length;

    let errorMessage = "";

    if (presentedAt === "Club/Association Name") {
        errorMessage = "Please select a club or association.";
    } else if (presentedOn === "") {
        errorMessage = "Please select a presentation date.";
    } else if (topicName === "") {
        errorMessage = "Please enter the topic name.";
    } else if (prizeParticipation === "default") {
        errorMessage = "Please select a prize/participation status.";
    } else if (fileInput === 0) {
        errorMessage = "Please upload your proof file.";
    }

    if (errorMessage) {
        event.preventDefault(); // Prevent form submission
        document.getElementById("invalid-input").textContent = errorMessage; // Display error message
    }
}
function projectoutVal(event) {
    const collegeName = document.getElementById("collegeNameInput").value.trim();
    const premierSelected = document.getElementById("premierRadio").checked;
    const nonPremierSelected = document.getElementById("nonPremierRadio").checked;
    const presentedOn = document.getElementById("presentedOnInput").value;
    const topicName = document.getElementById("topicNameInput").value.trim();
    const prizeParticipation = document.getElementById("prizeParticipationDropdown").value;
    const fileInput = document.getElementById("formFileLg").files.length;

    let errorMessage = "";

    if (collegeName === "") {
        errorMessage = "Please enter the college name.";
    } else if (!premierSelected && !nonPremierSelected) {
        errorMessage = "Please select Premier or Non-Premier.";
    } else if (presentedOn === "") {
        errorMessage = "Please select a presentation date.";
    } else if (topicName === "") {
        errorMessage = "Please enter the topic name.";
    } else if (prizeParticipation === "Select prize/participation") {
        errorMessage = "Please select prize/participation.";
    } else if (fileInput === 0) {
        errorMessage = "Please upload your proof file.";
    }

    if (errorMessage) {
        event.preventDefault(); // Prevent form submission
        document.getElementById("invalid-input").textContent = errorMessage; // Display error message
    }
}
function serviceformVal(event) {
    const communityService = document.getElementById("communityServicesDropdown").value;
    const fileInput = document.getElementById("formFileLg").files.length;

    let errorMessage = "";

    if (communityService === "Select activity") {
        errorMessage = "Please select a community service activity.";
    } else if (fileInput === 0) {
        errorMessage = "Please upload your proof file.";
    }

    if (errorMessage) {
        event.preventDefault(); // Prevent form submission
        document.getElementById("invalid-input").textContent = errorMessage; // Display error message
    }
}
function sportsinVal(event) {
    const eventType = document.getElementById("eventTypeDropdown").value;
    const matchOn = document.getElementById("matchOnInput").value;
    const eventName = document.getElementById("eventNameInput").value.trim();
    const prizeParticipation = document.getElementById("prizeParticipationDropdown").value;
    const fileInput = document.getElementById("formFileLg").files.length;

    let errorMessage = "";

    if (eventType === "Select game") {
        errorMessage = "Please select a game.";
    } else if (matchOn === "") {
        errorMessage = "Please select the match date.";
    } else if (eventName === "") {
        errorMessage = "Please enter the event name.";
    } else if (prizeParticipation === "Select prize/participation") {
        errorMessage = "Please select a prize/participation option.";
    } else if (fileInput === 0) {
        errorMessage = "Please upload your proof file.";
    }

    if (errorMessage) {
        event.preventDefault(); // Prevent form submission
        document.getElementById("invalid-input").textContent = errorMessage; // Display error message
    }
}
function sportsoutVal(event) {
    const collegeName = document.getElementById("collegeNameInput").value.trim();
    const stateSelected = document.getElementById("stateRadio").checked;
    const nationalSelected = document.getElementById("nationalRadio").checked;
    const eventType = document.getElementById("eventTypeDropdown").value;
    const matchOn = document.getElementById("matchOnInput").value;
    const eventName = document.getElementById("eventNameInput").value.trim();
    const prizeParticipation = document.getElementById("prizeParticipationDropdown").value;
    const fileInput = document.getElementById("formFileLg").files.length;

    let errorMessage = "";

    if (collegeName === "") {
        errorMessage = "Please enter the college name.";
    } else if (!stateSelected && !nationalSelected) {
        errorMessage = "Please select either 'State' or 'National/International'.";
    } else if (eventType === "Select game") {
        errorMessage = "Please select a game.";
    } else if (matchOn === "") {
        errorMessage = "Please select a match date.";
    } else if (eventName === "") {
        errorMessage = "Please enter the event name.";
    } else if (prizeParticipation === "Select prize/participation") {
        errorMessage = "Please select a prize/participation option.";
    } else if (fileInput === 0) {
        errorMessage = "Please upload your proof file.";
    }

    if (errorMessage) {
        event.preventDefault(); // Prevent form submission
        document.getElementById("invalid-input").textContent = errorMessage; // Display error message
    }
}
function techinVal(event) {
    const eventType = document.getElementById("eventTypeDropdown").value;
    const presentedOn = document.getElementById("presentedOnInput").value;
    const eventName = document.getElementById("eventNameInput").value.trim();
    const prizeParticipation = document.getElementById("prizeParticipationDropdown").value;
    const fileInput = document.getElementById("formFileLg").files.length;

    let errorMessage = "";

    if (eventType === "Select Event type") {
        errorMessage = "Please select an event type.";
    } else if (presentedOn === "") {
        errorMessage = "Please select a presentation date.";
    } else if (eventName === "") {
        errorMessage = "Please enter the event name.";
    } else if (prizeParticipation === "Select prize/participation") {
        errorMessage = "Please select a prize/participation status.";
    } else if (fileInput === 0) {
        errorMessage = "Please upload your proof file.";
    }

    if (errorMessage) {
        event.preventDefault(); // Prevent form submission
        document.getElementById("invalid-input").textContent = errorMessage; // Display the error message
    }
}
function techoutVal(event) {
    const collegeName = document.getElementById("collegeNameInput").value.trim();
    const stateRadio = document.getElementById("stateRadio").checked;
    const nationalRadio = document.getElementById("nationalRadio").checked;
    const eventType = document.getElementById("eventTypeDropdown").value;
    const presentedOn = document.getElementById("presentedOnInput").value;
    const topicName = document.getElementById("topicNameInput").value.trim();
    const prizeParticipation = document.getElementById("prizeParticipationDropdown").value;
    const fileInput = document.getElementById("formFileLg").files.length;

    let errorMessage = "";

    if (collegeName === "") {
        errorMessage = "Please enter the college name.";
    } else if (!stateRadio && !nationalRadio) {
        errorMessage = "Please select State or National/International.";
    } else if (eventType === "Select Event type") {
        errorMessage = "Please select an event type.";
    } else if (presentedOn === "") {
        errorMessage = "Please select the presentation date.";
    } else if (topicName === "") {
        errorMessage = "Please enter the topic name.";
    } else if (prizeParticipation === "Select prize/participation") {
        errorMessage = "Please select a prize/participation status.";
    } else if (fileInput === 0) {
        errorMessage = "Please upload your proof file.";
    }

    if (errorMessage) {
        event.preventDefault(); // Prevent form submission
        document.getElementById("invalid-input").textContent = errorMessage; // Display error message
    }
}
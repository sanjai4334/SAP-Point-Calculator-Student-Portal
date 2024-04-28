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

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

        formData["points"] = await calculatePoints(event);

        console.log(form);
        formData["activity"] = form.name; // Add activity id to form data

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

    }
}


async function calculatePoints(event) {
    const form = event.target.closest('form'); // Find the closest form element
    let selectElement;
    let selectedValue;
    let radioElement;
    let radioSelectedValue;


    let points = 0;

    console.log(form.name);

    switch (form.name) {
        case 'courseform':
            selectElement = form.querySelector('select[name="Course Type"]');
            selectedValue = selectElement.value;

            switch (selectedValue) {
                case 'vac':
                    points = 5;
                    break;
                case 'c1':
                    points = 10;
                    break;
                case 'c2':
                    points = 20;
                    break;
                case 'morec':
                    points = 30;
                    break;
            }
            break;
        
        case 'entrepreneur':
            selectElement = form.querySelector('select[name="Progress level"]');
            selectedValue = selectElement.value;

            switch (selectedValue) {
                case 'workshop':
                    points = 10;
                    break;
                case 'reg':
                    points = 50;
                    break;
                case 'relesed':
                    points = 100;
                    break;
            }
            break;

        case 'examform':
            rm.querySelector('select[name="Exams"]');
            selectedValue = selectElement.value;

            switch (selectedValue) {
                case 'appeared':
                    points = 5;
                    break;
                case 'qualified':
                    points = 30;
                    break;
                case 'ranked':
                    points = 100;
                    break;
                case 'cleared':
                    points = 100;
                    break;
            }
            break;

        case 'leadform':
            selectElement = form.querySelector('select[name="Position"]');
            selectedValue = selectElement.value;

            switch (selectedValue) {
                case 'chairman':
                    points = 30;
                    break;
                case 'vice':
                    points = 20;
                    break;
                case 'ec':
                    points = 10;
                    break;
                case 'rep':
                    points = 10;
                    break;
            }
            break;
        
        case 'memberform':
            selectElement = form.querySelector('select[name="Club Type"]');
            selectedValue = selectElement.value;

            switch (selectedValue) {
                case 'ps':
                    points = 5;
                    break;
                case 'club':
                    points = 2;
                    break;
                case 'ncc':
                    points = 20;
                    break;
            }
            break;
        
        case 'paperin':
            selectElement = form.querySelector('select[name="Prize/Participation"]');
            selectedValue = selectElement.value;

            if (selectedValue == 'Participation') {
                points = 5;
            } else {
                points = 20;
            }
            break;
        
        case 'paperout':
            selectElement = form.querySelector('select[name="Prize/Participation"]');
            selectedValue = selectElement.value;
            radioElement = form.querySelector('input[name="category"]:checked');
            radioSelectedValue = radioElement.value;


            if (selectedValue == 'Participation') {
                if (radioSelectedValue == 'premier') {
                    points = 20;
                } else {
                    points = 10;
                }
            } else {
                if (radioSelectedValue == 'premier') {
                    points = 50;
                } else {
                    points = 30;
                }
            }
            break;
        
        case 'patentform':
            // only max scores are given for simplicity
            selectElement = form.querySelector('select[name="Patent Type"]');
            selectedValue = selectElement.value;

            switch (selectedValue) {
                case 'sci':
                    points = 50;
                    break;
                case 'wos':
                    points = 30;
                    break;
                case 'other':
                    points = 5;
                    break;
                case 'patent':
                    points = 100;
                    break;
                case 'copyright':
                    points = 10;
                    break;
            }
            break;
        
        case 'Placement and Internship':
            selectElement = form.querySelector('select[name="Category"]');
            selectedValue = selectElement.value;

            switch (selectedValue) {
                case 'clr':
                    points = 5;
                    break;
                case 'placed':
                    points = 40;
                    break;
                case 'intern':
                    points = 50;
                    break;
                case 'placeout':
                    points = 20;
                    break;
            }
            break;
        
        case 'projectin':
            selectElement = form.querySelector('select[name="Prize/Participation"]');
            selectedValue = selectElement.value;

            if (selectedValue == 'Participation') {
                points = 10;
            } else {
                points = 20;
            }
            break;
        
        case 'projectout':
            selectElement = form.querySelector('select[name="Prize/Participation"]');
            selectedValue = selectElement.value;
            radioElement = form.querySelector('input[name="category"]:checked');
            radioSelectedValue = radioElement.value;


            if (selectedValue == 'Participation') {
                if (radioSelectedValue == 'premier') {
                    points = 20;
                } else {
                    points = 10;
                }
            } else {
                if (radioSelectedValue == 'premier') {
                    points = 50;
                } else {
                    points = 30;
                }
            }
            break;

        case 'Social Activities':
            selectElement = form.querySelector('select[name="Community Services"]');
            selectedValue = selectElement.value;

            switch (selectedValue) {
                case 'blood':
                    points = 5;
                    break;
                case 'camp':
                    points = 30;
                    break;
                case 'morecamp':
                    points = 50;
                    break;
            }
            break;
        
        case 'sportsin':
            selectElement = form.querySelector('select[name="Prize/Participation"]');
            selectedValue = selectElement.value;

            if (selectedValue == 'Participation') {
                points = 2;
            } else {
                points = 5;
            }
            break;

        case 'sportsout':
            selectElement = form.querySelector('select[name="Prize/Participation"]');
            selectedValue = selectElement.value;
            radioElement = form.querySelector('input[name="category"]:checked');
            radioSelectedValue = radioElement.value;


            if (selectedValue == 'Participation') {
                if (radioSelectedValue == 'premier') {
                    points = 20;
                } else {
                    points = 10;
                }
            } else {
                if (radioSelectedValue == 'premier') {
                    points = 40;
                } else {
                    points = 20;
                }
            }
            break;

        case 'technoin':
            selectElement = form.querySelector('select[name="Prize/Participation"]');
            selectedValue = selectElement.value;

            if (selectedValue == 'Participation') {
                points = 2;
            } else {
                points = 10;
            }
            break;

        case 'technoout':
            selectElement = form.querySelector('select[name="Prize/Participation"]');
            selectedValue = selectElement.value;
            radioElement = form.querySelector('input[name="category"]:checked');
            radioSelectedValue = radioElement.value;


            if (selectedValue == 'Participation') {
                if (radioSelectedValue == 'premier') {
                    points = 10;
                } else {
                    points = 5;
                }
            } else {
                if (radioSelectedValue == 'premier') {
                    points = 30;
                } else {
                    points = 20;
                }
            }
            break;
        }
    console.log(points);
    
    return points;
}
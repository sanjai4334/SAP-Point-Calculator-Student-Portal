function validateLogin(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get the input element by its ID
    const registerNumberInput = document.getElementById('RegisterNumber');
    const dobInput = document.getElementById('dob');

    // Get the entered value
    const registerNumberInputValue = registerNumberInput.value;
    const dobInputValue = dobInput.value;

    // Define the pattern
    const registerNumberPattern = /^[0-9]{2}[A-Z]{3}[0-9]{3}$/;
    const dobPattern = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;

    // Test the input against the pattern
    if (!dobPattern.test(dobInputValue)) {
        // Invalid input
        dobInput.classList.add("is-invalid");
        return; // Exit the function without further execution
    } else {
        dobInput.classList.remove("is-invalid");
    }
    if (!registerNumberPattern.test(registerNumberInputValue)) {
        // Invalid input
        registerNumberInput.classList.add("is-invalid");
        return; // Exit the function without further execution
    } else {
        registerNumberInput.classList.remove("is-invalid");
    }

    // If validation succeeds, navigate to activity.html
    window.location.href = "./activities.html";
}


// // Add event listener to all input fields to remove the 'is-invalid' class on focus
// window.onload = function() {
//     inputs = document.getElementsByTagName("input");
//     for (let i = 0; i < inputs.length; i++) {
//         inputs[i].addEventListener("focus", function () {
//             this.classList.remove("is-invalid");
//         });
//     }
// }
// Validate function
function validate() {
  const email = document.querySelector("#email");
  const emailMessage = document.querySelector("#emailMessage");
  const password = document.querySelector("#password");
  const passwordMessage = document.querySelector("#passwordMessage");
  let isValid = true;

  // Email validation
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailValid.test(email.value)) {
    email.classList.remove("border");
    emailMessage.innerText = "";
  } else {
    email.classList.add("border");
    emailMessage.innerText = "Enter a valid email address";
    emailMessage.style.color = "red";
    isValid = false;
  }

  // Password validation
  if (password.value.length >= 6) {
    // Example: minimum 6 characters
    password.classList.remove("border");
    passwordMessage.innerText = "";
  } else {
    password.classList.add("border");
    passwordMessage.innerText = "Password must be at least 6 characters long";
    passwordMessage.style.color = "red";
    isValid = false;
  }

  return isValid;
}

// Handle form submission
function handleSubmit(e) {
  e.preventDefault(); // Prevent default form submission

  if (validate()) {
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    // URL to fetch user data (assuming JSON file or API)
    const URL = "http://localhost:3000/userDetails"; // Adjust URL as needed

    fetch(URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Check if user exists with correct email and password
        const user = data.find(
          (user) => user.email === email && user.password === password
        );

        if (user) {
          // Redirect to home page on successful login
          location.assign("../home/home.html");
        } else {
          // Show error message if login fails
          alert("Invalid email or password");
        }
      })
      .catch((error) => {
        console.error("Error occurred:", error);
      });
  }
}

// Attach event listener to the login form
document.getElementById("loginForm").addEventListener("submit", handleSubmit);

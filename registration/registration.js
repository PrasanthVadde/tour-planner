function validate() {
  const userName = document.querySelector("#username");
  const userNameMessage = document.querySelector("#usernameMessage");
  const email = document.querySelector("#email");
  const emailMessage = document.querySelector("#emailMessage");
  const password = document.querySelector("#password");
  const passwordMessage = document.querySelector("#passwordMessage");
  const conformPassword = document.querySelector("#conformPassword");
  const conformPasswordMessage = document.querySelector(
    "#conformPasswordMessage"
  );
  const num = document.querySelector("#num");
  const numMessage = document.querySelector("#numMessage");
  let isValid = true;

  // Username validation
  if (/^[a-zA-Z]+$/.test(userName.value) && userName.value.trim() !== "") {
    userName.classList.remove("border");
    userNameMessage.innerText = "";
  } else {
    userName.classList.add("border");
    userNameMessage.innerText = "Enter a valid username (only letters allowed)";
    userNameMessage.style.color = "red";
    isValid = false;
  }

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
  const passValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@%!#]).{8,16}$/;
  if (passValid.test(password.value)) {
    password.classList.remove("border");
    passwordMessage.innerText = "";
  } else {
    password.classList.add("border");
    passwordMessage.innerText =
      "Password must be 8-16 characters long, include uppercase, lowercase, number, and special character (@%!#)";
    passwordMessage.style.color = "red";
    isValid = false;
  }

  // Confirm password validation
  if (password.value === conformPassword.value) {
    conformPassword.classList.remove("border");
    conformPasswordMessage.innerText = "";
  } else {
    conformPassword.classList.add("border");
    conformPasswordMessage.innerText = "Passwords do not match";
    conformPasswordMessage.style.color = "red";
    isValid = false;
  }

  // Mobile number validation
  const numValid = /^[6-9]\d{9}$/;
  if (numValid.test(num.value)) {
    num.classList.remove("border");
    numMessage.innerText = "";
  } else {
    num.classList.add("border");
    numMessage.innerText = "Enter a valid 10-digit";
    numMessage.style.color = "red";
    isValid = false;
  }

  return isValid;
}

// Check if user already exists by email
function checkUserExists(email) {
  const URL = `http://localhost:3000/userDetails?email=${encodeURIComponent(
    email
  )}`;
  return fetch(URL)
    .then((response) => response.json())
    .then((data) => {
      console.log("checkUserExists data:", data);
      return data.length > 0;
    })
    .catch((error) => {
      console.error("Error checking user existence:", error);
      return false;
    });
}

function handleSubmit(e) {
  e.preventDefault();
  const email = document.querySelector("#email").value;

  if (validate()) {
    checkUserExists(email)
      .then((userExists) => {
        if (userExists) {
          // Display the error message on the page
          const emailMessage = document.querySelector("#emailMessage");
          emailMessage.innerText = "User with this email already exists";
          emailMessage.style.color = "red";
        } else {
          // Collect user details
          const userDetails = {
            userName: document.querySelector("#username").value,
            email: email,
            password: document.querySelector("#password").value,
            MobileNumber: document.querySelector("#num").value,
          };

          // Simulating a POST request; adjust URL as needed for your actual API
          const URL = "http://localhost:3000/userDetails";
          const options = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userDetails),
          };

          fetch(URL, options)
            .then((response) => {
              if (!response.ok) {
                throw new Error(
                  "Network response was not ok " + response.statusText
                );
              }
              return response.json();
            })
            .then((data) => {
              console.log("User created successfully:", data);
              location.assign("../home/home.html");
            })
            .catch((error) => {
              console.error("Error occurred during user creation:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error occurred during user check:", error);
      });
  }
}

// Attach event listener to the register button
document.getElementById("register").addEventListener("click", handleSubmit);

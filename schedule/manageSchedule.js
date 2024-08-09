// Fetching travel packages and populating the dropdown
fetch("http://localhost:8000/travel_packages")
  .then((response) => response.json())
  .then((data) => {
    const travelPackageSelect = document.getElementById("travelPackage");
    data.forEach((pkg) => {
      const option = document.createElement("option");
      option.value = pkg.id;
      option.textContent = pkg.place;
      travelPackageSelect.appendChild(option);
    });
  })
  .catch((error) => console.error("Error fetching packages:", error));

// Generate person input fields
document.getElementById("generateInputs").addEventListener("click", () => {
  const numPersons = parseInt(document.getElementById("numPersons").value);
  const personInputsDiv = document.getElementById("personInputs");
  personInputsDiv.innerHTML = "";

  for (let i = 0; i < numPersons; i++) {
    const personDiv = document.createElement("div");
    personDiv.classList.add("row");
    personDiv.innerHTML = `
            <div class="col-md-4 form-group">
              <label for="name${i}" autocomplete="off">Person ${
      i + 1
    } Name:</label>
              <input type="text" id="name${i}" class="form-control" required />
            </div>
            <div class="col-md-4 form-group">
              <label for="age${i}">Age:</label>
              <input type="number" id="age${i}" class="form-control" min="1" required />
            </div>
            <div class="col-md-4 form-group">
              <label for="gender${i}">Gender:</label>
              <select id="gender${i}" class="form-control" required>
                <option value="" disabled selected>Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div class="col-md-12 form-group">
              <span class="remove-person" data-index="${i}">Delete</span>
            </div>
          `;
    personInputsDiv.appendChild(personDiv);
  }

  // Attach event listeners to delete buttons
  document.querySelectorAll(".remove-person").forEach((button) => {
    button.addEventListener("click", function () {
      const index = this.getAttribute("data-index");
      document
        .getElementById(`name${index}`)
        .parentElement.parentElement.remove();
    });
  });
});

// Handle form submission
document
  .getElementById("travelScheduleForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const startDate = new Date(document.getElementById("startDate").value);
    const selectedPackageId = document.getElementById("travelPackage").value;
    const numPersons = parseInt(document.getElementById("numPersons").value);
    const personDetails = [];

    for (let i = 0; i < numPersons; i++) {
      personDetails.push({
        name: document.getElementById(`name${i}`).value,
        age: document.getElementById(`age${i}`).value,
        gender: document.getElementById(`gender${i}`).value,
      });
    }

    fetch(`http://localhost:8000/travel_packages/${selectedPackageId}`)
      .then((response) => response.json())
      .then((data) => {
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + data.no_of_days);

        // Populate modal content
        document.getElementById("modalStartDate").textContent =
          "Start Date: " + startDate.toDateString();
        document.getElementById("modalEndDate").textContent =
          "End Date: " + endDate.toDateString();
        document.getElementById("modalPrice").textContent =
          "Price: ₹" + data.package_price;
        document.getElementById("modalPlace").textContent =
          "Place: " + data.place;

        const modalPersonDetails =
          document.getElementById("modalPersonDetails");
        modalPersonDetails.innerHTML = "";
        personDetails.forEach((person) => {
          const li = document.createElement("li");
          li.textContent = `${person.name}, Age: ${person.age}, Gender: ${person.gender}`;
          modalPersonDetails.appendChild(li);
        });

        const modalVisitingSpots =
          document.getElementById("modalVisitingSpots");
        modalVisitingSpots.innerHTML = "";
        data.visiting_spots.forEach((spot) => {
          const li = document.createElement("li");
          li.textContent = spot;
          modalVisitingSpots.appendChild(li);
        });

        // Show modal
        const modal = document.getElementById("confirmationModal");
        const closeButton = document.querySelector("#confirmationModal .close");
        modal.style.display = "block";

        // Close modal
        closeButton.onclick = function () {
          modal.style.display = "none";
        };

        window.onclick = function (event) {
          if (event.target === modal) {
            modal.style.display = "none";
          }
        };
      })
      .catch((error) =>
        console.error("Error fetching package details:", error)
      );
  });

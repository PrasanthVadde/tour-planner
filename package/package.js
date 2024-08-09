const URL = "http://localhost:8000/travel_packages";

async function fetchTravelPackages() {
  try {
    let response = await fetch(URL);
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    let data = await response.json();
    if (data.length > 0) {
      let container = document.createElement("div");
      container.className = "travel-package-container";

      data.forEach((val) => {
        let div = document.createElement("div");
        div.className = "travel-package-card";

        let h1 = document.createElement("h1");
        let img = document.createElement("img");
        let des = document.createElement("p");
        let price = document.createElement("button");

        h1.innerText = val["place"];
        img.src = val["main_image"]; // Corrected image source
        des.innerText = val["description"];
        price.innerText = `Rs.${val["package_price"]}`;

        div.append(h1, img, des, price);
        container.appendChild(div);

        // Add click event to open modal
        div.addEventListener("click", () => openModal(val));
      });

      document.body.appendChild(container);
    } else {
      console.log("No data is present");
    }
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
}

function openModal(packageData) {
  // Get the modal element
  let modal = new bootstrap.Modal(
    document.getElementById("exampleModalCenter")
  );

  // Set modal content
  document.getElementById("modalTitle").innerText = packageData["place"];

  // Handle sub-images
  let imagesContainer = document.getElementById("modalImages");
  imagesContainer.innerHTML = ""; // Clear previous images

  if (packageData["sub_images"].length > 0) {
    packageData["sub_images"].forEach((imageURL) => {
      let img = document.createElement("img");
      img.src = imageURL; // Use the actual image URL
      imagesContainer.appendChild(img);
    });
  } else {
    imagesContainer.innerHTML = "No images available.";
  }

  // Display visiting spots
  let visitingSpotsContainer = document.getElementById("modalVisitingSpots");
  visitingSpotsContainer.innerHTML = ""; // Clear previous spots
  if (packageData["visiting_spots"].length > 0) {
    let spotsList = document.createElement("ul");
    packageData["visiting_spots"].forEach((spot) => {
      let listItem = document.createElement("li");
      listItem.innerText = spot;
      spotsList.appendChild(listItem);
    });
    visitingSpotsContainer.appendChild(spotsList);
  } else {
    visitingSpotsContainer.innerText = "No visiting spots available.";
  }

  // Display number of days
  document.getElementById(
    "modalNoOfDays"
  ).innerText = `Number of Days: ${packageData["no_of_days"]}`;

  document.getElementById("modalDescription").innerText =
    packageData["description"];
  document.getElementById(
    "modalPrice"
  ).innerText = `Rs.${packageData["package_price"]}`;

  // Set up Book button click event
  document.querySelector(".btn-primary").addEventListener("click", () => {
    // Save package details in local storage
    localStorage.setItem(
      "packageData",
      JSON.stringify({
        destination: packageData["place"],
        noOfDays: packageData["no_of_days"],
      })
    );
    // Redirect to schedule page
    window.location.href = "../schedule/manageSchedule.html";
  });

  // Show the modal
  modal.show();
}

document.addEventListener("DOMContentLoaded", fetchTravelPackages);

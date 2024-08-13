let places = []; // Initialize an empty array to store places

// Fetch data from the server
fetch("https://tour-planner-user-and-package-data.onrender.com/travel_packages")
  .then((response) => response.json())
  .then((data) => {
    places = data; // Store the fetched data in the places array
    displayFeaturedPackages();
  })
  .catch((error) => console.error("Error fetching data:", error));

function displayFeaturedPackages() {
  const packagesList = document.getElementById("packagesList");

  // Display the first four packages
  const featuredPackages = places.slice(0, 4);

  featuredPackages.forEach((place) => {
    const card = document.createElement("div");
    card.className = "travel-package-card";
    card.innerHTML = `
          <img src="${place.main_image}" alt="${place.place}" />
          <h3>${place.place}</h3>
          <p>${place.description}</p>
          <p><strong>Price:</strong> ₹${place.package_price}</p>
          <p><strong>Days:</strong> ${place.no_of_days}</p>
          <a href="../package/detailedPackage.html?packageId=${place.id}">View Details</a>
        `;

    packagesList.appendChild(card);
  });
}

function searchPlaces() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const resultsContainer = document.getElementById("searchResults");

  // Clear previous results
  resultsContainer.innerHTML = "";

  // Filter places based on the search query
  const filteredPlaces = places.filter((place) =>
    place.place.toLowerCase().includes(query)
  );

  // Sort the filtered places alphabetically by place name
  filteredPlaces.sort((a, b) => a.place.localeCompare(b.place));

  // Display filtered and sorted results
  filteredPlaces.forEach((place) => {
    const div = document.createElement("div");
    div.textContent = place.place;
    div.addEventListener("click", () => {
      document.getElementById("searchInput").value = place.place;
      window.location.href = `../package/detailedPackage.html?packageId=${place.id}`;
    });
    resultsContainer.appendChild(div);
  });

  // If no results, show a message
  if (filteredPlaces.length === 0) {
    resultsContainer.textContent = "No places found";
  }
}

// Add event listener to search input
document.getElementById("searchInput").addEventListener("input", searchPlaces);

function logout() {
  window.location.href = "../index.html";
}

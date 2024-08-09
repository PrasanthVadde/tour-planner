document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const placeId = urlParams.get("packageId");

  if (placeId) {
    fetch(`http://localhost:8000/travel_packages/${placeId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        document.getElementById("placeName").textContent = data.place;
        document.getElementById("mainImage").src = data.main_image;
        document.getElementById("description").textContent = data.description;
        document.getElementById("price").textContent =
          "Price: ₹" + data.package_price;
        document.getElementById("days").textContent =
          "Number of Days: " + data.no_of_days;

        const spotsList = document.getElementById("spots");
        data.visiting_spots.forEach((spot) => {
          const li = document.createElement("li");
          li.textContent = spot;
          spotsList.appendChild(li);
        });

        const subImagesContainer =
          document.getElementById("subImagesContainer");
        data.sub_images.forEach((imageUrl) => {
          const img = document.createElement("img");
          img.src = imageUrl;
          img.alt = "Sub Image";
          subImagesContainer.appendChild(img);
        });

        document.getElementById("bookButton").addEventListener("click", () => {
          window.location.href = "../schedule/manageSchedule.html";
        });
      })
      .catch((error) => {
        console.error("Error fetching package details:", error);
      });
  } else {
    console.error("No package ID found in URL");
  }
});

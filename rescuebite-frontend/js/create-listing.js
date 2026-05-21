const listingForm = document.getElementById("listingForm");
const locationSelect = document.getElementById("locationId");

async function loadMyLocations() {
    try {
        const response = await apiFetch("/locations/my");

        locationSelect.innerHTML = "";

        if (response.data.length === 0) {
            locationSelect.innerHTML = `
                <option value="">
                    No locations found. Create location first.
                </option>
            `;
            return;
        }

        response.data.forEach((location) => {
            const option = document.createElement("option");

            option.value = location.id;
            option.textContent = `${location.name} - ${location.address}`;

            locationSelect.appendChild(option);
        });

    } catch (error) {
        alert(error.message);
    }
}

listingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
        const title = document.getElementById("title").value;
        const description = document.getElementById("description").value;

        const ingredients = document
            .getElementById("ingredients")
            .value
            .split(",")
            .map(item => item.trim())
            .filter(item => item.length > 0);

        const price = Number(document.getElementById("price").value);
        const quantity = Number(document.getElementById("quantity").value);
        const locationId = locationSelect.value;

        const freshUntilInput = document.getElementById("freshUntil").value;
        const freshUntil = new Date(freshUntilInput).toISOString();

        if (!locationId) {
            alert("Please select location");
            return;
        }

        await apiFetch("/listings", {
            method: "POST",
            body: JSON.stringify({
                title,
                description,
                ingredients,
                price,
                quantity,
                locationId,
                freshUntil
            })
        });

        alert("Listing created successfully");

        window.location.href = "/listings.html";

    } catch (error) {
        alert(error.message);
    }
});

loadMyLocations();
const locationForm = document.getElementById("locationForm");
const locationsContainer = document.getElementById("locationsContainer");

async function loadLocations() {
    try {
        const response = await apiFetch("/locations/my");

        locationsContainer.innerHTML = "";

        response.data.forEach(renderLocation);

    } catch (error) {
        alert(error.message);
    }
}

function renderLocation(location) {
    const card = document.createElement("div");

    card.className = "bg-white rounded-xl shadow p-5";

    card.innerHTML = `
        <h3 class="text-xl font-bold mb-2">
            ${location.name}
        </h3>

        <p class="text-gray-600 mb-2">
            ${location.address}
        </p>

        <p class="text-sm text-gray-500 mb-1">
            Latitude: ${location.latitude}
        </p>

        <p class="text-sm text-gray-500 mb-4">
            Longitude: ${location.longitude}
        </p>

        <p class="text-xs text-gray-400 break-all mb-4">
            ID: ${location.id}
        </p>

        <div class="flex gap-2">

            <button
                onclick="deleteLocation('${location.id}')"
                class="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
                Delete
            </button>

        </div>
    `;

    locationsContainer.appendChild(card);
}

locationForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
        const name = document.getElementById("name").value;

        const address = document.getElementById("address").value;

        const latitude = Number(
            document.getElementById("latitude").value
        );

        const longitude = Number(
            document.getElementById("longitude").value
        );

        await apiFetch("/locations", {
            method: "POST",
            body: JSON.stringify({
                name,
                address,
                latitude,
                longitude
            })
        });

        alert("Location created");

        locationForm.reset();

        loadLocations();

    } catch (error) {
        alert(error.message);
    }
});

async function deleteLocation(id) {
    try {
        await apiFetch(`/locations/${id}`, {
            method: "DELETE"
        });

        alert("Location deleted");

        loadLocations();

    } catch (error) {
        alert(error.message);
    }
}

loadLocations();
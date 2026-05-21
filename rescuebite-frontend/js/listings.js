const listingsContainer = document.getElementById("listingsContainer");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const searchBtn = document.getElementById("searchBtn");
const loadMoreBtn = document.getElementById("loadMoreBtn");

let nextCursor = null;

function getStatusClass(status) {
    if (status === "FRESH") return "bg-green-100 text-green-700";
    if (status === "DISCOUNTED") return "bg-yellow-100 text-yellow-700";
    if (status === "FREE") return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-700";
}

async function loadListings(reset = true) {
    try {
        if (reset) {
            listingsContainer.innerHTML = "";
            nextCursor = null;
        }

        const search = searchInput.value;
        const status = statusFilter.value;

        let endpoint = `/listings?limit=9`;

        if (search) endpoint += `&search=${encodeURIComponent(search)}`;
        if (status) endpoint += `&status=${status}`;
        if (nextCursor) endpoint += `&cursor=${nextCursor}`;

        const response = await apiFetch(endpoint);

        if (reset && response.data.length === 0) {
            listingsContainer.innerHTML = `
                <div class="bg-white rounded-xl shadow p-6 col-span-full text-center">
                    <h2 class="text-xl font-bold mb-2">No listings found</h2>
                    <p class="text-gray-600">Create your first food listing.</p>
                </div>
            `;
            loadMoreBtn.classList.add("hidden");
            return;
        }

        response.data.forEach(renderListing);

        nextCursor = response.pagination.nextCursor;

        if (response.pagination.hasNextPage) {
            loadMoreBtn.classList.remove("hidden");
        } else {
            loadMoreBtn.classList.add("hidden");
        }

    } catch (error) {
        alert(error.message);
    }
}

function renderListing(listing) {
    const card = document.createElement("div");

    card.className = "bg-white rounded-xl shadow p-5";

    card.innerHTML = `
        <div class="flex justify-between items-center mb-3">
            <h2 class="text-xl font-bold">${listing.title}</h2>
            <span class="px-3 py-1 rounded-full text-sm ${getStatusClass(listing.status)}">
                ${listing.status}
            </span>
        </div>

        <p class="text-gray-600 mb-3">${listing.description || "No description"}</p>

        <p class="mb-2"><b>Price:</b> ${listing.price}</p>
        <p class="mb-2"><b>Quantity:</b> ${listing.quantity}</p>

        <p class="mb-4 text-sm text-gray-500">
            <b>Ingredients:</b> ${listing.ingredients.join(", ")}
        </p>

        <div class="flex gap-2">
            <button
                onclick="editListing('${listing.id}')"
                class="flex-1 bg-yellow-500 text-white p-3 rounded-lg"
            >
                Edit
            </button>

            <button
                onclick="deleteListing('${listing.id}')"
                class="flex-1 bg-red-500 text-white p-3 rounded-lg"
            >
                Delete
            </button>
        </div>
    `;

    listingsContainer.appendChild(card);
}

function editListing(id) {
    window.location.href = `/edit-listing.html?id=${id}`;
}

async function deleteListing(id) {
    try {
        const confirmed = confirm("Delete this listing?");

        if (!confirmed) return;

        await apiFetch(`/listings/${id}`, {
            method: "DELETE"
        });

        alert("Listing deleted");

        loadListings(true);

    } catch (error) {
        alert(error.message);
    }
}

searchBtn.addEventListener("click", () => loadListings(true));
loadMoreBtn.addEventListener("click", () => loadListings(false));

loadListings();
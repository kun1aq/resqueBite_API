const navLinks = document.getElementById("navLinks");
const listingsContainer = document.getElementById("listingsContainer");
const reviewsContainer = document.getElementById("reviewsContainer");

function renderNavbar() {
    const user = getUser();

    if (!user) return;

    let links = `
        <a href="index.html">Home</a>
    `;

    if (user.role === "USER") {
        links += `
            <a href="user-listings.html">Listings</a>
            <a href="reservations.html">My Reservations</a>
        `;
    }

    if (user.role === "MERCHANT") {
        links += `
            <a href="listings.html">Merchant Listings</a>
            <a href="create-listing.html">Create Listing</a>
            <a href="location.html">Location</a>
        `;
    }

    if (user.role === "COURIER") {
        links += `
            <a href="courier.html">Courier Dashboard</a>
        `;
    }

    links += `
        <button onclick="logout()" class="text-red-500">Logout</button>
    `;

    navLinks.innerHTML = links;
}

function getStatusClass(status) {
    if (status === "FRESH") return "bg-green-100 text-green-700";
    if (status === "DISCOUNTED") return "bg-yellow-100 text-yellow-700";
    if (status === "FREE") return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-700";
}

async function loadListingsPreview() {
    try {
        const response = await apiFetch("/listings?limit=6");

        listingsContainer.innerHTML = "";

        if (response.data.length === 0) {
            listingsContainer.innerHTML = `
                <p class="text-gray-500 col-span-full">No listings yet.</p>
            `;
            return;
        }

        response.data.forEach((listing) => {
            const card = document.createElement("div");

            card.className = "bg-white rounded-xl shadow p-5";

            card.innerHTML = `
                <div class="flex justify-between items-center mb-3">
                    <h3 class="text-xl font-bold">${listing.title}</h3>
                    <span class="px-3 py-1 rounded-full text-sm ${getStatusClass(listing.status)}">
                        ${listing.status}
                    </span>
                </div>

                <p class="text-gray-600 mb-3">${listing.description || "No description"}</p>

                <p class="mb-2"><b>Price:</b> ${listing.price}</p>
                <p class="mb-4"><b>Quantity:</b> ${listing.quantity}</p>

                <a href="user-listings.html" class="block text-center bg-green-600 text-white p-3 rounded-lg">
                    View Listing
                </a>
            `;

            listingsContainer.appendChild(card);
        });

    } catch (error) {
        listingsContainer.innerHTML = `<p class="text-red-500">Could not load listings.</p>`;
    }
}

async function loadReviews() {
    try {
        const response = await apiFetch("/reviews");

        reviewsContainer.innerHTML = "";

        if (!response.data || response.data.length === 0) {
            reviewsContainer.innerHTML = `
                <p class="text-gray-500 col-span-full">No reviews yet.</p>
            `;
            return;
        }

        response.data.slice(0, 6).forEach((review) => {
            const card = document.createElement("div");

            card.className = "bg-white rounded-xl shadow p-5";

            card.innerHTML = `
                <h3 class="font-bold mb-2">
                    ${review.user?.username || "User"}
                </h3>

                <p class="text-yellow-500 mb-2">
                    Rating: ${review.rating || "-"}
                </p>

                <p class="text-gray-600">
                    ${review.comment || review.text || "No comment"}
                </p>
            `;

            reviewsContainer.appendChild(card);
        });

    } catch (error) {
        reviewsContainer.innerHTML = `
            <p class="text-gray-500 col-span-full">
                Reviews are not available yet.
            </p>
        `;
    }
}

renderNavbar();
loadListingsPreview();
loadReviews();
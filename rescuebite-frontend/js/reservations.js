const navLinks = document.getElementById("navLinks");
const reservationsContainer = document.getElementById("reservationsContainer");

function renderNavbar() {
    const user = getUser();

    let links = `
        <a href="user-listings.html">Listings</a>
    `;

    if (user && user.role === "MERCHANT") {
        links = `
            <a href="listings.html">Listings</a>
            <a href="locations.html">Locations</a>
            <a href="create-listing.html">Create Listing</a>
        `;
    }

    if (user && user.role === "COURIER") {
        links = `
            <a href="courier.html">Courier Dashboard</a>
        `;
    }

    links += `
        <button onclick="logout()" class="text-red-500">
            Logout
        </button>
    `;

    navLinks.innerHTML = links;
}

function getStatusColor(status) {
    if (status === "ACTIVE") return "bg-yellow-100 text-yellow-700";
    if (status === "CONFIRMED") return "bg-green-100 text-green-700";
    if (status === "CANCELLED") return "bg-red-100 text-red-700";
    if (status === "EXPIRED") return "bg-gray-100 text-gray-700";
    return "bg-blue-100 text-blue-700";
}

async function loadReservations() {
    try {
        const response = await apiFetch("/reservations/my");

        reservationsContainer.innerHTML = "";

        if (response.data.length === 0) {
            reservationsContainer.innerHTML = `
                <div class="bg-white rounded-xl shadow p-6 col-span-full text-center">
                    <h2 class="text-xl font-bold mb-2">No reservations yet</h2>

                    <p class="text-gray-600 mb-4">
                        Go to listings and reserve available food.
                    </p>

                    <a href="user-listings.html" class="bg-green-600 text-white px-5 py-3 rounded-lg inline-block">
                        Browse Listings
                    </a>
                </div>
            `;
            return;
        }

        response.data.forEach(renderReservation);

    } catch (error) {
        alert(error.message);
    }
}

function renderReservation(reservation) {
    const card = document.createElement("div");

    card.className = "bg-white rounded-xl shadow p-5";

    const canReview =
        reservation.status === "CONFIRMED" &&
        reservation.deliveryStatus === "DELIVERED";

    card.innerHTML = `
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">
                ${reservation.listing.title}
            </h2>

            <span class="px-3 py-1 rounded-full text-sm ${getStatusColor(reservation.status)}">
                ${reservation.status}
            </span>
        </div>

        <p class="mb-2">
            <b>Quantity:</b> ${reservation.quantity}
        </p>

        <p class="mb-2">
            <b>Delivery:</b> ${reservation.deliveryStatus || "NONE"}
        </p>

        <p class="mb-4 text-sm text-gray-500">
            Reservation ID: ${reservation.id}
        </p>

        <div class="flex gap-3">
            ${
                reservation.status === "ACTIVE"
                ? `
                    <button
                        onclick="confirmReservation('${reservation.id}')"
                        class="bg-green-600 text-white px-4 py-2 rounded-lg"
                    >
                        Confirm
                    </button>

                    <button
                        onclick="cancelReservation('${reservation.id}')"
                        class="bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                        Cancel
                    </button>
                `
                : ""
            }

            ${
                canReview
                ? `
                    <a
                        href="review.html?listingId=${reservation.listing.id}"
                        class="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                    >
                        Review
                    </a>
                `
                : ""
            }
        </div>
    `;

    reservationsContainer.appendChild(card);
}

async function confirmReservation(id) {
    try {
        await apiFetch(`/reservations/${id}/confirm`, {
            method: "PATCH"
        });

        alert("Reservation confirmed");
        loadReservations();

    } catch (error) {
        alert(error.message);
    }
}

async function cancelReservation(id) {
    try {
        await apiFetch(`/reservations/${id}/cancel`, {
            method: "PATCH"
        });

        alert("Reservation cancelled");
        loadReservations();

    } catch (error) {
        alert(error.message);
    }
}

async function openReviewModal(listingId) {
    try {
        alert("Review button works");

        const rating = Number(prompt("Enter rating from 1 to 5"));

        if (!rating || rating < 1 || rating > 5) {
            alert("Rating must be between 1 and 5");
            return;
        }

        const comment = prompt("Write your review");

        await apiFetch("/reviews", {
            method: "POST",
            body: JSON.stringify({
                listingId,
                rating,
                comment
            })
        });

        alert("Review submitted successfully");

    } catch (error) {
        alert(error.message);
    }
}

window.confirmReservation = confirmReservation;
window.cancelReservation = cancelReservation;
window.openReviewModal = openReviewModal;

renderNavbar();
loadReservations();
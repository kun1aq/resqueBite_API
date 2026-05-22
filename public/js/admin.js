const statsContainer = document.getElementById("statsContainer");
const usersTable = document.getElementById("usersTable");
const reservationsContainer = document.getElementById("reservationsContainer");

async function loadAdminPanel() {
    await loadStats();
    await loadUsers();
    await loadReservations();
}

async function loadStats() {
    try {
        const response = await apiFetch("/admin/stats");

        const stats = response.data;

        statsContainer.innerHTML = `
            <div class="bg-white p-5 rounded-xl shadow text-center">
                <h3 class="text-gray-500">Users</h3>
                <p class="text-3xl font-bold">${stats.totalUsers}</p>
            </div>

            <div class="bg-white p-5 rounded-xl shadow text-center">
                <h3 class="text-gray-500">Listings</h3>
                <p class="text-3xl font-bold">${stats.totalListings}</p>
            </div>

            <div class="bg-white p-5 rounded-xl shadow text-center">
                <h3 class="text-gray-500">Reservations</h3>
                <p class="text-3xl font-bold">${stats.totalReservations}</p>
            </div>

            <div class="bg-white p-5 rounded-xl shadow text-center">
                <h3 class="text-gray-500">Active Listings</h3>
                <p class="text-3xl font-bold text-green-600">${stats.activeListings}</p>
            </div>

            <div class="bg-white p-5 rounded-xl shadow text-center">
                <h3 class="text-gray-500">Compost</h3>
                <p class="text-3xl font-bold text-red-600">${stats.compostListings}</p>
            </div>
        `;

    } catch (error) {
        alert(error.message);
    }
}

async function loadUsers() {
    try {
        const response = await apiFetch("/admin/users");

        usersTable.innerHTML = "";

        response.data.forEach((user) => {
            const row = document.createElement("tr");

            row.className = "border-t";

            row.innerHTML = `
                <td class="p-3">${user.username}</td>
                <td class="p-3">${user.email}</td>
                <td class="p-3">
                    <span class="px-3 py-1 rounded-full bg-gray-100">
                        ${user.role}
                    </span>
                </td>
                <td class="p-3">${new Date(user.createdAt).toLocaleDateString()}</td>
            `;

            usersTable.appendChild(row);
        });

    } catch (error) {
        alert(error.message);
    }
}

async function loadReservations() {
    try {
        const response = await apiFetch("/admin/reservations");

        reservationsContainer.innerHTML = "";

        if (response.data.length === 0) {
            reservationsContainer.innerHTML = `
                <p class="text-gray-500">No reservations found.</p>
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

    const listing = reservation.listing;

    card.innerHTML = `
        <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold">
                ${listing?.title || "Deleted listing"}
            </h3>

            <span class="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                ${reservation.status}
            </span>
        </div>

        <p class="mb-2"><b>User:</b> ${reservation.user?.username || "Unknown"}</p>
        <p class="mb-2"><b>Email:</b> ${reservation.user?.email || "Unknown"}</p>
        <p class="mb-2"><b>Quantity:</b> ${reservation.quantity}</p>
        <p class="mb-2"><b>Delivery:</b> ${reservation.deliveryStatus || "NONE"}</p>

        ${
            listing
            ? `
                <div class="flex gap-2 mt-4">
                    <button
                        onclick="compostListing('${listing.id}')"
                        class="flex-1 bg-yellow-500 text-white p-2 rounded-lg"
                    >
                        Compost
                    </button>

                    <button
                        onclick="deleteListing('${listing.id}')"
                        class="flex-1 bg-red-500 text-white p-2 rounded-lg"
                    >
                        Delete Listing
                    </button>
                </div>
            `
            : ""
        }
    `;

    reservationsContainer.appendChild(card);
}

async function compostListing(id) {
    try {
        await apiFetch(`/admin/listings/${id}/compost`, {
            method: "PATCH"
        });

        alert("Listing moved to compost");

        loadAdminPanel();

    } catch (error) {
        alert(error.message);
    }
}

async function deleteListing(id) {
    try {
        const confirmed = confirm("Delete this listing?");

        if (!confirmed) return;

        await apiFetch(`/admin/listings/${id}`, {
            method: "DELETE"
        });

        alert("Listing deleted");

        loadAdminPanel();

    } catch (error) {
        alert(error.message);
    }
}

loadAdminPanel();
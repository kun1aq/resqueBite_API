const availableContainer = document.getElementById("availableContainer");
const myDeliveriesContainer = document.getElementById("myDeliveriesContainer");

async function loadCourierData() {
    await loadAvailableDeliveries();
    await loadMyDeliveries();
}

async function loadAvailableDeliveries() {
    try {
        const response = await apiFetch("/reservations/deliveries/available");

        availableContainer.innerHTML = "";

        if (response.data.length === 0) {
            availableContainer.innerHTML = `<p class="text-gray-500">No available deliveries.</p>`;
            return;
        }

        response.data.forEach(renderAvailableDelivery);

    } catch (error) {
        alert(error.message);
    }
}

function renderAvailableDelivery(reservation) {
    const card = document.createElement("div");
    card.className = "bg-white rounded-xl shadow p-5";

    card.innerHTML = `
        <h3 class="text-xl font-bold mb-2">${reservation.listing.title}</h3>

        <p><b>Quantity:</b> ${reservation.quantity}</p>
        <p><b>User:</b> ${reservation.user.username}</p>
        <p><b>Status:</b> ${reservation.deliveryStatus}</p>

        <button
            onclick="acceptDelivery('${reservation.id}')"
            class="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg"
        >
            Accept Delivery
        </button>
    `;

    availableContainer.appendChild(card);
}

async function loadMyDeliveries() {
    try {
        const response = await apiFetch("/reservations/deliveries/my");

        myDeliveriesContainer.innerHTML = "";

        if (response.data.length === 0) {
            myDeliveriesContainer.innerHTML = `<p class="text-gray-500">You have no deliveries.</p>`;
            return;
        }

        response.data.forEach(renderMyDelivery);

    } catch (error) {
        alert(error.message);
    }
}

function renderMyDelivery(reservation) {
    const card = document.createElement("div");
    card.className = "bg-white rounded-xl shadow p-5";

    card.innerHTML = `
        <h3 class="text-xl font-bold mb-2">${reservation.listing.title}</h3>

        <p><b>Quantity:</b> ${reservation.quantity}</p>
        <p><b>User:</b> ${reservation.user.username}</p>
        <p><b>Delivery Status:</b> ${reservation.deliveryStatus}</p>

        <div class="flex gap-2 mt-4">
            <button onclick="updateDeliveryStatus('${reservation.id}', 'PICKED_UP')" class="bg-yellow-500 text-white px-3 py-2 rounded-lg">
                Picked Up
            </button>

            <button onclick="updateDeliveryStatus('${reservation.id}', 'DELIVERING')" class="bg-blue-500 text-white px-3 py-2 rounded-lg">
                Delivering
            </button>

            <button onclick="updateDeliveryStatus('${reservation.id}', 'DELIVERED')" class="bg-green-600 text-white px-3 py-2 rounded-lg">
                Delivered
            </button>
        </div>
    `;

    myDeliveriesContainer.appendChild(card);
}

async function acceptDelivery(id) {
    try {
        await apiFetch(`/reservations/${id}/accept-delivery`, {
            method: "PATCH"
        });

        alert("Delivery accepted");
        loadCourierData();

    } catch (error) {
        alert(error.message);
    }
}

async function updateDeliveryStatus(id, status) {
    try {
        await apiFetch(`/reservations/${id}/delivery-status`, {
            method: "PATCH",
            body: JSON.stringify({ status })
        });

        alert("Delivery status updated");
        loadCourierData();

    } catch (error) {
        alert(error.message);
    }
}

loadCourierData();
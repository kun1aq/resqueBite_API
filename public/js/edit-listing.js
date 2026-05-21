const editForm = document.getElementById("editForm");

const params = new URLSearchParams(window.location.search);

const listingId = params.get("id");

async function loadListing() {
    try {
        const response = await apiFetch("/listings");

        const listing = response.data.find(
            item => item.id === listingId
        );

        if (!listing) {
            alert("Listing not found");
            return;
        }

        document.getElementById("title").value = listing.title;

        document.getElementById("description").value =
            listing.description || "";

        document.getElementById("ingredients").value =
            listing.ingredients.join(", ");

        document.getElementById("price").value =
            listing.price;

        document.getElementById("quantity").value =
            listing.quantity;

        document.getElementById("freshUntil").value =
            new Date(listing.freshUntil)
                .toISOString()
                .slice(0, 16);

    } catch (error) {
        alert(error.message);
    }
}

editForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
        const title =
            document.getElementById("title").value;

        const description =
            document.getElementById("description").value;

        const ingredients =
            document.getElementById("ingredients")
                .value
                .split(",")
                .map(item => item.trim())
                .filter(item => item.length > 0);

        const price =
            Number(document.getElementById("price").value);

        const quantity =
            Number(document.getElementById("quantity").value);

        const freshUntil =
            new Date(
                document.getElementById("freshUntil").value
            ).toISOString();

        await apiFetch(`/listings/${listingId}`, {
            method: "PATCH",
            body: JSON.stringify({
                title,
                description,
                ingredients,
                price,
                quantity,
                freshUntil
            })
        });

        alert("Listing updated");

        window.location.href = "/listings.html";

    } catch (error) {
        alert(error.message);
    }
});

loadListing();
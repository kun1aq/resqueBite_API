const reviewForm = document.getElementById("reviewForm");

const params = new URLSearchParams(window.location.search);

const listingId = params.get("listingId");

if (!listingId) {
    alert("Listing ID not found");
    window.location.href = "/reservations.html";
}

reviewForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
        const rating = Number(
            document.getElementById("rating").value
        );

        const comment =
            document.getElementById("comment").value;

        await apiFetch("/reviews", {
            method: "POST",
            body: JSON.stringify({
                listingId,
                rating,
                comment
            })
        });

        alert("Review submitted successfully");

        window.location.href = "/reservations.html";

    } catch (error) {
        alert(error.message);
    }
});
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const response = await apiFetch("/auth/login", {
            method: "POST",
            body: JSON.stringify({
                email,
                password
            })
        });

        saveAuth(response.data);

        alert("Login successful");

        const user = response.data.user;

        if (user.role === "MERCHANT") {
            window.location.href = "/listings.html";
        } else if (user.role === "USER") {
            window.location.href = "/user-listings.html";
        } 
        else if (user.role === "COURIER") {
            window.location.href = "/courier.html";
        } else if (user.role === "ADMIN") {
            window.location.href = "/admin.html";
        } else {
            window.location.href = "/listings.html";
        }

    } catch (error) {
        alert(error.message);
    }
});
function requireAuth() {
    const token = localStorage.getItem("accessToken");

    if (!token) {
        window.location.replace("/login.html");
        return false;
    }

    return true;
}

function requireRole(role) {
    const user = getUser();

    if (!user || user.role !== role) {
        alert("Access denied");

        if (!user) {
            window.location.replace("/login.html");
            return false;
        }

        if (user.role === "USER") {
            window.location.replace("/user-listings.html");
            return false;
        }

        if (user.role === "MERCHANT") {
            window.location.replace("/listings.html");
            return false;
        }

        if (user.role === "COURIER") {
            window.location.replace("/courier.html");
            return false;
        }

        window.location.replace("/login.html");
        return false;
    }

    return true;
}
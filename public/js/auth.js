function saveAuth(data) {
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("user", JSON.stringify(data.user));
}

function getUser() {
    return JSON.parse(localStorage.getItem("user"));
}

function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    window.location.href = "/login.html";
}

function isLoggedIn() {
    return !!localStorage.getItem("accessToken");
}
function hasRole(role) {
    const user = getUser();

    if (!user) return false;

    return user.role === role;
}
const registerForm = document.getElementById("registerForm");
const verifyBox = document.getElementById("verifyBox");
const verifyTokenInput = document.getElementById("verifyToken");
const verifyBtn = document.getElementById("verifyBtn");

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const role = document.getElementById("role").value;

        const response = await apiFetch("/auth/register", {
            method: "POST",
            body: JSON.stringify({
                username,
                email,
                password,
                role
            })
        });

        alert("Registered successfully. Now verify email.");

        console.log("REGISTER RESPONSE:", response.data);

        if (response.data.verificationCode) {
            verifyTokenInput.value = response.data.verificationCode;
        }

        verifyBox.classList.remove("hidden");

    } catch (error) {
        alert(error.message);
    }
});

verifyBtn.addEventListener("click", async () => {
    try {
        const token = verifyTokenInput.value;

        await apiFetch("/auth/verify-email", {
            method: "POST",
            body: JSON.stringify({ token })
        });

        alert("Email verified. Now you can login.");
        window.location.href = "/login.html";

    } catch (error) {
        alert(error.message);
    }
});
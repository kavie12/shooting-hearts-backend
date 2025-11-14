const { getAuth } = require("./FirebaseAdmin");
const { initPlayerRecord } = require("./FirebaseDatabase");

const apiKey = process.env.FIREBASE_API_KEY;

async function createUser(name, email, password) {
    try {
        // API Doc: https://firebase.google.com/docs/reference/rest/auth#section-create-email-password
        const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email,
                password: password,
                returnSecureToken: true
            })
        });
        const data = await res.json();

        if (!res.ok) {
            throw data.error;
        }

        await updateDisplayName(data.idToken, name);
        
        await initPlayerRecord(data.localId, name);

        return {
            accessToken: data.idToken,
            refreshToken: data.refreshToken
        };
    } catch (error) {
        throw errorConverter(error);
    }
}

async function updateDisplayName(token, name) {
    try {
        // API Doc: https://firebase.google.com/docs/reference/rest/auth#section-update-profile
        const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                idToken: token,
                displayName: name,
                deleteAttribute: ["PHOTO_URL"],
                returnSecureToken: false
            })
        });
        const data = await res.json();

        if (!res.ok) {
            throw data.error;
        }
    } catch (error) {
        throw errorConverter(error);
    }
}

async function authenticate(email, password) {
    try {
        // API Doc: https://firebase.google.com/docs/reference/rest/auth#section-sign-in-email-password
        const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email,
                password: password,
                returnSecureToken: true
            })
        });
        data = await res.json();

        if (!res.ok) {
            throw data.error;
        }

        return {
            accessToken: data.idToken,
            refreshToken: data.refreshToken
        };
    } catch (error) {
        throw errorConverter(error);
    }
}

async function refreshTokens(refreshToken) {
    try {
        // API Doc: https://firebase.google.com/docs/reference/rest/auth#section-refresh-token
        const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                grant_type: "refresh_token",
                refresh_token: refreshToken
            })
        });
        const data = await res.json();

        if (!res.ok) {
            throw data.error;
        }

        return {
            accessToken: data.id_token,
            refreshToken: data.refresh_token
        };
    } catch (error) {
        throw errorConverter(error);
    }
}

async function getUIDByToken(token) {
    try {
        const decodedToken = await getAuth().verifyIdToken(token);
        return decodedToken.uid;
    } catch (error) {
        error.message = "INVALID_ID_TOKEN";
        throw errorConverter(error);
    }
}

function errorConverter(error) {
    switch (error.message) {
        case "TOKEN_EXPIRED":
        case "INVALID_ID_TOKEN":
            return {
                code: error.message,
                message: "Invalid or expired token."
            };
        case "USER_NOT_FOUND":
        case "INVALID_LOGIN_CREDENTIALS":
            return {
                code: error.message,
                message: "No user found with the provided credentials."
            };
        case "INVALID_REFRESH_TOKEN":
            return {
                code: error.message,
                message: "The provided refresh token is invalid or has expired."
            };
        case "MISSING_REFRESH_TOKEN":
            return {
                code: error.message,
                message: "Missing refresh token."
            };
        case "EMAIL_EXISTS":
            return {
                code: error.message,
                message: "This email is already registered."
            };
        case "EMAIL_NOT_FOUND":
            return {
                code: error.message,
                message: "No account found with this email."
            };
        case "INVALID_PASSWORD":
            return {
                code: error.message,
                message: "The password you entered is incorrect."
            };
        default:
            return {
                code: "UNKNOWN_ERROR",
                message: "An unexpected error occurred."
            };
    }
}

module.exports = {
    createUser,
    authenticate,
    refreshTokens,
    getUIDByToken
};
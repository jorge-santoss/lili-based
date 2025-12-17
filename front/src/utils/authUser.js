// src/utils/authUser.js
export function getCurrentUserFromToken() {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const payloadBase64 = token.split(".")[1];
    const json = atob(payloadBase64);
    const payload = JSON.parse(json);

    return {
      email: payload.email,
      role: payload.role, // adapte si ton token utilise un autre champ
    };
  } catch {
    return null;
  }
}

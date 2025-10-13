import axios from "axios";

export const registerUser = async (userData: {
  username: string;
  email: string;
  gender?: "" | "laki-laki" | "perempuan" | undefined;
  password: string;
}) => {
  try {
    const response = await axios.post("/api/auth/register", userData);
    return response.data;
  } catch (error) {
    throw error || { error: "Terjadi kesalahan" };
  }
};

export async function authLogin(userData: { email: string; password: string }) {
  try {
    const response = await axios.post("/api/auth/login", userData);
    return response.data;
  } catch (error) {
    throw error || { error: "Terjadi kesalahan" };
  }
}

export const logout = async () => {
  console.log("masuk logout");
  try {
    const response = await axios.post("/api/auth/logout");
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error || { error: "Terjadi kesalahan" };
  }
};

export const handleGoogleLogin = async () => {
  try {
    const response = await axios.post("/api/auth/google", {
      provider: "google",
    });
    window.location.href = response.data.url;
  } catch (error) {
    console.error("Google login failed:", error);
  }
};

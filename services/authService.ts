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
    console.log(userData);
    const response = await axios.post("/api/auth/login", userData);
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error || { error: "Terjadi kesalahan" };
  }
}

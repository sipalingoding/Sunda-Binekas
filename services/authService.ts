import axios from "axios";

export const registerUser = async (userData: {
  username: string;
  email: string;
  gender?: "" | "laki-laki" | "perempuan" | undefined;
  password: string;
}) => {
  try {
    console.log(userData);
    const response = await axios.post("/api/auth/register", userData);
    console.log(response);
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error || { error: "Terjadi kesalahan" };
  }
};

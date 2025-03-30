import { supabase } from "@/lib/supabase";
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
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error();
  } else {
    console.log("User logged out successfully!");
  }
};

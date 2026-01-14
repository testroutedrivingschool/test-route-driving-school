import axios from "axios";

export const getUserByEmail = async (email) => {
  try {
    const res = await axios.get(`/api/users?email=${email}`);
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
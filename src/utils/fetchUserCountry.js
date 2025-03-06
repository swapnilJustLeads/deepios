import axios from "axios";

const fetchUserCountry = async () => {
  try {
    const response = await axios.get("https://ipapi.co/json/");
    return response.data.country_code; // Example: "US", "IN"
  } catch (error) {
    console.error("Error fetching user country:", error);
    return "US"; // Default to US if API fails
  }
};

export default fetchUserCountry;

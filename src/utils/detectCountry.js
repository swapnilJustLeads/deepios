const detectCountry = () => {
    const localeOptions = Intl.DateTimeFormat().resolvedOptions();
    const locale = localeOptions.locale; // Example: "en-IN"
    const timeZone = localeOptions.timeZone; // Example: "Asia/Kolkata"
    const country = locale.split("-")[1] || "US"; // Extract country code (IN, US, GB)
  
    console.log("🟢 Full Locale Data:", localeOptions);
    console.log("🟢 Detected Locale:", locale);
    console.log("🟢 Detected Time Zone:", timeZone);
    console.log("🟢 Extracted Country Code:", country);
    
    return country;
  };
  
  export default detectCountry;
  
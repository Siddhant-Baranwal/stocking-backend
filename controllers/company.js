// Make APIs for the company database.
import { app } from "../firebaseConfig.js";
import {
  getFirestore,
  query,
  doc,
  getDocs,
  getDoc,
  collection,
} from "firebase/firestore";

const db = getFirestore(app);

// Function to get companies corresponding to keyword in their name
const getFilterdSearch = async (req, res) => {
  console.log(req.query);
  try {
    // Extract the search string from the request query parameters
    const searchString = req.query.name;

    if (!searchString) {
      return res.status(400).json({ error: "Search string is required" });
    }

    const companiesRef = collection(db, "Companies");
    const q = query(companiesRef); // Fetch all companies for now

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(404).json({ message: "No matching companies found" });
    }

    const matchingCompanies = [];
    querySnapshot.forEach((doc) => {
      const companyData = doc.data();
      if (
        companyData.Name &&
        companyData.Name.toLowerCase().includes(searchString.toLowerCase())
      ) {
        matchingCompanies.push({
          id: doc.id,
          Name: companyData.Name,
          country: companyData.Country,
          sl_no: companyData.SL_No,
        });
      }
    });

    return res.status(200).json({ companies: matchingCompanies });
  } catch (error) {
    console.error("Error fetching companies:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// function to fetch the comapny using id
const getCompanyDetails = async (req, res) => {
  try {
    // Get the 'uid' parameter from the URL
    const companyUid = req.params.id;
    console.log(companyUid);

    // Reference to the specific document in Firestore using the UID
    const companyRef = doc(db, "Companies", companyUid);
    const companySnap = await getDoc(companyRef);

    if (companySnap.exists()) {
      // Send the company data if it exists
      return res
        .status(200)
        .json({ uid: companySnap.id, ...companySnap.data() });
    } else {
      // If the document doesn't exist, send a 404 response
      return res.status(404).json({ message: "Company not found" });
    }
  } catch (error) {
    console.error("Error fetching company by UID:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getallCompanies = async (req, res) => {
  try {
    const companiesRef = collection(db, "Companies");
    const querySnapshot = await getDocs(companiesRef);

    if (querySnapshot.empty) {
      return res.status(404).json({ message: "No companies found" });
    }

    const allCompanies = [];
    querySnapshot.forEach((doc) => {
      const companyData = doc.data();
      allCompanies.push({
        id: doc.id,
        ...companyData, // Spread the entire company data object
      });
    });

    return res.status(200).json({ companies: allCompanies });
  } catch (error) {
    console.error("Error fetching companies:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export { getFilterdSearch, getCompanyDetails, getallCompanies };

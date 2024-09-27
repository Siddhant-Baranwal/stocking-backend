import { app } from "../firebaseConfig.js";
import {
  collection,
  doc,
  setDoc,
  writeBatch,
  getDoc,
  getFirestore,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const firestore = getFirestore(app);

// Function to upload data to Firestore
const uploadDataToFirestore = async (data) => {
  const collectionRef = collection(firestore, "UsersDetail");
  const batch = writeBatch(firestore);

  data.forEach((item) => {
    const docRef = doc(collectionRef);
    batch.set(docRef, item);
  });

  try {
    await batch.commit();
    console.log("Data uploaded successfully!");
  } catch (error) {
    console.error("Error uploading data to Firestore:", error);
  }
};

const addUser = async (req, res) => {
  const { name, email } = req.body;
  const history = [];
  const data = { name, email, history };
  try {
    // Check if a user with the given email already exists in Firestore
    const userQuery = query(
      collection(firestore, "UsersDetail"),
      where("email", "==", email)
    );
    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      // User already exists
      const existingUserDoc = querySnapshot.docs[0]; // Get the first matched document
      const existingUserData = existingUserDoc.data(); // Get the user data
      const userId = existingUserDoc.id; // Get the document ID (userId)

      return res.status(200).json({
        message: "User already exists.",
        user: { userId, ...existingUserData }, // Include the userId in the response
      });
    }

    // If the user doesn't exist, create a new user
    const userRef = await addDoc(collection(firestore, "UsersDetail"), data);
    const userId = userRef.id; // Firestore auto-generates the document ID

    const newUser = { userId, ...data }; // Add userId to user data

    res
      .status(200)
      .cookie("token", email, {
        httpOnly: true,
        maxAge: 15 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: "User added successfully!",
        user: newUser, // Return the newly created user data
      });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error.");
  }
};

// History of user
const updateHistory = async (req, res) => {
  const email = req.cookies.token;
  const { newEntry } = req.body;

  if (!email) {
    return res.status(401).send("Unauthorized: No token provided");
  }

  const docRef = doc(firestore, "UsersDetail", email);

  try {
    const userDoc = await getDoc(docRef);
    if (userDoc.exists()) {
      const currentHistory = userDoc.data().history || [];
      currentHistory.push(newEntry);

      await setDoc(docRef, { history: currentHistory }, { merge: true });
      res.status(200).send("History updated successfully!");
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error updating user history:", error);
    res.status(500).send("Internal Server Error");
  }
};

const getHistory = async (req, res) => {
  const email = req.cookies.token;

  if (!email) {
    return res.status(401).send("Unauthorized: No token provided");
  }

  const docRef = doc(firestore, "UsersDetail", email);

  try {
    const userDoc = await getDoc(docRef);
    if (userDoc.exists()) {
      const history = userDoc.data().history || [];
      res.status(200).json(history);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error fetching user history:", error);
    res.status(500).send("Internal Server Error");
  }
};

export { addUser, updateHistory, getHistory };
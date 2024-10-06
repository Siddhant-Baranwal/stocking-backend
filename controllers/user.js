import { app } from "../firebaseConfig.js";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getFirestore,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const firestore = getFirestore(app);

const addUser = async (req, res) => {
  const { name, email } = req.body;
  console.log(req.user);
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
    res.status(500).send("Internal server error.");
  }
};

// History of user
const updateHistory = async (req, res) => {
  const { email, newEntry } = req.body;
  console.log("hi", email);

  if (!email) {
    return res.status(401).send("Unauthorized: No email provided");
  }

  try {
    // Create a query to find the user document by email
    const userQuery = query(
      collection(firestore, "UsersDetail"),
      where("email", "==", email)
    );

    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      // Get the first document from the query snapshot
      const userDoc = querySnapshot.docs[0];

      // Get the current history from the user document
      const currentHistory = userDoc.data().history || [];

      // Add the new entry to the history array
      currentHistory.push(newEntry);

      // Update the document with the new history
      const docRef = doc(firestore, "UsersDetail", userDoc.id); // Use the doc ID to reference the document
      await setDoc(docRef, { history: currentHistory }, { merge: true });
      const updatedUserDoc = await getDoc(docRef);
      res.status(200).send(updatedUserDoc.data());
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

const getHistory = async (req, res) => {
  const email = req.cookies.token;

  if (!email) {
    return res.status(401).send("Unauthorized: No token provided");
  }

  try {
    // Query the user by email (similar to updateHistory)
    const userQuery = query(
      collection(firestore, "UsersDetail"),
      where("email", "==", email)
    );
    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      // Get the user document
      const userDoc = querySnapshot.docs[0];
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

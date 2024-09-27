import { app } from "../firebaseConfig.js";
import {
  collection,
  doc,
  setDoc,
  writeBatch,
  getDoc,
  getFirestore,
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
    await uploadDataToFirestore([data]);
    res
      .status(200)
      .cookie("token", email, {
        httpOnly: true,
        maxAge: 15 * 24 * 60 * 60 * 1000,
      })
      .send("User added successfully!");
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

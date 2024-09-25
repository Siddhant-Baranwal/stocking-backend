import { app } from "../firebaseConfig.js";
import { collection, doc, setDoc, writeBatch, getDoc, getFirestore } from "firebase/firestore";

const firestore=getFirestore(app)

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
}

// History of user
const addUser = async(req, res) => {
    const { email, uid } = req.body;
    const history = []; 
    const data = {email, uid, history};
    try {
        await uploadDataToFirestore([data]);
        res.status(200).cookie("token", uid, {
            httpOnly: true,
            maxAge: 15 * 24 * 60 * 60 * 1000,
        }).send("User added successfully!");
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error.");
    }
}

const updateHistory = async (req, res) => {
    const uid = req.cookies.token;
    const { newEntry } = req.body; 

    if (!uid) {
        return res.status(401).send("Unauthorized: No token provided");
    }

    const docRef = doc(firestore, "UsersDetail", uid);

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
    const uid = req.cookies.token;

    if (!uid) {
        return res.status(401).send("Unauthorized: No token provided");
    }

    const docRef = doc(firestore, "UsersDetail", uid);

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

export {addUser, updateHistory, getHistory};
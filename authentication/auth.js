import { app } from "../firebaseConfig.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { TotpSecret } from "firebase/auth/web-extension";
import speakeasy from "speakeasy";
import qrcode from "qrcode";

const handleEmailSignUp = async (req, res) => {
  const { email, password } = req.body;
  const auth = getAuth(app);

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await sendEmailVerification(user);
    res.send(user);
  } catch (error) {
    res.send(error);
  }
};

const handleEmailSignIn = async (req, res) => {
  const { email, password } = req.body;
  const auth = getAuth(app);

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    res.send(user);
  } catch (error) {
    res.send(error);
  }
};

const isEmailVerified = async (req, res) => {
  const { email, password } = req.body;
  const auth = getAuth(app);

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    if (user.emailVerified) {
      res.send(true);
    } else {
      res.send(false);
    }
  } catch (error) {
    res.send(error);
  }
};

const handleResendVerification = async (req, res) => {
  const { email, password } = req.body;
  const auth = getAuth(app);

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;
    await sendEmailVerification(user);
    res.send(true);
  } catch (error) {
    res.send(false);
    console.log(error);
  }
};

const signInWithGoogle = async (req, res) => {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    res.send(user);
  } catch (error) {
    res.send(error);
  }
};

const secretCodeGeneration = async (req, res) => {
  try {
    const userId = req.body.userId;

    // Generate a new secret for TOTP
    const secret = speakeasy.generateSecret({ name: "Stock-Insights" });

    // Initialize Firestore
    const firestore = getFirestore(app);

    // Get the reference to the user's document in Firestore
    const userRef = doc(firestore, "UsersDetail", userId);

    // Fetch the user document
    const usersnap = await getDoc(userRef);

    if (usersnap.exists()) {
      // Update the user document with the new TOTP secret, merging the data
      await setDoc(userRef, { totpsecret: secret.base32 }, { merge: true });

      // Generate OTP auth URL and QR code
      const otpauth_url = secret.otpauth_url;
      const qrCode = await qrcode.toDataURL(otpauth_url);

      // Respond with the QR code for the client to display
      res.json({ qrCode });
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.log(error);
  }
};

const codeVerification = async (req, res) => {
  try {
    const { userId, token } = req.body;
    const firestore = getFirestore(app);

    const userRef = doc(firestore, "UsersDetail", userId);
    const usersnap = await getDoc(userRef);
    const secret = usersnap.data().totpsecret;

    // console.log(secret);

    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: "base32",
      token: token,
      window: 1, // Allows some margin for time drift
    });

    if (verified) {
      res.json({ verified: true });
    } else {
      res.json({ verified: false, message: "Invalid token" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export {
  handleEmailSignUp,
  handleEmailSignIn,
  isEmailVerified,
  handleResendVerification,
  signInWithGoogle,
  secretCodeGeneration,
  codeVerification,
};

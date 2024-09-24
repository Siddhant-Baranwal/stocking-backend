import { app } from "../firebaseConfig.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

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

export {
  handleEmailSignUp,
  handleEmailSignIn,
  isEmailVerified,
  handleResendVerification,
  signInWithGoogle,
};

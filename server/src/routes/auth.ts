import { Router } from "express";
import { admin, db } from "../firebaseAdmin";
import { verifyToken, requireRole, AuthRequest } from "../middleware/auth";

const router = Router();

router.post("/register", async (req: AuthRequest, res) => {
  const { email, password, displayName, role } = req.body;
  if (!email || !password) return res.status(400).json({ error: "email and password required" });
  const userRole = role || "buyer";
  try {
    const userRecord = await admin.auth().createUser({ email, password, displayName });
    const uid = userRecord.uid;
    await admin.auth().setCustomUserClaims(uid, { role: userRole });
    await db.collection("users").doc(uid).set({ email, displayName, role: userRole, createdAt: admin.firestore.FieldValue.serverTimestamp() });
    return res.status(201).json({ uid, email, role: userRole });
  } catch (err) {
    return res.status(500).json({ error: "Failed to create user", details: String(err) });
  }
});

// Protected route: only admin can create admin users
router.post("/create-admin", verifyToken, requireRole("admin"), async (req: AuthRequest, res) => {
  const { email, password, displayName } = req.body;
  if (!email || !password) return res.status(400).json({ error: "email and password required" });
  try {
    const userRecord = await admin.auth().createUser({ email, password, displayName });
    const uid = userRecord.uid;
    await admin.auth().setCustomUserClaims(uid, { role: "admin" });
    await db.collection("users").doc(uid).set({ email, displayName, role: "admin", createdAt: admin.firestore.FieldValue.serverTimestamp() });
    return res.status(201).json({ uid, email, role: "admin" });
  } catch (err) {
    return res.status(500).json({ error: "Failed to create admin user", details: String(err) });
  }
});

router.get("/me", verifyToken, async (req: AuthRequest, res) => {
  try {
    const uid = req.user.uid;
    const doc = await db.collection("users").doc(uid).get();
    const data = doc.exists ? doc.data() : null;
    return res.json({ uid, claims: req.user, profile: data });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

export default router;

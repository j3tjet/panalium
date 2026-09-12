import { Request, Response, NextFunction } from "express";
import { admin } from "../firebaseAdmin";

export interface AuthRequest extends Request {
  user?: any;
}

export async function verifyToken(req: AuthRequest, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return res.status(401).json({ error: "No token provided" });
  const idToken = auth.split(" ")[1];
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = decoded; // contains uid and custom claims
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido", details: String(err) });
  }
}

export function requireRole(role: string) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "No autorizado" });
    const userRole = user.role || user.role || (user.firebase && user.firebase.sign_in_provider ? user.role : undefined);
    // custom claims are available directly on decoded token
    const claimRole = (req.user && req.user.role) || (req.user && req.user.roles) || req.user.claims;
    if (req.user.role === role || (Array.isArray(claimRole) ? claimRole.includes(role) : claimRole === role)) return next();
    return res.status(403).json({ error: "Forbidden - role required" });
  };
}

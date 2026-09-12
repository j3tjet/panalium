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

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "No autorizado" });
    // decoded token contains custom claims directly, e.g. decoded.role
    const claimRole = (user && (user.role || user.roleId || user['role'])) as string | undefined;
    if (!claimRole) return res.status(403).json({ error: "Forbidden - role required" });
    if (roles.includes(claimRole)) return next();
    return res.status(403).json({ error: "Forbidden - insufficient role" });
  };
}

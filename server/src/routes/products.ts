import { Router } from "express";
import multer from "multer";
import { admin, db } from "../firebaseAdmin";
import { verifyToken, requireRole, AuthRequest } from "../middleware/auth";

interface ProductInput {
  description: string;
  link: string;
  minQuantity: number;
  unitPrice: number;
}

interface ProductRecord extends ProductInput {
  photoUrl: string;
  photoPath: string;
  createdBy: string;
  createdAt: unknown;
  updatedAt: unknown;
}

interface ProductResponse extends ProductInput {
  id: string;
  photoUrl: string;
  createdBy: string;
  createdAt: string | null;
  updatedAt: string | null;
}

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.use(verifyToken, requireRole("buyer"));

function parseRequiredString(value: unknown, fieldName: string): string {
  if (typeof value !== "string") {
    throw new Error(`${fieldName} is required`);
  }

  const trimmedValue = value.trim();
  if (!trimmedValue) {
    throw new Error(`${fieldName} is required`);
  }

  return trimmedValue;
}

function parseRequiredInteger(value: unknown, fieldName: string): number {
  const parsedValue = Number(value);
  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new Error(`${fieldName} must be a positive integer`);
  }

  return parsedValue;
}

function parseRequiredNumber(value: unknown, fieldName: string): number {
  const parsedValue = Number(value);
  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    throw new Error(`${fieldName} must be a positive number`);
  }

  return parsedValue;
}

function timestampToIso(value: unknown): string | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const timestampLike = value as { toDate?: () => Date };
  if (typeof timestampLike.toDate !== "function") {
    return null;
  }

  return timestampLike.toDate().toISOString();
}

function serializeProduct(id: string, data: Record<string, unknown>): ProductResponse {
  return {
    id,
    photoUrl: String(data.photoUrl ?? ""),
    description: String(data.description ?? ""),
    link: String(data.link ?? ""),
    minQuantity: Number(data.minQuantity ?? 0),
    unitPrice: Number(data.unitPrice ?? 0),
    createdBy: String(data.createdBy ?? ""),
    createdAt: timestampToIso(data.createdAt),
    updatedAt: timestampToIso(data.updatedAt),
  };
}

async function storeProductImage(file: Express.Multer.File, createdBy: string) {
  const bucketName = process.env.FIREBASE_STORAGE_BUCKET;
  if (bucketName) {
    try {
      const bucket = admin.storage().bucket(bucketName);
      const safeFileName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
      const photoPath = `products/${createdBy}/${Date.now()}-${safeFileName}`;
      const storageFile = bucket.file(photoPath);

      await storageFile.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
        resumable: false,
      });

      const [signedUrl] = await storageFile.getSignedUrl({
        action: "read",
        expires: new Date("2099-12-31T23:59:59.000Z"),
      });

      return { photoUrl: signedUrl, photoPath };
    } catch (error) {
      console.warn(`Falling back to inline photoUrl because Storage upload failed: ${String(error)}`);
    }
  }

  return {
    photoUrl: `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
    photoPath: "",
  };
}

router.get("/", async (_req: AuthRequest, res) => {
  try {
    const snapshot = await db.collection("products").orderBy("createdAt", "desc").get();
    const products = snapshot.docs.map((doc) => serializeProduct(doc.id, doc.data()));
    return res.json({ items: products });
  } catch (error) {
    return res.status(500).json({ error: "Failed to load products", details: String(error) });
  }
});

router.get("/:id", async (req: AuthRequest, res) => {
  try {
    const productId = req.params.id;
    const doc = await db.collection("products").doc(productId).get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.json({ item: serializeProduct(doc.id, doc.data() ?? {}) });
  } catch (error) {
    return res.status(500).json({ error: "Failed to load product", details: String(error) });
  }
});

router.post("/", upload.single("photo"), async (req: AuthRequest, res) => {
  try {
    const user = req.user;
    if (!user?.uid) {
      return res.status(401).json({ error: "No autorizado" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "photo is required" });
    }

    const description = parseRequiredString(req.body.description, "description");
    const link = parseRequiredString(req.body.link, "link");
    const minQuantity = parseRequiredInteger(req.body.minQuantity, "minQuantity");
    const unitPrice = parseRequiredNumber(req.body.unitPrice, "unitPrice");

    const { photoUrl, photoPath } = await storeProductImage(req.file, user.uid);
    const createdAt = admin.firestore.FieldValue.serverTimestamp();

    const productData: Omit<ProductRecord, "createdAt" | "updatedAt"> & {
      createdAt: unknown;
      updatedAt: unknown;
    } = {
      photoUrl,
      photoPath,
      description,
      link,
      minQuantity,
      unitPrice,
      createdBy: user.uid,
      createdAt,
      updatedAt: null,
    };

    const docRef = await db.collection("products").add(productData);
    const createdDoc = await docRef.get();

    return res.status(201).json({ item: serializeProduct(createdDoc.id, createdDoc.data() ?? {}) });
  } catch (error) {
    return res.status(400).json({ error: "Failed to create product", details: String(error) });
  }
});

router.put("/:id", upload.single("photo"), async (req: AuthRequest, res) => {
  try {
    const user = req.user;
    if (!user?.uid) {
      return res.status(401).json({ error: "No autorizado" });
    }

    const productId = req.params.id;
    const docRef = db.collection("products").doc(productId);
    const currentDoc = await docRef.get();

    if (!currentDoc.exists) {
      return res.status(404).json({ error: "Product not found" });
    }

    const currentData = currentDoc.data() ?? {};
    const nextDescription = req.body.description ? parseRequiredString(req.body.description, "description") : String(currentData.description ?? "");
    const nextLink = req.body.link ? parseRequiredString(req.body.link, "link") : String(currentData.link ?? "");
    const nextMinQuantity = req.body.minQuantity ? parseRequiredInteger(req.body.minQuantity, "minQuantity") : Number(currentData.minQuantity ?? 0);
    const nextUnitPrice = req.body.unitPrice ? parseRequiredNumber(req.body.unitPrice, "unitPrice") : Number(currentData.unitPrice ?? 0);

    let nextPhotoUrl = String(currentData.photoUrl ?? "");
    let nextPhotoPath = String(currentData.photoPath ?? "");

    if (req.file) {
      const uploadedImage = await storeProductImage(req.file, user.uid);
      nextPhotoUrl = uploadedImage.photoUrl;
      nextPhotoPath = uploadedImage.photoPath;

      if (currentData.photoPath && process.env.FIREBASE_STORAGE_BUCKET) {
        try {
          await admin.storage().bucket(process.env.FIREBASE_STORAGE_BUCKET).file(String(currentData.photoPath)).delete({ ignoreNotFound: true });
        } catch (error) {
          console.warn(`Could not delete old product image: ${String(error)}`);
        }
      }
    }

    const updateData = {
      photoUrl: nextPhotoUrl,
      photoPath: nextPhotoPath,
      description: nextDescription,
      link: nextLink,
      minQuantity: nextMinQuantity,
      unitPrice: nextUnitPrice,
      createdBy: String(currentData.createdBy ?? user.uid),
      createdAt: currentData.createdAt ?? admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await docRef.set(updateData, { merge: true });
    const updatedDoc = await docRef.get();

    return res.json({ item: serializeProduct(updatedDoc.id, updatedDoc.data() ?? {}) });
  } catch (error) {
    return res.status(400).json({ error: "Failed to update product", details: String(error) });
  }
});

router.delete("/:id", async (req: AuthRequest, res) => {
  try {
    const productId = req.params.id;
    const docRef = db.collection("products").doc(productId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Product not found" });
    }

    const data = doc.data() ?? {};
    if (data.photoPath && process.env.FIREBASE_STORAGE_BUCKET) {
      try {
        await admin.storage().bucket(process.env.FIREBASE_STORAGE_BUCKET).file(String(data.photoPath)).delete({ ignoreNotFound: true });
      } catch (error) {
        console.warn(`Could not delete product image: ${String(error)}`);
      }
    }

    await docRef.delete();
    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ error: "Failed to delete product", details: String(error) });
  }
});

export default router;
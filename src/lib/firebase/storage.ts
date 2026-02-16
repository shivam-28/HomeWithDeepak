import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { getClientDb } from "./config";

function getClientStorage() {
  // Storage uses the same app as Firestore
  const db = getClientDb();
  return getStorage(db.app);
}

export async function uploadPropertyImage(
  propertyId: string,
  file: File
): Promise<string> {
  const storage = getClientStorage();
  const filename = `${Date.now()}_${file.name}`;
  const storageRef = ref(storage, `properties/${propertyId}/${filename}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function deletePropertyImage(imageUrl: string): Promise<void> {
  const storage = getClientStorage();
  const storageRef = ref(storage, imageUrl);
  try {
    await deleteObject(storageRef);
  } catch {
    // Image may already be deleted from storage
    console.warn("Could not delete image from storage:", imageUrl);
  }
}

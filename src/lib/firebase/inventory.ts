import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  getDoc,
  Timestamp,
  Unsubscribe,
} from "firebase/firestore";
import { getClientDb } from "./config";
import { Property, PropertyFormData, PropertyStatus, Lead } from "@/types";

const PROPERTIES_COLLECTION = "properties";

function propertiesRef() {
  return collection(getClientDb(), PROPERTIES_COLLECTION);
}

function propertyDocRef(id: string) {
  return doc(getClientDb(), PROPERTIES_COLLECTION, id);
}

export function subscribeToProperties(
  uid: string,
  callback: (properties: Property[]) => void
): Unsubscribe {
  const q = query(
    propertiesRef(),
    where("uid", "==", uid),
    orderBy("updated_at", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    const properties = snapshot.docs.map(
      (d) => ({ id: d.id, ...d.data() } as Property)
    );
    callback(properties);
  });
}

export function subscribeToAllProperties(
  callback: (properties: Property[]) => void
): Unsubscribe {
  const q = query(propertiesRef(), orderBy("updated_at", "desc"));
  return onSnapshot(q, (snapshot) => {
    const properties = snapshot.docs.map(
      (d) => ({ id: d.id, ...d.data() } as Property)
    );
    callback(properties);
  });
}

export async function getProperty(id: string): Promise<Property | null> {
  const docSnap = await getDoc(propertyDocRef(id));
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as Property;
}

export async function addProperty(
  uid: string,
  data: PropertyFormData,
  email?: string | null
): Promise<string> {
  const now = Timestamp.now();
  const docRef = await addDoc(propertiesRef(), {
    uid,
    ...(email ? { created_by_email: email } : {}),
    ...data,
    carpet_area_sqft: Number(data.carpet_area_sqft) || 0,
    price: Number(data.price) || 0,
    price_per_sqft: Number(data.price_per_sqft) || 0,
    latitude: data.latitude ? Number(data.latitude) : "",
    longitude: data.longitude ? Number(data.longitude) : "",
    google_maps_link: data.google_maps_link || "",
    images: data.images || [],
    created_at: now,
    updated_at: now,
  });
  return docRef.id;
}

export async function updateProperty(
  id: string,
  data: Partial<PropertyFormData>
): Promise<void> {
  const updateData: Record<string, unknown> = {
    ...data,
    updated_at: Timestamp.now(),
  };
  if (data.carpet_area_sqft !== undefined) {
    updateData.carpet_area_sqft = Number(data.carpet_area_sqft) || 0;
  }
  if (data.price !== undefined) {
    updateData.price = Number(data.price) || 0;
  }
  if (data.price_per_sqft !== undefined) {
    updateData.price_per_sqft = Number(data.price_per_sqft) || 0;
  }
  await updateDoc(propertyDocRef(id), updateData);
}

export async function updatePropertyStatus(
  id: string,
  status: PropertyStatus
): Promise<void> {
  await updateDoc(propertyDocRef(id), {
    status,
    updated_at: Timestamp.now(),
  });
}

export async function deleteProperty(id: string): Promise<void> {
  await deleteDoc(propertyDocRef(id));
}

export async function updatePropertyImages(
  id: string,
  images: string[]
): Promise<void> {
  await updateDoc(propertyDocRef(id), {
    images,
    updated_at: Timestamp.now(),
  });
}

export async function markPropertySold(
  id: string,
  soldToLeadId?: string,
  soldPrice?: number
): Promise<void> {
  await updateDoc(propertyDocRef(id), {
    status: "Sold" as PropertyStatus,
    ...(soldToLeadId ? { sold_to_lead_id: soldToLeadId } : {}),
    ...(soldPrice ? { sold_price: soldPrice } : {}),
    sold_date: new Date().toISOString().split("T")[0],
    updated_at: Timestamp.now(),
  });
}

export function subscribeToLeadsByProperty(
  propertyId: string,
  callback: (leads: Lead[]) => void
): Unsubscribe {
  const leadsCol = collection(getClientDb(), "leads");
  const q = query(
    leadsCol,
    where("linked_property_id", "==", propertyId)
  );
  return onSnapshot(q, (snapshot) => {
    const leads = snapshot.docs.map(
      (d) => ({ id: d.id, ...d.data() } as Lead)
    );
    callback(leads);
  });
}

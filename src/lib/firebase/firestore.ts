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
import { Lead, LeadFormData, Note } from "@/types";

const LEADS_COLLECTION = "leads";

function leadsRef() {
  return collection(getClientDb(), LEADS_COLLECTION);
}

function leadDocRef(id: string) {
  return doc(getClientDb(), LEADS_COLLECTION, id);
}

export function subscribeToLeads(
  uid: string,
  callback: (leads: Lead[]) => void
): Unsubscribe {
  const q = query(
    leadsRef(),
    where("uid", "==", uid),
    orderBy("updated_at", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    const leads = snapshot.docs.map(
      (d) => ({ id: d.id, ...d.data() } as Lead)
    );
    callback(leads);
  });
}

export async function getLead(id: string): Promise<Lead | null> {
  const docSnap = await getDoc(leadDocRef(id));
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as Lead;
}

export async function addLead(uid: string, data: LeadFormData): Promise<string> {
  const now = Timestamp.now();
  const docRef = await addDoc(leadsRef(), {
    uid,
    ...data,
    follow_up_call: data.follow_up_call
      ? Timestamp.fromDate(data.follow_up_call)
      : null,
    notes: [],
    created_at: now,
    updated_at: now,
  });
  return docRef.id;
}

export async function updateLead(
  id: string,
  data: Partial<LeadFormData>
): Promise<void> {
  const updateData: Record<string, unknown> = {
    ...data,
    updated_at: Timestamp.now(),
  };
  if (data.follow_up_call !== undefined) {
    updateData.follow_up_call = data.follow_up_call
      ? Timestamp.fromDate(data.follow_up_call)
      : null;
  }
  await updateDoc(leadDocRef(id), updateData);
}

export async function deleteLead(id: string): Promise<void> {
  await deleteDoc(leadDocRef(id));
}

export async function addNote(leadId: string, text: string): Promise<void> {
  const lead = await getLead(leadId);
  if (!lead) return;
  const note: Note = {
    id: crypto.randomUUID(),
    text,
    created_at: Timestamp.now(),
  };
  await updateDoc(leadDocRef(leadId), {
    notes: [...lead.notes, note],
    updated_at: Timestamp.now(),
  });
}

export async function logVisit(leadId: string): Promise<void> {
  const lead = await getLead(leadId);
  if (!lead) return;
  await updateDoc(leadDocRef(leadId), {
    property_visit: true,
    visit_no: lead.visit_no + 1,
    status: lead.status === "New" || lead.status === "In Progress" ? "Visited" : lead.status,
    updated_at: Timestamp.now(),
  });
}

export async function rescheduleFollowUp(
  leadId: string,
  date: Date
): Promise<void> {
  await updateDoc(leadDocRef(leadId), {
    follow_up_call: Timestamp.fromDate(date),
    updated_at: Timestamp.now(),
  });
}

export async function clearFollowUp(leadId: string): Promise<void> {
  await updateDoc(leadDocRef(leadId), {
    follow_up_call: null,
    updated_at: Timestamp.now(),
  });
}

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

export function subscribeToAllLeads(
  callback: (leads: Lead[]) => void
): Unsubscribe {
  const q = query(leadsRef(), orderBy("updated_at", "desc"));
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

export async function addLead(uid: string, data: LeadFormData, email?: string | null): Promise<string> {
  const now = Timestamp.now();
  const docRef = await addDoc(leadsRef(), {
    uid,
    ...(email ? { created_by_email: email } : {}),
    ...data,
    follow_up_call: data.follow_up_call
      ? Timestamp.fromDate(data.follow_up_call)
      : null,
    lead_source: data.lead_source || "",
    customer_requirements: data.customer_requirements || null,
    linked_property_id: data.linked_property_id || null,
    deal_amount: data.deal_amount ? Number(data.deal_amount) : null,
    closing_remarks: data.closing_remarks || "",
    lost_reason: data.lost_reason || "",
    lost_remarks: data.lost_remarks || "",
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
  if (data.customer_requirements !== undefined) {
    updateData.customer_requirements = data.customer_requirements || null;
  }
  if (data.linked_property_id !== undefined) {
    updateData.linked_property_id = data.linked_property_id || null;
  }
  if (data.deal_amount !== undefined) {
    updateData.deal_amount = data.deal_amount ? Number(data.deal_amount) : null;
  }
  if (data.closing_remarks !== undefined) {
    updateData.closing_remarks = data.closing_remarks || "";
  }
  if (data.lost_reason !== undefined) {
    updateData.lost_reason = data.lost_reason || "";
  }
  if (data.lost_remarks !== undefined) {
    updateData.lost_remarks = data.lost_remarks || "";
  }
  if (data.lead_source !== undefined) {
    updateData.lead_source = data.lead_source || "";
  }
  await updateDoc(leadDocRef(id), updateData);
}

export async function linkPropertyToLead(
  leadId: string,
  propertyId: string
): Promise<void> {
  await updateDoc(leadDocRef(leadId), {
    linked_property_id: propertyId,
    updated_at: Timestamp.now(),
  });
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

export async function closeLeadWon(
  leadId: string,
  dealAmount?: number,
  remarks?: string
): Promise<void> {
  await updateDoc(leadDocRef(leadId), {
    status: "Closed Won",
    ...(dealAmount ? { deal_amount: dealAmount } : {}),
    ...(remarks ? { closing_remarks: remarks } : {}),
    updated_at: Timestamp.now(),
  });
}

export async function closeLeadLost(
  leadId: string,
  lostReason: string,
  remarks?: string
): Promise<void> {
  await updateDoc(leadDocRef(leadId), {
    status: "Closed Lost",
    lost_reason: lostReason,
    ...(remarks ? { lost_remarks: remarks } : {}),
    updated_at: Timestamp.now(),
  });
}

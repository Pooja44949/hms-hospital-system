import type { HospitalStore } from "./types";

const pastDate = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
};

const futureDate = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

export const initialData: HospitalStore = {
  hospitalInfo: {
    name: "City Hospital",
    address: "12 MG Road, New Delhi",
  },
  activeRole: "Admin",
  patients: [
    { id: "p1", fullName: "Ravi Sharma", gender: "Male", dob: "1985-04-12", phone: "9876543210", email: "ravi@example.com", address: "42 Park Street", bloodGroup: "O+", allergies: ["Penicillin"], registeredAt: pastDate(100) },
    { id: "p2", fullName: "Priya Singh", gender: "Female", dob: "1992-11-23", phone: "9876543211", email: "priya@example.com", address: "88 Lake Road", bloodGroup: "A-", allergies: [], registeredAt: pastDate(80) },
    { id: "p3", fullName: "Amit Kumar", gender: "Male", dob: "1978-08-05", phone: "9876543212", email: "amit@example.com", address: "19 Gandhi Lane", bloodGroup: "B+", allergies: ["Peanuts"], registeredAt: pastDate(60) },
    { id: "p4", fullName: "Neha Patel", gender: "Female", dob: "1990-02-15", phone: "9876543213", email: "neha@example.com", address: "55 Garden Road", bloodGroup: "AB+", allergies: [], registeredAt: pastDate(50) },
  ],
  doctors: [
    { id: "d1", fullName: "Raj Mehta", specialization: "General Medicine", phone: "9876540201", email: "raj@cityhospital.in", department: "Internal Medicine", joinedAt: pastDate(1000) },
    { id: "d2", fullName: "Anita Rao", specialization: "Endocrinology", phone: "9876540202", email: "anita@cityhospital.in", department: "Endocrinology", joinedAt: pastDate(1200) },
    { id: "d3", fullName: "Suresh Iyer", specialization: "Oncology", phone: "9876540203", email: "suresh@cityhospital.in", department: "Oncology", joinedAt: pastDate(1100) },
    { id: "d4", fullName: "Pooja Nair", specialization: "Immunology", phone: "9876540204", email: "pooja@cityhospital.in", department: "Immunology", joinedAt: pastDate(900) },
  ],
  staff: [
    { id: "s1", fullName: "Meena Joshi", role: "Nurse", department: "Emergency", phone: "9876540301", email: "meena@cityhospital.in" },
    { id: "s2", fullName: "Vikram Das", role: "Admin", department: "Administration", phone: "9876540302", email: "vikram@cityhospital.in" },
  ],
  appointments: [
    { id: "a1", patientId: "p1", doctorId: "d1", dateTime: futureDate(1), reason: "Routine Checkup", status: "Scheduled" },
    { id: "a2", patientId: "p2", doctorId: "d2", dateTime: pastDate(1), reason: "Blood test follow-up", status: "Completed" },
    { id: "a3", patientId: "p3", doctorId: "d3", dateTime: futureDate(2), reason: "Consultation", status: "Scheduled" },
  ],
  admissions: [
    { id: "ad1", patientId: "p4", ward: "General", bed: "101", admittedAt: pastDate(2), dischargedAt: null, reason: "Fever and weakness", attendingDoctorId: "d1", status: "Active" },
  ],
  treatments: [
    { id: "t1", patientId: "p2", doctorId: "d2", date: pastDate(1), diagnosis: "Vitamin D Deficiency", prescription: "Vitamin D 50000 IU", notes: "Take once a week." },
  ],
  surgeries: [
    { id: "su1", patientId: "p3", surgeonId: "d3", otRoom: "OT 1", dateTime: futureDate(5), procedure: "Biopsy", status: "Scheduled" },
  ],
};

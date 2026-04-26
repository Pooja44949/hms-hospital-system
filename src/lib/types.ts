import { z } from "zod";

export const patientSchema = z.object({
  id: z.string(),
  fullName: z.string().min(1, "Name is required"),
  gender: z.enum(["Male", "Female", "Other"]),
  dob: z.string().min(1, "Date of birth is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().min(1, "Address is required"),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"]),
  allergies: z.array(z.string()),
  registeredAt: z.string(),
});

export type Patient = z.infer<typeof patientSchema>;

export const doctorSchema = z.object({
  id: z.string(),
  fullName: z.string().min(1, "Name is required"),
  specialization: z.string().min(1, "Specialization is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  department: z.string().min(1, "Department is required"),
  joinedAt: z.string(),
});

export type Doctor = z.infer<typeof doctorSchema>;

export const staffSchema = z.object({
  id: z.string(),
  fullName: z.string().min(1, "Name is required"),
  role: z.enum(["Admin", "Doctor", "Nurse", "Receptionist", "Lab Technician", "Pharmacist"]),
  department: z.string().min(1, "Department is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
});

export type Staff = z.infer<typeof staffSchema>;

export const appointmentSchema = z.object({
  id: z.string(),
  patientId: z.string().min(1, "Patient is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  dateTime: z.string().min(1, "Date/Time is required"),
  reason: z.string().min(1, "Reason is required"),
  status: z.enum(["Scheduled", "Completed", "Cancelled", "No-show"]),
});

export type Appointment = z.infer<typeof appointmentSchema>;

export const admissionSchema = z.object({
  id: z.string(),
  patientId: z.string().min(1, "Patient is required"),
  ward: z.string().min(1, "Ward is required"),
  bed: z.string().min(1, "Bed is required"),
  admittedAt: z.string().min(1, "Admission date is required"),
  dischargedAt: z.string().nullable(),
  reason: z.string().min(1, "Reason is required"),
  attendingDoctorId: z.string().min(1, "Attending doctor is required"),
  status: z.enum(["Active", "Discharged", "Transferred"]),
});

export type Admission = z.infer<typeof admissionSchema>;

export const treatmentSchema = z.object({
  id: z.string(),
  patientId: z.string().min(1, "Patient is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  date: z.string().min(1, "Date is required"),
  diagnosis: z.string().min(1, "Diagnosis is required"),
  prescription: z.string().min(1, "Prescription is required"),
  notes: z.string(),
});

export type Treatment = z.infer<typeof treatmentSchema>;

export const surgerySchema = z.object({
  id: z.string(),
  patientId: z.string().min(1, "Patient is required"),
  surgeonId: z.string().min(1, "Surgeon is required"),
  otRoom: z.string().min(1, "OT Room is required"),
  dateTime: z.string().min(1, "Date/Time is required"),
  procedure: z.string().min(1, "Procedure is required"),
  status: z.enum(["Scheduled", "InProgress", "Completed", "Cancelled"]),
});

export type Surgery = z.infer<typeof surgerySchema>;

export type HospitalStore = {
  patients: Patient[];
  doctors: Doctor[];
  staff: Staff[];
  appointments: Appointment[];
  admissions: Admission[];
  treatments: Treatment[];
  surgeries: Surgery[];
  activeRole: Staff["role"];
  hospitalInfo: { name: string; address: string };
};

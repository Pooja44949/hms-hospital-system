import { useMemo } from "react";
import { useStore } from "./store";

export type NotificationItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "appointment" | "surgery" | "admission" | "treatment";
  href: string;
};

const formatRelative = (iso: string): string => {
  const target = new Date(iso).getTime();
  const now = Date.now();
  const diffMs = target - now;
  const absMs = Math.abs(diffMs);
  const min = Math.round(absMs / 60000);
  const hr = Math.round(absMs / 3600000);
  const day = Math.round(absMs / 86400000);
  const future = diffMs > 0;
  if (min < 60) return future ? `in ${min}m` : `${min}m ago`;
  if (hr < 24) return future ? `in ${hr}h` : `${hr}h ago`;
  return future ? `in ${day}d` : `${day}d ago`;
};

export function useNotifications() {
  const { patients, doctors, appointments, surgeries, admissions } = useStore();

  return useMemo<NotificationItem[]>(() => {
    const items: NotificationItem[] = [];
    const now = Date.now();
    const horizon = now + 1000 * 60 * 60 * 24 * 7;

    const patientName = (id: string) => patients.find((p) => p.id === id)?.fullName || "Unknown";
    const doctorName = (id: string) => doctors.find((d) => d.id === id)?.fullName || "Unknown";

    appointments
      .filter((a) => a.status === "Scheduled")
      .forEach((a) => {
        const t = new Date(a.dateTime).getTime();
        if (t >= now - 1000 * 60 * 60 && t <= horizon) {
          items.push({
            id: `apt-${a.id}`,
            type: "appointment",
            title: `Appointment: ${patientName(a.patientId)}`,
            description: `With Dr. ${doctorName(a.doctorId)} • ${a.reason}`,
            time: formatRelative(a.dateTime),
            href: "/appointments",
          });
        }
      });

    surgeries
      .filter((s) => s.status === "Scheduled" || s.status === "InProgress")
      .forEach((s) => {
        items.push({
          id: `sur-${s.id}`,
          type: "surgery",
          title: `${s.status === "InProgress" ? "Ongoing" : "Upcoming"} Surgery`,
          description: `${s.procedure} • ${patientName(s.patientId)} • ${s.otRoom}`,
          time: formatRelative(s.dateTime),
          href: "/surgeries",
        });
      });

    admissions
      .filter((a) => a.status === "Active")
      .forEach((a) => {
        items.push({
          id: `adm-${a.id}`,
          type: "admission",
          title: `Active Admission`,
          description: `${patientName(a.patientId)} • Ward ${a.ward} • Bed ${a.bed}`,
          time: formatRelative(a.admittedAt),
          href: "/admissions",
        });
      });

    return items.sort((a, b) => a.time.localeCompare(b.time));
  }, [patients, doctors, appointments, surgeries, admissions]);
}

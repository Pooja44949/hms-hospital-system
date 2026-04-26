import { useState, useEffect, useCallback } from "react";
import type { HospitalStore, Patient, Doctor, Staff, Appointment, Admission, Treatment, Surgery } from "./types";
import { initialData } from "./seed";

const STORE_KEY = "hms_store_v2";

// Simple pub/sub for cross-tab and cross-component syncing
const listeners = new Set<() => void>();
const emitChange = () => listeners.forEach((l) => l());

const getStore = (): HospitalStore => {
  try {
    const data = localStorage.getItem(STORE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Failed to parse store", e);
  }
  
  // Seed initial data if nothing exists
  localStorage.setItem(STORE_KEY, JSON.stringify(initialData));
  return initialData;
};

const setStore = (update: Partial<HospitalStore> | ((prev: HospitalStore) => Partial<HospitalStore>)) => {
  const prev = getStore();
  const nextPartial = typeof update === "function" ? update(prev) : update;
  const next = { ...prev, ...nextPartial };
  localStorage.setItem(STORE_KEY, JSON.stringify(next));
  emitChange();
};

export const useStore = () => {
  const [store, setLocalStore] = useState<HospitalStore>(getStore());

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORE_KEY) setLocalStore(getStore());
    };
    
    const handleChange = () => setLocalStore(getStore());

    window.addEventListener("storage", handleStorage);
    listeners.add(handleChange);
    return () => {
      window.removeEventListener("storage", handleStorage);
      listeners.delete(handleChange);
    };
  }, []);

  const generateId = () => Math.random().toString(36).substring(2, 9);

  // CRUD actions
  const addPatient = useCallback((data: Omit<Patient, "id" | "registeredAt">) => {
    setStore((prev) => ({
      patients: [...prev.patients, { ...data, id: generateId(), registeredAt: new Date().toISOString() }],
    }));
  }, []);

  const updatePatient = useCallback((id: string, data: Partial<Patient>) => {
    setStore((prev) => ({
      patients: prev.patients.map((p) => (p.id === id ? { ...p, ...data } : p)),
    }));
  }, []);

  const deletePatient = useCallback((id: string) => {
    setStore((prev) => ({
      patients: prev.patients.filter((p) => p.id !== id),
    }));
  }, []);

  return {
    ...store,
    setStore,
    addPatient,
    updatePatient,
    deletePatient,
    // Add other generic CRUD methods dynamically
    addRecord: <K extends keyof Omit<HospitalStore, "activeRole" | "hospitalInfo">>(
      key: K,
      data: Omit<HospitalStore[K][number], "id">
    ) => {
      setStore((prev) => ({
        [key]: [...prev[key], { ...data, id: generateId() }],
      }));
    },
    updateRecord: <K extends keyof Omit<HospitalStore, "activeRole" | "hospitalInfo">>(
      key: K,
      id: string,
      data: Partial<HospitalStore[K][number]>
    ) => {
      setStore((prev) => ({
        [key]: (prev[key] as any[]).map((item: any) => (item.id === id ? { ...item, ...data } : item)),
      }));
    },
    deleteRecord: <K extends keyof Omit<HospitalStore, "activeRole" | "hospitalInfo">>(
      key: K,
      id: string
    ) => {
      setStore((prev) => ({
        [key]: (prev[key] as any[]).filter((item: any) => item.id !== id),
      }));
    },
  };
};

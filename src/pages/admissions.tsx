import { useState } from "react";
import { useStore } from "@/lib/store";
import { Bed, Plus, Search, Activity, User, DoorOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { admissionSchema } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const formSchema = admissionSchema.omit({ id: true, status: true, dischargedAt: true });

export default function Admissions() {
  const { admissions, addRecord, updateRecord, patients, doctors } = useStore();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const filteredAdmissions = admissions.filter(a => {
    const patient = patients.find(p => p.id === a.patientId);
    return patient?.fullName.toLowerCase().includes(search.toLowerCase()) || 
           a.ward.toLowerCase().includes(search.toLowerCase()) ||
           a.bed.toLowerCase().includes(search.toLowerCase());
  }).sort((a, b) => new Date(b.admittedAt).getTime() - new Date(a.admittedAt).getTime());

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: "",
      ward: "",
      bed: "",
      admittedAt: new Date().toISOString().slice(0, 16),
      reason: "",
      attendingDoctorId: "",
    }
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    addRecord("admissions", { ...data, status: "Active", dischargedAt: null });
    setOpen(false);
    form.reset();
    toast({ title: "Success", description: "Patient admitted successfully." });
  };

  const handleDischarge = (id: string) => {
    updateRecord("admissions", id, { status: "Discharged", dischargedAt: new Date().toISOString() });
    toast({ title: "Discharged", description: `Patient has been discharged.` });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Inpatient Admissions</h1>
          <p className="text-muted-foreground text-sm">Manage ward assignments and bed tracking.</p>
        </div>
        <div className="flex w-full sm:w-auto gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search patient or ward..." 
              className="pl-9 bg-background"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="shrink-0"><Plus className="h-4 w-4 mr-2" /> New Admission</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <Bed className="h-5 w-5 text-primary" />
                  Admit Patient
                </DialogTitle>
                <DialogDescription>
                  Assign a patient to a ward and bed.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-4">
                  <FormField control={form.control} name="patientId" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {patients.map(p => <SelectItem key={p.id} value={p.id}>{p.fullName}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="ward" render={({ field }) => (
                      <FormItem><FormLabel>Ward</FormLabel><FormControl><Input placeholder="e.g. ICU, General" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="bed" render={({ field }) => (
                      <FormItem><FormLabel>Bed Number</FormLabel><FormControl><Input placeholder="e.g. 101-A" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="attendingDoctorId" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Attending Doctor</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select doctor" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {doctors.map(d => <SelectItem key={d.id} value={d.id}>Dr. {d.fullName}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="admittedAt" render={({ field }) => (
                    <FormItem><FormLabel>Admission Time</FormLabel><FormControl><Input type="datetime-local" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="reason" render={({ field }) => (
                    <FormItem><FormLabel>Reason for Admission</FormLabel><FormControl><Input placeholder="Primary complaint" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button type="submit">Admit Patient</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {filteredAdmissions.length === 0 ? (
        <Card className="border-dashed bg-muted/10">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Bed className="h-8 w-8 text-muted-foreground/60" />
            </div>
            <p className="text-lg font-medium text-foreground">No admissions found</p>
            <p className="text-sm mt-1 mb-4">Admit a patient to see them here.</p>
            <Button variant="outline" onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-2" /> New Admission</Button>
          </CardContent>
        </Card>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filteredAdmissions.map(adm => {
            const patient = patients.find(p => p.id === adm.patientId);
            const doctor = doctors.find(d => d.id === adm.attendingDoctorId);
            const isActive = adm.status === "Active";
            
            return (
              <motion.div key={adm.id} variants={item} className="h-full">
                <Card className={`h-full flex flex-col transition-all duration-200 ${isActive ? "border-primary/40 shadow-sm ring-1 ring-primary/10 hover:shadow-md" : "opacity-80 hover:opacity-100 bg-muted/5"}`}>
                  <div className={`h-1.5 w-full ${isActive ? "bg-primary" : "bg-muted-foreground/20"}`}></div>
                  <CardContent className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-4 gap-4">
                      <div className="flex items-start gap-3 min-w-0">
                        <Avatar className="h-10 w-10 mt-1 border bg-background shrink-0">
                          <AvatarFallback className={isActive ? "bg-primary/10 text-primary font-bold" : "bg-muted text-muted-foreground"}>
                            {patient?.fullName.substring(0, 2).toUpperCase() || "??"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <h3 className="font-bold text-lg leading-tight truncate">{patient?.fullName || "Unknown"}</h3>
                          <p className="text-sm font-medium text-muted-foreground mt-0.5 truncate">{adm.reason}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={`shrink-0 border ${isActive ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-muted text-muted-foreground border-muted"}`}>
                        {adm.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                      <div className={`p-3 rounded-lg border ${isActive ? "bg-primary/5 border-primary/10" : "bg-muted/30 border-transparent"}`}>
                        <p className="text-xs text-muted-foreground mb-0.5">Ward</p>
                        <p className="font-bold text-foreground">{adm.ward}</p>
                      </div>
                      <div className={`p-3 rounded-lg border ${isActive ? "bg-primary/5 border-primary/10" : "bg-muted/30 border-transparent"}`}>
                        <p className="text-xs text-muted-foreground mb-0.5">Bed</p>
                        <p className="font-bold text-foreground">{adm.bed}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm mb-6 flex-1">
                      <div className="flex items-center text-muted-foreground">
                        <User className="w-4 h-4 mr-2 shrink-0" />
                        <span className="truncate">Attending: <span className="font-medium text-foreground">Dr. {doctor?.fullName}</span></span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Activity className="w-4 h-4 mr-2 shrink-0" />
                        <span>Admitted: <span className="text-foreground">{new Date(adm.admittedAt).toLocaleDateString()}</span></span>
                      </div>
                      {adm.dischargedAt && (
                        <div className="flex items-center text-muted-foreground">
                          <DoorOpen className="w-4 h-4 mr-2 shrink-0" />
                          <span>Discharged: <span className="text-foreground">{new Date(adm.dischargedAt).toLocaleDateString()}</span></span>
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-4 border-t mt-auto">
                      {isActive ? (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" className="w-full text-foreground hover:border-foreground/30 group">
                              <DoorOpen className="w-4 h-4 mr-2 text-muted-foreground group-hover:text-foreground transition-colors" /> Discharge Patient
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Discharge Patient?</AlertDialogTitle>
                              <AlertDialogDescription>Are you sure you want to discharge {patient?.fullName} from {adm.ward} ward, bed {adm.bed}?</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction className="bg-primary hover:bg-primary/90" onClick={() => handleDischarge(adm.id)}>Confirm Discharge</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      ) : (
                        <Button variant="secondary" className="w-full" disabled>
                          Patient Discharged
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}

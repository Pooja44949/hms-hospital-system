import { useState } from "react";
import { useStore } from "@/lib/store";
import { CalendarDays, Plus, Search, CheckCircle, XCircle, Clock, User, Stethoscope } from "lucide-react";
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
import { appointmentSchema } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const formSchema = appointmentSchema.omit({ id: true, status: true });

export default function Appointments() {
  const { appointments, addRecord, updateRecord, patients, doctors } = useStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const filteredAppointments = appointments.filter(a => {
    const patient = patients.find(p => p.id === a.patientId);
    const matchesSearch = patient?.fullName.toLowerCase().includes(search.toLowerCase()) || 
                          a.reason.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: "",
      doctorId: "",
      dateTime: "",
      reason: "",
    }
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    addRecord("appointments", { ...data, status: "Scheduled" });
    setOpen(false);
    form.reset();
    toast({ title: "Success", description: "Appointment scheduled successfully." });
  };

  const handleStatusUpdate = (id: string, status: "Completed" | "Cancelled") => {
    updateRecord("appointments", id, { status });
    toast({ title: "Status Updated", description: `Appointment marked as ${status}.` });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch(status) {
      case "Scheduled": return "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100";
      case "Completed": return "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100";
      case "Cancelled": return "bg-red-100 text-red-800 border-red-200 hover:bg-red-100";
      case "No-show": return "bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-100";
      default: return "";
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Appointments</h1>
          <p className="text-muted-foreground text-sm">Schedule and manage patient visits.</p>
        </div>
        
        <div className="flex flex-wrap w-full sm:w-auto gap-3">
          <div className="relative flex-1 min-w-[200px] sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search reason or patient..." 
              className="pl-9 bg-background"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] bg-background">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Scheduled">Scheduled</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto"><Plus className="h-4 w-4 mr-2" /> Schedule</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  Schedule Appointment
                </DialogTitle>
                <DialogDescription>
                  Book a new visit for a patient with a specific doctor.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <FormField control={form.control} name="doctorId" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Doctor</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select doctor" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {doctors.map(d => <SelectItem key={d.id} value={d.id}>Dr. {d.fullName}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="dateTime" render={({ field }) => (
                    <FormItem><FormLabel>Date & Time</FormLabel><FormControl><Input type="datetime-local" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="reason" render={({ field }) => (
                    <FormItem><FormLabel>Reason for Visit</FormLabel><FormControl><Input placeholder="e.g. Annual Checkup" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button type="submit">Schedule Appointment</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <Card className="border-dashed bg-muted/10">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <CalendarDays className="h-8 w-8 text-muted-foreground/60" />
            </div>
            <p className="text-lg font-medium text-foreground">No appointments found</p>
            <p className="text-sm mt-1 mb-4">Try adjusting your filters or schedule a new one.</p>
            <Button variant="outline" onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-2" /> Schedule</Button>
          </CardContent>
        </Card>
      ) : (
        <motion.div className="space-y-3" variants={container} initial="hidden" animate="show">
          {filteredAppointments.map((apt) => {
            const patient = patients.find(p => p.id === apt.patientId);
            const doctor = doctors.find(d => d.id === apt.doctorId);
            const aptDate = new Date(apt.dateTime);
            
            return (
              <motion.div key={apt.id} variants={item}>
                <Card className="group overflow-hidden hover:shadow-md transition-all duration-200 border-l-4" style={{
                  borderLeftColor: apt.status === 'Scheduled' ? 'hsl(var(--primary))' : 
                                   apt.status === 'Completed' ? 'hsl(var(--success))' : 
                                   apt.status === 'Cancelled' ? 'hsl(var(--destructive))' : 'hsl(var(--muted))'
                }}>
                  <CardContent className="p-0 flex flex-col md:flex-row">
                    <div className="bg-muted/20 p-4 md:w-56 flex md:flex-col items-center md:items-start justify-between md:justify-center border-b md:border-b-0 md:border-r">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-lg font-bold text-foreground">{aptDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <span className="text-sm font-medium text-muted-foreground md:mt-1">{aptDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                      <div className="space-y-3 flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-lg leading-tight truncate">{patient?.fullName || "Unknown"}</h3>
                            <p className="text-sm text-foreground font-medium mt-0.5">{apt.reason}</p>
                          </div>
                          <Badge variant="outline" className={`ml-2 whitespace-nowrap border ${getStatusBadgeVariant(apt.status)}`}>
                            {apt.status}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground bg-muted/30 p-2 rounded-md w-fit">
                          <Stethoscope className="w-3.5 h-3.5 mr-1.5" /> Dr. {doctor?.fullName || "Unknown"}
                        </div>
                      </div>

                      {apt.status === "Scheduled" && (
                        <div className="flex gap-2 sm:flex-col justify-end shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 mt-3 sm:mt-0">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="flex-1 sm:w-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 border-emerald-200">
                                <CheckCircle className="w-4 h-4 mr-2" /> Complete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Mark as Completed?</AlertDialogTitle>
                                <AlertDialogDescription>Record this visit as successfully completed.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handleStatusUpdate(apt.id, "Completed")}>Confirm</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="flex-1 sm:w-full bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 border-red-200">
                                <XCircle className="w-4 h-4 mr-2" /> Cancel
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Cancel Appointment?</AlertDialogTitle>
                                <AlertDialogDescription>Are you sure you want to cancel this appointment?</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Back</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleStatusUpdate(apt.id, "Cancelled")} className="bg-destructive hover:bg-destructive/90">Cancel Appointment</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
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

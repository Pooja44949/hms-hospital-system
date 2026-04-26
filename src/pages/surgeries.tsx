import { useState } from "react";
import { useStore } from "@/lib/store";
import { Syringe, Plus, Search, Activity, User, Clock, CalendarDays, CheckCircle, XCircle, PlayCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { surgerySchema } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const formSchema = surgerySchema.omit({ id: true, status: true });

export default function Surgeries() {
  const { surgeries, addRecord, updateRecord, patients, doctors } = useStore();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const filteredSurgeries = surgeries.filter(s => {
    const patient = patients.find(p => p.id === s.patientId);
    return patient?.fullName.toLowerCase().includes(search.toLowerCase()) || 
           s.procedure.toLowerCase().includes(search.toLowerCase());
  }).sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: "",
      surgeonId: "",
      otRoom: "",
      dateTime: "",
      procedure: "",
    }
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    addRecord("surgeries", { ...data, status: "Scheduled" });
    setOpen(false);
    form.reset();
    toast({ title: "Success", description: "Surgery scheduled successfully." });
  };

  const updateStatus = (id: string, status: "Scheduled" | "InProgress" | "Completed" | "Cancelled") => {
    updateRecord("surgeries", id, { status });
    toast({ title: "Status Updated", description: `Surgery marked as ${status}.` });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Scheduled": return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Scheduled</Badge>;
      case "InProgress": return <Badge className="bg-amber-500 hover:bg-amber-600 shadow-sm animate-pulse">In Progress</Badge>;
      case "Completed": return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Completed</Badge>;
      case "Cancelled": return <Badge variant="destructive" className="bg-red-500/10 text-red-600 hover:bg-red-500/20 border-0">Cancelled</Badge>;
      default: return <Badge>{status}</Badge>;
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
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Surgical Procedures</h1>
          <p className="text-muted-foreground text-sm">Schedule and track operating theater procedures.</p>
        </div>
        <div className="flex w-full sm:w-auto gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search procedure or patient..." 
              className="pl-9 bg-background"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="shrink-0"><Plus className="h-4 w-4 mr-2" /> Schedule Surgery</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <Syringe className="h-5 w-5 text-primary" />
                  Schedule Surgery
                </DialogTitle>
                <DialogDescription>
                  Book an operating theater for a surgical procedure.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg border">
                    <FormField control={form.control} name="patientId" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patient</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger className="bg-background"><SelectValue placeholder="Select patient" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {patients.map(p => <SelectItem key={p.id} value={p.id}>{p.fullName}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="surgeonId" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Surgeon</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger className="bg-background"><SelectValue placeholder="Select surgeon" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {doctors.map(d => <SelectItem key={d.id} value={d.id}>Dr. {d.fullName}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="procedure" render={({ field }) => (
                    <FormItem><FormLabel>Surgical Procedure</FormLabel><FormControl><Input placeholder="e.g. Appendectomy" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="otRoom" render={({ field }) => (
                      <FormItem><FormLabel>OT Room</FormLabel><FormControl><Input placeholder="e.g. Theater 1" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="dateTime" render={({ field }) => (
                      <FormItem><FormLabel>Date & Time</FormLabel><FormControl><Input type="datetime-local" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button type="submit">Schedule</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {filteredSurgeries.length === 0 ? (
        <Card className="border-dashed bg-muted/10">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Syringe className="h-8 w-8 text-muted-foreground/60" />
            </div>
            <p className="text-lg font-medium text-foreground">No surgeries scheduled</p>
            <p className="text-sm mt-1 mb-4">Schedule a procedure to see it here.</p>
            <Button variant="outline" onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-2" /> Schedule Surgery</Button>
          </CardContent>
        </Card>
      ) : (
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-5"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filteredSurgeries.map(s => {
            const patient = patients.find(p => p.id === s.patientId);
            const surgeon = doctors.find(d => d.id === s.surgeonId);
            const sDate = new Date(s.dateTime);
            const isInProgress = s.status === "InProgress";
            
            return (
              <motion.div key={s.id} variants={item} className="h-full">
                <Card className={`h-full flex flex-col transition-all duration-200 ${isInProgress ? "border-amber-400 shadow-md ring-1 ring-amber-400/20" : "hover:shadow-sm"}`}>
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className={`p-4 border-b flex justify-between items-start gap-4 ${isInProgress ? 'bg-amber-50 dark:bg-amber-950/20' : 'bg-muted/10'}`}>
                      <div>
                        <h3 className="font-bold text-xl text-foreground mb-1 leading-tight">{s.procedure}</h3>
                        <p className="text-sm font-medium flex items-center text-muted-foreground">
                          <User className="w-3.5 h-3.5 mr-1.5" /> Patient: <span className="text-foreground ml-1">{patient?.fullName || "Unknown"}</span>
                        </p>
                      </div>
                      <div className="shrink-0">{getStatusBadge(s.status)}</div>
                    </div>
                    
                    <div className="p-5 grid grid-cols-2 gap-4 flex-1">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Surgeon</p>
                        <p className="font-medium text-foreground flex items-center">
                          <Syringe className="w-4 h-4 mr-2 text-primary/70" /> Dr. {surgeon?.fullName}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Location</p>
                        <p className="font-medium text-foreground flex items-center">
                          <Activity className="w-4 h-4 mr-2 text-primary/70" /> {s.otRoom}
                        </p>
                      </div>
                      <div className="space-y-1 col-span-2 pt-2">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Schedule</p>
                        <div className="flex flex-wrap gap-3">
                          <Badge variant="secondary" className="bg-muted text-foreground flex items-center px-2.5 py-1 text-sm font-medium border">
                            <CalendarDays className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                            {sDate.toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric' })}
                          </Badge>
                          <Badge variant="secondary" className="bg-primary/10 text-primary flex items-center px-2.5 py-1 text-sm font-bold border-0 hover:bg-primary/10">
                            <Clock className="w-3.5 h-3.5 mr-1.5" />
                            {sDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-muted/10 border-t mt-auto flex flex-wrap gap-2 justify-end">
                      {s.status === "Scheduled" && (
                        <>
                          <Button variant="outline" className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20" onClick={() => updateStatus(s.id, "Cancelled")}>Cancel</Button>
                          <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={() => updateStatus(s.id, "InProgress")}>Begin Procedure</Button>
                        </>
                      )}
                      {s.status === "InProgress" && (
                        <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700" onClick={() => updateStatus(s.id, "Completed")}>
                          <CheckCircle className="w-4 h-4 mr-2" /> Mark Completed
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

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Activity, Plus, Search, FileText, User, Pill } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { treatmentSchema } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { motion } from "framer-motion";

const formSchema = treatmentSchema.omit({ id: true });

export default function Treatments() {
  const { treatments, addRecord, patients, doctors } = useStore();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const filteredTreatments = treatments.filter(t => {
    const patient = patients.find(p => p.id === t.patientId);
    return patient?.fullName.toLowerCase().includes(search.toLowerCase()) || 
           t.diagnosis.toLowerCase().includes(search.toLowerCase());
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: "",
      doctorId: "",
      date: new Date().toISOString().split('T')[0],
      diagnosis: "",
      prescription: "",
      notes: "",
    }
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    addRecord("treatments", data);
    setOpen(false);
    form.reset();
    toast({ title: "Success", description: "Treatment logged successfully." });
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
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Clinical Treatments</h1>
          <p className="text-muted-foreground text-sm">Log diagnoses, prescriptions, and medical notes.</p>
        </div>
        <div className="flex w-full sm:w-auto gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search diagnosis or patient..." 
              className="pl-9 bg-background"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="shrink-0"><Plus className="h-4 w-4 mr-2" /> Log Treatment</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <Activity className="h-5 w-5 text-primary" />
                  Log New Treatment
                </DialogTitle>
                <DialogDescription>Record clinical findings and issue prescriptions.</DialogDescription>
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
                    <FormField control={form.control} name="doctorId" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Attending Doctor</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger className="bg-background"><SelectValue placeholder="Select doctor" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {doctors.map(d => <SelectItem key={d.id} value={d.id}>Dr. {d.fullName}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormField control={form.control} name="date" render={({ field }) => (
                      <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="sm:col-span-2">
                      <FormField control={form.control} name="diagnosis" render={({ field }) => (
                        <FormItem><FormLabel>Primary Diagnosis</FormLabel><FormControl><Input placeholder="e.g. Acute Bronchitis" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                  </div>
                  <FormField control={form.control} name="prescription" render={({ field }) => (
                    <FormItem><FormLabel className="flex items-center gap-2"><Pill className="w-4 h-4 text-primary"/> Prescription</FormLabel><FormControl><Textarea className="min-h-[80px]" placeholder="Medication, dosage, and frequency..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="notes" render={({ field }) => (
                    <FormItem><FormLabel className="flex items-center gap-2"><FileText className="w-4 h-4 text-primary"/> Clinical Notes</FormLabel><FormControl><Textarea className="min-h-[100px]" placeholder="Observations, symptoms, recommended follow-up..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button type="submit">Save Treatment Record</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {filteredTreatments.length === 0 ? (
        <Card className="border-dashed bg-muted/10">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Activity className="h-8 w-8 text-muted-foreground/60" />
            </div>
            <p className="text-lg font-medium text-foreground">No treatments logged</p>
            <p className="text-sm mt-1 mb-4">Log a patient's treatment to see it here.</p>
            <Button variant="outline" onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-2" /> Log Treatment</Button>
          </CardContent>
        </Card>
      ) : (
        <motion.div className="space-y-4" variants={container} initial="hidden" animate="show">
          {filteredTreatments.map(t => {
            const patient = patients.find(p => p.id === t.patientId);
            const doctor = doctors.find(d => d.id === t.doctorId);
            return (
              <motion.div key={t.id} variants={item}>
                <Card className="overflow-hidden hover:shadow-md transition-all duration-200 border-l-4 border-l-primary">
                  <CardHeader className="bg-muted/10 pb-4 border-b">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl text-primary mb-1">{t.diagnosis}</CardTitle>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                          <span className="flex items-center bg-background px-2 py-1 rounded-md border shadow-sm">
                            <User className="w-3.5 h-3.5 mr-1.5 text-primary" />
                            <span className="font-medium text-foreground mr-1">Patient:</span> {patient?.fullName}
                          </span>
                          <span className="flex items-center">
                            Dr. {doctor?.fullName}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="inline-block bg-background border px-3 py-1.5 rounded-full text-sm font-medium shadow-sm">
                          {new Date(t.date).toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-5 pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                          <Pill className="w-3.5 h-3.5 text-primary" /> Prescription
                        </h4>
                        <div className="bg-primary/5 text-foreground p-3 rounded-lg border border-primary/10 min-h-[80px]">
                          {t.prescription}
                        </div>
                      </div>
                      {t.notes && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5" /> Clinical Notes
                          </h4>
                          <div className="text-foreground/80 p-3 rounded-lg border bg-muted/20 min-h-[80px] whitespace-pre-wrap text-sm">
                            {t.notes}
                          </div>
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

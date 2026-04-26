import { useState } from "react";
import { useStore } from "@/lib/store";
import { Link } from "wouter";
import { Plus, Search, Stethoscope, ChevronRight, Phone, Mail, Building } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { doctorSchema } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const formSchema = doctorSchema.omit({ id: true, joinedAt: true });

export default function Doctors() {
  const { doctors, addRecord } = useStore();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const filteredDoctors = doctors.filter(d => 
    d.fullName.toLowerCase().includes(search.toLowerCase()) || 
    d.specialization.toLowerCase().includes(search.toLowerCase())
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      specialization: "",
      phone: "",
      email: "",
      department: "",
    }
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    addRecord("doctors", { ...data, joinedAt: new Date().toISOString() });
    setOpen(false);
    form.reset();
    toast({ title: "Success", description: "Doctor added successfully." });
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
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Medical Staff</h1>
          <p className="text-muted-foreground text-sm">Manage doctor profiles and specializations.</p>
        </div>
        <div className="flex w-full sm:w-auto gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search doctors..." 
              className="pl-9 bg-background"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="shrink-0"><Plus className="h-4 w-4 mr-2" /> Add Doctor</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  Add New Doctor
                </DialogTitle>
                <DialogDescription>
                  Enter the doctor's professional details to add them to the directory.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-4">
                  <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Dr. Jane Doe" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="specialization" render={({ field }) => (
                      <FormItem><FormLabel>Specialization</FormLabel><FormControl><Input placeholder="Cardiology" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="department" render={({ field }) => (
                      <FormItem><FormLabel>Department</FormLabel><FormControl><Input placeholder="Cardiology Dept" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem><FormLabel>Phone</FormLabel><FormControl><Input placeholder="+1 (555) 000-0000" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="doctor@hospital.com" {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button type="submit">Save Doctor</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {filteredDoctors.length === 0 ? (
        <Card className="border-dashed bg-muted/10">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Stethoscope className="h-8 w-8 text-muted-foreground/60" />
            </div>
            <p className="text-lg font-medium text-foreground">No doctors found</p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Try adjusting your search query.</p>
            <Button variant="outline" onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-2" /> Add Doctor</Button>
          </CardContent>
        </Card>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filteredDoctors.map(doctor => (
            <motion.div key={doctor.id} variants={item}>
              <Link href={`/doctors/${doctor.id}`}>
                <Card className="group cursor-pointer hover:border-primary/50 hover:shadow-md transition-all duration-200 h-full flex flex-col">
                  <CardContent className="p-5 flex-1 flex flex-col">
                    <div className="flex flex-col items-center text-center mb-4">
                      <Avatar className="h-20 w-20 border-4 border-background shadow-sm mb-3 group-hover:scale-105 transition-transform">
                        <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                          {doctor.fullName.replace('Dr. ', '').substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">{doctor.fullName}</h3>
                      <p className="text-sm font-medium text-primary bg-primary/10 px-2.5 py-0.5 rounded-full mt-1">
                        {doctor.specialization}
                      </p>
                    </div>
                    
                    <div className="mt-auto space-y-2 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg border">
                      <div className="flex items-center gap-2 truncate">
                        <Building className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{doctor.department}</span>
                      </div>
                      <div className="flex items-center gap-2 truncate">
                        <Phone className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{doctor.phone}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

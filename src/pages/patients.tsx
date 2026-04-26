import { useState } from "react";
import { useStore } from "@/lib/store";
import { Link } from "wouter";
import { Plus, Search, User, ChevronRight, Activity, Calendar, Droplet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { patientSchema } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const formSchema = patientSchema.omit({ id: true, registeredAt: true });

export default function Patients() {
  const { patients, addPatient } = useStore();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const filteredPatients = patients.filter(p => 
    p.fullName.toLowerCase().includes(search.toLowerCase()) || 
    p.phone.includes(search)
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      gender: "Male",
      dob: "",
      phone: "",
      email: "",
      address: "",
      bloodGroup: "Unknown",
      allergies: [],
    }
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    addPatient(data);
    setOpen(false);
    form.reset();
    toast({ title: "Success", description: "Patient registered successfully." });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
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
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Patients</h1>
          <p className="text-muted-foreground text-sm">Manage patient records and clinical histories.</p>
        </div>
        <div className="flex w-full sm:w-auto gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search patients..." 
              className="pl-9 bg-background"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="shrink-0"><Plus className="h-4 w-4 mr-2" /> Register Patient</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <User className="h-5 w-5 text-primary" />
                  Register New Patient
                </DialogTitle>
                <DialogDescription>
                  Enter the patient's personal and clinical details.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dob"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl><Input type="date" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bloodGroup"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Blood Group</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select blood group" /></SelectTrigger></FormControl>
                            <SelectContent>
                              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"].map(bg => (
                                <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl><Input placeholder="+1 (555) 000-0000" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email (Optional)</FormLabel>
                          <FormControl><Input type="email" placeholder="john@example.com" {...field} value={field.value || ""} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl><Input placeholder="123 Main St, City, State" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button type="submit">Register Patient</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {filteredPatients.length === 0 ? (
        <Card className="border-dashed bg-muted/10">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-muted-foreground/60" />
            </div>
            <p className="text-lg font-medium text-foreground">No patients found</p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Try adjusting your search or register a new patient.</p>
            <Button variant="outline" onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-2" /> Register Patient</Button>
          </CardContent>
        </Card>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filteredPatients.map((patient) => {
            const age = new Date().getFullYear() - new Date(patient.dob).getFullYear();
            return (
              <motion.div key={patient.id} variants={item}>
                <Link href={`/patients/${patient.id}`}>
                  <Card className="group cursor-pointer hover:border-primary/50 hover:shadow-md transition-all duration-200 h-full flex flex-col">
                    <CardContent className="p-5 flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                            {patient.fullName.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <Badge variant="outline" className="bg-muted/50 text-xs font-medium border-muted-foreground/20">
                          {patient.id.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="mb-4 flex-1">
                        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">{patient.fullName}</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">{patient.gender}, {age} yrs</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                        <div className="flex items-center text-muted-foreground bg-muted/30 p-2 rounded-md">
                          <Droplet className="w-3.5 h-3.5 mr-1.5 text-red-500" /> 
                          <span className="font-medium text-foreground">{patient.bloodGroup}</span>
                        </div>
                        <div className="flex items-center text-muted-foreground bg-muted/30 p-2 rounded-md truncate">
                          <Activity className="w-3.5 h-3.5 mr-1.5 text-primary" />
                          <span className="truncate">{patient.phone}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-end text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity mt-auto">
                        View Details <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}

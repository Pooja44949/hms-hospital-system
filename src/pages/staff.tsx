import { useState } from "react";
import { useStore } from "@/lib/store";
import { Plus, Search, UserRoundCog, Mail, Phone, Building } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { staffSchema } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const formSchema = staffSchema.omit({ id: true });

export default function Staff() {
  const { staff, addRecord } = useStore();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const filteredStaff = staff.filter(s => 
    s.fullName.toLowerCase().includes(search.toLowerCase()) || 
    s.role.toLowerCase().includes(search.toLowerCase()) ||
    s.department.toLowerCase().includes(search.toLowerCase())
  );

  // Group by role
  const groupedStaff = filteredStaff.reduce((acc, current) => {
    if (!acc[current.role]) acc[current.role] = [];
    acc[current.role].push(current);
    return acc;
  }, {} as Record<string, typeof staff>);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      role: "Nurse",
      department: "",
      phone: "",
      email: "",
    }
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    addRecord("staff", data);
    setOpen(false);
    form.reset();
    toast({ title: "Success", description: "Staff member added successfully." });
  };

  const ROLES = ["Admin", "Doctor", "Nurse", "Receptionist", "Lab Technician", "Pharmacist"];

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

  const getRoleColor = (role: string) => {
    switch(role) {
      case "Admin": return "bg-slate-800 text-slate-100";
      case "Nurse": return "bg-blue-600 text-blue-50";
      case "Receptionist": return "bg-teal-600 text-teal-50";
      case "Lab Technician": return "bg-purple-600 text-purple-50";
      case "Pharmacist": return "bg-amber-600 text-amber-50";
      default: return "bg-primary text-primary-foreground";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Hospital Staff</h1>
          <p className="text-muted-foreground text-sm">Directory of administrative and clinical personnel.</p>
        </div>
        <div className="flex w-full sm:w-auto gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search name, role, dept..." 
              className="pl-9 bg-background"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="shrink-0"><Plus className="h-4 w-4 mr-2" /> Add Staff</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <UserRoundCog className="h-5 w-5 text-primary" />
                  Add Staff Member
                </DialogTitle>
                <DialogDescription>
                  Register a new employee into the hospital system.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-4">
                  <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Employee name" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="role" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="department" render={({ field }) => (
                      <FormItem><FormLabel>Department</FormLabel><FormControl><Input placeholder="e.g. Pharmacy" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem><FormLabel>Phone</FormLabel><FormControl><Input placeholder="Contact number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="work email" {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button type="submit">Save Employee</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {Object.keys(groupedStaff).length === 0 ? (
        <Card className="border-dashed bg-muted/10">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <UserRoundCog className="h-8 w-8 text-muted-foreground/60" />
            </div>
            <p className="text-lg font-medium text-foreground">No staff found</p>
            <p className="text-sm mt-1 mb-4">Try adjusting your search criteria.</p>
            <Button variant="outline" onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-2" /> Add Staff</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-10">
          {Object.entries(groupedStaff).map(([role, roleStaff]) => (
            <div key={role} className="space-y-4">
              <div className="flex items-center gap-3 border-b pb-2">
                <h2 className="text-xl font-bold tracking-tight text-foreground">{role}s</h2>
                <Badge variant="secondary" className="bg-muted text-muted-foreground">{roleStaff.length}</Badge>
              </div>
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {roleStaff.map(member => (
                  <motion.div key={member.id} variants={item}>
                    <Card className="overflow-hidden hover:shadow-md transition-shadow group">
                      <CardContent className="p-0 flex flex-col h-full">
                        <div className="p-5 flex items-start gap-4">
                          <Avatar className="h-12 w-12 border-2 border-background shadow-sm shrink-0">
                            <AvatarFallback className={`font-bold ${getRoleColor(member.role)}`}>
                              {member.fullName.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base leading-tight truncate group-hover:text-primary transition-colors">{member.fullName}</h3>
                            <Badge variant="outline" className="mt-1.5 font-medium text-xs bg-muted/30 border-muted">
                              {member.department}
                            </Badge>
                          </div>
                        </div>
                        <div className="bg-muted/10 p-4 border-t mt-auto text-sm space-y-2">
                          <p className="flex items-center text-muted-foreground"><Phone className="w-3.5 h-3.5 mr-2 text-foreground/40" /> <span className="truncate">{member.phone}</span></p>
                          {member.email && (
                            <p className="flex items-center text-muted-foreground"><Mail className="w-3.5 h-3.5 mr-2 text-foreground/40" /> <span className="truncate">{member.email}</span></p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

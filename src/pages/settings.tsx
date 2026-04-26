import { useStore } from "@/lib/store";
import { initialData } from "@/lib/seed";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { Building, UserRoundCog, RefreshCw, Save, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

const infoSchema = z.object({
  name: z.string().min(1, "Hospital name is required"),
  address: z.string().min(1, "Address is required"),
});

export default function Settings() {
  const { hospitalInfo, activeRole, setStore } = useStore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof infoSchema>>({
    resolver: zodResolver(infoSchema),
    defaultValues: {
      name: hospitalInfo.name,
      address: hospitalInfo.address,
    }
  });

  const onSubmit = (data: z.infer<typeof infoSchema>) => {
    setStore({ hospitalInfo: data });
    toast({ title: "Settings Saved", description: "Hospital information updated successfully." });
  };

  const handleRoleChange = (role: any) => {
    setStore({ activeRole: role });
    toast({ title: "Role Switched", description: `Active session is now acting as ${role}.` });
  };

  const handleResetData = () => {
    if (confirm("Are you sure you want to reset all data to the initial seed state? This cannot be undone.")) {
      setStore(initialData);
      toast({ title: "Data Reset", description: "Application data has been restored to default." });
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">System Settings</h1>
        <p className="text-muted-foreground text-sm">Manage hospital preferences and application state.</p>
      </div>

      <motion.div className="grid gap-6" variants={container} initial="hidden" animate="show">
        <motion.div variants={item}>
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/20 border-b">
              <CardTitle className="flex items-center gap-2 text-lg"><Building className="w-5 h-5 text-primary" /> Hospital Profile</CardTitle>
              <CardDescription>Update the primary details for the medical facility.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facility Name</FormLabel>
                      <FormControl><Input className="max-w-md bg-background" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Address</FormLabel>
                      <FormControl><Input className="bg-background" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit"><Save className="w-4 h-4 mr-2"/> Save Changes</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/20 border-b">
              <CardTitle className="flex items-center gap-2 text-lg"><UserRoundCog className="w-5 h-5 text-primary" /> Session & Access Control</CardTitle>
              <CardDescription>Switch roles to test different permissions and UI views.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3 max-w-md">
                <Label className="text-muted-foreground">Active Role Simulator</Label>
                <div className="flex gap-4 items-center">
                  <Select value={activeRole} onValueChange={handleRoleChange}>
                    <SelectTrigger className="w-full bg-background border-primary/20">
                      <SelectValue placeholder="Select active role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin (Full Access)</SelectItem>
                      <SelectItem value="Doctor">Doctor</SelectItem>
                      <SelectItem value="Nurse">Nurse</SelectItem>
                      <SelectItem value="Receptionist">Receptionist</SelectItem>
                      <SelectItem value="Lab Technician">Lab Technician</SelectItem>
                      <SelectItem value="Pharmacist">Pharmacist</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Changing roles instantly updates the UI to reflect that role's permissions.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-destructive/30 shadow-sm bg-destructive/5">
            <CardHeader className="border-b border-destructive/10">
              <CardTitle className="text-destructive flex items-center gap-2 text-lg">
                <ShieldAlert className="w-5 h-5" /> Danger Zone
              </CardTitle>
              <CardDescription className="text-destructive/80">Actions here cannot be reversed.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <h4 className="font-semibold text-foreground">Reset Application State</h4>
                <p className="text-sm text-muted-foreground">Erase all custom data and restore the initial mock dataset.</p>
              </div>
              <Button variant="destructive" onClick={handleResetData} className="shrink-0">
                <RefreshCw className="w-4 h-4 mr-2" /> Reset Data to Default
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}

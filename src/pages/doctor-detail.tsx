import { useRoute, Link } from "wouter";
import { useStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Stethoscope, Phone, Mail, Building, CalendarDays, ArrowLeft, User, MapPin } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import NotFound from "./not-found";

export default function DoctorDetail() {
  const [match, params] = useRoute("/doctors/:id");
  const { doctors, appointments, patients } = useStore();

  if (!match) return null;
  const doctor = doctors.find(d => d.id === params.id);
  
  if (!doctor) return <NotFound />;

  const upcomingAppointments = appointments
    .filter(a => a.doctorId === doctor.id && a.status === "Scheduled")
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

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
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <Button variant="ghost" size="sm" asChild className="-ml-3 text-muted-foreground hover:text-foreground">
          <Link href="/doctors"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Directory</Link>
        </Button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-br from-card to-muted/20">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 bg-muted/30 p-8 flex flex-col items-center text-center justify-center border-r">
                <Avatar className="h-32 w-32 border-4 border-background shadow-md mb-4">
                  <AvatarFallback className="bg-primary text-primary-foreground text-4xl font-bold">
                    {doctor.fullName.replace('Dr. ', '').substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h1 className="text-2xl font-bold tracking-tight">{doctor.fullName}</h1>
                <Badge className="mt-2 bg-primary/20 text-primary hover:bg-primary/30 border-0">{doctor.specialization}</Badge>
              </div>
              
              <div className="p-8 flex-1 flex flex-col justify-center space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Contact Information</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center p-3 rounded-lg bg-background border">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3 shrink-0">
                        <Building className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Department</p>
                        <p className="text-sm font-medium">{doctor.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 rounded-lg bg-background border">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3 shrink-0">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="text-sm font-medium">{doctor.phone}</p>
                      </div>
                    </div>
                    {doctor.email && (
                      <div className="flex items-center p-3 rounded-lg bg-background border sm:col-span-2">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3 shrink-0">
                          <Mail className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Email</p>
                          <p className="text-sm font-medium">{doctor.email}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="pt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" /> Schedule
          </h2>
          <Badge variant="secondary">{upcomingAppointments.length} Upcoming</Badge>
        </div>

        {upcomingAppointments.length === 0 ? (
          <Card className="border-dashed bg-muted/10"><CardContent className="p-12 text-center text-muted-foreground flex flex-col items-center"><CalendarDays className="h-12 w-12 mb-4 opacity-20" /><p>No upcoming appointments scheduled.</p></CardContent></Card>
        ) : (
          <motion.div className="grid gap-4 md:grid-cols-2" variants={container} initial="hidden" animate="show">
            {upcomingAppointments.map(apt => {
              const patient = patients.find(p => p.id === apt.patientId);
              const aptDate = new Date(apt.dateTime);
              
              return (
                <motion.div key={apt.id} variants={item}>
                  <Card className="hover:shadow-md transition-shadow h-full border-l-4 border-l-primary">
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-muted text-muted-foreground font-medium">
                              {patient?.fullName.substring(0, 2).toUpperCase() || "??"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{patient?.fullName || "Unknown Patient"}</p>
                            <p className="text-xs text-muted-foreground">ID: {patient?.id}</p>
                          </div>
                        </div>
                        <div className="text-right text-primary font-bold text-lg">
                          {aptDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      
                      <div className="bg-muted/40 p-3 rounded-lg text-sm border border-border/50">
                        <p className="font-medium text-foreground mb-1">Reason for visit</p>
                        <p className="text-muted-foreground">{apt.reason}</p>
                      </div>
                      
                      <div className="mt-4 text-xs font-medium text-muted-foreground flex items-center justify-between pt-3 border-t">
                        <span>{aptDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Scheduled</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}

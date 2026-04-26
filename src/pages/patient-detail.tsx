import { useRoute, Link } from "wouter";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { User, Phone, MapPin, Droplet, Calendar, Activity, Bed, CalendarDays, Mail, Plus, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import NotFound from "./not-found";

export default function PatientDetail() {
  const [match, params] = useRoute("/patients/:id");
  const { patients, treatments, admissions, appointments, doctors } = useStore();

  if (!match) return null;
  const patient = patients.find(p => p.id === params.id);
  
  if (!patient) return <NotFound />;

  const patientTreatments = treatments.filter(t => t.patientId === patient.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const patientAdmissions = admissions.filter(a => a.patientId === patient.id).sort((a, b) => new Date(b.admittedAt).getTime() - new Date(a.admittedAt).getTime());
  const patientAppointments = appointments.filter(a => a.patientId === patient.id).sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

  const getDoctorName = (id: string) => doctors.find(d => d.id === id)?.fullName || "Unknown Doctor";
  const age = new Date().getFullYear() - new Date(patient.dob).getFullYear();

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
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <Button variant="ghost" size="sm" asChild className="-ml-3 text-muted-foreground hover:text-foreground">
          <Link href="/patients"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Patients</Link>
        </Button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-br from-card to-muted/20">
          <div className="h-24 bg-primary/10 w-full relative">
            <div className="absolute -bottom-12 left-6">
              <Avatar className="h-24 w-24 border-4 border-background shadow-sm">
                <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">
                  {patient.fullName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          <CardContent className="pt-16 pb-6 px-6">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold tracking-tight">{patient.fullName}</h1>
                    <Badge variant="outline" className="bg-background">{patient.id.toUpperCase()}</Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center text-foreground font-medium">
                      {patient.gender}, {age} yrs
                    </span>
                    <span className="flex items-center">
                      <Droplet className="w-3.5 h-3.5 mr-1.5 text-red-500" /> {patient.bloodGroup} Blood
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1.5" /> Born {new Date(patient.dob).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 pt-4 border-t text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Phone className="w-4 h-4 mr-3 text-primary/70 shrink-0" /> 
                    <span className="text-foreground">{patient.phone}</span>
                  </div>
                  {patient.email && (
                    <div className="flex items-center text-muted-foreground">
                      <Mail className="w-4 h-4 mr-3 text-primary/70 shrink-0" /> 
                      <span className="text-foreground">{patient.email}</span>
                    </div>
                  )}
                  <div className="flex items-center text-muted-foreground md:col-span-2">
                    <MapPin className="w-4 h-4 mr-3 text-primary/70 shrink-0" /> 
                    <span className="text-foreground">{patient.address}</span>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-64 bg-card rounded-xl p-4 border shadow-sm shrink-0">
                <h3 className="text-sm font-semibold text-destructive mb-3 flex items-center">
                  <Activity className="w-4 h-4 mr-1.5" /> Medical Alerts
                </h3>
                {patient.allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {patient.allergies.map(a => (
                      <Badge key={a} variant="destructive" className="bg-destructive/10 text-destructive hover:bg-destructive/20 font-medium">
                        {a}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No known allergies.</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md bg-muted/50 p-1 h-auto rounded-lg">
          <TabsTrigger value="appointments" className="rounded-md py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <CalendarDays className="w-4 h-4 mr-2" /> Appointments
          </TabsTrigger>
          <TabsTrigger value="treatments" className="rounded-md py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Activity className="w-4 h-4 mr-2" /> Treatments
          </TabsTrigger>
          <TabsTrigger value="admissions" className="rounded-md py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Bed className="w-4 h-4 mr-2" /> Admissions
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="appointments" className="mt-6 focus-visible:outline-none">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Appointment History</h3>
            <Button size="sm" variant="outline" asChild><Link href="/appointments"><Plus className="w-4 h-4 mr-2"/> Schedule</Link></Button>
          </div>
          
          {patientAppointments.length === 0 ? (
            <Card className="border-dashed bg-muted/10"><CardContent className="p-12 text-center text-muted-foreground flex flex-col items-center"><CalendarDays className="h-12 w-12 mb-4 opacity-20" /><p>No appointments recorded.</p></CardContent></Card>
          ) : (
            <motion.div className="space-y-3" variants={container} initial="hidden" animate="show">
              {patientAppointments.map(apt => (
                <motion.div key={apt.id} variants={item}>
                  <Card className="overflow-hidden hover:border-primary/30 transition-colors">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        <div className="bg-muted/30 p-4 sm:w-48 flex flex-col justify-center border-r">
                          <span className="text-sm font-medium text-muted-foreground">{new Date(apt.dateTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                          <span className="text-lg font-bold text-foreground">{new Date(apt.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="p-4 flex-1 flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-base">{apt.reason}</p>
                            <p className="text-sm text-muted-foreground mt-1 flex items-center">
                              <User className="w-3.5 h-3.5 mr-1.5" /> Dr. {getDoctorName(apt.doctorId)}
                            </p>
                          </div>
                          <Badge variant="outline" className={`
                            ${apt.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}
                            ${apt.status === 'Scheduled' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                            ${apt.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                          `}>
                            {apt.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="treatments" className="mt-6 focus-visible:outline-none">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Treatment Records</h3>
            <Button size="sm" variant="outline" asChild><Link href="/treatments"><Plus className="w-4 h-4 mr-2"/> Log Treatment</Link></Button>
          </div>

          {patientTreatments.length === 0 ? (
            <Card className="border-dashed bg-muted/10"><CardContent className="p-12 text-center text-muted-foreground flex flex-col items-center"><Activity className="h-12 w-12 mb-4 opacity-20" /><p>No treatments recorded.</p></CardContent></Card>
          ) : (
            <motion.div className="space-y-4" variants={container} initial="hidden" animate="show">
              {patientTreatments.map(t => (
                <motion.div key={t.id} variants={item}>
                  <Card className="hover:shadow-sm transition-shadow">
                    <CardHeader className="pb-3 border-b bg-muted/10">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-bold text-primary">{t.diagnosis}</CardTitle>
                        <Badge variant="secondary" className="font-medium bg-background">{new Date(t.date).toLocaleDateString()}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Prescription</p>
                        <p className="text-sm font-medium bg-primary/5 p-2.5 rounded-md border border-primary/10">{t.prescription}</p>
                      </div>
                      {t.notes && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Clinical Notes</p>
                          <p className="text-sm text-foreground/80 whitespace-pre-wrap">{t.notes}</p>
                        </div>
                      )}
                      <div className="pt-4 flex items-center text-sm text-muted-foreground border-t">
                        <User className="w-4 h-4 mr-2" /> Attending: <span className="font-medium text-foreground ml-1">Dr. {getDoctorName(t.doctorId)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="admissions" className="mt-6 focus-visible:outline-none">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Admission History</h3>
            <Button size="sm" variant="outline" asChild><Link href="/admissions"><Plus className="w-4 h-4 mr-2"/> New Admission</Link></Button>
          </div>

          {patientAdmissions.length === 0 ? (
            <Card className="border-dashed bg-muted/10"><CardContent className="p-12 text-center text-muted-foreground flex flex-col items-center"><Bed className="h-12 w-12 mb-4 opacity-20" /><p>No admissions recorded.</p></CardContent></Card>
          ) : (
            <motion.div className="space-y-4" variants={container} initial="hidden" animate="show">
              {patientAdmissions.map(adm => (
                <motion.div key={adm.id} variants={item}>
                  <Card className={adm.status === "Active" ? "border-amber-500 shadow-sm ring-1 ring-amber-500/20" : ""}>
                    <CardContent className="p-0 flex flex-col sm:flex-row">
                      <div className={`p-4 sm:w-48 flex flex-col justify-center border-r ${adm.status === "Active" ? "bg-amber-50 dark:bg-amber-950/30" : "bg-muted/30"}`}>
                        <Badge variant={adm.status === "Active" ? "default" : "secondary"} className={`w-fit mb-2 ${adm.status === "Active" ? "bg-amber-500 hover:bg-amber-600" : ""}`}>
                          {adm.status}
                        </Badge>
                        <p className="text-sm font-bold text-foreground">Ward {adm.ward}</p>
                        <p className="text-sm text-muted-foreground">Bed {adm.bed}</p>
                      </div>
                      <div className="p-4 flex-1">
                        <p className="font-semibold text-base mb-1">{adm.reason}</p>
                        <p className="text-sm text-muted-foreground flex items-center mb-4">
                          <User className="w-3.5 h-3.5 mr-1.5" /> Dr. {getDoctorName(adm.attendingDoctorId)}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4 pt-3 border-t text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground mb-0.5">Admitted</p>
                            <p className="font-medium text-foreground">{new Date(adm.admittedAt).toLocaleDateString()}</p>
                          </div>
                          {adm.dischargedAt && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-0.5">Discharged</p>
                              <p className="font-medium text-foreground">{new Date(adm.dischargedAt).toLocaleDateString()}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

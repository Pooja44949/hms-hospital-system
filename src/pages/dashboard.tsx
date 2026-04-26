import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, CalendarDays, Bed, Syringe, Activity, TrendingUp, ArrowUpRight, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Dashboard() {
  const { patients, appointments, admissions, surgeries, activeRole, doctors, treatments } = useStore();

  const today = new Date().toISOString().split("T")[0];
  
  const todayAppointments = appointments.filter(a => a.dateTime.startsWith(today));
  const activeAdmissions = admissions.filter(a => a.status === "Active");
  const upcomingSurgeries = surgeries.filter(s => s.status === "Scheduled");

  const stats = [
    { 
      label: "Total Patients", 
      value: patients.length, 
      icon: Users, 
      color: "text-blue-600 dark:text-blue-400", 
      bg: "bg-blue-100 dark:bg-blue-900/30",
      border: "border-blue-200 dark:border-blue-800",
      trend: "+12% this month"
    },
    { 
      label: "Today's Appointments", 
      value: todayAppointments.length, 
      icon: CalendarDays, 
      color: "text-emerald-600 dark:text-emerald-400", 
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
      border: "border-emerald-200 dark:border-emerald-800",
      trend: "8 scheduled"
    },
    { 
      label: "Active Admissions", 
      value: activeAdmissions.length, 
      icon: Bed, 
      color: "text-amber-600 dark:text-amber-400", 
      bg: "bg-amber-100 dark:bg-amber-900/30",
      border: "border-amber-200 dark:border-amber-800",
      trend: "85% capacity"
    },
    { 
      label: "Upcoming Surgeries", 
      value: upcomingSurgeries.length, 
      icon: Syringe, 
      color: "text-purple-600 dark:text-purple-400", 
      bg: "bg-purple-100 dark:bg-purple-900/30",
      border: "border-purple-200 dark:border-purple-800",
      trend: "Next in 2h"
    },
  ];

  // Dummy data for charts
  const weeklyData = [
    { name: 'Mon', apts: Math.floor(Math.random() * 20) + 10 },
    { name: 'Tue', apts: Math.floor(Math.random() * 20) + 15 },
    { name: 'Wed', apts: Math.floor(Math.random() * 20) + 10 },
    { name: 'Thu', apts: Math.floor(Math.random() * 20) + 25 },
    { name: 'Fri', apts: Math.floor(Math.random() * 20) + 20 },
    { name: 'Sat', apts: Math.floor(Math.random() * 10) + 5 },
    { name: 'Sun', apts: Math.floor(Math.random() * 10) + 2 },
  ];

  const wardData = [
    { name: 'General', occupied: 45, total: 50 },
    { name: 'ICU', occupied: 12, total: 15 },
    { name: 'Pediatrics', occupied: 20, total: 30 },
    { name: 'Maternity', occupied: 18, total: 25 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-primary/5 p-6 rounded-2xl border border-primary/10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Good morning, {activeRole}</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening at the hospital today.</p>
        </div>
        <div className="flex gap-3">
          <Badge variant="outline" className="px-3 py-1.5 bg-background text-sm font-medium">
            <CalendarDays className="w-4 h-4 mr-2 text-primary" />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
          >
            <Card className={`hover-card-lift overflow-hidden relative border ${stat.border}`}>
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <stat.icon className="w-24 h-24 transform translate-x-4 -translate-y-4" />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <Badge variant="secondary" className="bg-background/50 backdrop-blur-sm border-0 font-medium flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> {stat.trend}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-4xl font-bold tracking-tight mb-1 text-foreground">
                    <AnimatedCounter value={stat.value} />
                  </h3>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="lg:col-span-2">
          <Card className="h-full shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Weekly Appointments</CardTitle>
                <CardDescription>Patient visits over the last 7 days</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-primary">
                View Report <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorApts" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                      itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                    />
                    <Area type="monotone" dataKey="apts" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorApts)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <Card className="h-full shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle>Ward Occupancy</CardTitle>
              <CardDescription>Current bed utilization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={wardData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--foreground))', fontWeight: 500 }} width={80} />
                    <Tooltip 
                      cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                    />
                    <Bar dataKey="occupied" radius={[0, 4, 4, 0]} barSize={24}>
                      {wardData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <Card className="h-full shadow-sm border-t-4 border-t-primary">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  Today's Appointments
                </CardTitle>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer">
                View All
              </Badge>
            </CardHeader>
            <CardContent>
              {todayAppointments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
                  <CalendarDays className="h-12 w-12 mb-3 text-muted-foreground/50" />
                  <p className="font-medium">No appointments for today</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {todayAppointments.slice(0, 5).map(apt => {
                    const patient = patients.find(p => p.id === apt.patientId);
                    const doctor = doctors.find(d => d.id === apt.doctorId);
                    const time = new Date(apt.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    
                    return (
                      <div key={apt.id} className="group flex items-center justify-between p-4 border rounded-xl bg-card hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10 border border-primary/10">
                            <AvatarFallback className="bg-primary/5 text-primary font-medium">
                              {patient?.fullName.substring(0, 2).toUpperCase() || "??"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-foreground">{patient?.fullName || "Unknown Patient"}</p>
                            <p className="text-xs text-muted-foreground flex items-center mt-0.5">
                              <span className="text-primary font-medium mr-2">{time}</span> 
                              {apt.reason}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className={`
                            ${apt.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}
                            ${apt.status === 'Scheduled' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                            ${apt.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                          `}>
                            {apt.status}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          <Card className="h-full shadow-sm border-t-4 border-t-amber-500">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Activity className="h-5 w-5 text-amber-500" />
                  Recent Treatments
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {treatments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
                  <Activity className="h-12 w-12 mb-3 text-muted-foreground/50" />
                  <p className="font-medium">No recent treatments</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {treatments.slice(0, 5).map(t => {
                    const patient = patients.find(p => p.id === t.patientId);
                    const doctor = doctors.find(d => d.id === t.doctorId);
                    
                    return (
                      <div key={t.id} className="group flex items-start justify-between p-4 border rounded-xl bg-card hover:bg-muted/50 transition-colors">
                        <div className="flex gap-4">
                          <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                            <Activity className="h-5 w-5 text-amber-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{t.diagnosis}</p>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              <span className="font-medium text-foreground">{patient?.fullName}</span> • Dr. {doctor?.fullName}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2 line-clamp-1 bg-muted/50 px-2 py-1 rounded inline-block">
                              {t.prescription}
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
                            {new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

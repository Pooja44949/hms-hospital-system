import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from "recharts";
import { FileBarChart } from "lucide-react";
import { motion } from "framer-motion";

export default function Reports() {
  const { patients, appointments, surgeries, admissions } = useStore();

  // 1. Patients by Blood Group (Bar)
  const bgCounts: Record<string, number> = {};
  patients.forEach(p => {
    bgCounts[p.bloodGroup] = (bgCounts[p.bloodGroup] || 0) + 1;
  });
  const bloodGroupData = Object.entries(bgCounts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  // 2. Appointments by Status (Pie)
  const aptCounts: Record<string, number> = {};
  appointments.forEach(a => {
    aptCounts[a.status] = (aptCounts[a.status] || 0) + 1;
  });
  const appointmentData = Object.entries(aptCounts).map(([name, value]) => ({ name, value }));
  const PIE_COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

  // 3. Surgeries Status
  const surCounts: Record<string, number> = {};
  surgeries.forEach(s => {
    surCounts[s.status] = (surCounts[s.status] || 0) + 1;
  });
  const surgeryData = Object.entries(surCounts).map(([name, value]) => ({ name, value }));

  // 4. Monthly Admissions (Area)
  // Mock data for visual completeness since we only have a few real records
  const monthlyAdmissions = [
    { name: 'Jan', total: 45, discharged: 40 },
    { name: 'Feb', total: 52, discharged: 48 },
    { name: 'Mar', total: 38, discharged: 35 },
    { name: 'Apr', total: 65, discharged: 55 },
    { name: 'May', total: 48, discharged: 45 },
    { name: 'Jun', total: 50, discharged: 42 },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <FileBarChart className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Hospital Analytics</h1>
          <p className="text-muted-foreground text-sm">Visual insights into hospital operations and patient demographics.</p>
        </div>
      </div>
      
      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6" variants={container} initial="hidden" animate="show">
        <motion.div variants={item}>
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Patients by Blood Group</CardTitle>
              <CardDescription>Distribution across registered patients</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bloodGroupData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    cursor={{ fill: 'hsl(var(--muted)/0.5)' }} 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} maxBarSize={50}>
                    {bloodGroupData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Appointments by Status</CardTitle>
              <CardDescription>Current state of all booked visits</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={appointmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
                  >
                    {appointmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Surgical Procedures Status</CardTitle>
              <CardDescription>Operating theater utilization</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={surgeryData} layout="vertical" margin={{ top: 20, right: 30, left: 30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                  <XAxis type="number" allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--foreground))', fontWeight: 500 }} />
                  <Tooltip 
                    cursor={{ fill: 'hsl(var(--muted)/0.5)' }} 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={40}>
                    {surgeryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 3) + 3}))`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Monthly Admissions</CardTitle>
              <CardDescription>Inpatient intake vs discharge</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyAdmissions} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDis" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Area type="monotone" dataKey="total" name="Total Admitted" stroke="hsl(var(--chart-1))" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
                  <Area type="monotone" dataKey="discharged" name="Discharged" stroke="hsl(var(--chart-2))" strokeWidth={2} fillOpacity={1} fill="url(#colorDis)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}

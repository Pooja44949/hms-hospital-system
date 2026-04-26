import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AppLayout } from "@/components/layout/AppLayout";
import { AnimatePresence } from "framer-motion";

import Dashboard from "@/pages/dashboard";
import Patients from "@/pages/patients";
import Doctors from "@/pages/doctors";
import Appointments from "@/pages/appointments";
import Admissions from "@/pages/admissions";
import Treatments from "@/pages/treatments";
import Surgeries from "@/pages/surgeries";
import Reports from "@/pages/reports";
import Staff from "@/pages/staff";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";
import PatientDetail from "@/pages/patient-detail";
import DoctorDetail from "@/pages/doctor-detail";

const queryClient = new QueryClient();

function Router() {
  const [location] = useLocation();
  
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/patients" component={Patients} />
        <Route path="/patients/:id" component={PatientDetail} />
        <Route path="/doctors" component={Doctors} />
        <Route path="/doctors/:id" component={DoctorDetail} />
        <Route path="/appointments" component={Appointments} />
        <Route path="/admissions" component={Admissions} />
        <Route path="/treatments" component={Treatments} />
        <Route path="/surgeries" component={Surgeries} />
        <Route path="/reports" component={Reports} />
        <Route path="/staff" component={Staff} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="hms-theme">
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

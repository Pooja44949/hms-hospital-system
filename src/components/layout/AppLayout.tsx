import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Users, 
  Stethoscope, 
  CalendarDays, 
  Bed, 
  Activity, 
  Syringe, 
  FileBarChart, 
  UserRoundCog, 
  Settings, 
  Menu,
  Moon,
  Sun,
  Search,
  Bell,
  HeartPulse
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useTheme } from "@/components/theme-provider";
import { useStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNotifications } from "@/lib/useNotifications";
import { ScrollArea } from "@/components/ui/scroll-area";

const NAV_GROUPS = [
  {
    title: "Overview",
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard },
    ]
  },
  {
    title: "Clinical",
    items: [
      { href: "/patients", label: "Patients", icon: Users },
      { href: "/doctors", label: "Doctors", icon: Stethoscope },
      { href: "/treatments", label: "Treatments", icon: Activity },
      { href: "/surgeries", label: "Surgeries", icon: Syringe },
    ]
  },
  {
    title: "Operations",
    items: [
      { href: "/appointments", label: "Appointments", icon: CalendarDays },
      { href: "/admissions", label: "Admissions", icon: Bed },
      { href: "/reports", label: "Reports", icon: FileBarChart },
    ]
  },
  {
    title: "System",
    items: [
      { href: "/staff", label: "Staff", icon: UserRoundCog },
      { href: "/settings", label: "Settings", icon: Settings },
    ]
  }
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const { hospitalInfo, activeRole } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavLinks = () => (
    <div className="space-y-6">
      {NAV_GROUPS.map((group) => (
        <div key={group.title} className="space-y-1">
          <h4 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {group.title}
          </h4>
          {group.items.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-primary text-primary-foreground font-medium shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground transition-colors"}`} />
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );

  const activePage = NAV_GROUPS.flatMap(g => g.items).find(item => location === item.href || (item.href !== "/" && location.startsWith(item.href)))?.label || "Dashboard";

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 border-r bg-card h-screen sticky top-0 shadow-sm z-20">
        <div className="p-6 border-b h-20 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-inner shrink-0">
            <HeartPulse className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="font-bold text-lg text-foreground truncate leading-tight tracking-tight">{hospitalInfo.name}</h1>
            <span className="text-xs text-muted-foreground truncate">Medical Portal</span>
          </div>
        </div>
        <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
          <NavLinks />
        </nav>
        <div className="p-4 border-t bg-muted/30">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-background border shadow-sm">
            <Avatar className="h-10 w-10 border border-primary/10">
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {activeRole.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <p className="text-sm font-semibold leading-none truncate">{activeRole}</p>
              <p className="text-xs text-muted-foreground mt-1 truncate">Current Session</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative">
        {/* Header */}
        <header className="h-20 border-b bg-card/80 backdrop-blur-xl flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4 flex-1">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 flex flex-col">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="p-6 border-b h-20 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
                    <HeartPulse className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h1 className="font-bold text-lg truncate leading-tight tracking-tight">{hospitalInfo.name}</h1>
                    <span className="text-xs text-muted-foreground truncate">Medical Portal</span>
                  </div>
                </div>
                <nav className="flex-1 p-4 overflow-y-auto">
                  <NavLinks />
                </nav>
              </SheetContent>
            </Sheet>
            
            <div className="hidden sm:flex relative w-96 max-w-md transition-all focus-within:max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search anything..." 
                className="pl-9 bg-muted/50 border-muted focus-visible:bg-background transition-all rounded-full"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <NotificationBell />
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-5 w-5 text-muted-foreground" /> : <Moon className="h-5 w-5 text-muted-foreground" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <div className="h-8 w-px bg-border mx-1 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <Avatar className="h-9 w-9 border hidden sm:flex">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {activeRole.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function NotificationBell() {
  const notifications = useNotifications();
  const [, setLocation] = useLocation();
  const count = notifications.length;
  const typeStyle: Record<string, string> = {
    appointment: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    surgery: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    admission: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    treatment: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full" data-testid="button-notifications">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {count > 0 && (
            <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center border-2 border-card">
              {count > 9 ? "9+" : count}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <p className="font-semibold text-sm">Notifications</p>
            <p className="text-xs text-muted-foreground">{count} active alerts</p>
          </div>
          <Bell className="h-4 w-4 text-muted-foreground" />
        </div>
        <ScrollArea className="max-h-80">
          {count === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              You're all caught up.
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setLocation(n.href)}
                  className="w-full text-left p-3 hover:bg-muted/50 transition-colors flex gap-3"
                  data-testid={`notification-${n.id}`}
                >
                  <span className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${typeStyle[n.type]}`}>
                    <Bell className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{n.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{n.description}</p>
                    <p className="text-[11px] text-muted-foreground/80 mt-0.5">{n.time}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

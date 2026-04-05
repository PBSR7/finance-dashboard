import { useFinance } from "@/contexts/FinanceContext";
import { Shield, Eye } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Role } from "@/data/mockData";

export function RoleToggle() {
  const { role, setRole } = useFinance();

  return (
    <div className="flex items-center gap-2">
      <div className={`p-1.5 rounded-md ${role === "admin" ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"}`}>
        {role === "admin" ? <Shield className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </div>
      <Select value={role} onValueChange={(v) => setRole(v as Role)}>
        <SelectTrigger className="w-[110px] h-8 text-xs bg-secondary border-border">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="viewer">Viewer</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

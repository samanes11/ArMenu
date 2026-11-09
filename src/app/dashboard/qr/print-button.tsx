"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintButton() {
  return (
    <Button type="button" variant="outline" onClick={() => window.print()} className="no-print">
      <Printer size={16} /> چاپ
    </Button>
  );
}

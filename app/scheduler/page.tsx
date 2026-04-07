"use client";

import { CalendarScheduler } from "@/components/ui/calendar-scheduler";

export default function SchedulerDemoPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-black">
        <div className="bg-white p-6 rounded-2xl">
          <CalendarScheduler
            onConfirm={(val) => {
              console.log("Scheduled:", val);
              alert(`Scheduled for ${val.date?.toLocaleDateString()} at ${val.time}`);
            }}
          />
        </div>
    </div>
  );
}

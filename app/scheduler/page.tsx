"use client";

import { CalendarScheduler } from "@/components/ui/calendar-scheduler";

export default function SchedulerDemoPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-black p-8">
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

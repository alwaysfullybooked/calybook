// "use client";

// import { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/card";
// import { Button } from "@/components/button";
// import { format, parse, addHours } from "date-fns";

// // Helper function to generate time slots based on start time, end time, and duration
// function generateTimeSlots(
//   startTime: string,
//   endTime: string,
//   durationMinutes: number,
// ) {
//   const slots = [];

//   // Parse the start and end times
//   const start = parse(startTime, "HH:mm", new Date());
//   const end = parse(endTime, "HH:mm", new Date());

//   // Calculate the number of slots
//   const durationHours = durationMinutes / 60;
//   let currentSlot = start;

//   while (currentSlot < end) {
//     const slotEnd = addHours(currentSlot, durationHours);
//     slots.push({
//       start: format(currentSlot, "HH:mm"),
//       end: format(slotEnd, "HH:mm"),
//       formattedTime: format(currentSlot, "h:mm a"),
//     });
//     currentSlot = slotEnd;
//   }

//   return slots;
// }

// interface Court {
//   id: string;
//   name: string;
//   surface: string | null;
//   indoor: boolean | null;
//   timeslots: {
//     id: string;
//     startTime: string;
//     endTime: string;
//     price: string;
//     currency: string;
//     durationMinutes: number;
//   }[];
// }

// export default function CourtTabs({ courts }: { courts: Court[] }) {
//   const [selectedCourtIndex, setSelectedCourtIndex] = useState(0);
//   const selectedCourt = courts[selectedCourtIndex];

//   return (
//     <div className="space-y-6">
//       {/* Court selector tabs */}
//       <div className="border-b">
//         <div className="flex flex-wrap space-x-2">
//           {courts.map((court, index) => (
//             <button
//               key={court.id}
//               className={`border-b-2 px-4 py-2 text-sm font-medium ${
//                 index === selectedCourtIndex
//                   ? "border-green-600 text-green-600"
//                   : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
//               }`}
//               onClick={() => setSelectedCourtIndex(index)}
//             >
//               {court.name}
//               <span className="ml-2 text-xs">
//                 ({court.surface} • {court.indoor ? "Indoor" : "Outdoor"})
//               </span>
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Show selected court */}
//       {selectedCourt && (
//         <Card>
//           <CardHeader>
//             <CardTitle>{selectedCourt.name || "Court"}</CardTitle>
//             <CardDescription>
//               {selectedCourt.surface ?? "Tennis"} court •{" "}
//               {selectedCourt.indoor ? "Indoor" : "Outdoor"}
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             {selectedCourt.timeslots && selectedCourt.timeslots.length > 0 ? (
//               <div>
//                 {selectedCourt.timeslots.map((timeslot) => (
//                   <div key={timeslot.id} className="mb-6 last:mb-0">
//                     <div className="mb-2 flex items-center justify-between">
//                       <h3 className="text-lg font-medium">
//                         {timeslot.startTime} - {timeslot.endTime}
//                         <span className="ml-3 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
//                           {timeslot.price} {timeslot.currency}
//                         </span>
//                       </h3>
//                     </div>

//                     <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
//                       {generateTimeSlots(
//                         timeslot.startTime,
//                         timeslot.endTime,
//                         timeslot.durationMinutes,
//                       ).map((slot, i) => {
//                         // Randomize availability (for demo purposes)
//                         // In a real app, this would come from the database
//                         const isAvailable = Math.random() > 0.3;

//                         return (
//                           <Button
//                             key={i}
//                             variant={isAvailable ? "default" : "outline"}
//                             className={`h-20 w-full flex-col items-center justify-center space-y-1 ${
//                               isAvailable
//                                 ? "bg-green-600 hover:bg-green-700"
//                                 : "bg-gray-100 text-gray-400"
//                             }`}
//                             disabled={!isAvailable}
//                           >
//                             <span className="text-sm">
//                               {slot.formattedTime}
//                             </span>
//                             <span className="text-xs">
//                               {isAvailable ? "Available" : "Booked"}
//                             </span>
//                           </Button>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-center text-gray-500">
//                 No available time slots for this court
//               </p>
//             )}
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }

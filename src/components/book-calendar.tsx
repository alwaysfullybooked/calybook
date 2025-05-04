// "use client";

// import { format } from "date-fns";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/card";
// import Image from "next/image";
// import CourtTabs from "@/components/book-court-tabs";
// import { useState } from "react";
// import type { Club, Court } from "@/types/types";

// interface BookClientPageProps {
//   club: Club | null;
//   courts: Court[];
// }

// export default function BookClientPage({ club, courts }: BookClientPageProps) {
//   const [selectedDate, setSelectedDate] = useState<Date>(new Date());

//   // Default image for tennis clubs
//   const defaultImage =
//     "https://images.unsplash.com/photo-1595435934819-5704bd44e4a9?q=80&w=1000";

//   const today = new Date();
//   const formattedDate = format(selectedDate, "PPP");

//   // Function to check if a date is in the past
//   const isPastDate = (date: Date) => {
//     const now = new Date();
//     now.setHours(0, 0, 0, 0);
//     return date < now;
//   };

//   return (
//     <main className="container mx-auto py-8">
//       <div className="grid gap-8 md:grid-cols-2">
//         {/* Club Information */}
//         <div>
//           <Card className="overflow-hidden">
//             <div className="relative h-60 w-full">
//               <Image
//                 src={club?.image ?? defaultImage}
//                 alt={club?.name ?? "Tennis Club"}
//                 fill
//                 className="object-cover"
//               />
//             </div>
//             <CardHeader>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <CardTitle className="text-2xl">
//                     {club?.name ?? "Tennis Club"}
//                   </CardTitle>
//                   <CardDescription>
//                     {club?.address ?? "Address not available"}
//                   </CardDescription>
//                 </div>
//                 <div className="rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
//                   Open
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-2">
//                 <p className="text-sm text-gray-500">
//                   {club?.city
//                     ? `${club.city}, ${club.country ?? ""}`
//                     : "Location not available"}
//                 </p>
//                 <div className="flex flex-wrap gap-2">
//                   <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium">
//                     Tennis
//                   </span>
//                   {club?.website && (
//                     <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium">
//                       Website available
//                     </span>
//                   )}
//                   {club?.phone && (
//                     <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium">
//                       Phone available
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Calendar Section */}
//         <div>
//           <Card>
//             <CardHeader>
//               <CardTitle>Select Date</CardTitle>
//               <CardDescription>
//                 Choose a date to book your court
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="flex flex-col items-center space-y-4">
//                 <div className="inline-block rounded-md border p-4">
//                   {/* Calendar with selectable dates */}
//                   <div className="grid grid-cols-7 gap-2">
//                     {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
//                       <div
//                         key={day}
//                         className="text-center text-xs font-medium"
//                       >
//                         {day}
//                       </div>
//                     ))}
//                     {Array.from({ length: 35 }, (_, i) => {
//                       const date = new Date(
//                         today.getFullYear(),
//                         today.getMonth(),
//                         i - today.getDay() + 1,
//                       );

//                       const isCurrentMonth =
//                         date.getMonth() === today.getMonth();
//                       const isToday =
//                         date.getDate() === today.getDate() &&
//                         date.getMonth() === today.getMonth() &&
//                         date.getFullYear() === today.getFullYear();
//                       const isSelected =
//                         date.getDate() === selectedDate.getDate() &&
//                         date.getMonth() === selectedDate.getMonth() &&
//                         date.getFullYear() === selectedDate.getFullYear();
//                       const isDisabled = isPastDate(date) && !isToday;

//                       return (
//                         <button
//                           key={i}
//                           onClick={() =>
//                             !isDisabled && setSelectedDate(new Date(date))
//                           }
//                           disabled={isDisabled}
//                           className={`h-9 w-9 rounded-full text-center text-sm transition-colors focus:outline-none ${
//                             isDisabled
//                               ? "cursor-not-allowed text-gray-300"
//                               : isSelected
//                                 ? "bg-blue-600 text-white hover:bg-blue-700"
//                                 : isToday
//                                   ? "bg-green-600 text-white hover:bg-green-700"
//                                   : isCurrentMonth
//                                     ? "hover:bg-gray-100"
//                                     : "text-gray-400 hover:bg-gray-50"
//                           }`}
//                           aria-label={`Select ${format(date, "MMMM d, yyyy")}`}
//                         >
//                           {date.getDate()}
//                         </button>
//                       );
//                     })}
//                   </div>
//                 </div>
//                 <div className="text-sm text-gray-500">
//                   Selected date:{" "}
//                   <span className="font-medium">{formattedDate}</span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       {/* Courts and Availability */}
//       <div className="mt-8">
//         <h2 className="mb-4 text-2xl font-bold">Available Courts</h2>

//         {courts.length > 0 ? (
//           <CourtTabs courts={courts} />
//         ) : (
//           <p className="py-8 text-center text-gray-500">
//             No courts available at this club
//           </p>
//         )}
//       </div>
//     </main>
//   );
// }


// import { Button } from "@/components/ui/button";
// import {
//   TableBody,
//   TableCell,
//   TableRow,
// } from "@/components/ui/table";
// import { formatDate, formatCurrency } from "@/lib/utils";
// import { Eye, Printer } from "lucide-react";
// import Link from "next/link";

// const STATUS_STYLES: Record<string, string> = {
//   pending: "bg-yellow-100 text-yellow-800",
//   processing: "bg-blue-100 text-blue-800",
//   paid: "bg-green-100 text-green-800",
//   shipped: "bg-purple-100 text-purple-800",
//   out_for_delivery: "bg-orange-100 text-orange-800",
//   delivered: "bg-green-100 text-green-800",
//   cancelled: "bg-red-100 text-red-800",
// };

// export default function OrdersComponent({ orders }: { orders: any[] }) {
//   if (!orders?.length) return null;

//   return (
//     <TableBody>
//       {orders.map((order) => (
//         <TableRow key={order._id}>
//           <TableCell className="font-medium">#{order.orderNumber}</TableCell>
//           <TableCell>{formatDate(order.orderDate)}</TableCell>
//           <TableCell>{order.customerName}</TableCell>
//           <TableCell className="hidden sm:table-cell">
//             {order.email}
//           </TableCell>
//           <TableCell>
//             {formatCurrency(order.totalPrice, order.currency)}
//           </TableCell>
//           <TableCell>
//             <span className={`px-2 py-1 rounded text-xs capitalize ${STATUS_STYLES[order.status] || "bg-gray-100"}`}>
//               {order.status.replace(/_/g, ' ')}
//             </span>
//           </TableCell>
//           <TableCell className="hidden md:table-cell">
//             {order.invoice?.number || "N/A"}
//           </TableCell>
//           <TableCell className="flex justify-end gap-2">
//             <Button size="icon" variant="outline" asChild>
//               <Link href={`/orders/${order._id}`}>
//                 <Eye className="h-4 w-4" />
//               </Link>
//             </Button>
//             {order.invoice?.hosted_invoice_url && (
//               <Button size="icon" variant="outline" asChild>
//                 <a 
//                   href={order.invoice.hosted_invoice_url} 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   aria-label="Print invoice"
//                 >
//                   <Printer className="h-4 w-4" />
//                 </a>
//               </Button>
//             )}
//           </TableCell>
//         </TableRow>
//       ))}
//     </TableBody>
//   );
// }
import { Button } from "@/components/ui/button";
import {
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Eye, Printer } from "lucide-react";
import Link from "next/link";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  paid: "bg-green-100 text-green-800",
  shipped: "bg-purple-100 text-purple-800",
  out_for_delivery: "bg-orange-100 text-orange-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function OrdersComponent({ orders }: { orders: any[] }) {
  if (!orders || orders.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
            No orders found
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {orders.map((order) => (
        <TableRow key={order._id}>
          <TableCell className="font-medium">#{order.orderNumber}</TableCell>
          <TableCell>{formatDate(order.orderDate)}</TableCell>
          <TableCell>{order.customerName}</TableCell>
          <TableCell className="hidden sm:table-cell">
            {order.email}
          </TableCell>
          <TableCell>
            {formatCurrency(order.totalPrice, order.currency)}
          </TableCell>
          <TableCell>
            <span className={`px-2 py-1 rounded text-xs capitalize ${STATUS_STYLES[order.status] || "bg-gray-100"}`}>
              {order.status?.replace(/_/g, ' ') || 'unknown'}
            </span>
          </TableCell>
          <TableCell className="hidden md:table-cell">
            {order.invoice?.number || "N/A"}
          </TableCell>
          <TableCell className="flex justify-end gap-2">
            <Button size="icon" variant="outline" asChild>
              <Link href={`/orders/${order._id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            {order.invoice?.hosted_invoice_url && (
              <Button size="icon" variant="outline" asChild>
                <a 
                  href={order.invoice.hosted_invoice_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Print invoice"
                >
                  <Printer className="h-4 w-4" />
                </a>
              </Button>
            )}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
export function generateJastipInvoiceTemplate({
  spb,
  tableRows,
  totalQty,
  totalKg,
  totalPrice,
  formattedDate,
  time,
}: {
  spb: any;
  tableRows: string;
  totalQty: number;
  totalKg: number;
  totalPrice: number;
  formattedDate: string;
  time: string;
}) {
  return `
    <html>
      <head>
        <title>INVOICE JASA TITIPAN BARANG</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 2cm;
          }
          body {
            font-family: "Courier New", monospace;
            font-size: 12px;
            margin: 0;
            padding: 0;
          }
          h1, h2, h3, p {
            margin: 4px 0;
            text-align: center;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          td, th {
            border: 1px solid #000;
            padding: 4px;
            vertical-align: top;
          }
          .no-border {
            border: none !important;
          }
          .flex-row {
            display: flex;
            justify-content: space-between;
            margin: 4px 0;
            padding: 0 20px;
          }
          .signature {
            margin-top: 5px;
            width: 100%;
            text-align: center;
            table-layout: fixed;
          }
          .signature td {
            height: 35px;
            width: 33.33%;
            word-wrap: break-word;
            border: none;
            font-size: 10px; 
          }
          .footer-note {
            font-size: 10px;
            font-weight: bold;
          }
          .underline {
            text-decoration: underline;
          }
          .big-title {
            font-size: 50px;
          }
          td.number , th.number {
            text-align: right;
          }
          td.text , th.text {
            text-align: left;
          }
        </style>
      </head>
      <body>
        <h1 class="big-title">BFAP</h1>
        <div class="flex-row">
          <div>No D/O&emsp;: ${spb.invoice.invoice_no}</div>
          <div>Kepada&emsp;: ${spb.customer.name}</div>
        </div>
        <div class="flex-row">
          <div>Tgl D/O : ${formattedDate} Jam : ${time} WIB</div>
          <div>No Plat : ${spb.no_plat}</div>
        </div>
    
        <h1>INVOICE JASA TITIPAN BARANG</h1>
    
        <table>
          <tr>
            <th>No</th>
            <th>KETERANGAN BARANG</th>
            <th>TITIP</th>
            <th>QTY PACK</th>
            <th>JLH HARI</th>
            <th>VOL/KG</th>
            <th>JASTIP</th>
            <th>TTL CH.</th>
            <th>TOTAL FINE</th>
            <th>TOTAL JASTIP</th>
          </tr>
          ${tableRows}
          <tr>
            <th colspan="3">TOTAL</th>
            <th class="number">${totalQty}</th>
            <th></th>
            <th class="number">${totalKg.toLocaleString()}</th>
            <th></th>
            <th></th>
            <th></th>
            <th class="number">${totalPrice.toLocaleString()}</th>
          </tr>
        </table>
  
        <table class="signature">
          <tr>
            <td>DiKeluarkan Oleh,</td>
            <td>Disetujui Oleh,</td>
          </tr>
          <tr>
            <td>((Admin Gudang)</td>
            <td>Admin Kantor</td>
          </tr>
        </table>
  
        <div style="display: flex; align-items: flex-start; gap: 50px;">
          <div class="footer-note">
            NB: Barang diatas sudah diterima dengan cukup & baik.
          </div>
  
          <table style="border: 1px solid black; font-family: 'Courier New', monospace; font-size: 12px; margin-top: -50px; width: fit-content; font-weight:bold">
            <tr>
              <td colspan="1" style="border-bottom: 1px solid black;">Pembayaran ditransfer ke rekening</td>
            </tr>
            <tr>
              <td>BRI no rek :&nbsp;0634-01-000-131567<br>A/N&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: Roby Khong</td>
            </tr>
          </table>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            window.close();
          };
        </script>
      </body>
    </html>
    `;
}

// HOW TO USE
// const ExampleRouting2: React.FC = () => {
//     const spb = {
//       id: 56,
//       customer: {
//         id: 1,
//         name: "Customer Name",
//         code: "Customer Code",
//         address: "Customer Address",
//         is_deleted: false,
//         created_at: "2025-03-23T23:20:05.803Z",
//         updated_at: "2025-03-23T23:20:05.803Z",
//       },
//       customerId: 1,
//       invoice: {
//         id: 56,
//         customerId: 1,
//         invoice_no: "Customer Code-00056",
//         total_amount: 112002,
//         charge: 600,
//         fine: 0,
//         discount: 0,
//         total_order: 4,
//         total_order_converted: 6,
//         tax: 0,
//         status: "pending",
//         created_at: "2025-04-06T06:42:37.356Z",
//         updated_at: "2025-04-06T06:42:37.356Z",
//       },
//       invoiceId: 56,
//       no_plat: "asfd",
//       clock_out: "2025-04-06T13:41:15.000Z",
//       created_at: "2025-04-06T06:42:37.358Z",
//       updated_at: "2025-04-06T06:42:37.358Z",
//     };

//     const items = [
//       {
//         id: 80,
//         product: {
//           id: 2,
//           name: "Product Name 1",
//           price: 5000,
//           qty: 12,
//           desc: "Product description",
//           is_deleted: false,
//           created_at: "2025-03-23T23:17:19.465Z",
//           updated_at: "2025-04-06T06:42:37.000Z",
//         },
//         productId: 2,
//         customer: {
//           id: 1,
//           name: "Customer Name",
//           code: "Customer Code",
//           address: "Customer Address",
//           is_deleted: false,
//           created_at: "2025-03-23T23:20:05.803Z",
//           updated_at: "2025-03-23T23:20:05.803Z",
//         },
//         customerId: 1,
//         transaction_inId: 84,
//         invoiceId: 56,
//         spbId: 56,
//         qty: 2,
//         converted_qty: 2,
//         conversion_to_kg: 1,
//         unit: "afdafsd",
//         total_price: 10000,
//         total_fine: 0,
//         total_charge: 100,
//         price: 5000,
//         total_days: 1,
//         created_at: "2025-04-06T06:42:37.320Z",
//         updated_at: "2025-04-06T06:42:37.000Z",
//       },
//       {
//         id: 81,
//         product: {
//           id: 3,
//           name: "Product Name 2",
//           price: 1000,
//           qty: 10,
//           desc: "Product description",
//           is_deleted: false,
//           created_at: "2025-04-01T05:38:06.521Z",
//           updated_at: "2025-04-06T06:42:37.000Z",
//         },
//         productId: 3,
//         customer: {
//           id: 1,
//           name: "Customer Name",
//           code: "Customer Code",
//           address: "Customer Address",
//           is_deleted: false,
//           created_at: "2025-03-23T23:20:05.803Z",
//           updated_at: "2025-03-23T23:20:05.803Z",
//         },
//         customerId: 1,
//         transaction_inId: 88,
//         invoiceId: 56,
//         spbId: 56,
//         qty: 2,
//         converted_qty: 2,
//         conversion_to_kg: 1,
//         unit: "pack",
//         total_price: 2000,
//         total_fine: 0,
//         total_charge: 100,
//         price: 1000,
//         total_days: 0,
//         created_at: "2025-04-06T06:42:37.336Z",
//         updated_at: "2025-04-06T06:42:37.000Z",
//       },
//       {
//         id: 82,
//         product: {
//           id: 6,
//           name: "softspoken",
//           price: 50001,
//           qty: 8514,
//           desc: "hghey",
//           is_deleted: false,
//           created_at: "2025-04-01T07:58:48.145Z",
//           updated_at: "2025-04-06T06:42:37.000Z",
//         },
//         productId: 6,
//         customer: {
//           id: 1,
//           name: "Customer Name",
//           code: "Customer Code",
//           address: "Customer Address",
//           is_deleted: false,
//           created_at: "2025-03-23T23:20:05.803Z",
//           updated_at: "2025-03-23T23:20:05.803Z",
//         },
//         customerId: 1,
//         transaction_inId: 86,
//         invoiceId: 56,
//         spbId: 56,
//         qty: 0,
//         converted_qty: 2,
//         conversion_to_kg: 1700,
//         unit: "kotak",
//         total_price: 100002,
//         total_fine: 0,
//         total_charge: 100,
//         price: 50001,
//         total_days: 1,
//         created_at: "2025-04-06T06:42:37.350Z",
//         updated_at: "2025-04-06T06:42:37.000Z",
//       },
//     ];

//     const date = new Date(spb.clock_out);

//     // Format jam
//     const hours = date.getHours().toString().padStart(2, "0");
//     const minutes = date.getMinutes().toString().padStart(2, "0");
//     const time = `${hours}:${minutes}`;

//     // Format tanggal (D/M/Y)
//     const day = date.getDate().toString().padStart(2, "0");
//     const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 0-based index
//     const year = date.getFullYear();
//     const formattedDate = `${day}/${month}/${year}`;

//     // Build rows
//     let totalQty = 0;
//     let totalKg = 0;
//     let totalPrice = 0;

//     const tableRows = items
//       .map((item, i) => {
//         const name = item.product.name || "-";
//         const volume = item.converted_qty;
//         totalQty += item.qty;
//         totalKg += volume;
//         totalPrice += item.total_price;

//         const date = new Date(item.created_at);
//         date.setDate(date.getDate() - item.total_days);

//         const day = date.getDate().toString().padStart(2, "0");
//         const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 0-based index
//         const year = date.getFullYear();
//         const formattedDate = `${day}/${month}/${year}`;

//         return `
//           <tr>
//             <td class="number">${i + 1}</td>
//             <td class="text">${name.toUpperCase()}</td>
//             <td class="text">${formattedDate}</td>
//             <td class="number">${item.qty}</td>
//             <td class="number">${item.total_days}</td>
//             <td class="number">${volume.toLocaleString()}</td>
//             <td class="number">${item.price.toLocaleString()}</td>
//             <td class="number">${item.total_charge.toLocaleString()}</td>
//             <td class="number">${item.total_fine.toLocaleString()}</td>
//             <td class="text">${item.total_price.toLocaleString()}</td>
//           </tr>`;
//       })
//       .join("\n");

//     const handlePrint = () => {
//       const printWindow = window.open("", "_blank", "width=800,height=600");

//       if (!printWindow) {
//         alert("Popup blocked!");
//         return;
//       }

//       const htmlContent = generateJastipInvoiceTemplate({
//         spb,
//         tableRows,
//         totalQty,
//         totalKg,
//         totalPrice,
//         formattedDate,
//         time,
//       });

//       printWindow.document.open();
//       printWindow.document.write(htmlContent);
//       printWindow.document.close();
//     };

//     return <button onClick={handlePrint}>Print Invoice</button>;
//   };

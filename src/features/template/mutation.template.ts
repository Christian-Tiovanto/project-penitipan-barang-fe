import { formatDate } from "date-fns";
import { formatDateReport } from "../../utils/date";
import { Satellite } from "@mui/icons-material";

export function generateMutationHtml(
  startDate: Date,
  endDate: Date,
  customerName: string,
  tableRows: string
) {
  return `
          <html>
            <head>
              <title>LAPORAN SUMMARY MUTASI BARANG TITIPAN PER CUSTOMER</title>
              <style>
                @page { size: A4 landscape; margin: 2cm; }
                body { font-family: "Courier New", monospace; font-size: 15px; margin: 0; padding: 0; }
                h1, h2, h3, p { margin: 4px 0; text-align: center; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                td, th { border: 1px solid #000; padding: 4px; vertical-align: top; }
                .no-border { border: none !important; }
                .flex-row { display: flex; justify-content: space-between; margin: 4px 0; padding: 0 20px; }
                .signature { margin-top: 5px; width: 100%; text-align: center; table-layout: fixed; }
                .signature td { height: 35px; width: 33.33%; word-wrap: break-word; border: none; font-size: 15px; }
                .footer-note { font-size: 15px; font-weight: bold; }
                .underline { text-decoration: underline; }
                .big-title { font-size: 50px; }
                td.number , th.number { text-align: right; }
                td.text , th.text { text-align: left; }
              </style>
            </head>
            <body>
              <h1 class="big-title">BFAP</h1>
              <div class="flex-row">
              <div>From Period&emsp;: ${formatDateReport(
                startDate
              )} To : ${formatDateReport(endDate)}</div>
                <div>Customer&emsp;: ${customerName}</div>
              </div>
      
              <h1>LAPORAN SUMMARY MUTASI BARANG TITIPAN PER CUSTOMER</h1>
      
              <table>
                <tr>
                  <th>Tanggal</th>
                  <th>Masuk</th>
                  <th>Keluar</th>
                  <th>SISA</th>
                </tr>
                ${tableRows}
              </table>
      
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

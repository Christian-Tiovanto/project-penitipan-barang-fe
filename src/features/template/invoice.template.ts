export function generateJastipInvoiceTemplate({
  spb,
  tableRows,
  totalQty,
  totalKg,
  totalPrice,
  totalFine,
  totalCharge,
  formattedDate,
  time,
}: {
  spb: any;
  tableRows: string;
  totalQty: number;
  totalKg: number;
  totalPrice: number;
  totalFine: number;
  totalCharge: number;
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
          font-size: 15px;
          margin: 0;
          padding: 0;
        }
        h1,
        h2,
        h3,
        p {
          margin: 4px 0;
          text-align: center;
        }
        .content-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        .content-table td,
        .content-table th {
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
          max-width: 70%;
          margin: 4px auto;
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
          font-size: 15px;
        }
        .footer-note {
          font-size: 15px;
          font-weight: bold;
        }
        .desc-note {
          font-size: 15px;
        }
        .underline {
          text-decoration: underline;
        }
        h1.big-title {
          font-size: 50px;
          margin: 0;
        }
        td.number,
        th.number {
          text-align: right;
        }
        td.text,
        th.text {
          text-align: left;
        }
        .header-table tr td:first-child {
          width: 10%;
          /* opsional supaya text di kiri */
          vertical-align: middle;
        }
        .header-table tr td:last-child {
          width: 10%;
          /* opsional supaya text di kiri */
          vertical-align: middle;
        }
        .header-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        .header-table td,
        .header-table th {
          padding: 0;
          vertical-align: bottom;
        }
        </style>
      </head>
      <body>        
        <table class="header-table">
        <tr>
          <td>
            <h1 class="big-title">BHC</h1>
          </td>
          <td>
            <div class="flex-row">
              <div>
              <div>No D/O&nbsp;&nbsp;: ${spb.invoice.invoice_no}</div>
              <div>Tgl D/O&nbsp;: ${formattedDate}</div>
              </div>
              <div>
              <div>Kepada&nbsp;: ${spb.customer.name}</div>
              <div>No Plat: ${spb.no_plat} Jam : ${time} </div>
              </div>
            </div>
            <h1>INVOICE JASA TITIPAN BARANG</h1>
          </td>
          <td></td>
        </tr>
      </table>
    

    
        <table class="content-table">
          <tr>
            <th>No</th>
            <th style="width: 350px;">KETERANGAN BARANG</th>
            <th>TITIP</th>
            <th>QTY PACK</th>
            <th>JLH HARI</th>
            <th>VOL/KG</th>
            <th>JASTIP</th>
            <th>TOTAL CH</th>
            <th>TOTAL JASTIP</th>
          </tr>
          ${tableRows}
          <tr>
            <th colspan="3">TOTAL</th>
            <th class="number">${totalQty}</th>
            <th></th>
            <th class="number">${totalKg.toLocaleString()}</th>
            <th></th>
            <th class="number">${totalCharge.toLocaleString()}</th>
            <th class="number">${(
              totalPrice +
              totalFine +
              totalCharge
            ).toLocaleString()}</th>
          </tr>
        </table>
  
        <table class="signature">
          <tr>
            <td>DiKeluarkan Oleh,</td>
            <td>Disetujui Oleh,</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
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
  
          <table style="border: 1px solid black; font-family: 'Courier New', monospace; font-size: 15px; margin-top: 0px; width: fit-content; font-weight:bold">
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

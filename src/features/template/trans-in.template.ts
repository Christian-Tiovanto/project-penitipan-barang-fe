export function generateTransInHtml(
  transInHeader: any,
  formattedDate: string,
  time: string,
  tableRows: string,
  totalQty: number,
  totalKg: number
) {
  return `
        <html>
          <head>
            <title>SURAT TANDA TERIMA BARANG</title>
            <style>
              @page { size: A4 landscape; margin: 2cm; }
              body { font-family: "Courier New", monospace; font-size: 12px; margin: 0; padding: 0; }
              h1, h2, h3, p { margin: 4px 0; text-align: center; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              td, th { border: 1px solid #000; padding: 4px; vertical-align: top; }
              .no-border { border: none !important; }
              .flex-row { display: flex; justify-content: space-between; margin: 4px 0; padding: 0 20px; }
              .signature { margin-top: 5px; width: 100%; text-align: center; table-layout: fixed; }
              .signature td { height: 35px; width: 33.33%; word-wrap: break-word; border: none; font-size: 10px; }
              .footer-note { font-size: 10px; font-weight: bold; }
              .underline { text-decoration: underline; }
              .big-title { font-size: 50px; }
              td.number , th.number { text-align: right; }
              td.text , th.text { text-align: left; }
            </style>
          </head>
          <body>
            <h1 class="big-title">BFAP</h1>
            <div class="flex-row">
              <div>No Trans In&emsp;: ${transInHeader.code}</div>
              <div>Dari&emsp;: ${transInHeader.customer.name}</div>
            </div>
            <div class="flex-row">
              <div>Tgl Trans In : ${formattedDate} Jam : ${time} WIB</div>
            </div>
    
            <h1>SURAT TANDA TERIMA BARANG</h1>
    
            <table>
              <tr>
                <th>No</th>
                <th>KETERANGAN BARANG</th>
                <th>QTY</th>
                <th>UNIT</th>
                <th>VOL/KG</th>
              </tr>
              ${tableRows}
              <tr>
                <th colspan="2">TOTAL</th>
                <th class="number">${totalQty}</th>
                <th></th>
                <th class="number">${totalKg.toLocaleString()}</th>
              </tr>
            </table>
    
            <table class="signature">
              <tr>
                <td>Diterima Oleh,</td>
                <td>Petugas Telly,</td>
              </tr>
              <tr>
                <td>((Admin Gudang)</td>
                <td>(Nama Jelas & T/T)</td>
              </tr>
            </table>
    
            <div class="footer-note">
              NB: Barang diatas sudah diterima dengan cukup & baik.
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

export const generatePurchaseHistoryEmailTemplate = (purchaseHistory: any) => {
  const purchaseDetails = purchaseHistory
    .map(
      (purchase: any) => `
      <div style="margin-bottom: 20px;">
        <h3 style="margin-bottom: 10px;">Date: ${new Date(
          purchase.createdAt
        ).toLocaleString()}</h3>
        <p><strong>Total Items:</strong> ${purchase.totalItems}</p>
        <p><strong>Total Price:</strong> $${purchase.totalPrice}</p>
        <h4 style="margin-bottom: 5px;">Products:</h4>
        <table style="border-collapse: collapse; width: 100%;">
          <thead>
            <tr>
              <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Name</th>
              <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Quantity</th>
              <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${purchase.products
              .map(
                (product: any) => `
              <tr>
                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${product.product.name}</td>
                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${product.quantity}</td>
                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">$${product.price}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `
    )
    .join("");

  return `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              color: #333;
            }
            h3, h4 {
              color: #007bff;
            }
          </style>
        </head>
        <body>
          <h2>Purchase History Details</h2>
          ${purchaseDetails}
        </body>
      </html>
    `;
};

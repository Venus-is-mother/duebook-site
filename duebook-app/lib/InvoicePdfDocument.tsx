import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20, borderBottomWidth: 1, borderBottomColor: "#ddd", paddingBottom: 14 },
  bizName: { fontSize: 16, fontWeight: 700 },
  metaRight: { textAlign: "right", fontSize: 10, color: "#555" },
  billTo: { marginBottom: 16, color: "#555" },
  tableHeader: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#333", paddingBottom: 6, marginBottom: 6 },
  tableRow: { flexDirection: "row", paddingVertical: 5, borderBottomWidth: 0.5, borderBottomColor: "#eee" },
  colDesc: { flex: 3 },
  colQty: { flex: 1, textAlign: "right" },
  colPrice: { flex: 1.5, textAlign: "right" },
  colTotal: { flex: 1.5, textAlign: "right" },
  totalRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 16, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#333" },
  totalLabel: { fontSize: 13, fontWeight: 700, marginRight: 20 },
  totalValue: { fontSize: 15, fontWeight: 700 },
});

type Props = {
  invoice: {
    invoiceNumber: string;
    clientName: string;
    clientEmail: string | null;
    currency: string;
    total: string;
    createdAt: Date;
  };
  items: { description: string; quantity: string; unitPrice: string }[];
  businessName: string;
};

export function InvoiceDocument({ invoice, items, businessName }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.bizName}>{businessName || "Your Business"}</Text>
          <View style={styles.metaRight}>
            <Text>{invoice.invoiceNumber}</Text>
            <Text>{new Date(invoice.createdAt).toLocaleDateString()}</Text>
          </View>
        </View>

        <View style={styles.billTo}>
          <Text>Bill to: {invoice.clientName}</Text>
          {invoice.clientEmail ? <Text>{invoice.clientEmail}</Text> : null}
        </View>

        <View style={styles.tableHeader}>
          <Text style={styles.colDesc}>Description</Text>
          <Text style={styles.colQty}>Qty</Text>
          <Text style={styles.colPrice}>Unit price</Text>
          <Text style={styles.colTotal}>Total</Text>
        </View>

        {items.map((item, i) => {
          const qty = Number(item.quantity) || 0;
          const price = Number(item.unitPrice) || 0;
          return (
            <View style={styles.tableRow} key={i}>
              <Text style={styles.colDesc}>{item.description}</Text>
              <Text style={styles.colQty}>{qty}</Text>
              <Text style={styles.colPrice}>{invoice.currency} {price.toLocaleString()}</Text>
              <Text style={styles.colTotal}>{invoice.currency} {(qty * price).toLocaleString()}</Text>
            </View>
          );
        })}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total due</Text>
          <Text style={styles.totalValue}>{invoice.currency} {Number(invoice.total).toLocaleString()}</Text>
        </View>
      </Page>
    </Document>
  );
}
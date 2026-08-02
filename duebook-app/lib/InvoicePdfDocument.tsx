import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const NAVY = "#12213A";
const GOLD = "#C89B3C";
const GREEN = "#2F6D4F";
const SLATE = "#5B6472";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica", color: "#1a1a1a" },
  watermark: {
    position: "absolute",
    bottom: 18,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 7.5,
    color: "#aaaaaa",
  },

  // shared table bits
  tableHeader: { flexDirection: "row", borderBottomWidth: 1, paddingBottom: 6, marginBottom: 6 },
  tableRow: { flexDirection: "row", paddingVertical: 5, borderBottomWidth: 0.5, borderBottomColor: "#eee" },
  colDesc: { flex: 3 },
  colQty: { flex: 1, textAlign: "right" },
  colPrice: { flex: 1.5, textAlign: "right" },
  colTotal: { flex: 1.5, textAlign: "right" },

  // BASIC
  basicHead: { marginBottom: 18, paddingBottom: 12, borderBottomWidth: 0.5, borderBottomColor: "#ccc" },
  basicBiz: { fontSize: 13, fontWeight: 700 },
  basicMeta: { fontSize: 9.5, color: SLATE, marginTop: 4 },
  basicTotalRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 14, paddingTop: 8 },

  // STANDARD
  stdHead: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  stdBiz: { fontSize: 17, fontWeight: 700, color: NAVY },
  stdRule: { height: 2, backgroundColor: GOLD, marginTop: 8, marginBottom: 20, width: 60 },
  stdMetaRight: { textAlign: "right", fontSize: 9.5, color: SLATE },
  stdBillTo: { marginBottom: 18, color: SLATE, fontSize: 10.5 },
  stdTotalBox: { marginTop: 18, paddingTop: 12, borderTopWidth: 1, borderTopColor: NAVY, flexDirection: "row", justifyContent: "flex-end" },
  stdFooter: { marginTop: 30, fontSize: 9.5, color: SLATE, fontStyle: "italic" },

  // SALES
  salesBanner: { backgroundColor: GOLD, padding: "14 20", marginBottom: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  salesBannerText: { fontSize: 15, fontWeight: 700, color: "#12213A" },
  salesBannerMeta: { fontSize: 9, color: "#12213A" },
  salesRow: { flexDirection: "row", paddingVertical: 6, borderBottomWidth: 0.5, borderBottomColor: "#eee" },
  salesItemName: { flex: 3, fontWeight: 700, fontSize: 11 },
  salesTotalRow: { marginTop: 16, paddingTop: 10, borderTopWidth: 1.5, borderTopColor: GOLD, flexDirection: "row", justifyContent: "space-between" },
  salesThanks: { marginTop: 24, fontSize: 10, textAlign: "center", color: SLATE },

  // CORPORATE
  corpHead: { flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 2, borderBottomColor: NAVY, paddingBottom: 16, marginBottom: 4 },
  corpHeadInner: { borderBottomWidth: 0.5, borderBottomColor: NAVY, paddingBottom: 16, width: "100%" },
  corpBiz: { fontSize: 16, fontFamily: "Times-Bold" },
  corpBizSub: { fontSize: 8.5, color: SLATE, fontFamily: "Times-Roman", marginTop: 3 },
  corpMetaRight: { textAlign: "right", fontSize: 9.5, fontFamily: "Times-Roman", color: SLATE },
  corpBillTo: { marginTop: 20, marginBottom: 18, fontFamily: "Times-Roman", fontSize: 10.5 },
  corpTotalBox: { marginTop: 20, paddingTop: 4, alignSelf: "flex-end", width: 220 },
  corpTotalLine: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4, fontFamily: "Times-Roman", fontSize: 10.5 },
  corpTotalFinal: { flexDirection: "row", justifyContent: "space-between", paddingTop: 8, marginTop: 4, borderTopWidth: 1, borderTopColor: NAVY, fontFamily: "Times-Bold", fontSize: 13 },
  corpTerms: { marginTop: 34, fontSize: 8.5, fontFamily: "Times-Roman", color: SLATE, lineHeight: 1.5 },
});

type Item = { description: string; quantity: string; unitPrice: string };
type InvoiceProps = {
  invoice: {
    invoiceNumber: string;
    clientName: string;
    clientEmail: string | null;
    currency: string;
    total: string;
    tax: string;
    createdAt: Date;
    template: string;
  };
  items: Item[];
  businessName: string;
};

function Watermark() {
  return <Text style={styles.watermark} fixed>Made with Duebook</Text>;
}

function money(currency: string, n: number) {
  return `${currency} ${n.toLocaleString()}`;
}

function BasicTemplate({ invoice, items, businessName }: InvoiceProps) {
  const total = Number(invoice.total);
  return (
    <>
      <View style={styles.basicHead}>
        <Text style={styles.basicBiz}>{businessName}</Text>
        <Text style={styles.basicMeta}>{invoice.invoiceNumber} · {new Date(invoice.createdAt).toLocaleDateString()}</Text>
        <Text style={styles.basicMeta}>To: {invoice.clientName}</Text>
      </View>
      <View style={styles.tableHeader}>
        <Text style={styles.colDesc}>Item</Text>
        <Text style={styles.colQty}>Qty</Text>
        <Text style={styles.colTotal}>Amount</Text>
      </View>
      {items.map((item, i) => {
        const qty = Number(item.quantity) || 0;
        const price = Number(item.unitPrice) || 0;
        return (
          <View style={styles.tableRow} key={i}>
            <Text style={styles.colDesc}>{item.description}</Text>
            <Text style={styles.colQty}>{qty}</Text>
            <Text style={styles.colTotal}>{money(invoice.currency, qty * price)}</Text>
          </View>
        );
      })}
      <View style={styles.basicTotalRow}>
        <Text style={{ fontSize: 13, fontWeight: 700 }}>Total: {money(invoice.currency, total)}</Text>
      </View>
    </>
  );
}

function StandardTemplate({ invoice, items, businessName }: InvoiceProps) {
  const total = Number(invoice.total);
  return (
    <>
      <View style={styles.stdHead}>
        <Text style={styles.stdBiz}>{businessName}</Text>
        <View style={styles.stdMetaRight}>
          <Text>{invoice.invoiceNumber}</Text>
          <Text>{new Date(invoice.createdAt).toLocaleDateString()}</Text>
        </View>
      </View>
      <View style={styles.stdRule} />
      <View style={styles.stdBillTo}>
        <Text>Bill to</Text>
        <Text style={{ color: NAVY, fontWeight: 700, fontSize: 12, marginTop: 2 }}>{invoice.clientName}</Text>
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
            <Text style={styles.colPrice}>{money(invoice.currency, price)}</Text>
            <Text style={styles.colTotal}>{money(invoice.currency, qty * price)}</Text>
          </View>
        );
      })}
      <View style={styles.stdTotalBox}>
        <Text style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>Total due: {money(invoice.currency, total)}</Text>
      </View>
      <Text style={styles.stdFooter}>Thank you for your business.</Text>
    </>
  );
}

function SalesTemplate({ invoice, items, businessName }: InvoiceProps) {
  const total = Number(invoice.total);
  return (
    <>
      <View style={styles.salesBanner}>
        <Text style={styles.salesBannerText}>{businessName}</Text>
        <View>
          <Text style={styles.salesBannerMeta}>{invoice.invoiceNumber}</Text>
          <Text style={styles.salesBannerMeta}>{new Date(invoice.createdAt).toLocaleDateString()}</Text>
        </View>
      </View>
      <Text style={{ fontSize: 10, color: SLATE, marginBottom: 14 }}>Sold to: {invoice.clientName}</Text>
      {items.map((item, i) => {
        const qty = Number(item.quantity) || 0;
        const price = Number(item.unitPrice) || 0;
        return (
          <View style={styles.salesRow} key={i}>
            <Text style={styles.salesItemName}>{item.description}</Text>
            <Text style={styles.colQty}>x{qty}</Text>
            <Text style={styles.colTotal}>{money(invoice.currency, qty * price)}</Text>
          </View>
        );
      })}
      <View style={styles.salesTotalRow}>
        <Text style={{ fontSize: 13, fontWeight: 700 }}>TOTAL</Text>
        <Text style={{ fontSize: 15, fontWeight: 700 }}>{money(invoice.currency, total)}</Text>
      </View>
      <Text style={styles.salesThanks}>Thank you for your purchase!</Text>
    </>
  );
}

function CorporateTemplate({ invoice, items, businessName }: InvoiceProps) {
  const subtotal = Number(invoice.total) - Number(invoice.tax || 0);
  const tax = Number(invoice.tax || 0);
  const total = Number(invoice.total);
  return (
    <>
      <View style={styles.corpHead}>
        <View style={styles.corpHeadInner}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View>
              <Text style={styles.corpBiz}>{businessName}</Text>
              <Text style={styles.corpBizSub}>Invoice</Text>
            </View>
            <View style={styles.corpMetaRight}>
              <Text>{invoice.invoiceNumber}</Text>
              <Text>{new Date(invoice.createdAt).toLocaleDateString()}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.corpBillTo}>
        <Text style={{ color: SLATE, fontSize: 9 }}>BILLED TO</Text>
        <Text style={{ fontSize: 12, marginTop: 2 }}>{invoice.clientName}</Text>
        {invoice.clientEmail ? <Text style={{ fontSize: 9.5, color: SLATE }}>{invoice.clientEmail}</Text> : null}
      </View>
      <View style={styles.tableHeader}>
        <Text style={[styles.colDesc, { fontFamily: "Times-Bold" }]}>Description</Text>
        <Text style={[styles.colQty, { fontFamily: "Times-Bold" }]}>Qty</Text>
        <Text style={[styles.colPrice, { fontFamily: "Times-Bold" }]}>Unit price</Text>
        <Text style={[styles.colTotal, { fontFamily: "Times-Bold" }]}>Total</Text>
      </View>
      {items.map((item, i) => {
        const qty = Number(item.quantity) || 0;
        const price = Number(item.unitPrice) || 0;
        return (
          <View style={styles.tableRow} key={i}>
            <Text style={[styles.colDesc, { fontFamily: "Times-Roman" }]}>{item.description}</Text>
            <Text style={[styles.colQty, { fontFamily: "Times-Roman" }]}>{qty}</Text>
            <Text style={[styles.colPrice, { fontFamily: "Times-Roman" }]}>{money(invoice.currency, price)}</Text>
            <Text style={[styles.colTotal, { fontFamily: "Times-Roman" }]}>{money(invoice.currency, qty * price)}</Text>
          </View>
        );
      })}
      <View style={styles.corpTotalBox}>
        <View style={styles.corpTotalLine}>
          <Text>Subtotal</Text>
          <Text>{money(invoice.currency, subtotal)}</Text>
        </View>
        {tax > 0 && (
          <View style={styles.corpTotalLine}>
            <Text>Tax</Text>
            <Text>{money(invoice.currency, tax)}</Text>
          </View>
        )}
        <View style={styles.corpTotalFinal}>
          <Text>Total due</Text>
          <Text>{money(invoice.currency, total)}</Text>
        </View>
      </View>
      <Text style={styles.corpTerms}>
        Payment is due within 14 days of the invoice date. Please reference the invoice number above with your payment.
      </Text>
    </>
  );
}

export function InvoiceDocument({ invoice, items, businessName }: InvoiceProps) {
  const template = (invoice.template || "BASIC").toUpperCase();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {template === "STANDARD" && <StandardTemplate invoice={invoice} items={items} businessName={businessName} />}
        {template === "SALES" && <SalesTemplate invoice={invoice} items={items} businessName={businessName} />}
        {template === "CORPORATE" && <CorporateTemplate invoice={invoice} items={items} businessName={businessName} />}
        {(template === "BASIC" || !["STANDARD", "SALES", "CORPORATE"].includes(template)) && (
          <BasicTemplate invoice={invoice} items={items} businessName={businessName} />
        )}
        <Watermark />
      </Page>
    </Document>
  );
}
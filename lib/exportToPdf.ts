import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Export a DOM element (ref) to PDF
 * @param element HTMLElement to export
 * @param filename Optional filename, default: export.pdf
 */
export async function exportToPDF(
  element: HTMLElement,
  filename: string = "export.pdf"
): Promise<void> {
  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = (canvas.height * pageWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
  pdf.save(filename);
}

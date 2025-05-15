import { EventEmitter } from "events";
import { sendPrescriptionPDF } from "../../utils/prescriptionGeneration";

export const prescriptionEmitter = new EventEmitter();
console.log("prescriptionEmitter");

prescriptionEmitter.on("check:com", () => {
    console.log("i am working fine");
});

// Emit the "check" event
prescriptionEmitter.emit("check:com");


prescriptionEmitter.on("prescription:created", async (email, prescription) => {
  try {
    console.log("i am called")
    await sendPrescriptionPDF(email, prescription)
  } catch (error) {
    console.error("Email failed, retrying...");
    // retyr_mechanism (setTimeout or requeue into a DB for retry logic)
  }
});

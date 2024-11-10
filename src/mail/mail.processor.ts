import { Processor, Process } from "@nestjs/bull";
import { Job } from "bull";
import { MailService } from "./mail.service";

@Processor("mail")
export class MailProcessor {
  constructor(private readonly mailService: MailService) {}

  @Process("verification")
  async handleVerification(job: Job<{ to: string; token: string }>) {
    try {
      await this.mailService.sendVerificationEmail(job.data.to, job.data.token);
      console.log(`Email sent to ${job.data.to}`);
    } catch (error) {
      console.error("Failed to send email", error.message);
    }
  }

  @Process("statusUpdate")
  async handleStatusUpdate(job: Job<{ userEmail: string; orderId: number; status: string }>) {
    try {
      await this.mailService.sendOrderStatusUpdateEmail(job.data.userEmail, job.data.orderId, job.data.status);
      console.log(`Email for update status sent to ${job.data.userEmail}`);
    } catch (error: any) {
      console.error("Failed to send update message due:", error.message);
    }
  }
}

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
}

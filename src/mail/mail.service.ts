import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import * as nodemailer from "nodemailer";

@Injectable()
export class MailService {
  private transporter;

  constructor(@InjectQueue("mail") private readonly mailQueue: Queue) {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  async sendOrderStatusUpdateEmail(userEmail: string, orderId: number, newStatus: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Your Order #${orderId} Status Update`,
      text: `Dear customer, your order #${orderId} has been updated to ${newStatus}.`,
    };

    await this.transporter.sendMail(mailOptions);
  }
  async AddStatusUpdateEmail(userEmail: string, orderId: number, status: string) {
    await this.mailQueue.add("statusUpdate", { userEmail, orderId, status });
  }
  async AddVerification(to: string, token: string) {
    await this.mailQueue.add("verification", { to, token });
  }
  async sendVerificationEmail(to: string, verificationToken: string) {
    const subject = "Please verify your email";
    const text = `Click this link to verify your email: http://${process.env.HOST}:${process.env.PORT}/verify?token=${verificationToken}`;
    const mailOptions = { from: process.env.EMAIL_USER, to, subject, text };
    await this.transporter.sendMail(mailOptions);
  }
}

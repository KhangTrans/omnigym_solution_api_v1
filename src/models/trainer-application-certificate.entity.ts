import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { TrainerApplication } from "./trainer-application.entity.js";
import { User } from "./user.entity.js";
import { CertificateStatus } from "./trainer-status.enum.js";

@Entity("trainer_application_certificates")
export class TrainerApplicationCertificate {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "application_id", type: "int" })
  application_id!: number;

  @ManyToOne(
    () => TrainerApplication,
    (application) => application.certificates,
  )
  @JoinColumn({ name: "application_id" })
  application!: TrainerApplication;

  @Column({ type: "varchar", nullable: true })
  cert_name?: string;

  @Column({ type: "varchar", nullable: true })
  issued_by?: string;

  @Column({ type: "varchar", nullable: true })
  certificate_number?: string;

  @Column({ type: "text", nullable: true })
  image_url?: string;

  @Column({ type: "timestamp", nullable: true })
  issued_at?: Date;

  @Column({ type: "timestamp", nullable: true })
  expires_at?: Date;

  @Column({
    type: "enum",
    enum: CertificateStatus,
    enumName: "certificate_status",
    default: CertificateStatus.Pending,
  })
  status!: CertificateStatus;

  @Column({ type: "timestamp", nullable: true })
  verified_at?: Date;

  @Column({ type: "int", nullable: true })
  verified_by?: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "verified_by" })
  verifier?: User;

  @Column({ type: "text", nullable: true })
  rejection_reason?: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;
}

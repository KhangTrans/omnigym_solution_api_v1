import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Trainer } from "./trainer.entity.js";
import { User } from "./user.entity.js";
import { TrainerApplicationCertificate } from "./trainer-application-certificate.entity.js";
import { CertificateStatus } from "./trainer-status.enum.js";

@Entity("trainer_certificates")
export class TrainerCertificate {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "trainer_id", type: "int" })
  trainer_id!: number;

  @ManyToOne(() => Trainer)
  @JoinColumn({ name: "trainer_id" })
  trainer!: any;

  @Column({ type: "varchar", nullable: true })
  cert_name?: string;

  @Column({ type: "varchar", nullable: true })
  issued_by?: string;

  @Column({ type: "varchar", nullable: true })
  image_url?: string;

  @Column({ type: "timestamp", nullable: true })
  verified_at?: Date;

  @Column({
    type: "enum",
    enum: CertificateStatus,
    enumName: "certificate_status",
    default: CertificateStatus.Pending,
  })
  status!: CertificateStatus;

  @Column({
    name: "source_application_certificate_id",
    type: "int",
    nullable: true,
  })
  source_application_certificate_id?: number;

  @ManyToOne(() => TrainerApplicationCertificate, { nullable: true })
  @JoinColumn({ name: "source_application_certificate_id" })
  source_application_certificate?: TrainerApplicationCertificate;

  @Column({ type: "varchar", nullable: true })
  certificate_number?: string;

  @Column({ type: "timestamp", nullable: true })
  expires_at?: Date;

  @Column({ type: "timestamp", nullable: true })
  issued_at?: Date;

  @Column({ type: "int", nullable: true })
  verified_by?: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "verified_by" })
  verifier?: any;

  @Column({ type: "text", nullable: true })
  rejection_reason?: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;
}

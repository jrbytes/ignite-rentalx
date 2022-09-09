import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'
import { v4 as uuid } from 'uuid'

import { EntityNames } from '@shared/infra/typeorm/migrations/entityNames'

@Entity(EntityNames.RENTALS)
export class Rental {
  @PrimaryColumn()
  id: string

  @Column('uuid')
  car_id: string

  @Column('uuid')
  user_id: string

  @Column({ type: 'timestamp with time zone' })
  start_date: Date

  @Column({ type: 'timestamp with time zone' })
  end_date: Date

  @Column()
  expected_return_date: Date

  @Column()
  total: number

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date

  constructor() {
    if (!this.id) {
      this.id = uuid()
    }
  }
}

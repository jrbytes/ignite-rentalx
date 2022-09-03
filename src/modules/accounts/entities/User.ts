import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'
import { v4 as uuid } from 'uuid'

import { EntityNames } from '../../../database/migrations/entityNames'

@Entity(EntityNames.USERS)
class User {
  @PrimaryColumn()
  id: string

  @Column()
  name: string

  @Column()
  password: string

  @Column()
  email: string

  @Column()
  driver_license: string

  @Column()
  isAdmin: boolean

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

export { User }

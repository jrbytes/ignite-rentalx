import {
  Column,
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import { v4 as uuid } from 'uuid'

import { EntityNames } from '@shared/infra/typeorm/migrations/entityNames'

import { Category } from './Category'
import { Specification } from './Specification'

@Entity(EntityNames.CARS)
class Car {
  @PrimaryColumn()
  id?: string

  @Column()
  name: string

  @Column()
  description: string

  @Column()
  daily_rate: number

  @Column('boolean', { default: true })
  available = true

  @Column()
  license_plate: string

  @Column()
  fine_amount: number

  @Column()
  brand: string

  @Column({ type: 'uuid' })
  category_id: string

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category

  @ManyToMany(() => Specification)
  @JoinTable({
    name: EntityNames.SPECIFICATIONS_CARS,
    joinColumns: [{ name: 'car_id' }],
    inverseJoinColumns: [{ name: 'specification_id' }],
  })
  specifications: Specification[]

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

export { Car }

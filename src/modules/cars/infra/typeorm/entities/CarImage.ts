import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { v4 as uuid } from 'uuid'

import { EntityNames } from '@shared/infra/typeorm/migrations/entityNames'

import { Car } from './Car'

@Entity(EntityNames.CAR_IMAGES)
class CarImage {
  @PrimaryColumn()
  id: string

  @Column()
  image_name: string

  @Column('uuid')
  car_id: string

  @ManyToOne(() => Car)
  @JoinColumn({ name: 'car_id' })
  car: Car

  @Column('timestamp with time zone')
  created_at: Date

  @Column('timestamp with time zone')
  updated_at: Date

  constructor() {
    if (!this.id) {
      this.id = uuid()
    }
  }
}

export { CarImage }

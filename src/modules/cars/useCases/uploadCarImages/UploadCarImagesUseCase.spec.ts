import { faker } from '@faker-js/faker'
import { CarsImagesRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarImagesRepositoryInMemory'

import { UploadCarImagesUseCase } from './UploadCarImagesUseCase'

let carsImagesRepositoryInMemory: CarsImagesRepositoryInMemory
let uploadCarImages: UploadCarImagesUseCase

describe('Upload car images', () => {
  beforeEach(() => {
    carsImagesRepositoryInMemory = new CarsImagesRepositoryInMemory()
    uploadCarImages = new UploadCarImagesUseCase(carsImagesRepositoryInMemory)
  })

  it('should be able to create a new car', async () => {
    await uploadCarImages.execute({
      car_id: faker.datatype.uuid(),
      images_name: ['image.jpg', 'image2.jpg'],
    })

    const carImages = carsImagesRepositoryInMemory.carsImages

    expect(carImages.length).toEqual(2)
    expect(carImages[1].image_name).toEqual('image2.jpg')
  })
})

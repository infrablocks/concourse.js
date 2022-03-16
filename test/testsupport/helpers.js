import { faker } from '@faker-js/faker'

export const randomLowerHex = (length) => {
  let count = length
  if (typeof count === 'undefined') {
    count = 1
  }

  let wholeString = ''
  for (let i = 0; i < count; i++) {
    wholeString += faker.random.arrayElement([
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
      'a', 'b', 'c', 'd', 'e', 'f'
    ])
  }

  return wholeString
}

export const randomLowerCaseWord = () => faker.lorem.word()
export const randomBoolean = () => faker.datatype.boolean()

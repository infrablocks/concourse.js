export const toOutput = client => outputData =>
  new Output({ ...outputData, client })

export default class Output {
  constructor ({ name, resource, client }) {
    this.name = name
    this.resource = resource
    this.client = client
  }

  getName () {
    return this.name
  }

  getResourceName () {
    return this.resource
  }
}

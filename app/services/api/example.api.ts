import api from "./api"

class ExampleApi {
  async getTodos() {
    const todos = await api.get("/todos")

    return todos.data
  }
}

const ExampleService = new ExampleApi()

export default ExampleService

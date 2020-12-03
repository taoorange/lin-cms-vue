import _axios, { get, put, _delete } from '@/lin/plugin/axios'

class Book {
  // constructor() {}

  async createBook(data) {
    return _axios({
      method: 'post',
      url: 'v1/book',
      data,
    })
  }

  // 列表接口
  async queryList(info) {
    const res = await get(`v1/book`, info)
    return res
  }

  async editBook(id, info) {
    const res = await put(`v1/book/${id}`, info)
    return res
  }

  async deleteBook(id) {
    const res = await _delete(`v1/book/${id}`)
    return res
  }

  async getBooks() {
    return _axios({
      method: 'get',
      url: 'v1/book',
      handleError: true,
    })
  }
}

export default new Book()

const { nanoid } = require('nanoid');
const booksDatabase = require('./books');

// Handler untuk menambah buku baru
const addNewBook = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // Validasi: nama buku wajib ada
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // Validasi: readPage tidak boleh lebih besar dari pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  // Generate ID unik dan timestamp
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  // Buat object buku baru
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  // Simpan ke database
  booksDatabase.push(newBook);

  // Response sukses
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  });
  response.code(201);
  return response;
};

// Handler untuk mendapatkan semua buku (dengan query filter)
const getAllBooks = (request, h) => {
  const { name, reading, finished } = request.query;

  let result = [...booksDatabase];

  // Filter berdasarkan nama (case insensitive)
  if (name !== undefined) {
    result = result.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  // Filter berdasarkan status reading
  if (reading !== undefined) {
    const isReading = reading === '1';
    result = result.filter((book) => book.reading === isReading);
  }

  // Filter berdasarkan status finished
  if (finished !== undefined) {
    const isFinished = finished === '1';
    result = result.filter((book) => book.finished === isFinished);
  }

  // Map ke format response (hanya id, name, publisher)
  const books = result.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  const response = h.response({
    status: 'success',
    data: {
      books,
    },
  });
  response.code(200);
  return response;
};

// Handler untuk mendapatkan detail buku berdasarkan ID
const getBookById = (request, h) => {
  const { id } = request.params;

  // Cari buku berdasarkan ID
  const book = booksDatabase.find((b) => b.id === id);

  // Jika tidak ditemukan
  if (book === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  // Jika ditemukan
  const response = h.response({
    status: 'success',
    data: {
      book,
    },
  });
  response.code(200);
  return response;
};

// Handler untuk update buku
const updateBookById = (request, h) => {
  const { id } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // Validasi: nama buku wajib ada
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // Validasi: readPage tidak boleh lebih besar dari pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  // Cari index buku
  const index = booksDatabase.findIndex((b) => b.id === id);

  // Jika buku tidak ditemukan
  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  // Update buku
  const updatedAt = new Date().toISOString();
  const finished = pageCount === readPage;

  booksDatabase[index] = {
    ...booksDatabase[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    updatedAt,
  };

  // Response sukses
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
  response.code(200);
  return response;
};

// Handler untuk hapus buku
const deleteBookById = (request, h) => {
  const { id } = request.params;

  // Cari index buku
  const index = booksDatabase.findIndex((b) => b.id === id);

  // Jika tidak ditemukan
  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  // Hapus buku dari array
  booksDatabase.splice(index, 1);

  // Response sukses
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
  response.code(200);
  return response;
};

module.exports = {
  addNewBook,
  getAllBooks,
  getBookById,
  updateBookById,
  deleteBookById,
};
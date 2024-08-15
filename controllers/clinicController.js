const { db } = require('../config/firebase');

const addBook = async (req, res) => {
  const { bookType, subject, grade, bookDesc, image, donorId, bookId } = req.body;

  try {
    const book = { bookType, subject, grade, bookDesc, image, bookId, donorId, status: 'available', timeStamp: new Date().toISOString() };
    const bookRef = db.ref('books/' + bookId);
    await bookRef.set(book);
    res.status(201).json({ message: 'Book added successfully', book });
  } catch (error) {
    res.status(500).json({ message: error.message });;
  }
};

const getBooks = async (req, res) => {
  try {
    const booksRef = db.ref('books');
    booksRef.orderByChild('status').once('value', (snapshot) => {
      if (!snapshot.exists()) {
        return res.status(400).json({ message: 'No books available' });
      }

      const books = snapshot.val();
      let booksList = Object.keys(books).map((key) => ({ id: key, ...books[key] }));
      booksList = booksList.filter((e) => e.status !== 'complete');
      res.status(200).json(booksList);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });;
  }
};

const markBookAsSold = async (req, res) => {
    const { id } = req.params;
  
    try {
      const bookRef = db.ref(`books/${id}`);
      await bookRef.update({ status: 'sold' });
      res.status(200).json({ message: 'Book marked as sold' });
    } catch (error) {
      res.status(500).json({ message: error.message });;
    }
};

const saveFormData = async (req, res) => {
    let data = req.body;
    data.timeStamp = new Date().toISOString();
    const id = data.uid ?? data.clinicPhoneNo;
  
    try {
      const builderForm = db.ref('builderForm/' + id);
      await builderForm.update(data);
      res.status(201).json({ message: 'Clinic data added successfully', data });
    } catch (error) {
      res.status(500).json({ message: error.message });;
    }
};

const getClinicData = async (req, res) => {
  let data = req.body;
  const id = data.id;
  try {
    const form = db.ref('builderForm/'+id);
    form.once('value', (snapshot) => {
      if (!snapshot.exists()) {
        return res.status(400).json({ message: 'Clinic details not available' });
      }

      const formData = snapshot.val();
      res.status(200).json({ message: 'Clinic data fetched successfully', data: formData });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });;
  }
};

const getBanners = async (req, res) => {
  try {
    const bannersRef = db.ref('banners');
    bannersRef.once('value', (snapshot) => {
      if (!snapshot.exists()) {
        return res.status(400).json({ message: 'No banners available' });
      }

      const banners = snapshot.val();
      let bannersList = Object.keys(banners).map((key) => ({ id: key, ...banners[key] }));
      res.status(200).json(bannersList);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });;
  }
};

module.exports = { saveFormData, getClinicData, getBanners };

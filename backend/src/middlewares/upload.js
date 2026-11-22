import multer from 'multer';

// Use memory storage for fast in-memory PDF parsing
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Check MIME type or file extension
  if (
    file.mimetype === 'application/pdf' ||
    file.originalname.toLowerCase().endsWith('.pdf')
  ) {
    cb(null, true);
  } else {
    const error = new Error('Invalid file type. Only PDF documents (.pdf) are allowed.');
    error.statusCode = 415; // Unsupported Media Type
    cb(error, false);
  }
};

export const uploadResumeMiddleware = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 1
  },
  fileFilter
}).single('resume');

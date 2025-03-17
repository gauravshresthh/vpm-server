import multer from 'multer';

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory where files will be saved
  },
  filename: (req, file, cb) => {
    // Split the original filename and its extension
    const fileName = file.originalname.replace(/\.[^/.]+$/, ''); // Get the name without extension
    const fileExtension = file.originalname.split('.').pop(); // Get the file extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

    // Combine the file name, unique suffix, and extension
    cb(null, `${fileName}-${uniqueSuffix}.${fileExtension}`);
  },
});

// File filter to only allow certain types of files
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error('Invalid file type. Only JPEG, PNG, and PDF files are allowed.')
    );
  }
};

const upload = multer({ storage, fileFilter });

export default upload;

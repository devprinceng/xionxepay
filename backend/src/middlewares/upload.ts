import multer from 'multer';
import  {storage}  from '../config/coudinary';

const upload = multer({ storage });

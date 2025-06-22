import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Vendor's name
    email: { type: String,required:true, unique: true }, // Vendor's email, must be unique
    password: String, // Vendor's password, can be hashed later
    businessName: { type: String, unique: true }, // Unique business name for the vendor
    businessDescription: { type: String}, // Description of the vendor's
    category: {type:String, required:true}, // Category of the vendor's business
    metaAccountEmail: { type: String, unique: true }, // Meta account email for the vendor
    phone: { type: String, required: true, unique: true }, // Vendor's phone number
    address: { type: String, required: true }, // Vendor's address
    city: { type: String, required: true }, // Vendor's city
    state: { type: String, required: true }, // Vendor's state
    country: { type: String, required: true }, // Vendor's country
    zip: { type: String, required: true }, // Vendor's zip code
    logo: { type: String, default: null }, // URL to vendor's business logo
    logoPublicId: { type: String, default: null }, // Public ID for the logo in cloud storage
    isVerified: {
        type: Boolean,
        default: false, // Indicates if the user's email is verified
    },vendorVerified: {
        type: Boolean,
        default: false, // Indicates if the user's email is verified
    },
    verifyOtp: {
        type: String,
        default: null, // OTP for email verification
    },
    verifyOtpExpiresAt: {
        type: Date,
        default: null, // Expiration time for the OTP
    },
    resetOtp: {
        type: String,
        default: null, // OTP for password reset
    },
    resetOtpExpiresAt: {
        type: Date,
        default: null, // Expiration time for password reset otp
    },
},
    {
        timestamps: true, // Automatically manage createdAt and updatedAt fields
    }
);

const Vendor = mongoose.model('Vendor', vendorSchema);

export { Vendor };
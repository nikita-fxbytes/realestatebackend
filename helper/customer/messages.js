module.exports = {
    serverError: "Internal server error",
    // Property
    property:{
        getProperty: "Property fetch successfully!"
    },
    // End
    // Role
    role:{
        roleFetch: "Role fetch successfully!",
        notFound:"Role not found"
    },
    auth:{
        createUser:"User create successfully!",
        loginUser: "login successfully!",
        invalidCredentials: "Invalid credentials",
        getUser: "User fetch successfully!", 
        userNotFound: "User not found" 
    },
    name:{
        required: 'Name is required',
        length:"Name must be at least 3 characters"
    },
    email: {
        required: 'Email is required',
        invalid: 'Invalid email format',
        taken: 'Email is already registered'
    },
    mobile: {
        required: 'Mobile number is required',
        invalid: 'Invalid mobile format',
        taken: 'Mobile number is already registered',
        length: 'Mobile number length should be between 10 and 15'
    },
    password: {
        required: 'Password is required',
        match:'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        length: 'Password must be at least 6 characters',
        matchToConfimPassword:"matchToConfimPassword",
        matchToPassword:"matchToPassword",
        confirmMatch:"The confirmation password does not match the password.",
        confirmRequired: 'Confirm assword is required',
        
    },
    // inquiry
    inquiry:{
        message: "Message is required",
        property: "Property is required",
        getInquiry: "Inquiry fetch successfully!",
        createInquiry: "Inquiry added successfully!",
        notFound:"Property not found",
        getRealtors: "Realtor fetch successfully!",
        notRealtorFound:"No realtors found"
    }
    // End
}
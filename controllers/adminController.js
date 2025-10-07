import Admin from '../models/adminModel.js';

// Admin login
export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }
    const adminUser = await Admin.find();
    if (adminUser.length === 0) {
      return res.status(403).json({ message: 'No admin user found. Please set up an admin account.' });
    }
    if (username === adminUser[0].username && password === adminUser[0].password) {
      req.session.admin = { username };
      return res.status(200).json({ success: true, message: 'Admin logged in successfully.' });
    }} catch (error) {
    res.status(500).json({ message: error.message });
  }};


  export const getAdminStatus = async(req,res)=>{
    try{
      const {id, email} = req.params;
      const admin = await Admin.findById(id);
      console.log(admin.email + " Triggered");
      if(!admin){
        return res.status(404).json({success:false, message: "Admin not found." })
      }else{
        res.status(200).json({success: true, data: admin})
      }

    }catch(error){
        res.status(500).json({message: error.message})
    }
  }



    
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  try {
    console.log('🔍 Testing MongoDB connection...');
    console.log('Connection string:', process.env.MONGO_URI?.replace(/:[^:@]+@/, ':****@'));
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully!');
    
    await mongoose.disconnect();
    console.log('✅ Connection test passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection failed!');
    console.error('Error:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.error('\n💡 Issue: Authentication failed');
      console.error('   - Check if your password is correct');
      console.error('   - Verify username: bhaddreshamudala');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('\n💡 Issue: Cannot reach MongoDB Atlas');
      console.error('   - Check your internet connection');
      console.error('   - Verify cluster URL is correct');
    } else if (error.message.includes('IP')) {
      console.error('\n💡 Issue: IP address not whitelisted');
      console.error('   - Go to MongoDB Atlas → Network Access');
      console.error('   - Add your current IP address (or 0.0.0.0/0 for all IPs)');
    }
    
    process.exit(1);
  }
};

testConnection();


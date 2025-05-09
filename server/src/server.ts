import app from './app';
import { connectDB } from './utils/db';

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  app.listen(5000, '0.0.0.0', () => {
    console.log("Server running on port 5000");
  });  
})();

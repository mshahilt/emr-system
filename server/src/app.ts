import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import patientRoutes from './routes/patient.routes';
import doctorRoutes from './routes/doctor.routes';
import bookingRoutes from './routes/booking.routes';
import medicineRoutes from "./routes/medicine.routes";
import prescriptionRoutes from "./routes/prescrition.routes"
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_, res) => {
    res.send('API is running');
});

app.get('/', (req, res) => {
    try {
        res.send("server is finiing")
    } catch (error) {
        
    }
})
app.use('/api/doctor', doctorRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/medicine', medicineRoutes);
app.use('/api/prescription', prescriptionRoutes);

export default app;

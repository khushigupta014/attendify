const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 4040;
const secret = "634659";
app.use(bodyParser.json());
app.use(cors());


mongoose.connect('mongodb+srv://karanprajapat824:karanprajapat824@cluster0.xescpid.mongodb.net/?retryWrites=true&w=majority',{
    useNewUrlParser : true,
    useUnifiedTopology : true
});

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    rollNumber: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    managementId : {
        type: String,
        required: true
    },
    className : {
        type : String,
        required : true
    },
    attendance: {
        totalPresent: {
            type: Number,
            default: 0
        },
        totalAbsent: {
            type: Number,
            default: 0
        },
        subjects: [{
            name: {
                type: String,
                required: true
            },
            present: {
                type: Number,
                default: 0
            },
            absent: {
                type: Number,
                default: 0
            }
        }]
    }
});

const managementSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address : {
        type : String,
        required : true
    },
    managementId : {
        type : String
    }
});

const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    managementId: {
        type : String,
        required: true
    },
    teacherId  : {
        type : String,
        required : true,
        unique : true
    }
});


const Management = mongoose.model('management',managementSchema);
const Student = mongoose.model('student',studentSchema);
const Teacher = mongoose.model('teacher',teacherSchema);

const verify = (req,res,next)=>{
    try{
        const token = req.headers.authorization;
        const json = jwt.verify(token,secret);
        req.user = json;
        next();
    }catch(error){
        res.status(404).json({message : "Invalid token"})
    }
}

app.post('/register', async (req, res) => {
    let { name, password,address } = req.body;
    name = name.toUpperCase();
    try {
        const existingManagement = await Management.findOne({name});
        if (existingManagement) {
            return res.status(400).json({ message: 'Management already exists' });
        }
        const newManagement = new Management({
            name,
            password,
            address
        });
        const savedManagement = await newManagement.save();
            const token = jwt.sign(
                {password,name,address},
                secret
        );
        savedManagement.managementId = savedManagement._id;
        await savedManagement.save();

        res.status(200).json({ message: 'Management registered successfully',
         token,
        _id : savedManagement._id
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.post('/login',async (req,res) => {
    try
    {
        let name = req.body.name;
        name = name.toUpperCase();
        const password = req.body.password;
        
        let existingManagement = await Management.findOne({name});
        
        if(!existingManagement)
        {
            return res.status(404).json({message : "management not found"});
        }
        
        if(existingManagement.password === password)
        {
            
            const management = {name,password,address : existingManagement.address,managementId : existingManagement._id};
            const token = jwt.sign(management,secret);
            return res.status(200).json({message : "login successfully ",
            token,
            managementData : management
         });
        }
        else 
        {
            return res.json({message : "Invalid password"});
        }
    }
    catch(error)
    {
        res.status(500).json({message : "internal server error",error})
    }
});

app.post('/addStudent',verify,async(req, res) => {
    const { name, age, address, rollNumber, gender, branch, managementId,className,attendance} = req.body;
    console.log(attendance);
    try {
        const management = await Management.findOne({managementId});
        if (!management) {
            return res.status(404).json({ message: 'Management not found' });
        }

        const newStudent = new Student({
            name,
            age,
            address,
            rollNumber,
            gender,
            branch,
            managementId : managementId,
            className,
            attendance
        });

        const savedStudent = await newStudent.save();

        res.status(201).json({ message: 'Student added successfully', student: savedStudent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.post('/addTeacher',verify, async (req, res) => {
    const { name, age, address, gender, managementId , teacherId} = req.body;

    try {
        const management = await Management.findOne({managementId});
        if (!management) {
            return res.status(404).json({ message: 'Management not found' });
        }

        const existingTeacher = await Teacher.findOne({teacherId});
        if(existingTeacher)
        {
            return res.status(404).json({ message: 'Teacheralready exist in the system' });
        }
        
        const newTeacher = new Teacher({
            name,
            age,
            address,
            gender,
            managementId: managementId,
            teacherId
        });

        const savedTeacher = await newTeacher.save();

        res.status(201).json({ message: 'Teacher added successfully', teacher: savedTeacher });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.delete('/deleteStudent',verify, async (req, res) => {
    const { rollNumber, managementId} = req.body;

    try {
        const deletedStudent = await Student.findOneAndDelete({ rollNumber,managementId });
        if (!deletedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.delete('/deleteTeacher', verify, async (req, res) => {
    const { teacherId, managementId } = req.body;

    try {
        const management = await Teacher.findOneAndDelete({teacherId , managementId});
        if (!management) {
            return res.status(404).json({ message: 'Management not found' });
        }
        res.status(200).json({ message: 'Teacher deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/getAllStudentInfo', verify, async (req, res) => {
    const { managementId } = req.body;

    try {
        const students = await Student.find({ management: managementId });

        res.status(200).json({ students });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/getAllStudentByBranch', verify, async (req, res) => {
    const { managementId, branch } = req.body;

    try {
        const students = await Student.find({ management: managementId, branch });

        res.status(200).json({ students });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/getAllStudentByClassName', verify, async (req, res) => {
    const { managementId, className } = req.body;

    try {
        const students = await Student.find({ management: managementId, className });

        res.status(200).json({ students });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



app.listen(port,()=>{
    console.log(`Listening on port number ${port}`);
})
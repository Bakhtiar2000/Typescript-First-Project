import { Schema, model } from 'mongoose';
import {
  TGuardian,
  TLocalGuardian,
  TStudent,
  StudentModel,
  TUserName,
} from './student.interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true, // If there is space given in user input, trim removes them.
    maxlength: [15, 'First name cannot have more than 15 characters'],
  },
  middleName: {
    type: String,
    trim: true,
    maxlength: [15, 'Middle name cannot have more than 15 characters'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [15, 'Last name cannot have more than 15 characters'],
  },
});

const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    required: [true, 'Father name is required'],
  },
  fatherOccupation: {
    type: String,
    required: [true, 'Father occupation is required'],
  },
  fatherContactNumber: {
    type: String,
    required: [true, 'Father contact number is required'],
  },
  motherName: {
    type: String,
    required: [true, 'Mother name is required'],
  },
  motherOccupation: {
    type: String,
    required: [true, 'Mother occupation is required'],
  },
  motherContactNumber: {
    type: String,
    required: [true, 'Mother contact number is required'],
  },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: { type: String, required: [true, 'Local guardian name is required'] },
  occupation: {
    type: String,
    required: [true, 'Local guardian occupation is required'],
  },
  contactNo: {
    type: String,
    required: [true, 'Local guardian contact number is required'],
  },
  address: {
    type: String,
    required: [true, 'Local guardian address is required'],
  },
});

//--------------------Student Schema------------------------
const studentSchema = new Schema<TStudent, StudentModel>(
  {
    id: {
      type: String,
      required: [true, 'ID is required'],
      unique: true, // unique fields should have unique: true
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'user id required'],
      unique: true,
      ref: 'User', // Create a referencing with User Data. User is the collection name
    },
    name: { type: userNameSchema, required: [true, 'Name is required'] },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other'],
        message:
          "{VALUE} is not a valid gender. Gender can be one of the following: 'male', 'female', 'other'", // {VALUE} receives the user input inside enum data type
      },
      required: [true, 'Gender is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    dateOfBirth: {
      type: Date,
    },
    contactNo: {
      type: String,
      required: [true, 'Contact number is required'],
    },
    emergencyContactNo: {
      type: String,
      required: [true, 'Emergency contact number is required'],
    },
    bloodGroup: {
      type: String,
      enum: {
        values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        message: '{VALUE} is not a valid blood group.',
      },
    },
    presentAddress: {
      type: String,
      required: [true, 'Present address is required'],
    },
    permanentAddress: {
      type: String,
      required: [true, 'Permanent address is required'],
    },
    guardian: {
      type: guardianSchema,
      required: [true, 'Guardian information is required'],
    },
    localGuardian: {
      type: localGuardianSchema,
      required: [true, 'Local guardian information is required'],
    },
    profileImg: {
      type: String,
      default: '',
    },
    admissionSemester: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicSemester',
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicDepartment',
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicFaculty',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

//----------------------Virtual---------------------------
studentSchema.virtual('fullName').get(function () {
  return `${this?.name?.firstName} ${this?.name?.middleName} ${this?.name?.lastName}`;
});

// -----------------Query (find / findOne) Middleware / hook (Pre + Post)-------------------
studentSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } }); //this= current query
  next();
});

studentSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } }); //this= current query
  next();
});

studentSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  const isStudentExists = await Student.findOne(query);
  if (!isStudentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'This Student does not exist!');
  }
  next();
});

// -----------------Aggregation Middleware / hook (Pre + Post)-------------------
// studentSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } }); //this= current pipeline
//   // It works same as the findOne query middleware but here the implementation is in aggregation
//   next();
// });

//Creating a a static method
studentSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Student.findOne({ id: id });
  return existingUser;
};

//Creating a custom instance method
// studentSchema.methods.isUserExists = async function (id: string) {
//   const existingUser = await Student.findOne({ id: id });
//   return existingUser;
// };

//---------------Student Model-----------------
export const Student = model<TStudent, StudentModel>('Student', studentSchema);

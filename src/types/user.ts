
export type IPatient = {
    username: string;
    firstName: string;
    mInit: string;
    lastName: string;
    phone: string;
    day: string;    
    month: string;
    year: string;
    dob: string;
    sex: string;
    email: string;
    address: string;
    allergies: string;
    password: string;
}

export type IStaff = {
    id : number;
    users: IUsers;
    s_id : number,
    job_id : number,
    jobs :  string,
    // username: string;
    // firstName: string,
    // mInit: string,
    // lastName: string,
    // phone: string,
    // email: string,
    // dob: string,
    // sex: string,
    // password: string,
    // staff: string,
    department_id: number,
    departments: Department,
    manager_id: number,
    salary: number,
    qualifications: string,
}

export type createStafDto = {
    s_id : number;
    job_id : number;
    dept_id :number;
    manager_id : number;
    qualifications : string;
    salary : number;
}

export type Job = {
    job_id : number,
    job_title : string,
    description: string
}

export type Department = {
    dept_id : number,
    dept_name : string,
    description : string
}
export type IUsers = {
    id: number;
    role: number;
    username: string;
    pw: string;  // Note: 'pw' stands for password. Consider renaming to 'passwordHash' or similar for clarity
    Fname: string;  // First name
    Minit: string;  // Middle initial
    Lname: string;  // Last name
    phone: string;
    email: string;
    sex: string;  // Consider using an enum if the set of possible values is limited
    birth_date: string;  // ISO string date
}
export type ILoginProps = {
    email: string,
    password: string
}

export type IRegisterProps = {
    username: string;
    firstName: string;
    mInit: string;
    lastName: string;
    phone: string;
    day: string;    
    month: string;
    year: string;
    dob: string;
    sex: string;
    email: string;
    address: string;
    allergies: string;
    password: string;
    passwordConfirm: string;
}

export type Staff = {
    s_id: number;
    job_id: number;
    job: Jobs;
    dept_id: number;
    department: Department;
    manager_id: number;
    manager: string;
    qualifications: string;
    salary: number;
    users: IUsers;
}


export type updatedStaff = {
    s_id: number;
    job_id: number;
    job: Jobs;
    dept_id: number;
    department: Department;
    manager_id: number;
    manager: string;
    qualifications: string;
    sex: string;
    salary: number;
    firstName: string;
    mInit: string;
    lastName: string;
    phone: string;
    dob : string;
    email: string;
}

export type updateStaffDto = {
    firstName: string;
    mInit: string;
    lastName: string;
    phone: string;
    dob : string;
    qualifications : string;
}

export type Jobs = {
    job_id: number;
    job_title: string;
    job_description: string;   
}

export type Appointment = {
    appointment_id: number;
    meeting_date: string;
    p_id: number;
    s_id: number;
    purpose: string;
    location: string;
    start_time: string;
    end_time: string;
    meeting_status: string;
}

export type Treatment =  {
    t_id: number;
    p_id: number;
    doctor_id: number;
    treatment_date: string;
    start_time: string;
    end_time: string;
    patientName: string;
    description : string;
    billing: number;
  }


export type PersonalScheduleItem =  {
    start_time: string;
    end_time: string;
    activity: string;
    description: string;
  }


  
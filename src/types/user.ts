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
    users: IUsers;
    s_id : number,
    jobID : number,
    jobs :  Job,
    username: string;
    firstName: string,
    mInit: string,
    lastName: string,
    phone: string,
    email: string,
    dob: string,
    sex: string,
    password: string,
    staff: string,
    departments: Department,
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
    dept_id: number;
    manager_id: number;
    qualifications: string;
    salary: number;
    users: IUsers;
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

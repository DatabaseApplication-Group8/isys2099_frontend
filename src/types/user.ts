export type IPatient = {
    firstName: string,
    mInit: string,
    lastName: string,
    phone: string,
    email: string,
    sex: CharacterData,
}

export type IStaff = {
    username: string;
    firstName: string,
    mInit: string,
    lastName: string,
    phone: string,
    email: string,
    dob: string,
    sex: string,
    password: string,
    department: string,
    salary: number,
    qualification: string,
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

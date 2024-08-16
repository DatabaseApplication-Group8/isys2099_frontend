export type IPatient = {
    firstName: string,
    mInit: string,
    lastName: string,
    phone: string,
    email: string,
    sex: CharacterData,
}

export type IStaff = {
    firstName: string,
    mInit: string,
    lastName: string,
    phone: string,
    email: string,
    sex: CharacterData,
    salary: Float32Array
}

export type ILoginProps = {
    email: string,
    password: string
}

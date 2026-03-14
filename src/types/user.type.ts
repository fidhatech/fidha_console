export type UserListType = {
    id: string,
    name: string,
    phone: string,
    role: string,
    isBlocked: boolean,
    dateOfJoin: string,
}


export type UserType = {
    id: number | string,
    name: string,
    role: string,
    isBlocked: boolean,
    submittedDate: string | Date,
    audio: string,
};
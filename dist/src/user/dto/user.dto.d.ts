export declare enum Role {
    USER = "USER",
    ADMIN = "ADMIN",
    LIBRARIAN = "LIBRARIAN"
}
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
}

export interface UserSignUp{
    username: string;
    password: string;
    role: string;
    email: string;
    permissions?:string[];
}
export interface Author{
    name: string;
}
export interface Category{
    genre: string;
}
export interface UserLogin{
  email: string;
  password: string;
}
export interface Book{
    id:number
    title: string;
    authorId: number;
    categoryId: number;
    publicationDate: string;
    price: number;
    isbn: string;
}

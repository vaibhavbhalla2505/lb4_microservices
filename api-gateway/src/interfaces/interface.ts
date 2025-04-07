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
    title: string;
    authorId: number;
    categoryId: number;
    publication_date: string;
    price: number;
    isbn: string;
}

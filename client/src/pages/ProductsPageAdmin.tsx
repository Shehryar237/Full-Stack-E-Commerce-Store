import MainLayout from "../components/layout/MainLayout/MainLayout";
import ProductsGrid from '../components/ProductsGrid/ProductsGrid'
export default function ProductsPageAdmin(){
    return(
        <MainLayout>
            <h1>All Products</h1>
            <ProductsGrid isAdmin/>
        </MainLayout>
    )
}
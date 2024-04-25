import { Authorize } from "@/components/Authorize";
import { WithDefaultLayout } from "@/components/DefautLayout";
import { ProductClient, ProductDataListResponse } from "@/functions/BackendApiClient";
import { useSwrFetcherWithAccessToken } from "@/functions/useSwrFetcherWithAccessToken";
import { ProductData } from "@/types/be-products/ProductData";
import { Page } from "@/types/Page";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { Button, Modal, Table } from "antd";
import  { ColumnsType } from "antd/es/table";
import Link from "next/link";
import { useState } from "react"

const ProductIndex: React.FC = () => {
    const [page] = useState(1);

    const pageRows = 10;

    const [modal, contextHolder] = Modal.useModal();
    const queryFetcher = useSwrFetcherWithAccessToken();


    const { data, refetch, isFetching, isError } = useQuery<ProductDataListResponse>(
        {
            queryKey: ['products'],
            queryFn: async () => await queryFetcher('/api/be-custom/api/v1/product')
        });
        
    const productColumns: ColumnsType<ProductData> = [
            {
                title: 'No.', dataIndex: 'rowNumber',
                render: (__value, __item, index) => (page - 1) * pageRows + index + 1
            },
            {
                title: 'Name', dataIndex: 'name',
                render: (value: string, product) => <Link href={`/be-products/edit/${product.productId}`}>{value}</Link>
            },
            { title: 'Price', dataIndex: 'price' },
            {
                title: 'Action',
                dataIndex: 'productId',
                render: (__value, product) => <>
                    <Button className="bg-red-500" onClick={() => onClickDeleteProduct(product)}>
                        <FontAwesomeIcon className="text-white" icon={faTrash} />
                    </Button>
                </>
            }
    ];
        
        /**
         * On click delete product button.
         * @param product 
         */
    function onClickDeleteProduct(product: ProductData) {
            modal.confirm({
                title: 'Delete Product Confirmation',
                content: `Are you sure you want to delete product "${product.name}"?`,
                okButtonProps: {
                    className: 'bg-red-500 text-white'
                },
                okText: 'Yes',
                onOk: () => onConfirmDeleteProduct(product),
                cancelText: 'No',
            });
    }
    
        /**
         * On click confirm delete product.
         * @param product
         */
    async function onConfirmDeleteProduct(product: ProductData) {
            const productClient = new ProductClient('http://localhost:3000/api/be-custom');
    
            try {
                await productClient.productDELETE(product.productId);
            } catch (error) {
                console.error(error);
            }
    
            refetch();
    }
    
        /**
         * Render the product data table.
         * @returns 
         */
    function renderTable() {
            if (isFetching) {
                return <p>Loading...</p>;
            }
    
            if (isError) {
                return <p>An error has occurred, please contact your admin.</p>;
            }
    
            return <>
                <Table rowKey="productId"
                    dataSource={data?.productDatas}
                    columns={productColumns}></Table>
    
                <Button type="primary" htmlType="button"
                    className="bg-blue-500"
                    onClick={() => refetch()}>
                    Refresh
                </Button>
                {contextHolder}
            </>
    }

    
    return <>
                <h1>Products</h1>
                <p>Welcome to the product page!</p>
                <Link href="/be-products/create">Click here to create a product</Link>
                {renderTable()}
    </>
}
    
const ProductIndexPage: Page = () => {
        return <Authorize>
            <ProductIndex />
        </Authorize>;
}
    
ProductIndexPage.layout = WithDefaultLayout;
export default ProductIndexPage;
import React from "react";
import Table from "../../commons/tables/table";

const columns = [
    {
        Header: 'ID',
        accessor: 'id',
    },
    
    {
        Header: 'Name',
        accessor: 'name',
    },
    {
        Header: 'Quantity',
        accessor: 'quantity',
    },
    {
        Header: 'Price',
        accessor: 'price',
    },
    {
        Header: 'In Stock',
        accessor: 'inStock',
        Cell: ({ value }) => (value ? "Yes" : "No"),
    }
];

const filters = [
    {
        accessor: 'name',
    }
];

class ProductTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tableData: this.props.tableData
        };
    }

    render() {
        return (
            <Table
                data={this.props.tableData}
                columns={columns}
                search={filters}
                pageSize={5}
            />
        );
    }
}

export default ProductTable;

import React from "react";
import Table from "../../commons/tables/table";

const columns = [
    {
        Header: 'Order ID',
        accessor: 'id',
    },
    {
        Header: 'First Name',
        accessor: 'firstName',
    },
    {
        Header: 'Last Name',
        accessor: 'lastName',
    },
    {
        Header: 'Email',
        accessor: 'email',
    },
    {
        Header: 'Address',
        accessor: 'address',
    },
    {
        Header: 'Product',
        accessor: 'productName',
    },
    {
        Header: 'Quantity',
        accessor: 'quantity',
    },
    {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => {
            switch (value) {
                case "Placed":
                    return <span style={{ color: "blue" }}>Placed</span>;
                case "Shipped":
                    return <span style={{ color: "orange" }}>Shipped</span>;
                case "Delivered":
                    return <span style={{ color: "green" }}>Delivered</span>;
                default:
                    return value;
            }
        }
    }
];

const filters = [
    {
        accessor: 'firstName',
    },
    {
        accessor: 'lastName',
    },
    {
        accessor: 'productName',
    },
];

class OrderTable extends React.Component {
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

export default OrderTable;

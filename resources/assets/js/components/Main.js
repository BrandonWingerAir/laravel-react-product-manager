import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Product from './Product';
import AddProduct from './AddProduct';
import EditProduct from './EditProduct';

export default class Main extends Component {
    constructor() {
        super();

        this.state = {
            products: [],
            currentProduct: null,
            editBtnClicked: false
        }

        this.handleAddProduct = this.handleAddProduct.bind(this);
        this.handleDeleteProduct = this.handleDeleteProduct.bind(this);
        this.handleDeleteConfirm = this.handleDeleteConfirm.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }

    componentDidMount() {
        fetch('/api/products')
        .then(response => {
            return response.json();
        })
        .then(products => {
            this.setState({ products });
        });
    }

    renderProducts() {
        const listStyle = {
            listStyle: 'none',
            fontSize: '18px',
            lineHeight: '1.8em',
            paddingLeft: '1em'
        }

        return this.state.products.map((product) => {
            return (
                <li 
                    style={listStyle} 
                    onClick={() =>this.handleClick(product)} key={product.id}
                >
                    {product.title} 
                </li>
            );
        });
    }

    handleClick(product) {
        this.state.editBtnClicked = false
        this.setState({ currentProduct:product });
    }

    handleAddProduct(product) {
        product.price = Number(product.price);

        fetch( 'api/products/', {
            method:'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        })
        .then(response => {
            return response.json();
        })
        .then( data => {
            this.setState((prevState)=> ({
                products: prevState.products.concat(data),
                currentProduct : data
            }));
        });
    }

    handleDeleteProduct() {
        const currentProduct = this.state.currentProduct;

        fetch("api/products/" + currentProduct.id, {
            method: "delete"
        })
        .then(response => {
            var productsArray = this.state.products.filter(function(item) {
                return item !== currentProduct;
            });
    
            this.setState({ products: productsArray, currentProduct: null });
        });
    }

    handleDeleteConfirm(event) {
        if (confirm("Are you sure you want to delete it?")) {
            this.handleDeleteProduct();
        }
    }

    handleEdit() {
        this.setState({ editBtnClicked: true });
    }

    handleUpdate(product) {
        const currentProduct = this.state.currentProduct;

        fetch( 'api/products/'+ currentProduct.id, {
            method:'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            this.setState(prevState => ({
                products: prevState.products.map(
                    productObj => (productObj.id === currentProduct.id) ?
                    Object.assign(productObj, product) : productObj
                )
            }));            
        });

        this.setState({ editBtnClicked: false });
    }
    
    render() {
        const mainDivStyle =  {
            display: "flex",
            flexDirection: "row"
        }
        
        const divStyle = {
            justifyContent: "flex-start",
            padding: '10px',
            minWidth: '30vw',
            maxWidth: '30vw',
            height: '100%',
            background: '#f0f0f0',
            padding: '20px 20px 20px 20px',
            margin: '30px 10px'
        }

        return (
            <div>
                <div style= {mainDivStyle}>
                    <div style={divStyle}>
                        <h3>All products ({this.state.products.length})</h3>
                        <ul>
                            { this.renderProducts() }
                        </ul>
                    </div>
                    <div>
                        {this.state.editBtnClicked === true ? (
                            <EditProduct
                                product={this.state.currentProduct}
                                update={this.handleUpdate}
                            />
                        ) : (
                            <div>
                                <Product 
                                    product={this.state.currentProduct} 
                                    deleteProduct={this.handleDeleteProduct}
                                    handleDeleteConfirm={this.handleDeleteConfirm}
                                    handleEdit={this.handleEdit}
                                />
                                <AddProduct onAdd={this.handleAddProduct} /> 
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

if (document.getElementById('root')) {
    ReactDOM.render(<Main />, document.getElementById('root'));
}
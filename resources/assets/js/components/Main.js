import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Product from './Product';
import AddProduct from './AddProduct';

class Main extends Component {
    constructor() {
        super();

        this.state = {
            products: [],
            currentProduct: null
        }

        this.handleAddProduct = this.handleAddProduct.bind(this);
        this.handleDeleteProduct = this.handleDeleteProduct.bind(this);
        this.handleDeleteConfirm = this.handleDeleteConfirm.bind(this);
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
        }

        return this.state.products.map(product => {
            return (
                <li style={listStyle} onClick={
                    () =>this.handleClick(product)} key={product.id} >
                    { product.title } 
                </li>      
            );
        });
    }

    handleClick(product) {
        this.setState({currentProduct:product});
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

        fetch("api/products/" + this.state.currentProduct.id, {
            method: "delete"
        })
        .then(response => {
            var newProducts = this.state.products.filter(function(item) {
                return item !== currentProduct;
            });
    
            this.setState({ products: newProducts, currentProduct: null });
        });
    }

    handleDeleteConfirm(event) {
        if (confirm("Are you sure you want to delete it?")) {
            this.handleDeleteProduct();
        }
    }
    
    render() {
        const mainDivStyle =  {
            display: "flex",
            flexDirection: "row"
        }
        
        const divStyle = {
            justifyContent: "flex-start",
            padding: '10px',
            width: '35%',
            background: '#f0f0f0',
            padding: '20px 20px 20px 20px',
            margin: '30px 10px'
        }

        return (
            <div>
                <div style= {mainDivStyle}>
                    <div style={divStyle}>
                        <h3>All products</h3>
                        <ul>
                            { this.renderProducts() }
                        </ul> 
                    </div>
                    <Product 
                        product={this.state.currentProduct} 
                        deleteProduct={this.handleDeleteProduct}
                        handleDeleteConfirm={this.handleDeleteConfirm}
                    />
                    <AddProduct onAdd={this.handleAddProduct} /> 
                </div>
            </div>
        );
    }
}

export default Main;

if (document.getElementById('root')) {
    ReactDOM.render(<Main />, document.getElementById('root'));
}
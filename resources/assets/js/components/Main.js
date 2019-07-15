import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, withRouter } from 'react-router-dom';
import Product from './Product';
import AddProduct from './AddProduct';
import EditProduct from './EditProduct';
import Register from './Register';
import Login from './Login';
import Home from './Home';

import axios from 'axios';
import $ from 'jquery';

export default class Main extends Component {
    constructor() {
        super();

        this.state = {
            products: [],
            currentProduct: null,
            editBtnClicked: false,
            isLoggedIn: localStorage["appState"]
            ? JSON.parse(localStorage["appState"]).isLoggedIn
            : false,
            user: {},
            token: localStorage["appState"]
                ? JSON.parse(localStorage["appState"]).user.auth_token
                : ""
        }

        this.handleAddProduct = this.handleAddProduct.bind(this);
        this.handleDeleteProduct = this.handleDeleteProduct.bind(this);
        this.handleDeleteConfirm = this.handleDeleteConfirm.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this._loginUser = this._loginUser.bind(this);
        this._registerUser = this._registerUser.bind(this);
        this._logoutUser = this._logoutUser.bind(this);
    }

    componentDidUpdate() {
        if (
            !this.state.isLoggedIn &&
            this.props.location.pathname !== "/login" &&
            this.props.location.pathname !== "/register"
        ) {
            console.log("Redirecting to login");
            this.props.history.push("/login");
        }

        if (
            this.state.isLoggedIn &&
            (this.props.location.pathname === "/login" ||
                this.props.location.pathname === "/register")
        ) {
            console.log("Redirecting to dashboard");
            this.props.history.push("/");
        }
    }

    componentDidMount() {
        fetch('/api/products')
        .then(response => {
            return response.json();
        })
        .then(products => {
            this.setState({ products });
        })

        let state = localStorage["appState"];

        if (state) {
            let storedState = JSON.parse(state);
            this.setState({ isLoggedIn: storedState.isLoggedIn, user: storedState.user, token: storedState.user.auth_token });
        }
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
                    onClick={() =>this.handleClick(product)} 
                    key={product.id}
                >
                    {product.title} 
                </li>
            );
        });
    }

    handleClick(product) {
        this.state.editBtnClicked = false
        this.setState({ currentProduct: product });
    }

    handleAddProduct(product) {
        product.price = Number(product.price);

        fetch( `api/products?token=${this.state.token}`, {
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
                currentProduct: data
            }));
        });
    }

    handleDeleteProduct() {
        const currentProduct = this.state.currentProduct;

        fetch(`api/products/${currentProduct.id}?token=${this.state.token}`, {
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

        fetch( `api/products/${currentProduct.id}?token=${this.state.token}`, {
            method:'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
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

    _loginUser(email, password) {
        $(".email-login-btn")
            .attr("disabled", "disabled")
            .html(
            '<i class="fa fa-spinner fa-spin fa-1x fa-fw"></i><span class="sr-only">Loading...</span>'
        );

        var formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);

        axios
            .post("api/user/login/", formData)
            .then(response => {
            return response;
        })
        .then(json => {
            if (json.data.success) {
                let userData = {
                    name: json.data.data.name,
                    id: json.data.data.id,
                    email: json.data.data.email,
                    auth_token: json.data.data.auth_token,
                    timestamp: new Date().toString()
                };

                let appState = {
                    isLoggedIn: true,
                    user: userData
                }

                localStorage["appState"] = JSON.stringify(appState);

                this.setState({
                    isLoggedIn: appState.isLoggedIn,
                    user: appState.user,
                    token: appState.user.auth_token
                });
            } else {
                alert("Login Failed!");
            } 

            $("#login-form button")
                .removeAttr("disabled")
                .html("Login");
        })
        .catch(error => {
            $("#login-form button")
                .removeAttr("disabled")
                .html("Login");
        });
    };

    _registerUser(name, email, password) {
        $(".email-login-btn")
            .attr("disabled", "disabled")
            .html(
            '<i class="fa fa-spinner fa-spin fa-fw"></i><span class="sr-only">Loading...</span>'
        );

        var formData = new FormData();

        formData.append("name", name);  
        formData.append("email", email);
        formData.append("password", password);

        axios.post("api/user/register", formData)
            .then(response => {
            
            return response;
        })
        .then(json => {  
            if (json.data[0].success) {
                let userData = {
                    name: json.data[0].data.name,
                    id: json.data[0].data.id,
                    email: json.data[0].data.email,
                    auth_token: json.data[0].data.auth_token,
                    timestamp: new Date().toString()
                };

                let appState = {
                    isLoggedIn: true,
                    user: userData
                }

                localStorage["appState"] = JSON.stringify(appState);
        
                this.setState({
                    isLoggedIn: appState.isLoggedIn,
                    user: appState.user
                });
            } else {
                alert(`Registration Failed!`);

                $("#email-login-btn")
                    .removeAttr("disabled")
                    .html("Register");
            }
        })
        .catch(error => {
            console.log(`${formData} ${error}`);
            
            $(".email-login-btn")
                .removeAttr("disabled")
                .html("Register");
        });
    };
    
    _logoutUser() {
        let appState = {
            isLoggedIn: false,
            user: {},
            token: ''
        };        

        localStorage["appState"] = JSON.stringify(appState);
        this.setState(appState);
    };
    
    render() {
        const divStyle = {
            height: '100%',
            background: '#f0f0f0',
            padding: '10px 30px',
            margin: '30px'
        }

        return (
            <div>
                <div className="row margin-0">
                    { this.state.editBtnClicked === false ? (
                    <div className="col-xs-12 col-md-5 col-md-push-3 padding-0">
                        <div className="row margin-0">
                            <div className="col-md-12 padding-0">
                                <Product 
                                    product = {this.state.currentProduct} 
                                    deleteProduct = {this.handleDeleteProduct}
                                    handleDeleteConfirm = {this.handleDeleteConfirm}
                                    handleEdit = {this.handleEdit}
                                    token = {this.state.token}
                                    user = {this.state.user}
                                />
                            </div>
                        </div>
                        <div className="row margin-0">
                            <div className="col-md-12 padding-0">
                                { this.state.token ? (
                                    <div>
                                        <hr/>
                                        <AddProduct onAdd={this.handleAddProduct} />
                                    </div>
                                ) : (
                                    <div/>
                                )}
                            </div>
                        </div>
                    </div>
                    ) : (
                    <div className="col-xs-12 col-md-5 col-md-push-3 padding-0">
                        <EditProduct
                            product={this.state.currentProduct}
                            update={this.handleUpdate}
                        />
                    </div>
                    )}
                    <div className="col-xs-12 col-md-3 col-md-pull-5 padding-0">
                        <div style={divStyle}>
                            <div>
                                <h3>All reviews ({this.state.products.length})</h3>
                                <hr style={{ borderColor: '#e0e0e0' }}/>
                                <ul>
                                    { this.renderProducts() }
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <Switch data="data">
                        <Route
                            path="/login"
                            render={ props => <Login {...props} loginUser={this._loginUser}/> }
                        />

                        <Route
                            path="/register"
                            render={ props => <Register {...props} registerUser={this._registerUser}/> }
                        />
                        
                        <Route exact path="/" render={props => (
                            <div className="col-xs-12 col-md-4 padding-0">
                                <Home
                                    {...props}
                                    logoutUser={this._logoutUser}
                                    user={this.state.user}
                                />
                            </div>
                        )}/>
                    </Switch>
                </div>
            </div>
        );
    }
}

const AppContainer = withRouter(props => <Main {...props} />);

if (document.getElementById('root')) {
    ReactDOM.render(
        <BrowserRouter>
            <AppContainer/>
        </BrowserRouter>, 

        document.getElementById('root')
    );
}
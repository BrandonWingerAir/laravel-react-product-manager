import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, withRouter } from 'react-router-dom';
import Product from './Product';
import AddProduct from './AddProduct';
import EditProduct from './EditProduct';
import Register from './Register';
import Login from './Login';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import Home from './Home';

import axios from 'axios';
import $ from 'jquery';

export default class Main extends Component {
    constructor() {
        super();

        this.state = {
            products: [],
            currentPage: 1,
            productsPerPage: 15,
            currentProduct: null,
            newReviewForm: false,
            editBtnClicked: false,
            isLoggedIn: localStorage["appState"]
            ? JSON.parse(localStorage["appState"]).isLoggedIn
            : false,
            user: localStorage["appState"]
            ? JSON.parse(localStorage["appState"]).user
            : {},
            token: localStorage["appState"]
                ? JSON.parse(localStorage["appState"]).user.auth_token
                : "",
            resetTokenValid: false
        }

        this.handlePageClick = this.handlePageClick.bind(this);
        this.handlePrevClick = this.handlePrevClick.bind(this);
        this.handleNextClick = this.handleNextClick.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.cancelClick = this.cancelClick.bind(this);
        this.renderNewProducts = this.renderNewProducts.bind(this);
        this.renderReviewForm = this.renderReviewForm.bind(this);
        this.handleAddProduct = this.handleAddProduct.bind(this);
        this.handleDeleteProduct = this.handleDeleteProduct.bind(this);
        this.handleDeleteConfirm = this.handleDeleteConfirm.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this._loginUser = this._loginUser.bind(this);
        this._registerUser = this._registerUser.bind(this);
        this._logoutUser = this._logoutUser.bind(this);
        this._forgotPassword = this._forgotPassword.bind(this);
        this._resetPassword = this._resetPassword.bind(this);
    }

    componentWillMount() {     
        if (
            !this.state.isLoggedIn &&
            this.props.location.pathname !== "/login" &&
            this.props.location.pathname !== "/register" &&
            this.props.location.pathname !== "/forgot-password" &&
            this.props.location.pathname !== "/reset-password"
        ) {
            this.props.history.replace("/login");
        }
        
        if (
            this.state.isLoggedIn &&
            (this.props.location.pathname === "/login" || this.props.location.pathname === "/register")
        ) {
            this.props.history.replace("/");
        }

        // Check password reset token
        const urlParams = new URLSearchParams(window.location.search);
        const resetToken = urlParams.get('token');

        if (resetToken) {
            axios.get(`/api/password/find/${resetToken}`)
            .then(response => {
                return response;
            })
            .then(json => {
                if (json.data.success) {
                    this.state.resetTokenValid = true;                    
                    const user = json.data.user.email;
                    this.props.history.push(`/reset-password?user=${user}&token=${resetToken}`);
                } else {
                    this.props.history.replace("/forgot-password?token=invalid");
                }
            })
            .catch(() => {
                this.props.history.replace("/forgot-password?token=invalid");
            });
        } else {
            if (this.state.resetTokenValid === false && this.props.location.pathname === "/reset-password") {
                
                this.props.history.replace("/forgot-password?token=invalid");
            }
        }
    }

    componentDidUpdate() {
        if (
            !this.state.isLoggedIn &&
            this.props.location.pathname !== "/login" &&
            this.props.location.pathname !== "/register" &&
            this.props.location.pathname !== "/forgot-password" &&
            this.props.location.pathname !== "/reset-password"
        ) {
            this.props.history.push("/login");
        }
        
        if (
            this.state.isLoggedIn &&
            (this.props.location.pathname === "/login" || this.props.location.pathname === "/register")
        ) {
            this.props.history.push("/");
        }

        if (
            this.state.isLoggedIn && 
            !this.state.resetTokenValid && 
            this.props.location.pathname === "/reset-password"
        ) {
            this.props.history.replace("/");            
        }
    }

    componentDidMount() {
        fetch('/api/products')
        .then(response => {
            return response.json();
        })
        .then(products => {
            this.setState({ products });
        });        

        if (this.state.user) {
            if (Date.parse(new Date()) > Date.parse(this.state.user.token_expire)) {
                this.setState({ isLoggedIn: false, user: {}, token: '' });
            }
        } else {
            this.state.isLoggedIn = false;
        }
    }

    // Full List Functions
    listProducts() {
        const listStyle = {
            listStyle: 'none',
            fontSize: '18px',
            lineHeight: '1.8em',
            paddingLeft: '1em',
            borderRadius: '0',
            borderLeft: '0',
            borderRight: '0'
        }

        let { products, productsPerPage, currentPage } = this.state;

        products.sort((a, b) => a.title.localeCompare(b.title));        

        if (currentPage > Math.ceil(products.length / productsPerPage)) {
            currentPage -= 1;
        }

        const indexOfLastProduct = currentPage * productsPerPage;
        const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
        const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);   

        const renderProducts = currentProducts.map((product) => {
            return (
                <li
                    className="list-group-item"
                    style={listStyle}
                    onClick={() =>this.handleClick(product)} 
                    key={product.title}
                >
                    <h4 style={{ display: 'inline-block' }}>{product.title}</h4> 
                    <b style={{ float: 'right', marginRight: '5px' }}>
                        {Math.round(product.rating)}
                        <span 
                            className="fa fa-star" 
                            aria-hidden="true" 
                            style={{ color: '#3097D1', fontSize: '10px', verticalAlign: 'text-top', marginLeft: '2px' }}
                        ></span>
                    </b>
                </li>
            );
        });

        const pageNumbers = [];

        for (let i = 1; i <= Math.ceil(products.length / productsPerPage); i++) {
            pageNumbers.push(i);
        }

        const renderPageNumbers = pageNumbers.map(number => {

            if (currentPage === number) {
                return (
                    <li
                        key={number}
                        id={number}
                        className="active"
                        onClick={this.handlePageClick}
                    >
                        <span href="#all-reviews">
                            {number}
                        </span>
                    </li>
                )
            }

            return (
                <li
                    key={number}
                    id={number}
                    onClick={this.handlePageClick}
                >
                    <a href="#all-reviews">
                        {number}
                    </a>
                </li>
            );
        });

        return (
            <div>
                <ul className="list-group" style={{ marginBottom: '0' }}>
                    {renderProducts}
                </ul>
                { this.state.products.length > this.state.productsPerPage ? (
                    <nav style={{ textAlign: 'center' }}>
                        <ul className="pagination">
                            { currentPage === 1 ? (
                                <li className="disabled">
                                    <span>
                                        <span aria-hidden="true">&laquo;</span>
                                    </span>
                                </li>
                            ) : (
                                <li>
                                    <a href="#!" aria-label="Previous" onClick={this.handlePrevClick}>
                                        <span aria-hidden="true">&laquo;</span>
                                    </a>
                                </li>
                            ) }
                            {renderPageNumbers}
                            { currentPage === pageNumbers.length ? (
                                <li className="disabled">
                                    <span>
                                        <span aria-hidden="true">&raquo;</span>
                                    </span>
                                </li>
                            ) : (
                                <li>
                                    <a href="#!" aria-label="Next" onClick={this.handlePrevClick}>
                                        <span aria-hidden="true">&raquo;</span>
                                    </a>
                                </li>
                            ) }
                        </ul>
                    </nav>
                ) : (
                    <div/>
                ) }
            </div>
        )
    }

    handlePageClick(event) {
        this.setState({
            currentPage: Number(event.currentTarget.id)
        });
    }

    handleNextClick() {
        this.setState({
            currentPage: this.state.currentPage + 1
        });
    }
    
    handlePrevClick() {
        this.setState({
            currentPage: this.state.currentPage - 1
        });
    }

    renderNewProducts(limit, renderThumbs) {
        const listStyle = {
            listStyle: 'none',
            fontSize: '18px',
            lineHeight: '1.8em',
            borderRadius: '0',
            borderLeft: '0',
            borderRight: '0'
        }

        const reviewStars = (star) => {
            var stars = [];

            for (var i = 0; i < star; i++) {
                stars.push(
                <li key={i}>
                    <span className="fa fa-star" aria-hidden="true" style={{ color: '#3097D1' }}></span>
                </li>
                );
            }
        
            return stars;
        }

        let {products} = this.state;
        
        products.sort((a, b) => (a.id - b.id));

        return products.reverse().slice(0, limit).map((product) => {
            var newKey = `${product.title} (New)`;            

            return (
                <li 
                    className="list-group-item"
                    style={listStyle}
                    onClick={() =>this.handleClick(product)} 
                    key={newKey}
                >
                    <h4 style={{ display: 'inline-block' }}>{product.title}</h4 >

                    { renderThumbs ? (
                        <div style={{ display: 'inline-block' }}>
                            {
                                product.availability 
                                ? <i className="fa fa-thumbs-up text-success" style={{ marginLeft: '10px' }} aria-hidden="true"></i>
                                : <i className="fa fa-thumbs-down text-danger" style={{ marginLeft: '10px' }} aria-hidden="true"></i>
                            }
                        </div>
                    ) : (
                        <div>

                        </div>
                    )}

                    <h5><b>Version: </b>{product.description}</h5>

                    <hr style={{ width: '40%', margin: '25px auto 15px' }}/>

                    <ul className="list-unstyled list-inline" style={{ margin: '0 auto 10px' }}>
                        {(reviewStars(Math.round(product.rating)))}
                    </ul>
                </li>
            );
        });
    }

    // Product Functions
    renderReviewForm() {
        this.setState({ editBtnClicked: false, newReviewForm: true });

        $('html, body').animate({
            scrollTop: $("#product").offset().top
        }, 1000);
    }

    handleClick(product) {
        this.setState({ editBtnClicked : false, newReviewForm: false, currentProduct: product });
    }

    cancelClick() {
        this.setState({ editBtnClicked: false, newReviewForm: false });

        $('html, body').animate({
            scrollTop: $("#product").offset().top
        }, 1000);
    }

    handleAddProduct(product) {
        if (this.state.user) {
            if (Date.parse(new Date()) > Date.parse(this.state.user.token_expire)) {
                this.setState({ isLoggedIn: false, user: {}, token: '' });
            }
        } else {
            this.state.isLoggedIn = false;
        }

        product.user_interface = Number(product.user_interface);
        product.speed_size = Number(product.speed_size);
        product.software = Number(product.software);
        product.support = Number(product.support);
        product.administration = Number(product.administration);
        product.rating = parseFloat(product.rating);
        product.availability = Number(product.availability);        

        var formData = new FormData();
        formData.append("title", product.title);

        if (product.image) {
            formData.append("image", product.image, product.image.name);
        }

        if (product.notes) {
            formData.append("notes", product.notes);
        }

        formData.append("description", product.description);
        formData.append("user_interface", product.user_interface);
        formData.append("speed_size", product.speed_size);
        formData.append("software", product.software);
        formData.append("support", product.support);
        formData.append("administration", product.administration);
        formData.append("rating", product.rating);
        formData.append("availability", product.availability);        

        axios({
            method:'post',
            url: `api/products?token=${this.state.token}`,
            data: formData,
            headers: {
                'Accept': 'multipart/form-data',
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            return response;
        })
        .then( data => {            
            this.setState((prevState)=> ({
                products: prevState.products.concat(data.data),
                newReviewForm: false,
                currentProduct: data.data
            }));

            $('html, body').animate({
                scrollTop: $("#product").offset().top
            }, 1000);
        })
        .catch(errors => {            
            $("#add-new-btn")
                .removeAttr("disabled")
                .html("Submit");

            if (typeof errors.response.data.errors.title !== 'undefined') {
                if (typeof errors.response.data.errors.description !== 'undefined') {
                    $('.title-error').addClass('has-error');
                    $('.version-error').addClass('has-error');

                    $('.title-error-text').html(`
                        <li>${errors.response.data.errors.title[0]}</li>
                    `);

                    $('.version-error-text').html(`
                        <li>${errors.response.data.errors.description[0]}</li>
                    `);

                    $('html, body').animate({
                        scrollTop: $(".product-form").offset().top
                    }, 1000);
                } else {
                    $('.title-error').addClass('has-error');
                    $('.version-error').removeClass('has-error');

                    $('.title-error-text').html(`
                        <li>${errors.response.data.errors.title[0]}</li>
                    `);

                    $('html, body').animate({
                        scrollTop: $(".product-form").offset().top
                    }, 1000);
                }
            } else if (typeof errors.response.data.errors.description !== 'undefined') {
                $('.title-error').removeClass('has-error');
                $('.version-error').addClass('has-error');

                $('.version-error-text').html(`
                    <li>${errors.response.data.errors.description[0]}</li>
                `);

                $('html, body').animate({
                    scrollTop: $(".title-error-text").offset().top
                }, 1000);
            }
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

        $('html, body').animate({
            scrollTop: $("#product").offset().top
        }, 1000);
    }

    handleUpdate(product) {
        if (this.state.user) {
            if (Date.parse(new Date()) > Date.parse(this.state.user.token_expire)) {
                this.setState({ isLoggedIn: false, user: {}, token: '' });
            }
        } else {
            this.state.isLoggedIn = false;
        }

        product.user_interface = Number(product.user_interface);
        product.speed_size = Number(product.speed_size);
        product.software = Number(product.software);
        product.support = Number(product.support);
        product.administration = Number(product.administration);
        product.rating = parseFloat(product.rating);
        product.availability = Number(product.availability);
        
        var formData = new FormData();        
        if (product.image) {
            formData.append("image", product.image, product.image.name);
        }

        if (product.notes) {
            formData.append("notes", product.notes);
        }

        formData.append("title", product.title);
        formData.append("description", product.description);
        formData.append("user_interface", product.user_interface);
        formData.append("speed_size", product.speed_size);
        formData.append("software", product.software);
        formData.append("support", product.support);
        formData.append("administration", product.administration);
        formData.append("rating", product.rating);
        formData.append("availability", product.availability);
        
        const currentProduct = this.state.currentProduct;

        axios({
            method:'post',
            url: `api/products/${currentProduct.id}?_method=PUT`,
            data: formData,
            headers: {
                'Accept': 'multipart/form-data',
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${this.state.token}`
            }
        })
        .then(response => {
            return response;
        })
        .then(data => {
            this.setState(prevState => ({
                products: prevState.products.map(
                    productObj => (productObj.id === currentProduct.id) ?
                    Object.assign(productObj, product) : productObj
                )
            }));
        })
        .catch(errors => {            
            $("#add-new-btn")
                .removeAttr("disabled")
                .html("Submit");

            if (typeof errors.response.data.errors.title !== 'undefined') {
                if (typeof errors.response.data.errors.description !== 'undefined') {
                    $('.title-error').addClass('has-error');
                    $('.version-error').addClass('has-error');

                    $('.title-error-text').html(`
                        <li>${errors.response.data.errors.title[0]}</li>
                    `);

                    $('.version-error-text').html(`
                        <li>${errors.response.data.errors.description[0]}</li>
                    `);

                    $('html, body').animate({
                        scrollTop: $(".product-form").offset().top
                    }, 1000);
                } else {
                    $('.title-error').addClass('has-error');
                    $('.version-error').removeClass('has-error');

                    $('.title-error-text').html(`
                        <li>${errors.response.data.errors.title[0]}</li>
                    `);

                    $('html, body').animate({
                        scrollTop: $(".product-form").offset().top
                    }, 1000);
                }
            } else if (typeof errors.response.data.errors.description !== 'undefined') {
                $('.title-error').removeClass('has-error');
                $('.version-error').addClass('has-error');

                $('.version-error-text').html(`
                    <li>${errors.response.data.errors.description[0]}</li>
                `);

                $('html, body').animate({
                    scrollTop: $(".title-error-text").offset().top
                }, 1000);
            }
        });

        this.setState({ editBtnClicked: false });
    }

    // User Functions
    _loginUser(email, password) {
        $(".email-login-btn")
            .attr("disabled", "disabled")
            .html(
            '<i class="fa fa-spinner fa-spin fa-1x fa-fw"></i><span class="sr-only">Loading...</span>'
        );

        var formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        formData.append("token_expire", this.setTokenExpire());        

        axios.post("api/user/login/", formData)
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
                    token_expire: json.data.data.token_expire,
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
        .catch(errors => {
            $("#login-form button")
                .removeAttr("disabled")
                .html("Login");

            if (typeof errors.response.data.errors.email !== 'undefined') {
                if (typeof errors.response.data.errors.password !== 'undefined') {
                    $('.email-error').addClass('has-error');
                    $('.password-error').addClass('has-error');

                    $('.form-errors').html(`
                        <li>${errors.response.data.errors.email[0]}</li>
                        <li>${errors.response.data.errors.password[0]}</li>
                    `);
                } else {
                    $('.email-error').addClass('has-error');
                    $('.password-error').removeClass('has-error');

                    $('.form-errors').html(`
                        <li>${errors.response.data.errors.email[0]}</li>
                    `);
                }
            } else if (typeof errors.response.data.errors.password !== 'undefined') {
                $('.email-error').removeClass('has-error');
                $('.password-error').addClass('has-error');

                $('.form-errors').html(`
                    <li>${errors.response.data.errors.password[0]}</li>
                `);
            } else if (typeof errors.response.data.errors !== 'undefined') {
                $('.email-error').removeClass('has-error');
                $('.password-error').addClass('has-error');

                $('.form-errors').html(`
                    <li>${errors.response.data.errors}</li>
                `);
            }
        });
    };

    _forgotPassword(email) {
        $(".forgot-password-btn")
            .attr("disabled", "disabled")
            .html(
            '<i class="fa fa-spinner fa-spin fa-1x fa-fw"></i><span class="sr-only">Loading...</span>'
        );

        var formData = new FormData();
        formData.append("email", email);

        var object = {};
        formData.forEach(function(value, key){
            object[key] = value;
        });
        var json = JSON.stringify(object);

        axios({
            method: 'post',
            url: 'api/password/create',
            data: json,
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => {
            return response;
        })
        .then(json => {            
            if (json.data.success) {
                alert('Email Sent!');
            } else {
                alert("Email could not send!");
            } 

            $("#login-form button")
                .removeAttr("disabled")
                .html("Submit");
        })
        .catch(errors => {
            $(".form-btn")
                .removeAttr("disabled")
                .html("Submit");

            if (typeof errors.response.data.errors.email !== 'undefined') {
                $('.email-error').addClass('has-error');

                $('.form-errors').html(`
                    <li>${errors.response.data.errors.email[0]}</li>
                `);
            }
        });
    }

    _resetPassword(password, confirmPassword) {
        $(".forgot-password-btn")
            .attr("disabled", "disabled")
            .html(
            '<i class="fa fa-spinner fa-spin fa-1x fa-fw"></i><span class="sr-only">Loading...</span>'
        );
        
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get('user');
        const resetToken = urlParams.get('token'); 
        
        var formData = new FormData();

        formData.append("email", email);
        formData.append("token", resetToken);
        formData.append("token_expire", this.setTokenExpire());
        formData.append("password", password);
        formData.append("password_confirmation", confirmPassword);

        var object = {};
        formData.forEach(function(value, key){
            object[key] = value;
        });
        
        var jsonData = JSON.stringify(object);

        console.log(jsonData);
        

        axios({
            method:'post',
            url: `api/password/reset`,
            data: jsonData,
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => {            
            return response;
            
        })
        .then(json => {
            if (json.data.success) {
                let userData = {
                    name: json.data.user.name,
                    id: json.data.user.id,
                    email: json.data.user.email,
                    auth_token: json.data.user.auth_token,
                    token_expire: json.data.user.token_expire,
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
                    token: appState.user.auth_token,
                    resetTokenValid: false
                });                
            } else {
                alert("Reset Failed!");
            } 

            $("#login-form button")
                .removeAttr("disabled")
                .html("Login");
        })
        .catch(errors => {
            $(".form-btn")
                .removeAttr("disabled")
                .html("Submit");

            if (typeof errors.response.data.errors.password !== 'undefined') {
                $('.password-error').addClass('has-error');

                $('.form-errors').html(`
                    <li>${errors.response.data.errors.password[0]}</li>
                `);

                if (errors.response.data.errors.password[0] === 'The password confirmation does not match.') {
                    $('.password-error').removeClass('has-error');
                    $('#password-confirm').addClass('has-error');
                }
            }
        });
    }

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
        formData.append("token_expire", this.setTokenExpire());

        axios.post("api/user/register", formData)
        .then(response => {
            return response;
        })
        .then(json => {
            console.log('JSON:');
            console.log(json);
            
            if (json.data[0].success) {
                let userData = {
                    name: json.data[0].data.name,
                    id: json.data[0].data.id,
                    email: json.data[0].data.email,
                    auth_token: json.data[0].data.auth_token,
                    token_expire: json.data[0].data.token_expire,
                    timestamp: new Date().toString()
                };

                console.log('userData:');
                console.log(userData);

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
        .catch(errors => {
            if (typeof errors.response.data.errors.name !== 'undefined') {
                if (typeof errors.response.data.errors.email !== 'undefined') {
                    if (typeof errors.response.data.errors.password !== 'undefined') {
                        $('#name-error').addClass('has-error');
                        $('.email-error').addClass('has-error');
                        $('.password-error').addClass('has-error');

                        $('.form-errors').html(`
                            <li>${errors.response.data.errors.name[0]}</li>
                            <li>${errors.response.data.errors.email[0]}</li>
                            <li>${errors.response.data.errors.password[0]}</li>
                        `);
                    } else {
                        $('#name-error').addClass('has-error');
                        $('.email-error').addClass('has-error');
                        $('.password-error').removeClass('has-error');

                        $('.form-errors').html(`
                            <li>${errors.response.data.errors.name[0]}</li>
                            <li>${errors.response.data.errors.email[0]}</li>
                        `);
                    }
                } else if (typeof errors.response.data.errors.password !== 'undefined') {
                    $('#name-error').addClass('has-error');
                    $('.email-error').removeClass('has-error');
                    $('.password-error').addClass('has-error');

                    $('.form-errors').html(`
                        <li>${errors.response.data.errors.name[0]}</li>
                        <li>${errors.response.data.errors.password[0]}</li>
                    `);
                } else {
                    $('#name-error').addClass('has-error');
                    $('.email-error').removeClass('has-error');
                    $('.password-error').removeClass('has-error');

                    $('.form-errors').html(`
                        <li>${errors.response.data.errors.name[0]}</li>
                    `);
                }
            } else if (typeof errors.response.data.errors.email !== 'undefined') {
                if (typeof errors.response.data.errors.password !== 'undefined') {
                    $('#name-error').removeClass('has-error');
                    $('.email-error').addClass('has-error');
                    $('.password-error').addClass('has-error');

                    $('.form-errors').html(`
                        <li>${errors.response.data.errors.email[0]}</li>
                        <li>${errors.response.data.errors.password[0]}</li>
                    `);
                } else {
                    $('#name-error').removeClass('has-error');
                    $('.email-error').addClass('has-error');
                    $('.password-error').removeClass('has-error');

                    $('.form-errors').html(`
                        <li>${errors.response.data.errors.email[0]}</li>
                    `);
                }
            } else if (typeof errors.response.data.errors.password !== 'undefined') {
                $('#name-error').removeClass('has-error');
                $('.email-error').removeClass('has-error');
                $('.password-error').addClass('has-error');

                $('.form-errors').html(`
                    <li>${errors.response.data.errors.password[0]}</li>
                `);
            }
            
            $(".email-login-btn")
                .removeAttr("disabled")
                .html("Register");
        });
    };

    setTokenExpire() {
        var currentDate = new Date();
        const tokenExpire = new Date(currentDate.getTime() + 1000 * 60 * 60);        
        return tokenExpire;
    }
    
    _logoutUser() {
        let appState = {
            isLoggedIn: false,
            user: {},
            token: ''
        };        

        localStorage["appState"] = JSON.stringify(appState);
        this.setState(appState);
        this.setState({ newReviewForm: false, editBtnClicked: false });
    };
    
    render() {
        return (
            <div>
                <nav className="navbar text-center" style={{ background: '#424242', borderBottom: '2px solid #3097D1', borderRadius: '0' }}>
                    <h1 style={{ color: '#fff', margin: '20px 0 25px'}}>
                        OS Reviews <i className="fa fa-laptop" aria-hidden="true"></i>
                    </h1>
                </nav>

                <p id="session-expired"></p>

                <div id="product" className="row margin-0">
                    <div className="col-xs-12 col-md-5 col-md-push-3">
                        <div className="row margin-0">
                            <div className="col-md-12">
                                <Product 
                                    renderNewProducts = {this.renderNewProducts}
                                    product = {this.state.currentProduct} 
                                    newReviewForm = {this.state.newReviewForm}
                                    editBtnClicked = {this.state.editBtnClicked}
                                    deleteProduct = {this.handleDeleteProduct}
                                    handleDeleteConfirm = {this.handleDeleteConfirm}
                                    handleEdit = {this.handleEdit}
                                    token = {this.state.token}
                                    user = {this.state.user}
                                />
                            </div>
                        </div>
                        <div className="row margin-0">
                            <div className="col-md-12">
                                { this.state.token && this.state.newReviewForm ? (
                                    <div style={{ minHeight: '100vh' }}>
                                        <AddProduct 
                                            onAdd={this.handleAddProduct} 
                                            cancelClick={this.cancelClick}    
                                        />
                                    </div>
                                ) : (
                                    <div/>
                                )}
                            </div>
                            <div className="col-md-12">
                                { this.state.token && this.state.editBtnClicked ? (
                                    <div>
                                        <EditProduct
                                            product={this.state.currentProduct}
                                            update={this.handleUpdate}
                                            cancelClick={this.cancelClick}
                                        />
                                    </div>
                                ) : (
                                    <div/>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <Switch data="data">
                        <Route exact path="/" render={props => (
                            <div className="col-xs-12 col-md-4 col-md-push-3">
                                { this.state.isLoggedIn ? (
                                    <Home
                                        {...props}
                                        logoutUser={this._logoutUser}
                                        renderReviewForm={this.renderReviewForm}
                                        user={this.state.user}
                                        products={this.state.products}
                                        handleClick={this.handleClick}
                                    />
                                ) : (
                                    <div/>
                                )}
                            </div>
                        )}/>

                        <Route
                            path="/login"
                            render={ props => <Login {...props} loginUser={this._loginUser}/> }
                        />

                        <Route
                            path="/register"
                            render={ props => <Register {...props} registerUser={this._registerUser}/> }
                        />

                        <Route
                            path="/forgot-password"
                            render={ props => <ForgotPassword {...props} forgotPassword={this._forgotPassword}/> }
                        />
                        <Route
                            path="/reset-password"
                            render={ 
                                props => <ResetPassword 
                                    {...props} 
                                    resetPassword={this._resetPassword}
                                    resetTokenValid={this.state.resetTokenValid}
                                />
                            }
                        />
                    </Switch>

                    <div className="reorder-xs">
                        <div className="col-xs-12 col-md-4 col-md-push-3">
                            <div className="panel panel-default" style={{ margin: '15px auto 25px', boxShadow: 'none', width: '95%' }}>
                                <div className="panel-heading" style={{ backgroundColor: '#f5f5f5' }}>
                                    <h2 className="text-center" style={{ marginTop: '10px' }}>About</h2>
                                </div>
                                <div className="panel-body text-center">
                                    <p>
                                        View and post ratings on computer Operating Systems with an overall star rating calculated out of 5 categories: UI, speed/size, software, support and system administration.
                                    </p>
                                    <h2 style={{ margin: '10px 0 0' }}>
                                        <i className="fa fa-github" aria-hidden="true"></i>
                                    </h2>
                                </div>
                                <div className="panel-footer text-center">
                                    <h5 className="text-center">Brandon Winger-Air &copy; 2019</h5>
                                </div>
                            </div>

                            <div className="text-center">
                                <h4 style={{ marginBottom: '15px' }}>Contribute to future development:</h4>
                                <img src="https://www.mountainfamilycenter.org/wp-content/uploads/2018/06/5895ceb8cba9841eabab6072.png" alt="" width="25%"/>
                            </div>
                            
                            <hr/>

                            <div className="text-center">
                                <h4>Need a fast, free operating system?</h4>
                                <img src="https://res.cloudinary.com/dy8vgsd4o/image/upload/v1563301710/ubuntu_download_nae0sy.png" width="80%" style={{ border: '1px solid #bdbdbd', borderRadius: '3px', margin: '30px 0' }}/>
                            </div>
                        </div>

                        <div id="all-reviews" className="col-xs-12 col-md-3 col-md-pull-9">
                            <div>
                                <div>
                                    <div className="panel panel-default" style={{ margin: '15px', boxShadow: 'none' }}>
                                        <div className="panel-heading" style={{ backgroundColor: '#f5f5f5', borderBottom: '0' }}>
                                            <h3>All Reviews ({this.state.products.length})</h3>
                                        </div>
                                        <div>
                                            { this.listProducts() }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
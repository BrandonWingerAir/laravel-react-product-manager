import React from "react";
import axios from "axios";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
};

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      token: localStorage["appState"]
        ? JSON.parse(localStorage["appState"]).user.auth_token
        : "",
      user: {},
      currentPage: 1,
      productsPerPage: 3
    };

    this.handlePageClick = this.handlePageClick.bind(this);
    this.handlePrevClick = this.handlePrevClick.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
  }

  renderUserReviews() {
    let hasReviews = this.props.products.filter((product) => {
      if (product.posted_by === this.state.user.name) {
        return product;
      }
    }).length > 0;    

    if (hasReviews) {
      const usersProducts = this.props.products.filter((product) => {
        if (product.posted_by === this.state.user.name) {
          return product;
        }
      });      

      const { productsPerPage } = this.state;
      let { currentPage } = this.state;

      if (currentPage > Math.ceil(usersProducts.length / productsPerPage)) {
          currentPage -= 1;
      }

      const indexOfLastProduct = currentPage * productsPerPage;
      const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
      const currentProducts = usersProducts.slice(indexOfFirstProduct, indexOfLastProduct);

      const pageNumbers = [];

      for (let i = 1; i <= Math.ceil(usersProducts.length / productsPerPage); i++) {
          pageNumbers.push(i);
      }

      const renderPageNumbers = pageNumbers.map(number => {
        var newPageKey = `${number} (User)`;

        if (currentPage === number) {
            return (
                <li
                    key={newPageKey}
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
            key={newPageKey}
            id={number}
            onClick={this.handlePageClick}
        >
            <a href="#all-reviews">
                {number}
            </a>
        </li>
        );
      });
      
      const renderCurrentPage = currentProducts.map((product) => {
        var newKey = `${product.id} (User)`;
  
        return (
          <li 
            className="list-group-item user-review-list"
            style={{ width: '90%', margin: '0 auto', borderBottom: '0' }}
            onClick={() =>this.props.handleClick(product)} 
            key={newKey}
          >
            <h4 style={{ display: 'inline-block', marginRight: '5px' }}>{product.title}</h4>
            <b style={{ fontSize: '16px' }}>
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

      return (
        <div>
          <ul>
            {renderCurrentPage}
          </ul>
          { usersProducts.length > productsPerPage ? (
              <nav style={{ textAlign: 'center' }}>
                  <ul className="pagination" style={{ marginBottom: '0' }}>
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
    return (
      <ul>
        <li 
            id="no-user-reviews"
            className="list-group-item"
            style={{ width: '70%', margin: '0 auto' }}
          >
            <h4>No posts</h4>
        </li>
      </ul>
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

  componentDidMount() {
    axios.get(`api/user/home?token=${this.state.token}`)
    .then(response => {
      return response;
    })
    .then(json => {
      if (json.data.success) {
        this.setState({ user: json.data.data });
      } else alert("Login Failed!");
    })
    .catch(error => {
      $('#session-expired').textContent = 'Session has expired, please log in.';
    });
  }

  render() {
    return (
      <div style={styles}>
        <div className="panel panel-default" style={{ width: '85%', margin: '12px auto 20px' }}>
          <div className="panel-heading" style={{ backgroundColor: '#f5f5f5' }}>
            <h3 style={{ marginTop: '10px' }}>
              Dashboard
            </h3>
          </div>
          <div className="panel-body">
            <div className="list-group-item" style={{ width: '40%', borderRadius: '4px', margin: '0 auto', padding: '0' }}>
              <h3 style={{ marginTop: '10px' }}>{this.state.user.name}</h3>
            </div>
            <hr style={{ width: '70%',  }}/>
            <h4 style={{ marginBottom: '20px' }}>My Reviews:</h4>
            {this.renderUserReviews()}
            <hr style={{ width: '70%'  }}/>
            <button
                className="btn btn-success mobile-btn"
                onClick={this.props.renderReviewForm}
                style={{ margin: '0 10px' }}
            >
              Add New
            </button>
            <button
              className="btn btn-primary mobile-btn"
              onClick={this.props.logoutUser}
              style={{ margin: '0 10px' }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
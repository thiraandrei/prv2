import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import NavigationBar from './navigation-bar';
import Home from './home/home';
import ProductContainer from './product/product-container';
import PersonContainer from './person/person-container';
import OrderContainer from './order/order-container';
import ProductsPage from './product/product-page';
import CartPage from './product/CartPage';
import PastaProductsPage from './product/PastaProductsPage';
import PeriutaProductsPage from './product/PeriutaProductsPage';
import ApaProductsPage from './product/ApaProductsPage';
import OtherProductsPage from './product/OtherProductsPage';
import ErrorPage from './commons/errorhandling/error-page';
import styles from './commons/styles/project-style.css';
import UserManagementPage from './user/UserManagementPage';
import MessagePage from './message/MessagePage';
import AdminMessageViewer from './message/AdminMessageViewer';
import DiscountCodeManagementPage from './discountcodes/DiscountCodeManagementPage';
import LoginPage from './user/LoginPage';
import RegisterPage from './user/RegisterPage';
import UserProfilePage from './UserProfilePage';
import BestSellersPage from './order/BestSeller';

const CART_STORAGE_KEY = "shopping_cart";

const PrivateRoute = ({ component: Component, requiredRole, ...rest }) => {
    const role = localStorage.getItem("role");
    return (
        <Route
            {...rest}
            render={props =>
                role === requiredRole ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/" />
                )
            }
        />
    );
};

class App extends React.Component {
    constructor() {
        super();
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        this.state = {
            cart: savedCart ? JSON.parse(savedCart) : []
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.cart !== this.state.cart) {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.state.cart));
        }
    }

    addToCart = (product, quantity) => {
        if (quantity <= 0) return;
        this.setState(prevState => {
            const existingProduct = prevState.cart.find(item => item.product.name === product.name);
            if (existingProduct) {
                return {
                    cart: prevState.cart.map(item =>
                        item.product.name === product.name
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    )
                };
            }
            return {
                cart: [...prevState.cart, { product, quantity }]
            };
        });
    };

    removeFromCart = (productName) => {
        this.setState(prevState => ({
            cart: prevState.cart.filter(item => item.product.name !== productName)
        }));
    };

    placeOrder = () => {
        this.setState({ cart: [] });
        localStorage.removeItem(CART_STORAGE_KEY);
    };

    render() {
        return (
            <div className={styles.back}>
                <Router>
                    <div>
                        <NavigationBar />
                        <Switch>
                            <Route exact path="/" component={Home} />
                            <PrivateRoute exact path="/products" component={ProductContainer} requiredRole="ADMIN" />
                            <PrivateRoute exact path="/users" component={UserManagementPage} requiredRole="ADMIN" />
                            <PrivateRoute exact path="/discounts" component={DiscountCodeManagementPage} requiredRole="ADMIN" />
                            <PrivateRoute exact path="/view-message" component={AdminMessageViewer} requiredRole="ADMIN" />
                            <PrivateRoute exact path="/orders" component={OrderContainer} requiredRole="ADMIN" />
                            <PrivateRoute exact path="/person" component={PersonContainer} requiredRole="ADMIN" />

                            <Route exact path="/pageProducts" render={() => <ProductsPage onAddToCart={this.addToCart} />} />
                            <Route exact path="/send-message" component={MessagePage} />
                            <Route exact path="/register" component={RegisterPage} />
                            <Route exact path="/login" component={LoginPage} />
                            <Route exact path="/profile" component={UserProfilePage} />
                            <Route exact path="/bestseller" render={() => <BestSellersPage onAddToCart={this.addToCart} />} />
                            <Route exact path="/cart" render={() => <CartPage cart={this.state.cart} onRemoveFromCart={this.removeFromCart} onPlaceOrder={this.placeOrder} />} />
                            <Route exact path="/pasta" render={() => <PastaProductsPage onAddToCart={this.addToCart} />} />
                            <Route exact path="/periuta" render={() => <PeriutaProductsPage onAddToCart={this.addToCart} />} />
                            <Route exact path="/apa" render={() => <ApaProductsPage onAddToCart={this.addToCart} />} />
                            <Route exact path="/other" render={() => <OtherProductsPage onAddToCart={this.addToCart} />} />
                            <Route exact path="/error" component={ErrorPage} />
                            <Route component={ErrorPage} />
                        </Switch>
                    </div>
                </Router>
            </div>
        );
    }
}

export default App;

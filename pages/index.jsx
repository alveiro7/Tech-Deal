import styles from "../styles/app.module.scss"
import Layout from "../components/Layout"
import SearchBar from "../components/SearchBar"
import CardItem from "../components/CardItem"
import Loader from "../components/Loader"

import { useReducer } from "react"

const initialState = {
    loading: false,
    products: [],
    errorMessage: null,
}

const reducer = (state, action) => {
    switch (action.type) {
        case "SEARCH_PRODUCT_REQUEST":
            return {
                ...state,
                loading: true,
                errorMessage: null,
            }
        case "SEARCH_PRODUCT_SUCCESS":
            return {
                ...state,
                loading: false,
                products: action.payload,
                kWord: action.kWord,
            }
        case "SEARCH_PRODUCT_FAILURE":
            return {
                ...state,
                loading: false,
                errorMessage: action.error,
            }
        default:
            return state
    }
}

function App() {
    const [state, dispatch] = useReducer(reducer, initialState)

    const search = (keyWord) => {
        dispatch({
            type: "SEARCH_PRODUCT_REQUEST",
        })

        fetch(
            `https://amazon-price1.p.rapidapi.com/search?page=1&keywords=${keyWord}&marketplace=ES`,
            {
                method: "GET",
                headers: {
                    "x-rapidapi-host": "amazon-price1.p.rapidapi.com",
                    "x-rapidapi-key":
                        "f7b7d33c44msh8fc70bda52e206ep17aad3jsn31e87ee80dc6",
                },
            }
        )
            .then((response) => response.json())
            .then((jsonResponse) => {
                dispatch({
                    type: "SEARCH_PRODUCT_SUCCESS",
                    payload: jsonResponse,
                    kWord: keyWord,
                })
            })
            .catch((error) => {
                dispatch({
                    type: "SEARCH_PRODUCT_FAILURE",
                    error: error,
                })
            })
    }

    const { products, errorMessage, loading, kWord } = state

    return (
        <Layout>
            <section className={styles.searchContainer}>
                <h1 className={styles.searchContainer__title}>
                    The Best Tech Offers For you
                </h1>
                <h2 className={styles.searchContainer__subTitle}>
                    Online price and offers comparator
                </h2>
                <SearchBar search={search} />
                <section className={styles.searchContainer__results}>
                    {loading && !errorMessage ? (
                        <span
                            className={styles.searchContainer__results__loading}
                        >
                            <Loader />
                        </span>
                    ) : errorMessage ? (
                        <div className="errorMessage">{errorMessage}</div>
                    ) : Array.isArray(products) === true ? (
                        products.map((product, index) => {
                            return <CardItem key={index} product={product} />
                        })
                    ) : (
                        <div
                            className={
                                styles.searchContainer__results__notFound
                            }
                        >
                            <p>
                                No results for <span> {kWord} </span>{" "}
                            </p>
                            <p>
                                Check your spelling or use more general terms.
                            </p>
                        </div>
                    )}
                </section>
            </section>
        </Layout>
    )
}

export default App
